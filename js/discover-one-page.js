

(function($) {
	var $docsList = $("#documentsListing"),
		SHOW_ALL_VALUE = "*",
		ADD_TAG_FILTER_SELECTOR_ID = "AddTagFilterSelector",

		filteredTagsMap = {},

		scrollHandler;


	function getMatchingTags(aTagName) {
		return $("input[name='filterByTag'][value='" + aTagName + "']", $docsList);
	}

	function getVisibleCategory() {
		return $("#tagGroupSelect")[0].value;
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

		$(".entry", $docsList).each(function() {
			var hasAllRequiredTags = true,
				i,
				$this = $(this),
				myTags = [],
				visibleCategory;

			/*visibleCategory = getVisibleCategory();
			if (visibleCategory !== SHOW_ALL_VALUE && !$this.hasClass(visibleCategory)) {
				return false;
			}*/

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


		$("#"+ADD_TAG_FILTER_SELECTOR_ID).html(f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()));
	}

	function selectTag(aTagName) {
		var $matchedDocs;

		filteredTagsMap[aTagName] = true;

		console.log("selectTag(", aTagName, ")");
		$matchedTags = getMatchingTags(aTagName);
		$matchedTags.addClass("selected");
		$("#appliedTags .tagsList").append($("<span class='tagFilter'></span>").html(aTagName+" | <input type='submit' name='removeTagFilter' value='x'/>").data("tagName", aTagName));

		
//		console.log("$matchedTags: ", $matchedTags);
		$matchedDocs = $matchedTags.map(function(index, domElement) {
			return $(domElement).parents(".entry")[0];
		});

		$(".entry", $docsList).not($matchedDocs).hide();

		$("#"+ADD_TAG_FILTER_SELECTOR_ID).html(f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()));

		// NOT needed if the select options list is regenerated each time a filter is applied or removed
		//removeTagFilterOptionInSelector(aTagName);
	}


	function toggleTagFilter(aTagName) {
		var $matchedDocs,
			$matchedTags,
			isSelected;

		$matchedTags = getMatchingTags(aTagName);

		isSelected = $matchedTags.first().hasClass("selected");
		if (!isSelected) {
			selectTag(aTagName);			
		}
		else {
			unselectTag(aTagName);

		}	
	}

	function getIdsAndTags(index, value) {
	    var $this = $(this),
	        $entry = $this.closest(".entry");
	    
	    return {
	        "id" : $entry.prop("id"),
	        "tags" : $("input[name='filterByTag']", $this).map(function() { 
	        	return this.value; 
	        })
	    };
	};

	function f_tagsAndIDsMapToSelectHTML (aTagsToIdsMap) {
	    var options = $.map(aTagsToIdsMap, function(values, key) {
	        /*console.log("this: ", this);
	        console.log("arguments: ", arguments);
	        console.log("key: ", key);
	        console.log("values: ", values);*/
	        
	        return "<option value='" + key + "'>" + key + " (" + values.ids.length +")</option>";
	    });
	    
	    return options.join("\n");
	    //return "<select>" + options.join("\n") + "</select>";
	};

	function f_createTagSelectorHTML() {
		return "<select>" + f_tagsAndIDsMapToSelectHTML(f_getTagsToIdsMap()) + "</select>";
	}

	function f_isHiddenEntry() {
		var entry = $(this).closest(".entry")[0];  
		//console.log("\n\this.style.display: ", entry.style.display); 
		return entry.style.display != "none"
	}	

	function f_getTagsToIdsMap() {
		var idToTagsList = $(".tagsList", "#documentsListing").filter(f_isHiddenEntry).map(getIdsAndTags);
		
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
		window.tagsToIdsMap = tagsToIdsMap;
		return tagsToIdsMap;
	}


	$("#tagGroupSelect").on("change", function() {
		var showGroup = this.value;

		console.log("showGroup: ", showGroup);
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
		}

		// unselect all selected tags
		$("#appliedTags input[name='removeTagFilter']").each(function() {
			$(this).trigger("click");
		})
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

})(jQuery);
