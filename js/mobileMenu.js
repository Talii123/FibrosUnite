
window.App = window.App || {};
window.App.MobileMenu = window.App.MobileMenu || {

	makeMenu: function() {
		console.log("\n\n\nmaking menu now...\n\n\n");
		return menu($("#mobileMenu"));
	}

	, moveFilterBoxToMain: function() {
		var $filterBox = $("#filterBox").detach();

		$filterBox.find("#appliedTags").addClass("entry");
		$filterBox.insertBefore("#documentsListing");
	}

	, init: function() {
		if (!App.Utils.isSidebarShowing()) {
			this.moveFilterBoxToMain();
			this.makeMenu().init();
		}
	}
};