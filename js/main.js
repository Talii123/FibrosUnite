
function emitClosingEvent($closingDiv) {
	var eventType = "close:" + $closingDiv.attr("id");
	console.log("\n\n going to trigger eventType: ", eventType);
	$closingDiv.trigger(eventType);
}

function closeHandler($event) {
	var $target = $($event.target)
  		, dataToClose = $target.data("to-close");

  	console.log("closeHandler called..");

  	$toClose = dataToClose ? $(dataToClose) : $target.parent();
  	$toClose.slideUp();
  	emitClosingEvent($toClose);
}

function closeAndPullUpHandler($event) { 
	var containerHeight
  		, $toClose
  		, $toFill
  		, $container;

  	console.log("closeAndPullUpHandler called..");

  	function init($event) {
  		var $target = $($event.target)
  			, dataToClose = $target.data("to-close")
  			, dataToFill = $target.data("to-fill")
  			, dataContainer = $target.data("container");
		
		$toClose = dataToClose ? $(dataToClose) : $target.parent();
		$toFill = dataToFill ? $(dataToFill) : $toClose.next();
		$container = dataContainer ? $(dataContainer) : $toClose.parent();
		containerHeight = $container.height();

		console.log("$event: ", $event);
		console.log("$target: ", $target);
		console.log("$toClose: ", $toClose);
		console.log("$toFill: ", $toFill);
		console.log("$container: ", $container);
		console.log("$container height: ", containerHeight);
	    console.log("$toFill: ", $toFill);
  	}

	function heightUpdater() {
		return containerHeight - $toClose.height();
	}



	function doClose() {
		$toClose.slideUp({
		  progress: function() {
		  	// console.log("progress!!");
		    $toFill.height(heightUpdater);
		  }
		});		
	}

	init($event);
	doClose();
	emitClosingEvent($toClose);
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

