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
