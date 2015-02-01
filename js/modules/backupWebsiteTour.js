
function tour(module_z_index) {
	var DOCUMENTS_TOUR_ID = 'v1_documents'
		, TOUR_STATES = {
			COMPLETED: 'completed'
			, PAUSED: 'paused'
			, SKIPPED: 'skipped' 
		}
		, tours = {}
		, tourConfigs = {};

	$.extend(jBox.prototype, {
		lightOnTarget: lightOnTarget
		, lightOffTarget: lightOffTarget
	});

	return { 
		initTour: initTour
		, configureTour : function(tourID, tourConfig) {
			tourConfigs[tourID] = tourConfig;
			return this;
		}
	};


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


	function getTourById(tourID) {
		var tour
			, tourConfig;

		tour = tours[tourID];
		if (tour) return tour;

		tourConfig = tourConfigs[tourID];
		tour = tours[tourID] = 
			makeTour(tourID, tourConfig.jBoxDefs, tourConfig.options);

		return tour;
	}

	function makeTour(tourID, jBoxDefs, options) {
		var defaultZIndex = (options.zIndex || 10002),
			DEFAULTS = {
				CONTROLLER_EL: "#tourController"
				, RESUME_TOUR_LINK_$: '#help .helpLink'
				, START_TOUR_LINK_$: '#help .helpLink'
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
					}
					, defaultOnClose: function() {
						if (this.task && !this.task.isCompleted()) {
							this.task.unstart();
						}

						lightOffTarget(this.options.target);
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
			currentBox,
			controlBox,
			jBoxes,
			$el;

		if (jBoxDefs.length < 0) {
			console.log("error: invalid jBox definitions.");
			return;
		}

		options = $.extend(true, DEFAULTS, options);

		init(jBoxDefs, options);
		return {
			next: next
			, previous: previous
			, show: show
			, hide: hide
			, resume: resume
			, isStarted: isStarted
			, isCompleted: isCompleted
			, isSkipped: isSkipped
			, completeTour: completeTour
			, confirmBeforeStarting: confirmBeforeStarting
		};



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

		function addTourFinalization(jBox) {
			var openFunc;

			openFunc = jBox.open;
			jBox.open = function() {
				openFunc.apply(jBox, arguments);
				completeTour(tourID);
			}
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
				.append(makeControl('close', 'Finish'))
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

				controlBox = new jBox('Modal', $.extend(options.controlBox, {
					content: $el
				}));
			}			
		}

		function init(jBoxDefs, options) {
			// NOTE: not local vars!
			currentBox = -1;

			initControlsBox(options);

			initTourActionLink(options);

			jBoxes = $.map(jBoxDefs, makeJBox);

			addTourFinalization(jBoxes[jBoxes.length - 1]);

			attachHandlers($el);
		}

		function show() {
			controlBox.open();
		}

		function hide() {
			controlBox.close();
		}

		function hasNext() {
			return currentBox + 1 < jBoxes.length;
		}

		function hasPrev() {
			return currentBox - 1 >= 0;
		}


		function next() {
			if (currentBox >= 0) {
				console.log("closing box #", currentBox);
				jBoxes[currentBox].close();
				if (jBoxes[currentBox].options.onNext) {
					jBoxes[currentBox].options.onNext();
				}
			}
			if (hasNext()) {
				++currentBox;
				console.log("opening box #", currentBox);
				
				jBoxes[currentBox].open();

				if (hasPrev()) {
					$el.addClass('hasPrev');	
				}					
				if (!hasNext()) {
					$el.removeClass('hasNext');
					$el.addClass('hasFinish');
				}
			}
		}

		function previous() {
			console.log("closing box #", currentBox);
			jBoxes[currentBox].close();
			if (jBoxes[currentBox].options.onPrev) {
				jBoxes[currentBox].options.onPrev();
			}

			if (hasPrev()) {
				--currentBox;
				console.log("opening box #", currentBox);
				jBoxes[currentBox].open();

				$el.addClass('hasNext');
				if (!hasPrev()) {
					$el.removeClass('hasPrev');
				}
			}				
		}

		function close() {
			hide();
			jBoxes[currentBox].close();
		}


		function initTourActionLink(options) {
			if (isCompleted()) {
				initRestartTourLink(options);
			} else if (isSkipped() || isPaused()) {
				initResumeTourLink(options);
			} else {
				initStartTourLink(options);
			}			
		}

		function initResumeTourLink(options) {
			setupTourActionLink({
				$el: $(options.RESUME_TOUR_LINK_$)
				, linkText : 'Resume Tour'
				, linkAction : resume
			});			
		}

		function initStartTourLink(options) {
			setupTourActionLink({
				$el: $(options.START_TOUR_LINK_$)
				, linkText : options.linkText || 'Start Tour'
				, linkAction : start
			});
		}

		function initRestartTourLink(options) {
			setupTourActionLink({
				$el: $(options.START_TOUR_LINK_$)
				, linkText : options.linkText || 'Restart Tour'
				, linkAction : restart
			});
		}

		function setupTourActionLink(options) {
			if (options.$el.length) {
				options.$el.text(options.linkText)
					.off('click')
					.on('click', function($event) {
						$event.preventDefault();
						options.linkAction();
					});				
			}
		}

		// TODO: TEST
		function resume() {
			var jBox
				, stepNumber = getLastSavedStep(tourID)
				, i
				, key;

			// can happen if tour got paused without a call to "pause()",
			// which currently happens when you stop the tour midway through
			if (stepNumber < 0 || stepNumber >= jBoxes.length) {
				console.log("Invalid stepNumber '", stepNumber, "' provided to resume. Staring from the beginning.");
				stepNumber = 0;
				save(stepNumber);
			}

			key = getTourStateKey(tourID, TOUR_STATES.SKIPPED);
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

			initResumeTourLink(options)
			//jBoxes[currentBox].open();
			currentBox -= 1;
			next();
		}


		function skip(options) {
			var DEFAULT_MODAL_OPTIONS = {
		    		title: 'Ok, maybe later?'
		    		, content: 'If you would like to take the tour later you can always do so by clicking here.'
		    		, target: $('#help')
					, position: { x: 'right'}
					, outside: 'x'
					, zIndex: 10001
					, pointer: true
					, onOpen: function() {
						lightOnTarget.call(this);
					}
					, onClose: function() {
						lightOffTarget.call(this);
					}	
		    	}
		    	, skipModal
		    	, key
		    	;
			
			key = getTourStateKey(tourID, TOUR_STATES.SKIPPED);
			persistForSession(key, true);

			options = $.extend(DEFAULT_MODAL_OPTIONS, options);
	    	skipModal = new jBox('Modal', options);
	    	skipModal.open();
		}

		function isSkipped() {
			var key = getTourStateKey(tourID, TOUR_STATES.SKIPPED);
			return getPersistedForSession(key) === 'true';
		}		

		function isPaused() {
			var isPausedNow,
				isPausedBefore;
			/*var key = getTourStateKey(tourID, TOUR_STATES.PAUSED);
			return getPersistedForSession(key) === 'true';*/
			
			isPausedNow = 
				currentBox < jBoxes.length-1 &&  // if currentBox == jBoxes.length tour is finished
				currentBox >= 0 && 				 // valid index
				!jBoxes[currentBox].isOpen 		 // current jBox is closed


		}

		function getTourStateKey(aTourID, state) {
			return "tour_" + aTourID + "_" + state;
		}

		function isCompleted() {
			var key = getTourStateKey(tourID, TOUR_STATES.COMPLETED);
			return getPersisted(key) === 'true';
		}

		function completeTour() {
			var key = getTourStateKey(tourID, TOUR_STATES.COMPLETED);
			persist(key, true);
			initRestartTourLink(options);
		}

		function confirmBeforeStarting(confirmOptions) {
			var box
				, DEFAULT_OPTIONS = {
				    content: 'Hello there!<br/>Looks like this is your first time here. This short tour will introduce you to the options on this page.'
				    , title: 'Welcome! How about a quick tour?'
				    , zIndex: 10001
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

		function restart() {
			var key = getTourStateKey(tourID, TOUR_STATES.COMPLETED);

			persist(key, false);
			start();
		}

		function isStarted() {
			return getLastSavedStep(tourID) >= 0;
		}

		function start() {
			// reset this; start at the beginning if tour was part way through
			currentBox = -1;

			if (controlBox) {
				controlBox.open();
			}

			initResumeTourLink(options);

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

		/* TODO: Test these
		*/

		function getStepStateKey(tourID) {
			return "tour_" + tourID + "_step";
		}

		function save(step) {
			var key = getStepStateKey(tourID) 
				, stepToSave = (step ? step : currentBox);
			persist(key, stepToSave);
		}

		function getLastSavedStep(tourID) {
			var lastStep = getPersisted(getStepStateKey(tourID));
			return lastStep ? Number(lastStep) : -1;
		}
	}

	// TODO make this part of makeTour() and use implicit tourID
	// export getTourById() instead of initTour()
	function initTour(aTourID) {
		var tourID = aTourID || DOCUMENTS_TOUR_ID
			, tour
			;

		tour = getTourById(tourID)
		if (tour.isCompleted()) {
			console.log("User has completed tour ", tourID, " before. Not starting tour now.");
		} else if (!tour.isSkipped()) {
			if (tour.isStarted()) {
				tour.resume()
			} else {
				tour.confirmBeforeStarting();
			}
		} else {
			console.log("User has skipped tour ", tourID, " for this session. Not starting tour now.");
		}

		return this;
	}
	
}
