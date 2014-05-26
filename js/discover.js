

(function($) {
	var $docsList = $("#documentsListing"),
		$ALL_ENTRIES = $(".entry", "#documentsListing"),
		SHOW_ALL_VALUE = "*",
		ADD_TAG_FILTER_SELECTOR_ID = "AddTagFilterSelector",
		HAS_OWN = Object.prototype.hasOwnProperty,
		filteredTagsMap = {},

		scrollHandler,
		urlHelper,

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
			$docsList.on("categoryChanged", updateCategoryForUrl);
		}

		function init() {
			console.log("url helper is initializing..");
			// first character is '#'
			qsMap = qsToQSMap(location.hash && location.hash.substring(1));
			if (typeof qsMap.category !== "undefined") {
				if (qsMap.category !== SHOW_ALL_VALUE) {
					setVisibleCategory(qsMap.category[0]);
				}
				else {					
					delete qsMap.category;
				}				
			}
			else {
				qsMap.category = [(getVisibleCategory() || "").replace("_", " ")];
			}
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

		function updateCategoryForUrl($event, selectedCategory) {
			if (selectedCategory !== SHOW_ALL_VALUE)
				qsMap.category = [selectedCategory];
			else
				delete qsMap.category;
			updateURL();
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

	function getVisibleCategory() {
		return $("#tagGroupSelect")[0].value;
	}

	function setVisibleCategory(aNewCategory) {
		var $categorySelector = $("#tagGroupSelect"),
			oldCategory = $categorySelector[0].value;

		if (oldCategory !== aNewCategory || aNewCategory !== SHOW_ALL_VALUE) {
			$categorySelector[0].value = aNewCategory;
			$categorySelector.trigger("change", aNewCategory)
		}
	}

	function rebuildTagSelector() {
		$("#"+ADD_TAG_FILTER_SELECTOR_ID).html(f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()));
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

		console.log("entries: ", $(".entry", $docsList));
		$docsList.find(".entry").each(function() {
			var hasAllRequiredTags = true,
				i,
				$this = $(this),
				myTags = [],
				visibleCategory;

			visibleCategory = getVisibleCategory();
			if (visibleCategory !== SHOW_ALL_VALUE && !$this.hasClass(visibleCategory)) {
				console.log("category is a mismatch; visibleCategory = ", visibleCategory, " and $this is: ", $this)
				return;
			}

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


		rebuildTagSelector();
		//$("#"+ADD_TAG_FILTER_SELECTOR_ID).html(f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()));

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
		$("#appliedTags .tagsList").append($("<span class='tagFilter'></span>").html(aTagName+" | <input type='submit' name='removeTagFilter' value='x'/>").data("tagName", aTagName));

		
//		console.log("$matchedTags: ", $matchedTags);
		$matchedDocs = $matchedTags.map(function(index, domElement) {
			return $(domElement).parents(".entry")[0];
		});

		$(".entry", $docsList).not($matchedDocs).hide();

		rebuildTagSelector();
		//$("#"+ADD_TAG_FILTER_SELECTOR_ID).html(f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()));

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


	function f_makeOptionGroups(optionsArray) {
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
			optionGroup = TAG_TO_TAG_GROUP_MAP[option.tag];
			groupOfOptions = optGroupToOptionsMap[optionGroup];
			if (!groupOfOptions) {
				groupOfOptions = optGroupToOptionsMap[optionGroup] = [];
			}
			groupOfOptions.push(option.optStr);
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

	function f_tagsAndIDsMapToSelectHTML (aTagsToIdsMap) {
	    var options = $.map(aTagsToIdsMap, function(values, key) {
	        /*console.log("this: ", this);
	        console.log("arguments: ", arguments);
	        console.log("key: ", key);
	        console.log("values: ", values);*/
	        
	        return {tag: key, optStr: "<option value='" + key + "'>" + key + " (" + values.ids.length +")</option>"};
	    });
	    
	    //return options.join("\n");
	    return f_makeOptionGroups(options).join("\n");

	    //return "<select>" + options.join("\n") + "</select>";
	};

	function f_createTagSelectorHTML() {
		return "<select>" + f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()) + "</select>";
	}

	function f_isHidden($entry) {
	//	var entry = $(this).closest(".entry")[0];  
		//console.log("\n\this.style.display: ", entry.style.display); 
		return $entry[0].style.display != "none"
	}	

	function f_isMatchingCategory($entry, aCategory) {
		return $entry.hasClass(aCategory);
	}

	function f_filterMatchingDoc($entry, aCategory) {
		var isHidden = !f_isHidden($entry),
		 	isMatchingCategory = (aCategory == SHOW_ALL_VALUE) || f_isMatchingCategory($entry, aCategory);

		console.log("isHidden = ", isHidden, ", isMatchingCategory = ", isMatchingCategory);
		return !isHidden && isMatchingCategory;
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

	function f_getDocFilter(filterFunc, selectedCategory) {
		console.log("selectedCategory is ", selectedCategory);

		return function() {
			var $entry = $(this);

			return filterFunc($entry, selectedCategory);
		}
	} 

	function f_getTagsToIdsMap() {
		var idToTagsList;

		idToTagsList = $ALL_ENTRIES
			.filter(f_getDocFilter(f_filterMatchingDoc, getVisibleCategory()))
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
		console.log("Initializing App.Discover");

		features = features || {};

		$("#tagGroupSelect").on("change", function() {
			var category = this.value,
				$docsToShow,
				$docsToHide;

			/*console.log("showGroup: ", showGroup);
			if (showGroup === SHOW_ALL_VALUE) {
				$("#documentsListing > .entry").show();
			}
			else {
				$("#documentsListing > .entry").each(function() {
					var $this = $(this);
					if ($this.hasClass(showGroup)) {
						$this.show();
					}
					else {
						$this.hide();
					}
				});						
			}*/

			$docsToShow = $ALL_ENTRIES;
			if (category != SHOW_ALL_VALUE)
				$docsToShow = $docsToShow.filter(f_getDocFilter(f_isMatchingCategory, category))
			

			for (tag in filteredTagsMap) {
				if (HAS_OWN.call(filteredTagsMap, tag)) {
					// TODO: SERIOUSLY, this should NOT be looking at the dom for the data
					$docsToShow = $docsToShow.filter(function () {
						var tagSelector = "input[name='filterByTag'][value='" + tag + "']",
							tags = $(this).find(tagSelector);

						console.log("tags: ", tags);
						console.log("tags && tags.length > 0: ", (tags && tags.length > 0));
						return tags && tags.length > 0;
					});
					console.log("after filtering on tag: ", tag, " $docsToShow=", $docsToShow);
				}
				else {
					console.log("ignoring tag: ", tag, " because it's not an own property.");
				}
			}

			$docsToHide = $ALL_ENTRIES.not($docsToShow)

			$docsToShow.show();
			$docsToHide.hide();
			/*
			// unselect all selected tags
			$("#appliedTags input[name='removeTagFilter']").each(function() {
				$(this).trigger("click");
			})
			*/

			rebuildTagSelector();

			$docsList.trigger("categoryChanged", category);
		});	

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
			.insertAfter("#appliedTags")
			.before($(f_createTagSelectorHTML()).attr({"id" : ADD_TAG_FILTER_SELECTOR_ID}));

		$(".helpLink").on("click", function($event) {
			$event.preventDefault();
			$("#helpText").slideToggle();
		})

		/*scrollHandler = (function () {
			var mainTop = $("#main").position().top,
				$window = $(window),
				$sidebar = $("#sidebar"),
				sidebarTop = $sidebar.position().top,
				sidebarLeft = $sidebar.position().left;

			return function() {

				if ($window.scrollTop() >= mainTop) {
					console.log("sidebar should be fixed now.");
					$sidebar.css({
						"position" : "fixed",
						"top" : sidebarLeft
					});
				}
				else {
					console.log("sidebar should be floating now.");
					$sidebar.css({
						"position" : "",
						"top" : sidebarTop
					});
				}
			}
		})();

		$(window).on("scroll", scrollHandler);*/
		//var headerBottom = $("#header").position().top + $("#header").height();
		
		/*
		var sidebarTop = $("#sidebar").position().top;
		var mainHeight = $(window).height() - sidebarTop - $("#footer").height() - 40;
		var newMainCSS = {
			"position" : "absolute",
			//"top" : sidebarTop,
			"height" : mainHeight,
			"overflow-y" : "scroll"
		};
		if (sidebarTop > 0) {
			newMainCSS.top = sidebarTop;
		}
		console.log("mainHeight: ", mainHeight);
		$("#main").css(newMainCSS);
		$("#footer").addClass("absolute");
		$("body").css("overflow-x", "hidden");
		*/

	/*	var windowHeight = $(window).height();
		var $body = $("body");
		var bodyPadding = parseInt($body.css("padding-top")) + parseInt($body.css("padding-bottom"));

		var minTopHeight = 40;
		var minBottomHeight = 30;

		var mainMargin = 0.01 * windowHeight;
		var topHeight = 0.015 * windowHeight;
		topHeight = topHeight >= minTopHeight ? topHeight : minTopHeight;
		var bottomHeight = 0.01 * windowHeight;
		bottomHeight = bottomHeight >= minBottomHeight ? bottomHeight : minBottomHeight;
		
		var mainHeight = windowHeight - topHeight - bottomHeight - bodyPadding - mainMargin - mainMargin - 20;
		var padding = mainHeight * 0.01;
		

		$("#header").css({
			"height": topHeight,
			"margin" : "0 0 " +mainMargin + "px 0"
		});
		$("#footer").css({
			"height" : bottomHeight,
			"margin" : mainMargin + "px 0 0 0"
		});
		$("#main").css({
			"height" : mainHeight,
			"margin" : 0,
			"overflow-y" : "scroll",
			
		});
		alert("windowHeight: " + windowHeight +
			"\ntopHeight: " + topHeight +
			"\nbottomHeight: " + bottomHeight + 
			"\nmainHeight: "+ mainHeight);

	*/


		if (features.shareableURLs) {
			urlHelper = makeUrlHelper(),
			urlHelper.init();			
		}

		$("#loadingDiv").hide();
		$docsList.show();

		console.log("Done initializing App.Discover");

	}

})(jQuery);