function makeTruncationHelper($container, toTruncateSelector) {
	var NEWLINE_REPLACEMENT_CHAR = '¶'
	  	, NEWLINE_REPLACEMENT_MATCHER = RegExp("(\s)?" + NEWLINE_REPLACEMENT_CHAR + "(\s)?", "g")
		;

	function createReadMoreHTML(isHidden) {
		return "<span class='truncation control expander" + 
			(isHidden ? " hidden " : '') +
		 	"'>Read More</span>";
	}

	function createReadLessHTML(isHidden) {
		return "<span class='truncation control collapser" + 
			(isHidden ? " hidden " : '') +
			"'>Read Less</span>";
	}

	function insertHTML() {
		var HTML_TO_ADD = createReadLessHTML(true) + createReadMoreHTML(false);
		$container.find('.description').prepend(HTML_TO_ADD);
	}

	function onReadMore($event) {
		var $src = $($event.target);

		expand($src.nextAll(toTruncateSelector));
		$src.parent().find('.control').removeClass('hidden');
		$src.addClass('hidden');
	}

	function onReadLess($event) {
		var $src = $($event.target);

		truncate($src.nextAll(toTruncateSelector));
		$src.parent().find('.control').addClass('hidden');
		$src.next('.truncation.expander').removeClass('hidden');
	}

	function truncate($el) {
		$el.html($el.html().replace(/<br(\s)*(\/)?>/g, ' ' + NEWLINE_REPLACEMENT_CHAR + ' '));
		$el.addClass('truncated');
	}

	function expand($el) {
		$el.html($el.html().replace(NEWLINE_REPLACEMENT_MATCHER, '<br/>'));
		$el.removeClass('truncated');
	}

	function bindHandlers() {
		$container.on('click', '.truncation.expander', onReadMore);
		$container.on('click', '.truncation.collapser', onReadLess);
	}

	return {
		init: function() {
			insertHTML();
			bindHandlers();
			$container.find(toTruncateSelector).each(function() {
				var $this = $(this),
					heightBeforeTruncation = $this.height();

				truncate($this);
				if ($this.height() * 1.5 > heightBeforeTruncation) {
					$this.prevAll('.truncation.control').remove();
					expand($this);
					$this.addClass('notTruncatable');
				}
			});
		}
	};
}

/*window.App = window.App || {};
window.App.Utils = window.App.Utils || {};
window.App.Utils.makeTruncationHelper = makeTruncationHelper;*/