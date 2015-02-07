

(function($) {
	var MAIN_HEIGHT
		, $docsList = $("#documentsListing")
		, $ALL_ENTRIES = $(".entry", "#documentsListing")
		, ADD_TAG_FILTER_SELECTOR_ID = "AddTagFilterSelector"
		, HAS_OWN = Object.prototype.hasOwnProperty
		, BASE_DIR = location.protocol.charAt(0) === 'h' ? "" : ".."
		//, MODULES_DIR_ID = "f38196f"
		, filteredTagsMap = {}

		, FEATURES = {
			"suggestEdit" : {
				name: "suggest an edit"
				, builder: makeSuggestEditHelper
			}
			, "toolTips" : {
				name: "tool tip helper"
				, builder: makeToolTipHelper
			}
			, "truncation" : {
				name: "truncation helper"
				, builder: makeTrucationHelper
			}
			, "stateDescriptor" : {
				name: "state descriptor"
				, builder: function() {
					return makeStateDescriptor($("#message .showing"));
				}
			}
			, "search" : {
				name: "search helper"
				, builder: function() {
					return makeSearchHelper(makeCallToActionHelper('#searchFB', true));
				}
			}
			, "shareableURLs" : {
				name: "shareable URLs"
				, builder: makeUrlHelper
			}
			, "autocomplete" : {
				requires: {
					test: 	function() {
								return typeof $.prototype.chosen == "function";
							}
					, url: 	BASE_DIR + "/js/vendor/chosen.jquery.min.js"
				}
				, name: "autocomplete helper"
				, builder: function() {
					var initializer;
					console.log("Chosen loaded.");
					autocompleteHelper = makeAutocompleteHelper();
					initializer = autocompleteHelper.init;
					autocompleteHelper.init = function() {
						initializer.call(autocompleteHelper, "#"+ADD_TAG_FILTER_SELECTOR_ID);
					}
					console.log("autocomplete is enabled");				
					return autocompleteHelper;
				}
			}
			, "glossary" : {
				requires: {
					test: function() {
						instance = FEATURES["glossary"].instance;
						return instance != null && instance.isLoaded();
					}
					, url: BASE_DIR + "/js/glossary.js"
				}
				, name: "glossary"
				, builder: makeGlossary
			}
			, "websiteTour" : {
				requires: {
					test: function() {
						return typeof tour === "function";
					}
					, url: (function() {
						return BASE_DIR ? 
							 BASE_DIR + "/js/modules/websiteTour.js" :
							 "/js/" + MODULES_DIR_ID + "/websiteTour.js" ;
					})()
				}
				, name: "websiteTour"
				, builder: function() {  //makeDiscoverTour
					var TOURS_Z_INDEX = 10002
						, DOCUMENTS_TOUR_ID = 'v1_documents'
						, TOUR_ACTION_LINK_EL$ = '#help .helpLink'
						, tour
						, tourHelper
						;

					function setupTourActionLink(linkText, action) {
						$(TOUR_ACTION_LINK_EL$)
							.text(linkText)
							.off('click')
							.one('click', function() {
								tour = tourHelper.getTourForID(DOCUMENTS_TOUR_ID, getDocumentsTour());
								tour[action]();
						});
					}

					function getDocumentsTour() {
						var truncationToggler
							, $firstEntry
							, options
							, jBoxDefs
							, $KayteDoc = $docsList.find('#182099078511017');

						// not really; only temporary
						$firstEntry = $('#documentsListing .entry:nth-of-type(1)');
						//$firstEntry = $('#430857446968511');

						truncationToggler = function() {
							this.options.target.trigger('click');
							this.options.target = this.options.target.hasClass('expander') ?
								$('.truncation.control.collapser', $firstEntry) :
								$('.truncation.control.expander', $firstEntry);
						};

						options = {			
							zIndex: TOURS_Z_INDEX
							, embedControls: true
							, showTourController: true
							, stepCountLocation: 'footer'
							, stepBox: {
								width: $KayteDoc.width()
							}
							, tourActionLinkEl$: TOUR_ACTION_LINK_EL$
						};


						jBoxDefs = [
							{
								content: 'In the middle of the page is a collection of document summaries. Each summary corresponds to a document or file that a member of our Facebook group has shared.'
								, title: 'Document Summaries'
								, width: $('#sidebar').outerWidth()
								//, attach: $('#sidebar')
								, target: $docsList
								, position: { x: 'left ', y: 'top'}
								, offset: { y: 68 }
								, outside: 'x'
								, pointTo: 'right'
								/*, onOpen: function() {
									$(this).trigger('click');
								}
								/*, position: { y: 'top' }
								, outside: 'y'*/
								, onNext: function() {
									$docsList.scrollTop($KayteDoc.position().top);
								}
							}
							, {
								content: "If you click the title of a summary, you will be taken directly to that document - but ONLY if you are a member of our group AND logged in to Facebook. <strong>Only group members can view the documents!</strong><br/><br/>If you are a member but not logged in, then all you have to do is follow Facebook's prompts to log in, and once done, you will be taken to the document you chose."
								, title: 'Viewing Documents'
								, target: $('.title a', $KayteDoc)
								, position: { y: 'bottom' }
								, offset: { x: -85 }
								, pointer: 'left:10'
								, outside: 'y'
								/*
								, target: $('.title a', $firstEntry)
								, width: $('.title a', $firstEntry).width()
								, position: { x: 'right' }
								, outside: 'x'
								*/
							}
							, {
								content: "Below the title of each document summary is a collection of tags. These tags help you see some of the key topics mentioned in that document. You can click on a tag to hide all documents that don't have that tag. If you click on the tag a second time, it undoes that selection, and adds all those hidden documents back to the list."
								, title: 'Tags'
								, width: $KayteDoc.outerWidth()
								, target: $('.tags', $KayteDoc)
								, position: { y: 'bottom' }
								, offset: { y: -7 }
								, outside: 'y'
							}
							, {
								/*content: "See the tag for &quot;Nexavar&quot;/Sorafenib? See the document below called _____. Click on the tag now."
								, title: 'Filtering by clicking tags'*/
								//, target: $('input[value$="Sorafenib"]', $firstEntry)
								content: "See the tag for &quot;Liver Surgery&quot;? See the document below called _____. Click on the tag now."
								, target: $('input[value$="Liver Surgery"]', $KayteDoc)
								, position: { y: 'bottom' }
								, repositionOnContent: true
								, outside: 'y'
								//, offset: { x: -250 }
								, task: {
									onStart: function(task) {
										var jBox = this;

										function taskHandler() {
											alert("I was clicked!!");
											// need to do a close/open cycle to 
											// trigger repositioning IF the modal 
											// doesn't change size
											jBox.close();
											task.complete();

											// handy trick to ensure underlying DOM 
											// changes before Modal is recomputed
											setTimeout(function() {
												jBox.open();
											}, 0);
										}
										jBox.taskHandler = taskHandler;
										jBox.options.target.one('click', taskHandler);
									}
									, onUnstart: function(task) {
										var jBox = this;
										alert("onUnstart!!!");
										jBox.options.target.off(
											'click', 
											jBox.taskHandler
										);
									}
									, onComplete: function(task) {
										var $content
											, jBox = this;

										$content = $(jBox.content.prop("outerHTML"));
										$content.html("You did it!!");
											/*.prepend("You did it!! ")
											.find(".modal-footer")
											.remove();*/

										jBox.updateContent($content);
									}
								}
								, onOpen: function() {
									var $derrickStory = $("#490803154307273");

									this.options.defaultOnOpen.call(this);
									this.lightOnTarget($derrickStory);
									// provide default behaviour so it doesn't get overriden
									//this.lightOnTarget(this.options.target);

								}
								, onClose: function() {
									var $derrickStory = $("#490803154307273");
									
									this.lightOffTarget($derrickStory);
									// provide default behaviour so it doesn't get overriden
									this.options.defaultOnClose.call(this);
									//this.lightOffTarget(this.options.target);

								}
							}
							, {
								content: "Below the tags is a short summary of what the document is about. Only one line is shown by default. If the description is longer than one line than whatever does not fit is hidden. You can click the 'read more' button to see the rest of the description."
								, title: 'Description'
								, target: $('.description', $firstEntry)
								, position: { y: 'bottom' }
								, outside: 'y'
							}
							, {
								content: "If the description is long, you have to click on 'Read More' to find the link. If the document summary fits in one line, you will see the 'Suggest an Edit' link already there."
								, title: 'Read More'
								, width: $firstEntry.width()
								, target: $('.truncation.control.expander', $firstEntry)
								, pointer: 'right'
								, position: { y: 'bottom' }
								, outside: 'y'
								, onNext: function() {
									console.log("onNext();")
									$('.truncation.control.expander', $firstEntry).trigger("click");
								}
							}
							, {
								content: "This site is meant to be community driven - we want YOU to help make sure the content is accurate and high quality. For that reason there is a link called 'Suggest an Edit' on each document summary. If the description is long, you have to click on 'Read More' to find the link. If the document summary fits in one line, you will see the 'Suggest an Edit' link already there."
								, title: 'Suggest An Edit'
								, width: $firstEntry.width()
								, target: $('.edit.control', $firstEntry)
								, pointer: 'right'
								, position: { y: 'bottom' }
								, outside: 'y'
								, onPrev: function() {
									console.log("onPrev();")
									$('.truncation.control.collapser', $firstEntry).trigger("click");
								}
							}
							, {
								content: 'The sidebar contains controls to help you find the documents you are looking for. Example: click on the dropdown box where it says "Surgery" and choose an option (e.g. "Immunotherapy") and then click "Add Filter."'
								//, target: $("#documentsListing .entry:nth-of-type(2)")
								, title: 'Sidebar'
								, target: $('#sidebar')
								, onOpen: function() {
									this.options.defaultOnOpen.call(this);
									$("#filterBox button").one('click', function() {
										alert("I was added by the tour!");
									});
								}
								, position: { x: 'right', y: 'top' }
								, offset: { y: 60 }
								, outside: 'x'
							}
						    , {
						    	content: 'Congratulations! You have completed the tour!!'
						    }
						];

						return {
							options: options
							, jBoxDefs: jBoxDefs
						};
					}
					return {
						init: function() {
							tourHelper = websiteTour(TOURS_Z_INDEX);
							if (tourHelper.isTourCompleted(DOCUMENTS_TOUR_ID)) {
								console.log("User has completed tour ", DOCUMENTS_TOUR_ID, " before. Not starting tour now.");
								setupTourActionLink('Restart Tour', 'restart');
							} else if (!tourHelper.isTourSkipped(DOCUMENTS_TOUR_ID)) {
								tour = tourHelper.getTourForID(DOCUMENTS_TOUR_ID, getDocumentsTour());
								if (tour.isStarted()) {	  // tour is paused
									//tour.resume()
									tour.confirmBeforeResuming();
								} else {
									tour.confirmBeforeStarting();
								}
							} else {
								console.log("User has skipped tour ", DOCUMENTS_TOUR_ID, " for this session.");
								if (tourHelper.isTourStarted(DOCUMENTS_TOUR_ID)) {
									console.log("User has already started tour ", DOCUMENTS_TOUR_ID, " so set link to resume");
									setupTourActionLink('Resume Tour', 'resume');
								}
								else {
									console.log("User has not started tour ", DOCUMENTS_TOUR_ID, " so set link to start");
									setupTourActionLink('Start Tour', 'start');
								}								
							}
						}
					}
				} 
			}
		}

		, autocompleteHelper
		, TAG_TO_TAG_GROUP_MAP;

	window.App = window.App || {};
	window.App.Discover = window.App.Discover || {};
	window.App.Discover.init = init;

	window.setGlossaryTerms = function(mapOfTerms) {
		FEATURES.glossary.terms = mapOfTerms;
		window.setGlossaryTerms = function(){};
	}

	window.setTagToTagGroup = function(mapOfTagsAndTagGroups) {
		TAG_TO_TAG_GROUP_MAP = mapOfTagsAndTagGroups;
		window.setTagToTagGroup = function(){};
	}

	return; 

	function getAppliedTags() {
		var appliedTags = [];
		$.each(filteredTagsMap, function(tag) {
			if (HAS_OWN.call(filteredTagsMap, tag)) {
				appliedTags.push(tag);
			}
		});
		return appliedTags;
	}

	function ensureInPage(selector, componentName) {
		var $jqElement;

		componentName = componentName || "component";
		$jqElement = $(selector);
		if ($jqElement.length <= 0) {
			console.error("ERROR: cannot create " + componentName + " because no DOM node matches $('" + selector + "')");
		}
		return $jqElement;
	}

	function makeSuggestEditHelper() {
		return {
			init: function() {
				$(".entry .description").each(function() {
					var $this = $(this),
						id = $this.closest(".entry").attr("id"),
						href = "/discover/"+id+"/description/edit",
						$suggestEditLink;

					$suggestEditLink = $("<a>Suggest an Edit</a>").attr({
						"href": href,
						"class": "edit control",
						"target": "_blank"
					}).appendTo($this);
				});
			}
		};
	}

	function makeTrucationHelper() {
		var NEWLINE_REPLACEMENT_CHAR = "¶"
		  	, NEWLINE_REPLACEMENT_MATCHER = RegExp("(\s)?" + NEWLINE_REPLACEMENT_CHAR + "(\s)?", "g")
			//, CSS_TO_ADD = "/* inserted by truncation */"
			;

		/*function insertCSS() {
			$("head").append("<style>"+CSS_TO_ADD+"</style>");
		}*/

		function createReadMoreHTML(isHidden) {
			return "<span class='truncation control expander" + 
				(isHidden ? " hidden " : "") +
			 	"'>Read More</span>";
		}

		function createReadLessHTML(isHidden) {
			return "<span class='truncation control collapser" + 
				(isHidden ? " hidden " : "") +
				"'>Read Less</span>";
		}

		function insertHTML() {
			var HTML_TO_ADD = createReadLessHTML(true) + createReadMoreHTML(false);
			$("#documentsListing .description").prepend(HTML_TO_ADD);
		}

		function onReadMore($event) {
			var $src = $($event.target);

			expand($src.nextAll(".t"));
			$src.parent().find(".control").removeClass("hidden");
			//$src.prev(".truncation.collapser").removeClass("hidden");
			$src.addClass("hidden");
		}

		function onReadLess($event) {
			var $src = $($event.target);

			truncate($src.nextAll(".t"));
			$src.parent().find(".control").addClass("hidden");
			$src.next(".truncation.expander").removeClass("hidden");
			//$src.addClass("hidden");
		}

		function truncate($el) {
			$el.html($el.html().replace(/<br(\s)*(\/)?>/g, " " + NEWLINE_REPLACEMENT_CHAR + " "));
			$el.addClass("truncated");
		}

		function expand($el) {
			$el.html($el.html().replace(NEWLINE_REPLACEMENT_MATCHER, "<br/>"));
			$el.removeClass("truncated");
		}

		function bindHandlers() {
			$docsList.on("click", ".truncation.expander", onReadMore);
			$docsList.on("click", ".truncation.collapser", onReadLess);
		}

		return {
			init: function() {
				//insertCSS();
				insertHTML();
				bindHandlers();
				$("#documentsListing .t").each(function() {
					var $this = $(this),
						heightBeforeTruncation = $this.height();

					truncate($this);
					if ($this.height() * 1.5 > heightBeforeTruncation) {
						$this.prevAll(".truncation.control").remove();
						expand($this);
						$this.addClass("notTruncatable");
					}
				});
			}
		};
	}

	function makeToolTipHelper() {
		var updateTitle = (function() {
			var UNSELECTED_TITLE = "Click to hide all documents not tagged with '"
				, SELECTED_TITLE = "Click to stop hiding documents not tagged with '"
				, SELECTED_CLASS = "selected"
				, END_OF_LINE = "'";

			return function() {
				var $el = $(this);
				if ($el.hasClass(SELECTED_CLASS)) {
					$el.attr('title', SELECTED_TITLE + $el.val() + END_OF_LINE);
				}
				else {
					$el.attr('title', UNSELECTED_TITLE + $el.val() + END_OF_LINE);
				}
			}
		})();

		function updateTitleHandler($event, tagToggled) {
			$("[name='filterByTag']")
				.filter("[value='"+tagToggled+"']")
				.each(updateTitle);
		}

		function bindHandlers() {
			$docsList.on("selectTag", updateTitleHandler);
			$docsList.on("unselectTag", updateTitleHandler);			
		}

		return {
			init: function() {
				$("[name='filterByTag']").each(updateTitle);
				bindHandlers();
			}
		};
	}

	function makeCallToActionHelper(parentSelector, hideWhenEmpty) {
		var DEFAULT_CTA = "Click on a title to see the document"
			, CTA_CLASS = "ctaHighlighted"
			, $parentEL
			, $ctaEL
			, TITLES_SELECTOR = ".title > h2 > a"
			;

		$parentEL = parentSelector ? $(parentSelector) : $("#message");
		$ctaEL = $parentEL.find('.cta');
		bindHandlers();

		function highlightTitles() {
			$(TITLES_SELECTOR).addClass(CTA_CLASS)
		}

		function unhighlightTitles() {
			$(TITLES_SELECTOR).removeClass(CTA_CLASS)
		}

		function doWhenDefault(f) {
			return function() {
				if ($ctaEL.text() === DEFAULT_CTA) f();	
			}
		}

		function bindHandlers() {
			$ctaEL.hover(
				doWhenDefault(highlightTitles),
				doWhenDefault(unhighlightTitles)
			);
		}

		function updateCallToAction(newCTAHtml) {
			var oldCTAHtml = $ctaEL.html();

			$ctaEL.html(newCTAHtml);
			$ctaEL.trigger('change:cta', {
				oldValue: oldCTAHtml
				, newValue: newCTAHtml
			});
		}

		return {
			setCTA: function(ctaHTML) {
				updateCallToAction(ctaHTML);
				if (hideWhenEmpty) {
					if (ctaHTML && ctaHTML.length) {
						$parentEL.show();
					}
				}
			}
			, reset: function() {
				if (hideWhenEmpty) {
					$parentEL.hide();
				}
				else {
					updateCallToAction(DEFAULT_CTA);
				}
			}
		};
	}

	function makeSearchHelper(callToActionHelper, openSearchInSamePage) {
		var FB_SEARCH_BASE_URL =
				"https://www.facebook.com/groups/fibrolamellar/search/?query=",
			DEFAULT_CTA_MSG = "Click here to search our groups for posts matching those tags.",
			LINK_TEXT = "Click here",
			TARGET_ATTR = !openSearchInSamePage ? "target='_blank'" : "";


		function normalizeTag(tag) {
			return tag.replace(/\s*\([^\)]*\)\s*/g, '')	// strip out parenthetical content
					.replace(/\//g, ' ')
					.replace(/\"/g, '')
					.replace(/\'/g, '');

		}

		// not currently using because Facebook will 'AND' all terms together
		// and this can reduce results - e.g. Adriamycin Doxil Doxorubicin
		function getAllChemoVariations(tag) {
			return normalizeTag(tag);
		}

		function getFirstVariantOnly(tag) {
			var slashIndex = tag.indexOf('/');

			if (slashIndex > 0) {
				tag = tag.substring(0, slashIndex);
			} 

			return normalizeTag(tag.trim());
		}

		function getMoreCommon(chemo) {
			var substitutionMap = {
				'intron' : 'Interferon'
				, 'adriamycin' : 'Doxorubicin'
				, 'affinitor' : 'Everolimus'
			};
			// the map above is based on results from searching the fb group

			getMoreCommon = function(chemo) {
				return substitutionMap[chemo.toLowerCase()] || chemo;	
			}
			
			return getMoreCommon(chemo);
		}

		function makeQuery() {
			var appliedTags = getAppliedTags() || [];

			appliedTags = $.map(appliedTags, function(tag) {
				if (tag.indexOf('+') > 0) {
					return $.map(tag.split('+'), function(tag) {
						return getMoreCommon(getFirstVariantOnly(tag));
					}).join(' ');
				}
				else if (tag.indexOf('/') > 0) {
					return getMoreCommon(getFirstVariantOnly(tag));
				}
				else {
					tag = tag.replace(/\s*\([^\)]*\)\s*/g, '');
					return (tag.indexOf(' ') > 0) ? '"' + tag + '"' : tag;
				}
			}).join(' ');

			return FB_SEARCH_BASE_URL + encodeURIComponent(appliedTags);
		}

		function makeSearchCTA(href) {
			var closeTagIndex =
					DEFAULT_CTA_MSG.indexOf(LINK_TEXT) + LINK_TEXT.length;

			return "<a href='" + href + "' " + TARGET_ATTR + " >" +
				DEFAULT_CTA_MSG.substring(0, closeTagIndex) +
				"</a>" +
				DEFAULT_CTA_MSG.substring(closeTagIndex);
		}

		function onTagSelected() {
			callToActionHelper.setCTA(makeSearchCTA(makeQuery()));
		}

		function onTagUnselected() {
			var query = makeQuery();
			if (query.length != FB_SEARCH_BASE_URL.length) {
				callToActionHelper.setCTA(makeSearchCTA(query));
			}
			else {
				callToActionHelper.reset();
			}
		}

		function bindHandlers() {
			$docsList.on("selectTag", onTagSelected);
			$docsList.on("unselectTag", onTagUnselected);
		}

		return {
			init: function() {
				console.log("search cta is initializing..");
				bindHandlers();
				console.log("search cta is DONE initializing!");				
			}
		};
	}

	function makeStateDescriptor($stateEL) {
		var DEFAULT_STATE_DESCRIPTOR = "Showing all documents in our Facebook Group."
			, STATE_TAG_CLASS = "describedTag"
			;

		function bindHandlers() {
			$docsList.on("selectTag", updateStateDescriptor);
			$docsList.on("unselectTag", updateStateDescriptor);
		}

		function updateStateDescriptor() {
			var newShowingMessage
				, appliedTags = []
				, lastAppliedTag
				, oldState
				;

			newShowingMessage = "Now showing documents tagged with ";
			appliedTags = getAppliedTags() || [];
			console.log("appliedTags: ", appliedTags);
			appliedTags = $.map(appliedTags, function(tag) {
				return "<span class='"+STATE_TAG_CLASS+"'>'" + tag + "'</span>"
			});

			switch (appliedTags.length) {
				case 0:
					newShowingMessage = DEFAULT_STATE_DESCRIPTOR;
					break;

				case 1:
					newShowingMessage += appliedTags[0] + ".";
					break;

				default:
					lastAppliedTag = appliedTags.pop();
					newShowingMessage += appliedTags.join(", ") + " and " + lastAppliedTag + ".";
					break;
			}

			// this is not just for our internal views; there was code
			// elsewhere interested in this event (may no longer be true though)
			oldState = $stateEL.html();
			$stateEL.trigger('change:state', {
				oldValue: oldState
				, newValue: newShowingMessage
			});
		}

		function makeNotificationView($el) {
			var NOTIFICATION_CTA_HTML = " <a href='#'>Click here</a> " +
				"to search our groups for posts matching those tags.";
			$el.on('change:state', function($event, eventData) {
				new jBox('Notice', {
					content: eventData.newValue + NOTIFICATION_CTA_HTML
					, position: { x: 'left', y: 'bottom'}
				});
			});
		}

		function makeMsgBoxView($el) {
			$el.on('change:state', function($event, eventData) {
				$el.html(eventData.newValue);
			});
			$stateEL.parents().show();			
		}

		return {
			init: function() {
				console.log("state descriptor is initializing..");
				bindHandlers();
				makeNotificationView($stateEL);
				//makeMsgBoxView($stateEL);
				console.log("state descriptor is DONE initializing!");				
			}
		};

	}

	// function isGlossaryLoaded() {
	// 	return FEATURES["glossary"].instance.isLoaded();
	// }

	function makeGlossary() {
		//var $el = $("<div id='glossaryPopUp'></div>");
		var $el = $("#glossaryToolTip")
			, isHoveringOnBox = false
			, isHoverHandlerSet = false
			, terms
			, options = {
				attach: $(".entry .description em")
				, addClass: "glossaryToolTip"
				//, closeOnMouseleave: true
				, position: { x: 'center' }
				, delayOpen: 200				
			}
			$jBox = $el.jBox('Tooltip', options);


		function showGlossaryTip($event) {
			var $src = $($event.target),
				title = $src.text(),
				content = $src.closest(".entry").data(title);

			console.log("showGlossaryTip");

			/*$jBox = new jBox('Tooltip', {
				title: title,
				content: content
			});*/

/*			$src.jBox("Tooltip", {
				title: $src.data("title"),//terms["5FU"].name,
				content: $src.data("content"),
				closeOnMouseleave: true,
				position: {
					x: 'center'
				}
			});*/

			if (typeof $jBox == "undefined") return;

			console.log("$src: ", $src);
			console.log("title: ", title);
			console.log("content: ", content);

			/*$jBox.open({
				target: $src,
				title: $src.data("title"),
				content: $src.data("content"),
				closeOnMouseleave: true,
				position: {
					x: 'center'
				}
			});
*/
			$jBox.setTitle(title);
			$jBox.setContent(content);
			$jBox.open({
				target: $src
				//, closeOnMouseleave: true
			});

			if (!isHoverHandlerSet) {
				$(".glossaryToolTip").hover(function() {
					console.log("isHoveringOnBox is true");
					isHoveringOnBox = true;
				}, function() {
					console.log("isHoveringOnBox is false");
					isHoveringOnBox = false;
					console.log("closing....");
					$jBox.close();
				});

				isHoverHandlerSet = true;				
			}

			$src.one("mouseleave", function($event) {
				setTimeout(function() {
					if (!isHoveringOnBox) {
						console.log("closing..");
						$jBox.close();
					}
				}, 100);
			});

			//if (typeof terms == "undefined") return;

			/*$jBox.attach($src)
			$jBox.setContent(terms[term].description);
			$jBox.setTitle(term);
			$jBox.open();

			/*options.target = $src[0];
			options.title = term;
			options.content = terms[term].description;*/
			/*$jBox.open({
				target: $src,
				title: term,
				content: terms[term].description,
				closeOnMouseleave: true,
				position: {
					x: 'center'
				}				

			});*/
		}

		function bindHandlers() {
			//$("#documentsListing").on("click", ".entry .description em", showGlossaryTip);
			$docsList.on("mouseenter", ".entry .description em", showGlossaryTip);
		}

		return {
			init: function() {
				//$el.appendTo("body");
				terms = FEATURES.glossary.terms;
					
				//$jBox = new jBox('Tooltip');

				bindHandlers();

				$(".entry .description em").each(function() {
					var $el = $(this),
						term = $el.text(),
						synonyms = terms[term].synonyms,
						content = 
							terms[term].description + 
							(synonyms ? "<div>Synonyms: " + synonyms + "</div>" : "");

					$el.closest(".entry").data(term, content);

					/*$el.data("title", term);
					$el.data("content", content);*/

					/*$el.jBox("Tooltip", {
						title: term,//terms["5FU"].name,
						content: content
						closeOnMouseleave: true,
						position: {
							x: 'center'
						}
					});*/
				});
			}
			, isLoaded: function() {
				return typeof FEATURES.glossary.terms != "undefined";
			}
		};
	}

	function makeAutocompleteHelper() {
		var autocomplete,
			$tagSelector,
			defaultOptions = {
				search_contains: true
			};

		return {
			init: function(jqSelector) {
				console.log("init autocomplete helper called with jqSelector: ", jqSelector);
				$tagSelector = ensureInPage(jqSelector, "autocompleteHelper");
				autocomplete = $tagSelector.chosen(defaultOptions);

				this.updateOptions = function(newLookupOptions) {
					/*var currentOptions = $.extend(
						{lookup: newLookupOptions}, 
						defaultOptions
					);
					autocomplete.options(currentOptions);*/
					$tagSelector.trigger("chosen:updated");
				};

				// is this needed? 
				//this.updateOptions();
			}
		};
	}

	function makeUrlHelper() {
		var MULTI_VALUE_SEPARATOR = "|",
			qsMap;

		function qsToQSMap(qs) {
			var i,
				paramsMap;

			if (!qs || qs.length <= 0) {
				return {};
			}

			paramsMap = {};
			qs = decodeURIComponent(qs) || "";
			$.each(qs.split("&"), function(index, paramAssign) {
				var assignIndex,
					paramName,
					paramValue

				if (!paramAssign || paramAssign.length <= 0) return null;

				assignIndex = paramAssign.indexOf("=");
				if (assignIndex < 0) return null;

				paramName = paramAssign.substring(0, assignIndex);
				paramValue = paramAssign.substring(assignIndex+1);
				if (paramValue.indexOf(MULTI_VALUE_SEPARATOR) >= 0) {
					paramValue = paramValue.split(MULTI_VALUE_SEPARATOR);
				}

				paramsMap[paramName] = (paramsMap[paramName] || []).concat(paramValue);
			});

			return paramsMap;
		}

		function toQS() {
			var qs = [];
			$.each(qsMap, function(key, value) {
				if (value.length > 0 || (!$.isArray(value) && typeof value !== "string")) {
					qs.push(encodeURIComponent(key) +
						"=" +
						encodeURIComponent(value.join(MULTI_VALUE_SEPARATOR))
					);					
				}
			});
			return qs.join("&");
		}

		function bindHandlers() {
			$docsList.on("selectTag", addTagToUrl);
			$docsList.on("unselectTag", removeTagFromUrl);
		}

		function init() {
			console.log("url helper is initializing..");
			// first character is '#'
			qsMap = qsToQSMap(location.hash && location.hash.substring(1));
			if (typeof qsMap.tags !== "undefined") {
				$.each(qsMap.tags, function(index, tagName) {
					selectTag(tagName);
				});				
			}

			// now that URL helper is initialized can add handlers for
			// changes to page to update URL
			bindHandlers();

			console.log("url helper is DONE initializing..");
		}

		function updateURL() {
			// prepending '#' based on comments in Backbone that some browsers
			// need it to work correctly
			location.hash = '#' + toQS();
		}

		function addTagToUrl($event, aTagName) {
			console.log("adding tag: ", aTagName);
			$event.preventDefault();
			if (typeof qsMap.tags === "undefined") qsMap.tags = [];

			qsMap.tags.push(aTagName);
			updateURL();
		}

		function removeTagFromUrl($event, aTagName) {
			var i,
				tags = qsMap.tags;

			console.log("removing tag: ", aTagName);

			$event.preventDefault();
			for (i=tags.length-1; i >= 0; --i) {
				if (tags[i] === aTagName) {
					tags.splice(i, 1);
					break;
				}
			}

			updateURL();
		}

		return {
			init: init
		};
		
	}

	function getMatchingTags(aTagName) {
		return $("input[name='filterByTag'][value='" + aTagName + "']", $docsList);
	}

	function rebuildTagSelector() {
		$("#"+ADD_TAG_FILTER_SELECTOR_ID)
			.html(f_makeOptionGroupsHTML(f_getCurrentOptions()));	
		if (autocompleteHelper) autocompleteHelper.updateOptions();
	}

	function restoreTagFilterOptionInSelector(aTagName) {
		$.each($("select#AddTagFilterSelector").get(0).options, function() {
			if (this.value === aTagName) {
				this.style.display = "";
				// hiding options doesn't work in all browsers so enable it now; it was also disabled when it was hidden (disabling is standard in all browsers)
				this.disabled = false;
			}
		});
	}

	function removeTagFilterOptionInSelector(aTagName) {
		var tagFilterSelector = $("select#AddTagFilterSelector").get(0),
			tagToSelectOptions = tagFilterSelector.options,
			selectedOption,
			i;

		//$tagFilterSelector.get(0).options[$tagFilterSelector.get(0).selectedIndex].disabled = true;
		//tagToSelectOptions[tagFilterSelector.selectedIndex].disabled = true;
		
		// doesn't work because options is an array-like object
		//selectedOption = tagToSelectOptions.indexOf(aTagName);
		for (i=0; i < tagToSelectOptions.length && tagToSelectOptions[i].value != aTagName; ++i) {
			// noop - find index of selected tag
		}
		selectedOption = tagToSelectOptions[i];
		selectedOption.style.display = "none";
		// hiding options doesn't work in all browsers so disable it too (disabling is standard in all browsers)
		selectedOption.disabled = true;
		//for (i=0; i < tagToSelectOptions.length && tagToSelectOptions[i].disabled; ++i) {
		for (i=0; i < tagToSelectOptions.length && tagToSelectOptions[i].style.display == "none"; ++i) {
			// noop - find next non-disabled option
		}
		if (i < tagToSelectOptions.length) {
			tagFilterSelector.selectedIndex = i;	
		}		
	}; 


	function unselectTag(aTagName) {
		var $matchedDocs,
			requiredTags,
			numRequiredTags;

		delete filteredTagsMap[aTagName];

		console.log("unselectTag(", aTagName, ")");
		$matchedTags = getMatchingTags(aTagName);
		$matchedTags.removeClass("selected");
		
		$("#appliedTags .tagsList .tagFilter").filter(function() {
			return $(this).data("tagName") === aTagName;
		}).remove();	

		// NOT needed if select options are regenerated each time a filter is applied or removed
		// restoreTagFilterOptionInSelector(aTagName);

//		console.log("$matchedTags: ", $matchedTags);
		$matchedDocs = $matchedTags.map(function(index, domElement) {
			return $(domElement).parents(".entry")[0];
		});

		requiredTags = $("#appliedTags .tagsList .tagFilter").map(function() {
			return $(this).data("tagName");
		});
		numRequiredTags = requiredTags.length;		

		if (numRequiredTags > 0) {
			console.log("entries: ", $(".entry", $docsList));
			$docsList.find(".entry").each(function() {
				var hasAllRequiredTags = true,
					i,
					$this = $(this),
					myTags = [];

				$(".tagsList input[name='filterByTag']", $this).each(function() {
					myTags.push(this.value);
				});

				for (i=0; i < numRequiredTags && hasAllRequiredTags; ++i) {
					hasAllRequiredTags &= (myTags.indexOf(requiredTags[i]) >= 0);
				}

				if (hasAllRequiredTags) {
					//$this.show();
					$this.removeClass('hidden');
				}
			});			
		}
		else {
			$("#appliedTags .tagsList").hide();
			//$docsList.find(".entry").each(function() {$(this).show()});
			$docsList.find(".entry").each(function() {
				$(this).removeClass('hidden');
			});
		}

		rebuildTagSelector();

		$docsList.trigger("unselectTag", aTagName);
	}

	function selectTag(aTagName) {
		var $matchedDocs;

		filteredTagsMap[aTagName] = true;

		console.log("selectTag(", aTagName, ")");
		// select documents
		$matchedTags = getMatchingTags(aTagName);
		$matchedTags.addClass("selected");

		// update LHN
		$("#appliedTags .tagsList").show().append($("<span class='tagFilter'></span>").html(aTagName+" | <input type='submit' name='removeTagFilter' value='x'/>").data("tagName", aTagName));

		
//		console.log("$matchedTags: ", $matchedTags);
		$matchedDocs = $matchedTags.map(function(index, domElement) {
			return $(domElement).parents(".entry")[0];
		});

		//$(".entry", $docsList).not($matchedDocs).hide();
		$(".entry", $docsList).not($matchedDocs).addClass('hidden');

		rebuildTagSelector();

		// NOT needed if the select options list is regenerated each time a filter is applied or removed
		//removeTagFilterOptionInSelector(aTagName);

		$docsList.trigger("selectTag", aTagName);
	}


	function toggleTagFilter(aTagName, $triggeringEvent) {
		var $matchedDocs
			, $msgBox = $("#message")
			, $matchedTags
			, $clickedEntry
			, $offsetParent
			, isSelected
			, initialTop
			, changeInTop
			;

		$matchedTags = getMatchingTags(aTagName);
		$clickedEntry = $($triggeringEvent.target).closest('.entry');
		$offsetParent = $clickedEntry.offsetParent();
		initialTop = $clickedEntry.position().top;

		isSelected = filteredTagsMap[aTagName]
		if (!isSelected) {
			selectTag(aTagName);			
		}
		else {
			unselectTag(aTagName);
		}

		changeInTop = $clickedEntry.position().top - initialTop;
		$offsetParent.scrollTop($offsetParent.scrollTop() + changeInTop);
	}


	function f_makeOptionGroupsHTML(optionsArray) {
		var i,
			optGroupToOptionsMap = {},
			optionGroupLabel,
			optionGroupStr,
			output = [],
			groupOfOptions,
			OPTION_GROUPS_TO_OUTPUT = [
				"Treatments",
				"Surgery", 
				"Chemotherapy",
				"Radiation", 
				"Symptoms and Side Effects", 
				"Disease Sites/Locations", 
				"Disease Stage", 
				"General Knowledge and Tips", 
				"Other"
			];

		if (!optionsArray || !optionsArray.length) return [];

		console.log("TAG_TO_TAG_GROUP_MAP: ", TAG_TO_TAG_GROUP_MAP);

		for (i=0; i < optionsArray.length; ++i) {
			option = optionsArray[i];
			optionGroup = TAG_TO_TAG_GROUP_MAP[option.data];
			groupOfOptions = optGroupToOptionsMap[optionGroup];
			if (!groupOfOptions) {
				groupOfOptions = optGroupToOptionsMap[optionGroup] = [];
			}
			groupOfOptions.push(f_optionToHTML(option));
		}

		for (i=0; i < OPTION_GROUPS_TO_OUTPUT.length; ++i) {
			optionGroupLabel = OPTION_GROUPS_TO_OUTPUT[i]; 
			optionGroup = optionGroupLabel && optGroupToOptionsMap[optionGroupLabel];
			if (optionGroup) {
				optionGroupStr = "<optgroup label='" + optionGroupLabel + "'>";
				optionGroup.sort();
				if (optionGroupLabel == "Treatments") optionGroup.reverse();
				optionGroupStr += optionGroup.join("\n");
				optionGroupStr += "</optgroup>";

				output.push(optionGroupStr);
			}
		}

		return output;
	}

	function f_optionToHTML(option) {
		return "<option value='" + option.data + "'>" + option.label + "</option>";
	}

	function f_getOptionsForMap(aTagsToIdsMap) {
		return $.map(aTagsToIdsMap, function(values, key) {	        
			var label = key + " (" + values.ids.length +")";
			return {data: key, label: label};
		});
	}

	function f_getCurrentOptions() {
		return f_getOptionsForMap(f_getTagsToIdsMap());
	}

	function f_createTagSelectorHTML() {
		return "<select>" + f_makeOptionGroupsHTML(f_getCurrentOptions()) + "</select>";
	}

	function f_isHidden() {
		return this.style.display != "none"
	}	

	function f_getIdsAndTagsForEntry() {
		var $entry = $(this);
		/*var $this = $(this),
			$entry = $this.closest(".entry");*/

		return {
			"id" : $entry.prop("id"),
			"tags" : $("input[name='filterByTag']", $entry).map(function() { 
				return this.value;
			})
		};
	};	

	function f_getTagsToIdsMap() {
		var idToTagsList;

		idToTagsList = $ALL_ENTRIES
			.filter(f_isHidden)
			.map(f_getIdsAndTagsForEntry);
		
		console.log("idToTagsList: ", idToTagsList);

		var tagsToIdsMap = {};
		$.each(idToTagsList, function() {
		  var id = this.id;
		  $.each(this.tags, function() {
			var idsForTag;

			// console.log("filteredTags: ", filteredTags);
			// console.log("this: ", ""+this);
			// console.log("filteredTags.indexOf(this): ", filteredTags.indexOf(""+this));
			// don't include tags that are already filtered as an option
			// not sure why the string type coercion is needed
			//if (filteredTags.indexOf(""+this) >= 0 ) return;
			if (filteredTagsMap[this]) return;

			idsForTag = tagsToIdsMap[this];
			if (!idsForTag) {
			  idsForTag = {
				"ids" : []
			  };
			  tagsToIdsMap[this] = idsForTag;
			}

			idsForTag.ids.push(id);
		  });
		});

		console.log("tagsToIdsMap: ", tagsToIdsMap);
		//window.tagsToIdsMap = tagsToIdsMap;
		return tagsToIdsMap;
	}



	function savePageState() {
		persistForSession('scrollTop', $docsList.scrollTop());
	}

	function loadPageState() {
		$docsList.scrollTop(getPersistedForSession('scrollTop'));
	}



	function init(featuresToEnable) {
		console.log("Initializing App.Discover");

		MAIN_HEIGHT = $('#main').height();

		$docsList.on("click", "input[name='filterByTag']", function($event) {
			var tagClicked;

			$event.preventDefault();

			tagClicked = this.value;
			toggleTagFilter(tagClicked, $event);
			//$($event.target).blur();
		});

		$("#appliedTags").on("click", "input[name='removeTagFilter']", function($event) {
			var tag = $(this).parent().data("tagName")
			unselectTag(tag);
		});

		$("<button class='add filter'>Add Filter</button>")
			.on("click", function() {
				var tagFilterSelector = $(this).closest("#filterBox").find("select#"+ADD_TAG_FILTER_SELECTOR_ID).get(0),
					tagToSelect = tagFilterSelector.value;

				console.log("tagToSelect: ", tagToSelect);
				selectTag(tagToSelect);			
			})
			.insertBefore("#appliedTags .tagsList")
			.before($(f_createTagSelectorHTML()).attr({"id" : ADD_TAG_FILTER_SELECTOR_ID}))
			.after("<br/>");
		$("<button class='reset filter'>Reset Filters</button>")
			.on('click', function() {
				$("[name='removeTagFilter']").trigger("click");
			})
			.insertAfter("#appliedTags .add.filter");
		$(".helpLink").on("click", function($event) {
			$event.preventDefault();
			$("#helpText").slideToggle();
		});

		$('body').on('click', '[href]', savePageState);

		// IS THIS EVEN NEEDED NOW?!?
		// todo replace this with something cleaner
		if ($("#sidebar").css("display") === "none") {
			//console.log("\n\n\n binding closeHandler \n\n\n");
			$("body").on("click", ".button.close", closeHandler);
		}
		else {
			//console.log("\n\n\n binding closeAndPullUpHandler \n\n\n");
			$("body").on("click", ".button.close", closeAndPullUpHandler);
		}

		$("#loadingDiv").hide();
		$docsList.show();
		
		initFeatures(FEATURES, featuresToEnable);

		App.MobileMenu.init();

		// wait til after features are completed; will only work for 
		// synchronous features; if depends on an async feature, will need
		// to bind to a promise
		loadPageState();

		console.log("Done initializing App.Discover");
	}

})(jQuery);
