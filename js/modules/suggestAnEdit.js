$(function() {
	var 	$form = $("form"),
			$status = $("#status"),
			$editors = $(".propertyEditor"),
			$submit = $("#submitSuggestion"),
			// description
			$currentDescription = $(".entry .t"),
			$suggestedDescription = $(".suggestedDescription"),
			initialDescription,
			// tags
			$removedOptGroup = $("#removedGroup"),
			$addedOptGroup = $("#addedGroup"),
			$currentOptGroup = $("#currentGroup"),
			$unselectedTags = $("#unselectedTags"),
			$selectedTags = $("#selectedTags"),
			$tagsList = $(".entry .tagsList"),
			$tagsToAdd = $("#tagsToAdd"),
			$tagsToRemove = $("#tagsToRemove"),
			$suggestedTags = $("#suggestedTags"),
			initialTags,
			dirtyProperties = {};


	function initSuggestedDescription($suggested, $currentDescription) {
		var height = $currentDescription.height(),
			width = $currentDescription.closest(".entry").width();

		console.log("height: ", height, "\n width: ", width);

		$suggested.val($currentDescription.html()
			.replace(/<br>/g,  '\n')
			.replace(/<\/?em>/g, '')
		).height(height)
		.width(width)
		.keyup(updateHandler);
	}

	function getOptionsValues($optionGroup) {
		return $optionGroup.find("option").map(function() {
			return $(this).val();
		}).get().join(", ");
	}

	function updateHandler($event) {
		$currentDescription.html($suggestedDescription.val().replace(/\n/g, '<br/>'));

		updateDirtiness();
	}


	function isCurrentTag($option) {
		return $.inArray($option.attr("value"),initialTags) >= 0;
	}

	function addTag(tag, skipAddToEntry) {
		var $toMove,
			$toMoveParent,
			$targetOptGroup;

		tag = tag ? tag.trim() : "";
		console.log("adding tag: ", tag);
		$toMove = $unselectedTags.find(getOptionSelector(tag));
		
		if (!skipAddToEntry && !isCurrentTag($toMove)) {
			$targetOptGroup = $addedOptGroup;
			$tagsList.append(makeTagEl(tag));
		}
		else {
			$targetOptGroup = $currentOptGroup;
		}

		$toMoveParent = $toMove.parent();
		$toMove.remove();
		$targetOptGroup.append($toMove);
		$toMove.data("tagGroup", $toMoveParent);
	}

	function removeTag(tag) {
		var $toMove,
			$targetOptGroup;

		tag = tag ? tag.trim() : "";
		console.log("removing tag: ", tag);
		$toMove = $selectedTags.find(getOptionSelector(tag));
		
		//if ($toMove.data("isCurrent")) {
		if (isCurrentTag($toMove)) {
			$targetOptGroup = $removedOptGroup;
		}
		else {
			$targetOptGroup = $toMove.data("tagGroup");
		}

		$toMove.remove();
		$targetOptGroup.append($toMove);
		$tagsList.find(getTagSelector(tag)).remove();
	}

	function updateTagSelection(tag, tagUpdater) {
		if ($.isArray(tag)) {
			$.each(tag, function() { 
				tagUpdater(this)
			});
		}
		else {
			tagUpdater(tag);
		}

		updateAllTagGroupsVisibility();
		updateDirtiness();		
	}				

	function updateAllTagGroupsVisibility() {
		$("#selectedTags optgroup, #unselectedTags optgroup").each(updateTagGroupVisibility);					
	}

	function updateTagGroupVisibility(index, el) {
		$tagGroup = $(el);
		if (!$tagGroup.has("option").length) {
			$tagGroup.hide();
		}
		else {
			$tagGroup.show();
		}					
	}

	function getOptionSelector(tag) {
		return "[value='"+tag+"']";
	}

	function getTagSelector(tag) {
		return "input[name='filterByTag'][value='"+tag+"']";
	}

	function makeTagEl(tag) {
		return $('<input name="filterByTag" type="submit">').val(tag);
	}

	function isDescriptionDirty() {
		var isDirty = 
			$suggestedDescription.val() != initialDescription;
		if (isDirty) {
			dirtyProperties.descriptions = true
		} else {
			dirtyProperties.descriptions = false
		}

		return isDirty;
	}

	function isTagsDirty() {
		/*return $addedOptGroup.has("option").length ||
			$removedOptGroup.has("option").length ;*/
		var isDirty = $addedOptGroup.css("display") != "none" ||
			$removedOptGroup.css("display") != "none"

		if (isDirty) {
			dirtyProperties.tags = true
		} else {
			dirtyProperties.tags = false
		}

		return isDirty;
	}

	function updateDirtiness() {
		setDirty(isDirty());
	}

	function isDirty() {
		return isTagsDirty() || isDescriptionDirty();
	}

	function setDirty(isDirty) {
		if (isDirty) {
			$submit.attr('disabled', false);
			$status.text('Preview');
		}
		else {
			$submit.attr('disabled', true);
			$status.text('Current');
		}
		return isDirty;
	}

	$("#propertySelector").on("change", function($event) {
		var selectedID = $($event.target).val();

		$editors.hide();
		$editors.filter("#" + selectedID).show();
	}).trigger("change");

	$("#selectTag").on("click", function($event) {
		$event.preventDefault();
		updateTagSelection($unselectedTags.val(), addTag)
	});

	$("#unselectTag").on("click", function($event) {
		$event.preventDefault();
		updateTagSelection($selectedTags.val(), removeTag);
	});
	

	$submit.on("click", function($event) {
		var properties = [];

		if (!isDirty()) {	// should not happen
			$event.preventDefault();
			return;
		}

		$tagsToAdd.val(getOptionsValues($addedOptGroup));
		$tagsToRemove.val(getOptionsValues($removedOptGroup));
		$suggestedTags.val(getOptionsValues($selectedTags));

		for (key in dirtyProperties) {
			if (dirtyProperties[key]) properties.push(key);
		}
		$("#property").val(properties.join(", "));

		// optimization: if we're not going to edit the
		// description, don't send the description text that we
		// prefilled for the user
		if (!dirtyProperties.descriptions) $suggestedDescription.val("");
	});

	
	$selectedTags.append($currentOptGroup);
	$tagsList.find("input[name='filterByTag']")
		.each(function(index, input) {
			addTag(input.value, true);
		});

	initSuggestedDescription($suggestedDescription, $currentDescription);

	initialDescription = $suggestedDescription.val();
	initialTags = getOptionsValues($selectedTags).split(", ");
});