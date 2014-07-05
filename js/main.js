
function makeCloseAndFillFunc($toClose, $toFill, $container) { 
  var containerHeight = $container.height();

  console.log("$container height: ", containerHeight);
        console.log("$toFill: ", $toFill);

  function heightUpdater() {
    console.log("heightUpdater called!");
    var toCloseHeight = $toClose.height(),
        newHeight = containerHeight - toCloseHeight;
    console.log("setting height to: ", newHeight);
    return newHeight;
  };

  return function() {
    $toClose.slideUp({
      progress: function() {
      	console.log("progress!!");
        $toFill.height(heightUpdater);
      }
    });
  };
}


$(function() {
	// disable the submit button tags when JS is enabled
	$("#documentsListing").on("click", "input[name=filterByTag]", function($event) {
		$event.preventDefault();
	})

	/*
	$("body").on("click", ".button.close", function() {
		$(this).parent().slideUp();
	});
	*/

	/*  PROTOTYPE code probably no longer needed
	$(".show.allSurgeries").click(function() {
		$(this).parent().hide().parent().find(".allSurgeries").show();

	});
	$(".show.surgery").click(function() {
		$(this).parent().hide().parent().find(".surgery").show();

	});

	// if keeping this script at the bottom, probably don't need to put this code
	// in a document.ready jQuery handler
	$("#tagGroupSelect").on("change", function() {
		var showGroup = this.value;

		if (showGroup === "Show All") {
			$("#documentsListing > div").show();
		}
		else {
			$("#documentsListing > div").each(function() {
				var $this = $(this);
				if ($this.hasClass(showGroup)) {
					$this.show();
				}
				else {
					$this.hide();
				}
			})
		}
	});*/
});

