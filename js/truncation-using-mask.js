	function makeTrucationHelper() {
		var CSS_TO_ADD = 
			"#documentsListing .entry {"+
			    "position: relative;"+
			"}"+
			"#documentsListing .description {"+
				"max-height: 10em;"+
				"overflow-y: hidden;"+
			"}"+
			"#documentsListing .tags {"+
			    "margin-top: 10px;"+
			"}"+
			".more {"+
			    "position: absolute;"+
			    "bottom: 0;"+
			    "color: #D0CE6A;"+
			    "font-weight: bold;"+
			    "margin: 0 auto;"+
			"}"+
			".more:hover {"+
			    "font-weight: bold;"+
			"}"+

			".grad-t {"+
				"bottom: 0px;"+
				"height: 40px;"+

				"background: -moz-linear-gradient(top,  rgba(4,69,47,0) 0%, rgba(4,69,47,1) 55%, rgba(4,69,47,1) 100%); /* FF3.6+ */"+
				"background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(4,69,47,0)), color-stop(55%,rgba(4,69,47,1)), color-stop(100%,rgba(4,69,47,1))); /* Chrome,Safari4+ */"+
				"background: -webkit-linear-gradient(top,  rgba(4,69,47,0) 0%,rgba(4,69,47,1) 55%,rgba(4,69,47,1) 100%); /* Chrome10+,Safari5.1+ */"+
				"background: -o-linear-gradient(top,  rgba(4,69,47,0) 0%,rgba(4,69,47,1) 55%,rgba(4,69,47,1) 100%); /* Opera 11.10+ */"+
				"background: -ms-linear-gradient(top,  rgba(4,69,47,0) 0%,rgba(4,69,47,1) 55%,rgba(4,69,47,1) 100%); /* IE10+ */"+
				"background: linear-gradient(to bottom,  rgba(4,69,47,0) 0%,rgba(4,69,47,1) 55%,rgba(4,69,47,1) 100%); /* W3C */"+
				"filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0004452f', endColorstr='#04452f',GradientType=0 ); /* IE6-9 */"+
			"}";

		function insertCSS() {
			$("head").append("<style>"+CSS_TO_ADD+"</style>");
		}

		function insertHTML() {
			var HTML_TO_ADD = 
				"<div class='grad-t'>"+
					"<span class='more'>Read More</span>"+
					"<span class='less'>Read Less</span>"+
				"</div>";

			$("#documentsListing .description").append(HTML_TO_ADD);
		}

		function onReadMore($event) {
			var $src = $($event.target);

			$src.closest(".description").css("max-height", "0");
			$src.next(".less").show();
			$src.hide();
		}

		function onReadLess($event) {
			var $src = $($event.target);

			$src.closest(".description").css("max-height", "10em");
			$src.prev(".more").show();
			$src.hide();
		}

		function bindHandlers() {
			$("#documentsListing").on("click", ".more", onReadMore);
			$("#documentsListing").on("click", ".less", onReadLess);
		}

		return {
			init: function() {
				insertCSS();
				insertHTML();
				bindHandlers();
			}
		};
	}