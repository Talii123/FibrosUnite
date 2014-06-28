(function(obj, propertyName) {
	var TAB_SELECTOR = ".tab",
		FOR_CONTENT_DATA_ATTR = "content-id",
		ACTIVE_CLASS = "selected",
		$tabs,
		activeTabData,
		tabsMap = {};


	function tabClickHandler($event) {
		var $target;

		$event.stopPropagation();

		$target = $($event.target);
		if ($target != activeTabData.$tab) {
			activeTabData.$tab.removeClass(ACTIVE_CLASS);
			activeTabData.$content.hide();

			activeTabData = tabsMap[$target.data(FOR_CONTENT_DATA_ATTR)];
			activeTabData.$tab.addClass(ACTIVE_CLASS);
			activeTabData.$content.show();
		}
	}

	function makeTabData() {
		var $tab = $(this),
			forID = $tab.data(FOR_CONTENT_DATA_ATTR),
			$content = $("#"+forID),
			tabData;

		tabsMap[forID] = tabData = {
			//forID : forID,
			$tab: $tab,
			$content: $content
		};

		if ($tab.hasClass(ACTIVE_CLASS)) {
			activeTabData = tabData;
		}
	}

	obj[propertyName] = {
		init: 	function(selector) {
					$tabs = $(selector);
					$tabs.on("click", TAB_SELECTOR, tabClickHandler);
					$tabs.find(TAB_SELECTOR).each(makeTabData);
					// ensure there is a selected tab
					if (!activeTabData) {
						var $defaultTab = $tabs.find(TAB_SELECTOR).first(),
							defaultTabForID = $defaultTab.data(FOR_CONTENT_DATA_ATTR)
						activeTabData = tabsMap[defaultTabForID];
					}
				}
	}	

})(App.Discover, "Universal");