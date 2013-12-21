

(function($) {
	var $docsList = $("#documentsListing"),
		SHOW_ALL_VALUE = "*";

	function getMatchingTags(aTagName) {
		return $("input[name='filterByTag'][value='" + aTagName + "']", $docsList);
	}

	function getVisibleCategory() {
		return $("#tagGroupSelect")[0].value;
	}

	function unselectTag(aTagName) {
		var $matchedDocs,
			requiredTags,
			numRequiredTags;

		console.log("unselectTag(", aTagName, ")");
		$matchedTags = getMatchingTags(aTagName);
		$matchedTags.removeClass("selected");
		$("#appliedTags .tagsList .tagFilter").filter(function() {
			return $(this).data("tagName") === aTagName;
		}).remove();		

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
	}

	function selectTag(aTagName) {
		var $matchedDocs;

		console.log("selectTag(", aTagName, ")");
		$matchedTags = getMatchingTags(aTagName);
		$matchedTags.addClass("selected");
		$("#appliedTags .tagsList").append($("<span class='tagFilter'></span>").html(aTagName+" | <input type='submit' name='removeTagFilter' value='x'/>").data("tagName", aTagName));

		
//		console.log("$matchedTags: ", $matchedTags);
		$matchedDocs = $matchedTags.map(function(index, domElement) {
			return $(domElement).parents(".entry")[0];
		});

		$(".entry", $docsList).not($matchedDocs).hide();
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
			})						
		}

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


})(jQuery);
