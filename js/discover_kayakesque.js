
(function($, aTagToTagGroupMap) {
	// TODO: move data definitions
	var catsToTagsMap = {
	    "General Info": [
	        "Patient Story",
	        "Fibrolamellar Info",
	        "Nutrition",
	        "Exercise",
	        "Project",
	        "Advocacy",
	        "Fundraising",
	        "Inspiration",
	        "Other"
	    ],
	    "Surgery": [
	        "Liver Surgery",
	        "Liver Transplantation",
	        "Surgery to Remove Tumors Outside of the Liver",
	        "Laproscopic or Minimally Invasive Surgery",
	        "Laser Surgery"
	    ],
	    "Medications": [
	        "\"5FU\"/Fluorouracil + \"Intron\"/Interferon Alpha",
	        "\"5FU\"/Fluorouracil + \"Eloxatin\"/Oxaliplatin",
	        "\"5FU\"/Fluorouracil ",
	        "\"Nexavar\"/Sorafenib + \"Avastin\"/Bevacizumab",
	        "\"Xeloda\"/Capecitabine",
	        "\"Platinol\"/Cisplatin",
	        "\"Nexavar\"/Sorafenib",
	        "\"Sutent\"/Sunitinib",
	        "\"AVATAR\" (\"Avastin\"/Bevacizumab + \"Tarceva\"/Erlotinib)",
	        "\"GEMOX\" (\"Gemzar\"/Gemcitabine + \"Eloxatin\"/Oxaliplatin)",
	        "\"Gemzar\"/Gemcitabine",
	        "\"Adriamycin\"/Doxorubicin + \"Platinol\"/Cisplatin",
	        "\"Affinitor\"/Everolimus",
	        "\"Adriamycin\"/\"Doxil\"/Doxorubicin",
	        "\"Tarceva\"/Erlotinib",
	        "PIAF - Platinum Interferon Adriamycin Fluorouracil"
	    ],
	    "Radiation": [
	        "External Beam/Proton Radiation",
	        "RFA (Radiofrequency Ablation)",
	        "Cyberknife",
	        "Brachytherapy"
	    ],
	    "Embolization": [
	        "Chemoembolization / T.A.C.E.",
	        "Radioembolization - Y90/Sirspheres/Therospheres",
	        "Plain Embolization"
	    ],
	    "Other": [
	        "Immunotherapy",
	        "Bone Marrow Transplantation",
	        "Alternative Therapy",
	        "Clinical Trials"
	    ],
	    "Symptoms and Side Effects": [
	        "Mouth Sores",
	        "Nausea",
	        "Loss of Appetite",
	        "Problems with Hands and Feet",
	        "Jaundice (yellowing of skin or eyes)",
	        "Abdominal Pain",
	        "Ache and Pains",
	        "Neuropathy (loss of feeling in fingers or toes)",
	        "Changes in Sense of Taste (e.g. a metal taste in your mouth)",
	        "Fever",
	        "Diarrhea",
	        "Thrush (white tongue)",
	        "Blood Clots",
	        "Weight Loss",
	        "Weight Gain",
	        "Lymphedema (Swelling)",
	        "Rashes",
	        "Itchiness",
	        "Bowel Obstruction",
	        "Hair Loss",
	        "Low Blood Cell Counts (Neutropenia, Anemia)",
	        "High Ammonia Levels",
	        "Fatigue",
	        "Heartburn",
	        "Managing Catheters/Drains"
	    ],
	    "Social": [
	        "Events",
	        "Emotional Support"
	    ]
	},
	tagsToCatsMap = {
	    "Patient Story": "General Info",
	    "Fibrolamellar Info": "General Info",
	    "Nutrition": "General Info",
	    "Exercise": "General Info",
	    "Project": "General Info",
	    "Advocacy": "General Info",
	    "Fundraising": "General Info",
	    "Inspiration": "General Info",
	    "Other": "General Info",
	    "Liver Surgery": "Surgery",
	    "Liver Transplantation": "Surgery",
	    "Surgery to Remove Tumors Outside of the Liver": "Surgery",
	    "Laproscopic or Minimally Invasive Surgery": "Surgery",
	    "Laser Surgery": "Surgery",
	    "\"5FU\"/Fluorouracil + \"Intron\"/Interferon Alpha": "Medications",
	    "\"5FU\"/Fluorouracil + \"Eloxatin\"/Oxaliplatin": "Medications",
	    "\"5FU\"/Fluorouracil ": "Medications",
	    "\"Nexavar\"/Sorafenib + \"Avastin\"/Bevacizumab": "Medications",
	    "\"Xeloda\"/Capecitabine": "Medications",
	    "\"Platinol\"/Cisplatin": "Medications",
	    "\"Nexavar\"/Sorafenib": "Medications",
	    "\"Sutent\"/Sunitinib": "Medications",
	    "\"AVATAR\" (\"Avastin\"/Bevacizumab + \"Tarceva\"/Erlotinib)": "Medications",
	    "\"GEMOX\" (\"Gemzar\"/Gemcitabine + \"Eloxatin\"/Oxaliplatin)": "Medications",
	    "\"Gemzar\"/Gemcitabine": "Medications",
	    "\"Adriamycin\"/Doxorubicin + \"Platinol\"/Cisplatin": "Medications",
	    "\"Affinitor\"/Everolimus": "Medications",
	    "\"Adriamycin\"/\"Doxil\"/Doxorubicin": "Medications",
	    "\"Tarceva\"/Erlotinib": "Medications",
	    "PIAF - Platinum Interferon Adriamycin Fluorouracil": "Medications",
	    "External Beam/Proton Radiation": "Radiation",
	    "RFA (Radiofrequency Ablation)": "Radiation",
	    "Cyberknife": "Radiation",
	    "Brachytherapy": "Radiation",
	    "Chemoembolization / T.A.C.E.": "Embolization",
	    "Radioembolization - Y90/Sirspheres/Therospheres": "Embolization",
	    "Plain Embolization": "Embolization",
	    "Immunotherapy": "Other",
	    "Bone Marrow Transplantation": "Other",
	    "Alternative Therapy": "Other",
	    "Clinical Trials": "Other",
	    "Mouth Sores": "Symptoms and Side Effects",
	    "Nausea": "Symptoms and Side Effects",
	    "Loss of Appetite": "Symptoms and Side Effects",
	    "Problems with Hands and Feet": "Symptoms and Side Effects",
	    "Jaundice (yellowing of skin or eyes)": "Symptoms and Side Effects",
	    "Abdominal Pain": "Symptoms and Side Effects",
	    "Ache and Pains": "Symptoms and Side Effects",
	    "Neuropathy (loss of feeling in fingers or toes)": "Symptoms and Side Effects",
	    "Changes in Sense of Taste (e.g. a metal taste in your mouth)": "Symptoms and Side Effects",
	    "Fever": "Symptoms and Side Effects",
	    "Diarrhea": "Symptoms and Side Effects",
	    "Thrush (white tongue)": "Symptoms and Side Effects",
	    "Blood Clots": "Symptoms and Side Effects",
	    "Weight Loss": "Symptoms and Side Effects",
	    "Weight Gain": "Symptoms and Side Effects",
	    "Lymphedema (Swelling)": "Symptoms and Side Effects",
	    "Rashes": "Symptoms and Side Effects",
	    "Itchiness": "Symptoms and Side Effects",
	    "Bowel Obstruction": "Symptoms and Side Effects",
	    "Hair Loss": "Symptoms and Side Effects",
	    "Low Blood Cell Counts (Neutropenia, Anemia)": "Symptoms and Side Effects",
	    "High Ammonia Levels": "Symptoms and Side Effects",
	    "Fatigue": "Symptoms and Side Effects",
	    "Heartburn": "Symptoms and Side Effects",
	    "Managing Catheters/Drains": "Symptoms and Side Effects",
	    "Events": "Social",
	    "Emotional Support": "Social"
	};


	$("#loadingDiv").show();


	// my remove implementation
	// DEPENDS on arrays.js Patch!!
	if (!Array.prototype.remove) {
		  Array.prototype.remove = function (elementToRemove /*, fromIndex */ ) {
		    "use strict";

		    if (this == null) {
		      throw new TypeError();
		    }
		    var t = Object(this);		    

		    var index = t.indexOf(elementToRemove);

		    if (index >= 0) {
		    	return t.splice(index, 1);
		    }

		    return [];
		}
	}

	$(function() {
		var tagToTagGroupMap = aTagToTagGroupMap,  // cache in closer scope
			$allToggle,
			$checkboxes,
			$onlyToggles,
			$container,

			selectedTags = [],
			hiddenDocuments = [],
			displayedDocuments = [],
			f_initDocuments,
			f_initCheckboxes,
			f_selectTag,
			f_unselectTag,
			f_unselectMultipleTags,
			f_selectOnlyTagFromGroup,
			f_findTagsInGroup,
			f_showDocuments,
			f_hideDocuments;

		$container = $("#Surgery");
		$allToggle =  $(".allToggle", $container);
		$checkboxes = $(".tags input[type='checkbox']", $container);
		$onlyToggles = $(".tags .onlyToggle", $container);

		f_initCheckboxes = function() {
			var tag,
				onlyIndex,
				$this = $(this);

			$this.data("checkboxes", $checkboxes);

			tag = $(this).parent().text() || "";
			
			// currently selects the "Only" preceding the tag as well; unless change HTML,
			// need to strip out the "Only"
			onlyIndex = tag.indexOf("Only");
			if (onlyIndex >= 0) {
				tag = tag.substring(0, onlyIndex) + tag.substring(onlyIndex+"Only".length, tag.length);
			}

			console.log("tag: ", tag);
			$this.data("myTag", tag);
			selectedTags.push(tag);

			$(this).data("myAll", $allToggle);
		};

		$checkboxes.each(f_initCheckboxes);

		f_initDocuments = function() {
			var myTags = [],
				$this;

			$this = $(this);
			$this.find(".tagsList input").each(function() {
				myTags.push(this.value);
			});

			console.log("setting tags for {", this, "} to: ", myTags);
			$this.data("tags", myTags);

			displayedDocuments.push($this);
		}

		f_showDocuments = function(docsToShow) {
			$.each(docsToShow, function(index, $doc) {
				hiddenDocuments.remove($doc);
				displayedDocuments.push($doc);				
				$doc.show();
			});				
		}

		f_hideDocuments = function(docsToHide) {
			$.each(docsToHide, function(index, $doc) {
				displayedDocuments.remove($doc);
				hiddenDocuments.push($doc);
				$doc.hide();
			});				
		}

		f_updateShownDocs = function(aTag) {
			var docsToShow = [];
			
			// this can probably be done easier with $.map() or something like that
			$.each(hiddenDocuments, function(index, $doc) {
				var docTags = $doc.data("tags") || [];


				if (docTags && docTags.length > 0) {
					if (docTags.indexOf(aTag) >= 0) {
						docsToShow.push($doc);
					}
				}
			});

			f_showDocuments(docsToShow);			
		}

		f_updateHiddenDocs = function() {
			var docsToShow = [];
			$.each(displayedDocuments, function(index, $doc) {
				if (isDisplayable($doc)) {
					docsToShow.push($doc);
				}
			});

			if (docsToShow.length > 0) {
				f_showDocuments(docsToShow);
			}
		}


		$("#documentsListing .entry").each(f_initDocuments);

		f_findTagsInGroup = function(aTag) {
			var tagsGroup = catsToTagsMap[tagsToCatsMap[aTag]];

			console.log("tagsGroup: ", tagsGroup);
			return tagsGroup;
		}

		f_selectTag = function(aTag) {
			console.log("selecting tag: ", aTag);

			console.log("before action, selectedTags: ", selectedTags);

			// add to selected tags if not selected
			if (selectedTags.indexOf(aTag) < 0) {
				selectedTags.push(aTag);

				// for each hidden document, if it has the selected tag, unhide it
				f_updateShownDocs(aTag);
			}

			console.log("after action, selectedTags: ", selectedTags);
		};

		f_unselectTag = function(aTag) {
			console.log("UNselecting tag: ", aTag);

			console.log("before action, selectedTags: ", selectedTags);
			// remove from selected tags if it's selected
			selectedTags.remove(aTag);

			console.log("after action, selectedTags: ", selectedTags);

			// for each displayed document, check to see if it has one of the selected tags
		}

		f_unselectMultipleTags = function(aTagArray) {
			console.log("aTagArray: ", aTagArray);

			console.log("before action, selectedTags: ", selectedTags);
			// remove from selected tags if it's selected
			$.each(aTagArray, function(index, value) {
				//console.log("value: ", value);
				selectedTags.remove(value);
			});

			console.log("after action, selectedTags: ", selectedTags);			
		}

		/*f_selectOnlyTagFromGroup = function(aTag) {
			var tagsInGroup;

			console.log("select only this tag from its group: ", aTag);

			// lookup all the tags in the same group
			tagsInGroup = f_findTagsInGroup(aTag);

			// remove all these tags from selected tags

			// if this tag is NOT already visible, check all hidden documents to see if
			// applying this tag makes them visible, and put the newly visible ones in a new set

			// go through all visible documents (before the change above is applied) and
			// check to see if they are still visible with all of the deselected tags removed
		}*/

		$onlyToggles.each(function() {
			$(this).data("checkboxes", $checkboxes);
			$(this).data("myAll", $allToggle);
		});

		$allToggle.data("checkboxes", $checkboxes);


		/////////////////////////////
		// register event handlers //
		/////////////////////////////

		$container.on("click", ".tags input[type='checkbox']", function() {
			var allChecked = true,
				$this = $(this),
				$myAll = $this.data("myAll"),
				$checkboxes = $this.data("checkboxes");

			if (!this.checked) {
				//myAll.checked = false;	
				$myAll.show();
			}
			//else if (!myAll.checked) {
			else if ($myAll[0].style.display !== "none") {
				$checkboxes.each(function() {
					allChecked &= this.checked;
				});

				if (allChecked) {
					//myAll.checked = true;
					$myAll.hide();
				}
			}			
		});

		$container.on("click", ".tags .onlyToggle", function() {
			var $this = $(this),
				tagsToUnselect = [];

			$this.data("checkboxes").each(function() {
				this.checked = false;	
				tagsToUnselect.push($(this).data("myTag"));
			});//.data("myAll").checked = false;
			$this.data("myAll").show();

			//console.log("tagsToUnselect: ", tagsToUnselect);
			//f_selectOnlyTagFromGroup($this.data("myTag"));
			f_unselectMultipleTags(tagsToUnselect);
		});

		$container.on("click", ".allToggle", function() {
			//if (this.checked) {
				$(this).hide().data("checkboxes").each(function() {
					this.checked = true;
				});


			//}
		});

		$container.on("click", ".tags input[type='checkbox']", function() {
			var myTag;

			console.log("I was clicked!  ", this);
			
			myTag = $(this).data("myTag");

			if (this.checked) {				
				f_selectTag(myTag);
			} 
			else {
				f_unselectTag(myTag);
			}
		});

		/*$("#Surgery ").on("click", ".tags .onlyToggle", function($event) {
			var clicked = this;


			$(this).parentsUntil("div.tagGroup").parent().find("input[type='checkbox']").each(function() {
				if (this !== clicked) {
					console.log("I wasn't clicked! ", this);
					this.checked = false;
				}
				else {
					// never happens because no input was clicked;
					// since the click target is embedded in a label, the label action takes
					// place after, so the checkbox will get checked even though the above
					// if will initially uncheck it
					console.log("I was clicked! ", this);
				}
			});

			console.log("Done handling the onlyToggle");
		});

		$("#Surgery").on("click", ".allToggle", function($event) {
			$(this).parentsUntil("div.tagGroup").parent().find("input[type='checkbox']").each(function() {
				this.checked = true;
			});
		})
		

		$("#Surgery").on("click", ".tags input[type='checkbox']", function($event) {
			console.log("I'm a checkbox and I just got clicked!", this);

			$(this).parentsUntil("div.tagGroup").parent().find(".allToggle").each(function() {
				this.checked = false;
			});
		});*/

		$("#loadingDiv").hide();
	});
})(
	jQuery
);
