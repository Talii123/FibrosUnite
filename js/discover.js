

(function($) {
	var $docsList = $("#documentsListing"),
		$ALL_ENTRIES = $(".entry", "#documentsListing"),
		ADD_TAG_FILTER_SELECTOR_ID = "AddTagFilterSelector",
		HAS_OWN = Object.prototype.hasOwnProperty,
		filteredTagsMap = {},

		autocompleteHelper,

		TAG_TO_TAG_GROUP_MAP = {
			"Surgery": "Treatments",
			"Chemo": "Treatments",
			"Radiation": "Treatments",
			"Chemoembolization / T.A.C.E": "Treatments",
			"Radioembolization": "Treatments",
			"Ethanol Embolization": "Treatments",
			"Embolization": "Treatments",
			"Immunotherapy": "Treatments",
			"Bone Marrow Transplantation": "Treatments",
			"Alternative Therapy": "Treatments",
			"Clinical Trials": "Treatments",
			"Nutrition": "General Knowledge and Tips",
			"Exercise": "General Knowledge and Tips",
			"Emotional Support": "General Knowledge and Tips",
			"Caring for Someone Fighting Fibrolamellar": "General Knowledge and Tips",
			"Comforting Someone After the Loss of a Loved One": "General Knowledge and Tips",
			"Doing Your Own Research on Fibrolamellar": "General Knowledge and Tips",
			"Advocating for Yourself or a Loved One": "General Knowledge and Tips",
			"\"5FU\"/Fluorouracil + \"Intron\"/Interferon Alpha": "Chemotherapy",
			"\"5FU\"/Fluorouracil + \"Eloxatin\"/Oxaliplatin": "Chemotherapy",
			"\"5FU\"/Fluorouracil ": "Chemotherapy",
			"\"Nexavar\"/Sorafenib + \"Avastin\"/Bevacizumab": "Chemotherapy",
			"\"Nexavar\"/Sorafenib": "Chemotherapy",
			"\"Xeloda\"/Capecitabine": "Chemotherapy",
			"\"Platinol\"/Cisplatin": "Chemotherapy",
			"\"Sutent\"/Sunitinib": "Chemotherapy",
			"\"AVATAR\" (\"Avastin\"/Bevacizumab + \"Tarceva\"/Erlotinib)": "Chemotherapy",
			"\"Tarceva\"/Erlotinib": "Chemotherapy",
			"\"GEMOX\" (\"Gemzar\"/Gemcitabine + \"Eloxatin\"/Oxaliplatin)": "Chemotherapy",
			"\"Gemzar\"/Gemcitabine + \"Eloxatin\"/Oxaliplatin + \"Avastin\"/Bevacizumab": "Chemotherapy",
			"\"Gemzar\"/Gemcitabine": "Chemotherapy",
			"\"Adriamycin\"/Doxorubicin + \"Platinol\"/Cisplatin": "Chemotherapy",
			"\"Adriamycin\"/\"Doxil\"/Doxorubicin": "Chemotherapy",
			"\"Affinitor\"/Everolimus": "Chemotherapy",
			"PIAF - Platinum Interferon Adriamycin Fluorouracil": "Chemotherapy",
			"\"Avastin\"/Bevacizumab": "Chemotherapy",
			"Linifanib": "Chemotherapy",
			"\"Camptosar\"/Irinotecan": "Chemotherapy",
			"\"Oncovin\"/Vincristine": "Chemotherapy",
			"Mouth Sores": "Symptoms and Side Effects",
			"Nausea": "Symptoms and Side Effects",
			"Fatigue": "Symptoms and Side Effects",
			"Loss of Appetite": "Symptoms and Side Effects",
			"Problems with Hands and Feet": "Symptoms and Side Effects",
			"Jaundice (yellowing of skin or eyes)": "Symptoms and Side Effects",
			"Abdominal Pain": "Symptoms and Side Effects",
			"Ache and Pains": "Symptoms and Side Effects",
			"Neuropathy (loss of feeling in fingers or toes)": "Symptoms and Side Effects",
			"Thrush (white tongue)": "Symptoms and Side Effects",
			"Blood Clots": "Symptoms and Side Effects",
			"Lymphedema (Swelling)": "Symptoms and Side Effects",
			"Changes in Sense of Taste (e.g. a metal taste in your mouth)": "Symptoms and Side Effects",
			"High Ammonia Levels": "Symptoms and Side Effects",
			"Managing Catheters/Drains": "Symptoms and Side Effects",
			"Ascites": "Symptoms and Side Effects",
			"Abscess": "Symptoms and Side Effects",
			"Weight Loss": "Symptoms and Side Effects",
			"Weight Gain": "Symptoms and Side Effects",
			"Bowel Obstruction": "Symptoms and Side Effects",
			"Fever": "Symptoms and Side Effects",
			"Diarrhea": "Symptoms and Side Effects",
			"Rashes": "Symptoms and Side Effects",
			"Itchiness": "Symptoms and Side Effects",
			"Hair Loss": "Symptoms and Side Effects",
			"Vomiting": "Symptoms and Side Effects",
			"Low Blood Cell Counts (Neutropenia, Anemia)": "Symptoms and Side Effects",
			"Heartburn": "Symptoms and Side Effects",
			"Black Stools": "Symptoms and Side Effects",
			"External Beam/Proton Radiation": "Radiation",
			"Y90/Sirspheres/Therospheres - Radioactive Beads": "Radiation",
			"RFA (Radiofrequency Ablation)": "Radiation",
			"Cyberknife": "Radiation",
			"Brachytherapy": "Radiation",
			"Liver Surgery": "Surgery",
			"Liver Transplantation": "Surgery",
			"Surgery to Remove Tumors Outside of the Liver": "Surgery",
			"Laproscopic or Minimally Invasive Surgery": "Surgery",
			"Laser Surgery": "Surgery",
			"Recurrence": "Disease Stage",
			"Inspiration": "General Knowledge and Tips",
			"Advocacy": "General Knowledge and Tips",
			"Metastases": "Disease Stage",
			"No Disease Outside the Liver": "Disease Stage",
			"Second Opinions": "General Knowledge and Tips",
			"Cysts": "Disease Stage",
			"Paracentesis": "Symptoms and Side Effects",
			"Diuretics": "Symptoms and Side Effects",
			"Infection": "Symptoms and Side Effects",
			"Edema": "Symptoms and Side Effects",
			"Lasix": "Symptoms and Side Effects",
			"Compression Socks": "Symptoms and Side Effects",
			"Albumin": "Symptoms and Side Effects",
			"Low Sodium": "Symptoms and Side Effects",
			"Tumor Growth": "Disease Stage",
			"Tumor Shrinkage": "Disease Stage",
			"Stable Disease": "Disease Stage",
			"Liver": "Disease Sites/Locations",
			"Lymph Nodes": "Disease Sites/Locations",
			"Abdomen": "Disease Sites/Locations",
			"Chest": "Disease Sites/Locations",
			"Lungs": "Disease Sites/Locations",
			"Diaphragm": "Disease Sites/Locations",
			"Bones": "Disease Sites/Locations",
			"Brain": "Disease Sites/Locations",
			"Pancreas": "Disease Sites/Locations",
			"Gall Bladder": "Disease Sites/Locations",
			"Portal Vein": "Disease Sites/Locations",
			"Ovaries": "Disease Sites/Locations",
			"Kidney": "Disease Sites/Locations",
			"Bladder": "Disease Sites/Locations",
			"Stomach": "Disease Sites/Locations",
			"Spleen": "Disease Sites/Locations",
			"Stage I": "Disease Stage",
			"Stage II": "Disease Stage",
			"Stage III": "Disease Stage",
			"Stage IV": "Disease Stage"
		};

	window.App = window.App || {};
	window.App.Discover = window.App.Discover || {};
	window.App.Discover.init = init;
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

	function makeCallToActionHelper() {
		var DEFAULT_CALL_TO_ACTION = "Click on a title to see the document",
			CALL_TO_ACTION_CLASS = "ctaHighlighted",
			$MSG_BOX = $("#message"),
			$CALL_TO_ACTION = ensureInPage("#message .cta", "callToActionHelper"),
			TITLES_SELECTOR = ".title > h2 > a";


		function highlightTitles() {
			$(TITLES_SELECTOR).addClass(CALL_TO_ACTION_CLASS)
		}

		function unhighlightTitles() {
			$(TITLES_SELECTOR).removeClass(CALL_TO_ACTION_CLASS)
		}

		function doWhenDefault(f) {
			return function() {
				if ($CALL_TO_ACTION.text() === DEFAULT_CALL_TO_ACTION) f();	
			}
		}

		function bindHandlers() {
			$CALL_TO_ACTION.hover(
				doWhenDefault(highlightTitles),
				doWhenDefault(unhighlightTitles)
			);
		}

		return {
			init : 	function() {
						bindHandlers();
						$MSG_BOX.show();
					},
			setCTA: function(ctaHTML) {
						$CALL_TO_ACTION.html(ctaHTML);
					},
			reset: 	function() {
						$CALL_TO_ACTION.html(DEFAULT_CALL_TO_ACTION);
					}
		};
	}

	function makeSearchHelper(callToActionHelper, openSearchInSamePage) {
		var FB_SEARCH_BASE_URL =
				"https://www.facebook.com/groups/fibrolamellar/search/?query=",
			DEFAULT_CTA_MSG = "Click here to search our groups for posts matching those tags.",
			LINK_TEXT = "Click here",
			TARGET_ATTR = !openSearchInSamePage ? "target='_blank'" : "";

		function makeQuery() {
			var appliedTags = getAppliedTags() || [];

			appliedTags = appliedTags.join(',')
				.replace("'", "")
				.replace('"', '');
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
			init: 	function() {
						console.log("search cta is initializing..");
						bindHandlers();
						console.log("search cta is DONE initializing!");				
					}
		};
	}

	function makeStateDescriptor() {
		var DEFAULT_STATE_DESCRIPTOR = "Showing all documents in our Facebook Group.",
			STATE_TAG_CLASS = "describedTag",
			$STATE_DESCRIPTOR = ensureInPage("#message .showing", "stateDescriptor");

		function bindHandlers() {
			$docsList.on("selectTag", updateStateDescriptor);
			$docsList.on("unselectTag", updateStateDescriptor);
		}

		function updateStateDescriptor() {
			var newShowingMessage,
				appliedTags = [],
				lastAppliedTag;

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

			$STATE_DESCRIPTOR.html(newShowingMessage);
		}


		return {
			init: function() {
				console.log("state descriptor is initializing..");
				bindHandlers();
				console.log("state descriptor is DONE initializing!");				
			}
		};

	}

	function makeAutocompleteHelper() {
		var autocomplete,
			$tagSelector,
			defaultOptions = {};

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
		}
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
			location.hash = toQS();
		}

		function addTagToUrl($event, aTagName) {
			console.log("adding tag: ", aTagName);
			if (typeof qsMap.tags === "undefined") qsMap.tags = [];

			qsMap.tags.push(aTagName);
			updateURL();
		}

		function removeTagFromUrl($event, aTagName) {
			var i,
				tags = qsMap.tags;

			console.log("removing tag: ", aTagName);

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
					$this.show();
				}
			});			
		}
		else {
			$("#appliedTags .tagsList").hide();
			$docsList.find(".entry").each(function() {$(this).show()});
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

		$(".entry", $docsList).not($matchedDocs).hide();

		rebuildTagSelector();

		// NOT needed if the select options list is regenerated each time a filter is applied or removed
		//removeTagFilterOptionInSelector(aTagName);

		$docsList.trigger("selectTag", aTagName);
	}


	function toggleTagFilter(aTagName) {
		var $matchedDocs,
			$matchedTags,
			isSelected;

		$matchedTags = getMatchingTags(aTagName);

		//isSelected = $matchedTags.first().hasClass("selected");
		isSelected = filteredTagsMap[aTagName]
		if (!isSelected) {
			selectTag(aTagName);			
		}
		else {
			unselectTag(aTagName);
		}	
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


	function init(features) {
		var FEATURES = {
				"stateDescriptor" : {
					name: "state descriptor"
					, builder: makeStateDescriptor
				}
				, "callToAction" : {
					name: "call to action helper"
					, builder: makeCallToActionHelper
				}
				, "search" : {
					name: "search helper"
					/* this should be simplified/generalized */
					, builder: function() {
						var callToActionHelper = FEATURES["callToAction"],
							instance;
						
						if (callToActionHelper && callToActionHelper.instance) {
							return makeSearchHelper(callToActionHelper.instance);
						} else if (callToActionHelper) {
							callToActionInstance = callToActionHelper.builder();
							callToActionInstance.init();
							return makeSearchHelper(callToActionInstance);
						} else {
							console.error("Cannot create a search helper without a call to action helper!");
						}
					}
				}
				, "shareableURLs" : {
					name: "shareable URLs"
					, builder: makeUrlHelper
				}
				, "autocomplete" : {
			/*		name: "state descriptor"
					, builder: makeStateDescriptor*/
				}
			},
 			setupFeature;

		console.log("Initializing App.Discover");

		features = features || {};

		function enableFeatures (featureName, isEnabled) {
			var feature = FEATURES[featureName];
			if (typeof feature != "undefined") {
				feature.enabled = isEnabled;
			} else {
				console.error("'" + featureName + "' is not a valid feature");
			}
		}

		function enableFeaturesByURL (featureName) {
			var feature;
			if (location.search.indexOf(featureName) >= 0) {
				feature = FEATURES[featureName];
				feature.enabled = true;
				feature.enabledByUrl = true;
			}
		}

		$.each(features, enableFeatures);
		$.each(FEATURES, enableFeaturesByURL);

		$docsList.on("click", "input[name='filterByTag']", function($event) {
			var tagClicked;

			$event.preventDefault();

			tagClicked = this.value;
			toggleTagFilter(tagClicked);
		});

		$("#appliedTags").on("click", "input[name='removeTagFilter']", function() {
			unselectTag($(this).parent().data("tagName"));
		});

		$("<button>Add Filter</button>")
			.on("click", function() {
				var tagFilterSelector = $(this).closest("#sidebar").find("select#"+ADD_TAG_FILTER_SELECTOR_ID).get(0),
					tagToSelect = tagFilterSelector.value;

				console.log("tagToSelect: ", tagToSelect);
				selectTag(tagToSelect);			
			})
			.insertBefore("#appliedTags .tagsList")
			.before($(f_createTagSelectorHTML()).attr({"id" : ADD_TAG_FILTER_SELECTOR_ID}))
			.after("<br/>");
		$(".helpLink").on("click", function($event) {
			$event.preventDefault();
			$("#helpText").slideToggle();
		});

		setupFeature = function(featureID, featureDefinition) {
			var builder,
				instance;

			if (!featureDefinition) {
				console.error("Invalid feature definition for feature: ", featureID);
				return;
			}
			if (!featureDefinition.enabled) {
				console.log("Not enabling feature '" + featureID + "'");
				return;
			}

			console.log("setting up feature " + featureDefinition.name + "...");
			instance = featureDefinition.builder();
			instance.init();
			featureDefinition.instance = instance;
			console.log("DONE setting up feature " + featureDefinition.name);
		}

		// TODO: clean this up so don't have to remove autocomplete and handle it differently
		autoCompleteFeature = FEATURES.autocomplete;
		delete FEATURES.autocomplete;
		$.each(FEATURES, setupFeature);

/*		if (features.stateDescriptor) {
			console.log("enabling state descriptor...");
			stateDescriptor = makeStateDescriptor();
			stateDescriptor.init();
		}

		if (features.callToAction) {
			console.log("enabling call to action helper...");
			callToActionHelper = makeCallToActionHelper();
			callToActionHelper.init();
		}

		if (features.search) {
			console.log("enabling search helper...");
			searchHelper = makeSearchHelper();
			searchHelper.init();
		}

		if (features.shareableURLs) {
			urlHelper = makeUrlHelper(),
			urlHelper.init();			
		}*/

		//if (features.autocomplete) {
		if (autoCompleteFeature.enabled) {
			console.log("enabling autocomplete...");

			$.getScript("js/vendor/chosen.jquery.min.js").done(function() {
				autocompleteHelper = makeAutocompleteHelper();
				autocompleteHelper.init("#"+ADD_TAG_FILTER_SELECTOR_ID);
				console.log("autocomplete is enabled");				
			});
		}
		else {
			console.log("NOT enabling autocomplete.");
		}

		$("body").on("click", ".button.close", makeCloseAndFillFunc($("#message"), $("#documentsListing"), $("#main")));

		$("#loadingDiv").hide();
		$docsList.show();

		console.log("Done initializing App.Discover");
	}

})(jQuery);
