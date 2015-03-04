
window.App = window.App || {};
window.App.Utils = window.App.Utils || {};
window.App.Utils.isSidebarShowing = function() {
	return $("#sidebar").css("display") !== "none";
};