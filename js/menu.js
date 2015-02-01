
// REQUIRES: modules/ simple-persistence.js

var menu = function($el) {
	var ACTIVE_CLASS = "active"
		, ACTIVE_SELECTOR = "." + ACTIVE_CLASS
		, MENU_KEY = "_menu_" + $el.attr("id") + "_"
		, ACTIVE_TAB_KEY = MENU_KEY + "active_tab_"
		, TARGET_SELECTOR_ATTR = "content-selector"
		, TARGET_DATA_ATTR = "[data-"+TARGET_SELECTOR_ATTR+"]"
		, $activeTab
		;

	console.log("inside menuHandler...");

	function deactivate($tab) {
		var contentSelector;

		if (!$tab) $tab = $(this);

		contentSelector = $tab.data(TARGET_SELECTOR_ATTR);

		$tab.removeClass(ACTIVE_CLASS);
		$el.queue(function() {
			console.log("deactivate's animation started");
			$($tab.data(TARGET_SELECTOR_ATTR)).slideUp(function() {
				$el.dequeue();
			});
			console.log("deactivate's animation ended");
			
		});

		persist(ACTIVE_TAB_KEY, "none");
	}

	function activate($tab) {
		var contentSelector = $tab.data(TARGET_SELECTOR_ATTR);

	//	$tab.parent().find(ACTIVE_SELECTOR).each(deactivate);
		deactivate($activeTab);
	
		$tab.addClass(ACTIVE_CLASS);
		
		$el.queue(function() {
			console.log("activate's animation started");
			$(contentSelector).slideDown(function() {
				$el.dequeue();
			});
			console.log("activate's animation ended");
			
		});

		persist(ACTIVE_TAB_KEY, contentSelector);
		$activeTab = $tab;
	}

	function menuHandler($event) {
		var $tab = $($event.target)
			, contentSelector
			, isActive
			;

		if (!$tab.length) {
			console.error("No target found for menu click event.");
			return;
		}

		contentSelector = $tab.data(TARGET_SELECTOR_ATTR);
		isActive = $tab.hasClass(ACTIVE_CLASS);		
		if (isActive) {
			deactivate($tab);
		}
		else {
			activate($tab);
		}					
	}

	function getTabForContent(contentSelector) {
		return $el.find("[data-$1='$2']"
			.replace("$1", TARGET_SELECTOR_ATTR)
			.replace("$2", contentSelector)
		);
	}

	function closeEventListener() {
		var contentToCloseSelector = $(this).data(TARGET_SELECTOR_ATTR)
			, eventType
			;

		eventType = "close:" + contentToCloseSelector.substring(1);
		$("body").on(eventType, function($event) {
			deactivate.call(getTabForContent(contentToCloseSelector));
		});
	}

	function attachListeners() {
		var $targets = $el.find(TARGET_DATA_ATTR);

		$el.on('click', TARGET_DATA_ATTR, menuHandler);	
		$el.on('click', '.close.button', function() {
			persist(MENU_KEY, 'closed');
		});

		if ($targets.length) {
			$targets.each(closeEventListener);
		}
	}

	function init() {
		var lastActiveContent,
			activeContentSelector;

		attachListeners();

		$activeTab = $el.find(ACTIVE_SELECTOR);
		lastActiveContent = getPersisted(ACTIVE_TAB_KEY);
		activeContentSelector = $activeTab.data(TARGET_SELECTOR_ATTR)
		if (lastActiveContent !== activeContentSelector) {
			if (lastActiveContent) {
				if (lastActiveContent !== "none") {
					activate(getTabForContent(lastActiveContent))		
				}
				else {
					$(activeContentSelector).hide();
					deactivate($activeTab);
				}
			}
		}
		
		if (getPersisted(MENU_KEY) !== 'closed') {
			$el.show();
		}
	}

	return {
		init: init
	};

};
