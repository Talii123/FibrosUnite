
function websiteTour(module_z_index) {
	var DOCUMENTS_TOUR_ID = 'v1_documents'
		, TOUR_STATES = {
			COMPLETED: 'completed'
			, PAUSED: 'paused'
			, SKIPPED: 'skipped' 
		}
		, tours = {}
		, tourConfigs = {};

	module_z_index = module_z_index || 10002;

	$.extend(jBox.prototype, {
		lightOnTarget: lightOnTarget
		, lightOffTarget: lightOffTarget
	});

	return { 
		getTourForID: getTourForID
		, isTourCompleted: isTourCompleted
		, isTourSkipped: isTourSkipped
		, isTourStarted: isTourStarted
		, DOCUMENTS_TOUR_ID: DOCUMENTS_TOUR_ID
	};


	function getTourForID(aTourID, aTourConfig) {
		var tour
			, tourConfig;

		tour = tours[aTourID];
		if (tour) return tour;

		if (aTourConfig) {
			tourConfigs[aTourID] = aTourConfig;
		}
		tourConfig = tourConfigs[aTourID];

		tour = tours[aTourID] = 
			makeTour(aTourID, tourConfig.jBoxDefs, tourConfig.options);

		return tour;
	}	


	function _getTourStateKey(aTourID, state) {
		return "tour_" + aTourID + "_" + state;
	}

	function isTourSkipped(aTourID) {
		var key = _getTourStateKey(aTourID, TOUR_STATES.SKIPPED);
		return getPersistedForSession(key) === 'true';
	}	

	function isTourCompleted(aTourID) {
		var key = _getTourStateKey(aTourID, TOUR_STATES.COMPLETED);
		return getPersisted(key) === 'true';
	}

	function isTourStarted(aTourID) {
		return _getLastSavedStep(aTourID) >= 0;
	}	

	function _getStepStateKey(aTourID) {
		return "tour_" + aTourID + "_step";
	}

	function _getLastSavedStep(aTourID) {
		var lastStep = getPersisted(_getStepStateKey(aTourID));
		return lastStep ? Number(lastStep) : -1;
	}	


	function lightOnTarget($target) {
		var savedValues
			, isAlreadyLit;

		$target = $target || this.options.target;
		if (!$target.length || !$target.parent().length) {
			return;
		}

		isAlreadyLit = $target.data("savedCSS");
		if (isAlreadyLit) return;

		$target.data("savedCSS", {
			"z-index" : $target.css("z-index")
			, "position" : $target.css("position")
		});

		$target.css({
			"z-index": (module_z_index + 1)
			, "position": "relative"
		});
	}

	function lightOffTarget($target) {
		var savedCSS;

		$target = $target || this.options.target;
		if (!$target.length || !$target.parent().length) {
			return;
		}

		savedCSS = $target.data("savedCSS");
		if (savedCSS) {
			$target.css(savedCSS);
			// clear it out so we know $target has its default CSS
			$target.data("savedCSS", null);					
		}
	}


	function makeTask(config) {
		var _isCompleted
			, _isStarted;

		initTask(config);

		return {
			jBox: config.jBox
			, start: start
			, unstart: unstart
			, complete: complete
			, isCompleted: function() {
				return _isCompleted;
			}
			, next: function() {
				if (config.onNext) {
					config.onNext.call(this.jBox, this);
				}
			}
			, previous: function() {
				if (config.onPrev) {
					config.onPrev.call(this.jBox, this);
				}
			}
		};

		function initTask(config) {
			_isCompleted = _isStarted = false;
		}

		function start() {
			_isStarted = true;
			config.onStart.call(this.jBox, this);
			task = this;
			this.jBox.content.find(".next").text("Skip");
		}

		function unstart() {
			console.log("unstarting task..");
			_isStarted = false;
			if (config.onUnstart) {
				config.onUnstart.call(this.jBox, this);	
			}
		}

		function complete() {
			_isCompleted = true;
			if (config.onComplete) {
				config.onComplete.call(this.jBox, this);	
			}
			this.jBox.content.find(".next").text("Next");
		}
	}	

	function makeTourLinkHelper(theTour, $el, options) {
		var DEFAULTS = {
			start : { linkText : 'Start Tour' }
			, resume : { linkText : 'Resume Tour' }
			, restart : { linkText : 'Restart Tour' }
		};

		options = $.extend(DEFAULTS, options);

		function setTourActionLink(action) {
			var actionConfig = options[action];
			if ($el.length) {
				$el.text(actionConfig.linkText)
					.off('click')
					.on('click', function($event) {
						$event.preventDefault();
						theTour[action]();
					});				
			}
		}

		function initTourActionLink() {
			if (theTour.isCompleted()) {
				setTourActionLink('restart');
			} else if (theTour.isStarted()) {
				setTourActionLink('resume');
			} else {
				setTourActionLink('start');
			}			
		}

		function showLinkHelp(helpOptions) {
			var DEFAULT_MODAL_OPTIONS = {
		    		title: 'Ok, maybe later?'
		    		, content: 'If you would like to take the tour later you can always do so by clicking here.'
		    		, target: $el
					, position: { x: 'right'}
					, outside: 'x'
					, zIndex: module_z_index - 1
					, pointer: true
					, onOpen: function() {
						lightOnTarget.call(this);
					}
					, onClose: function() {
						lightOffTarget.call(this);
					}	
		    	}
		    	, linkHelpModal;

			helpOptions = $.extend(DEFAULT_MODAL_OPTIONS, helpOptions);
	    	linkHelpModal = new jBox('Modal', helpOptions);
	    	linkHelpModal.open();
		}	

		return {
			init: initTourActionLink
			, setLinkAction: setTourActionLink
			, showLinkHelp: showLinkHelp
		};
	}

	function makeTour(tourID, jBoxDefs, options) {
		var defaultZIndex = (options.zIndex || module_z_index),
			DEFAULTS = {
				CONTROLLER_EL: "#tourController"
				, stepBoxType: 'Modal'
				, stepBox: {
					zIndex: (defaultZIndex + 1)
					, draggable: true
					, pointer: true
					, defaultOnOpen: function() {
						var $content = this.content
							, currentZ = $content.css('z-index');

						save(this.index);

						lightOnTarget(this.options.target);
						if (this.$highlighted) {
							$.each(this.$highlighted, function(i, $node) {
								lightOnTarget($node);
							});
						}

						// hack to get modal pointer above highlighted content
						this.options['z-index'] = Number(currentZ) + 101;

						if (this.options.task) {
							if (!this.task) {
								this.options.task.jBox = this;
								this.task = makeTask(this.options.task);
							}
							if (!this.task.isCompleted()) {
								this.task.start();
							}
						}

						if (currentBox === jBoxes.length-1) {
							completeTour();
						}
					}
					, defaultOnClose: function() {
						lightOffTarget(this.options.target);
						if (this.$highlighted) {
							$.each(this.$highlighted, function(i, $node) {
								lightOffTarget($node);
							});
						}

					}
					, onOpen: function() {
						this.options.defaultOnOpen.call(this);
					}
					, onClose: function() {
						this.options.defaultOnClose.call(this);
					}					
					, onCreated: function() {
						this.options.setFooter.call(this);
					}
					// this can be called after setContent() without 
					// destroying event handlers or triggering reposition
					, setFooter: function() {
						var $footer = $("<div>")
								.attr({ 'class': 'modal-footer' })
							, stepCountLocation = options.stepCountLocation;

						if (stepCountLocation !== 'none') {
							stepCountLocation = 
								stepCountLocation == 'footer' ? $footer : null;
							addStepCount(this, stepCountLocation);
						}

						if (options.embedControls) {
							addControls(this, $footer);
						}

						$footer.appendTo(this.content);
						$footer.before('<br/><br/>');
					}
				}
				, controlBox: {
					title: 'Tour'
					, zIndex: (defaultZIndex + 100)
					, draggable: true
					, position: {
						x: "left",
						y: "bottom"
					}
					, offset: {
						x: 40,
						y: -60
					}
				}
			},
			tour,
			currentBox,
			controlBox,
			jBoxes,
			$el,
			tourLinkHelper;

		if (jBoxDefs.length < 0) {
			console.log("error: invalid jBox definitions.");
			return;
		}

		options = $.extend(true, DEFAULTS, options);

		init(jBoxDefs, options);
		tour = {
			next: next
			, previous: previous
			, show: show
			, hide: hide
			, resume: resume
			, restart: restart
			, start: start
			, isStarted: function() { return isTourStarted(tourID); }
			, isCompleted: function() { return isTourCompleted(tourID); }
			, isSkipped: function() { return isTourSkipped(tourID); }
//			, complete: completeTour

			// should probably be folded into start/resume as an option
			, confirmBeforeStarting: confirmBeforeStarting
			, confirmBeforeResuming: confirmBeforeResuming
		};

		if (options.tourActionLinkEl$) {
			tourLinkHelper = makeTourLinkHelper(tour, $(options.tourActionLinkEl$));
			tourLinkHelper.init(tour);			
		}

		return tour;


		function attachHandlers($el) {
			$el.on('click', ".next", next)
				.on('click', ".prev", previous)
				.on('click', ".close", close);
		} 
		
		function addControls(jBox, $controlsContainer) {
			if (jBox.index > 0) {
				$controlsContainer
					.append('<span class="control prev">Previous</span>');
			}		
			if (jBox.index < jBoxes.length -1 ) {
				$controlsContainer
					.append('<span class="control next">Next</span>');
			}
			else {
				$controlsContainer
					.append('<span class="control close">Finish</span>');	
			}

			attachHandlers($controlsContainer);
		}

		function addStepCount(jBox, $appendTarget) {
			var stepCount = (jBox.index + 1) + "/" + jBoxes.length
			
			$("<span>" + stepCount + "</span>")
				.attr({ 'class': 'steps' })
				.appendTo($appendTarget && $appendTarget.length ? 
					$appendTarget : 
					jBox.title
				);
		}

		function makeJBox(jBoxDef, iter) {
			var theJBox
				, type;

			type = jBoxDef.type || DEFAULTS.stepBoxType
			
			theJBox = new jBox(type, $.extend({
				title: 'Step ' + (iter+1)
			}, options.stepBox, jBoxDef));
			theJBox.index = iter;
			// should probably be on a prototype
			theJBox.updateContent = function(content) {
				if (content.html) content = content.html();
				this.setContent(content);
				if (this.options.setFooter) this.options.setFooter.call(this);
			}
			
			return theJBox;
		}

		function makeControl(controlClasses, controlText) {
			var classString = typeof controlClasses !== "string" ?
					controlClasses.join(' ') : 
					controlClasses;

			classString = "control " + classString;
			return $('<span/>')
						.attr('class', classString)
						.text(controlText);
		}

		function makeControllerHtml($el) {
			// <div id="tourController" class="hasNext">
			// 	<span class="control close">Finish</span>
			// 	<span class="control next">Next</span>		
			// 	<span class="control prev">Previous</span>
			// </div>
			$el.addClass('hasNext')
				.append(makeControl('close finish', 'Finish'))
				.append(makeControl('next', 'Next'))
				.append(makeControl('prev', 'Previous'));			
		}

		function initControlsBox(options) {
			options.showTourController =
				(options.showTourController || !options.embedControls);

			if (options.showTourController) {
				$el = $(options.CONTROLLER_EL);
				if (!$el.length) {
					$el = $('<div/>').attr('id', DEFAULTS.CONTROLLER_EL.substring(1));
					$('body').append($el);
					$el = $(DEFAULTS.CONTROLLER_EL);
				}

				makeControllerHtml($el);
				$el.on('click', '.finish', completeTour);

				controlBox = new jBox('Modal', $.extend(options.controlBox, {
					content: $el
				}));
			}			
		}
	

		function init(jBoxDefs, options) {
			// NOTE: not local vars!
			currentBox = -1;
			initControlsBox(options);
			jBoxes = $.map(jBoxDefs, makeJBox);
		}

		function show() {
			controlBox && controlBox.open();
		}

		function hide() {
			controlBox && controlBox.close();
		}

		function hasNext() {
			return currentBox + 1 < jBoxes.length;
		}

		function hasPrev() {
			return currentBox - 1 >= 0;
		}


		function next() {
			var task;

			if (currentBox >= 0) {
				console.log("closing box #", currentBox);
				jBoxes[currentBox].close();

				task = jBoxes[currentBox].task;
				if (task) {
					if (!task.isCompleted()) {
						task.unstart();
					}
					// is this needed?
					task.next();
				}

				if (jBoxes[currentBox].options.onNext) {
					jBoxes[currentBox].options.onNext();
				}
			}
			if (hasNext()) {
				++currentBox;
				console.log("opening box #", currentBox);
				
				jBoxes[currentBox].open();

				if ($el && hasPrev()) {
					$el.addClass('hasPrev');	
				}					
				if ($el && !hasNext()) {
					$el.removeClass('hasNext');
					$el.addClass('hasFinish');
				}
			}
		}

		function previous() {
			var task;

			console.log("closing box #", currentBox);
			jBoxes[currentBox].close();

			task = jBoxes[currentBox].task;
			if (task) {
				if (!task.isCompleted()) {
					task.unstart();
				}
				// is this needed?
				task.previous();
			}


			if (jBoxes[currentBox].options.onPrev) {
				jBoxes[currentBox].options.onPrev();
			}

			if (hasPrev()) {
				--currentBox;
				console.log("opening box #", currentBox);
				jBoxes[currentBox].open();

				if ($el) {
					$el.addClass('hasNext');
					if (!hasPrev()) {
						$el.removeClass('hasPrev');
					}
				}
			}				
		}

		function close() {
			hide();
			jBoxes[currentBox].close();
		}

		function resume() {
			var jBox
				, stepNumber = _getLastSavedStep(tourID)
				, i
				, key;

			// can happen if tour got paused without a call to "pause()",
			// which currently happens when you stop the tour midway through
			if (stepNumber < 0 || stepNumber >= jBoxes.length) {
				console.log("Invalid stepNumber '", stepNumber, "' provided to resume. Staring from the beginning.");
				stepNumber = 0;
				save(stepNumber);
			}

			key = _getTourStateKey(tourID, TOUR_STATES.SKIPPED);
			persistForSession(key, false);

			currentBox = stepNumber;

			if (controlBox) {
				controlBox.open();
			}			

			for (i = 0; i < currentBox-1; ++i) {
				jBox = jBoxes[i];
				// can't call next() cuz don't want to call open()/close() of intermediate steps; call 'onNext()' to ensure any necessary transitions happen
				if (jBox.options.onNext) {
					jBox.options.onNext();
				}
			}

			if (tourLinkHelper) {
				tourLinkHelper.setLinkAction('resume');
			}
			currentBox -= 1;
			next();
		}

		function skip(options) {
			var key;
			
			key = _getTourStateKey(tourID, TOUR_STATES.SKIPPED);
			persistForSession(key, true);

			if (tourLinkHelper) {
				tourLinkHelper.showLinkHelp();	
			} 
		}

		function completeTour() {
			var key = _getTourStateKey(tourID, TOUR_STATES.COMPLETED);
			persist(key, true);
			if (tourLinkHelper) {
				tourLinkHelper.setLinkAction('restart');
			}
		}

		function confirmBeforeStarting(confirmOptions) {
			var box
				, DEFAULT_OPTIONS = {
				    content: 'Hello there!<br/>Looks like this is your first time here. This short tour will introduce you to the options on this page.'
				    , title: 'Welcome! How about a quick tour?'
				    , zIndex: module_z_index - 1
				    , type: 'Confirm'
				    , cancelButton: 'Not Now'
				    , cancel: function() {
				    	console.log("\n\n Tour postponed.");
				    	skip();
				    }
				    , confirmButton: "Sure! Let's get started!"
				    , confirm: function() {
				    	console.log("\n\n Confirmed.");
				    	start();
				    }
	    		};

			box = new jBox('Confirm', $.extend(DEFAULT_OPTIONS, confirmOptions));
			box.open();
		}

		function confirmBeforeResuming(confirmOptions) {
			var box
				, DEFAULT_OPTIONS = {
				    content: 'Hello there!<br/>Looks like you started to take the tour before, but didn\'t quite finish. This short tour will introduce you to the options on this page. <br/>Would you like to continue the tour now?'
				    , title: 'Welcome Back! How about finishing up that tour?'
				    , zIndex: module_z_index - 1
				    , type: 'Confirm'
				    , cancelButton: 'Not Now'
				    , cancel: function() {
				    	console.log("\n\n Tour not resumed.");
						skip();
				    }
				    , confirmButton: "Sure! Let's continue the tour!"
				    , confirm: function() {
				    	console.log("\n\n Confirmed. Tour Resumed.");
				    	resume();
				    }
	    		};

			box = new jBox('Confirm', $.extend(DEFAULT_OPTIONS, confirmOptions));
			box.open();
		}		

		function restart() {
			var key = _getTourStateKey(tourID, TOUR_STATES.COMPLETED);

			persist(key, false);
			start();
		}



		function start() {
			var key;

			// reset tour; start at the beginning if tour was part way through
			currentBox = -1;
			// don't need to clear out step state cuz calling next to open
			// first step will do that

			key = _getTourStateKey(tourID, TOUR_STATES.SKIPPED);
			persistForSession(key, false);

			if (controlBox) {
				controlBox.open();
			}

			if (tourLinkHelper) {
				tourLinkHelper.setLinkAction('resume');
			}

			/* hack to ensure message box is two lines so that there is
			 * enough room for the Modal if we put it on top of the 
			 * #documentsListing
			 * 
			 * $(".reset.filter").trigger("click");
			 * $(".add.filter").trigger("click");
			 */
			next();

			// hack to get pointer to show in front of #documentListing
			//    I THINK THIS IS NO LONGER NEEDED
			/*firstJBoxDiv = jBoxes[0].content.parent().parent();
			firstJBoxDiv.css('z-index', firstJBoxDiv.css('z-index')+101);
			*/
		}



		function save(step) {
			var key = _getStepStateKey(tourID) 
				, stepToSave = (step ? step : currentBox);
			persist(key, stepToSave);
		}


	}
	
}
