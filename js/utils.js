
window.App = window.App || {};
window.App.Utils = window.App.Utils || {};
window.App.Utils.isSidebarShowing = function() {
	return $("#sidebar").css("display") !== "none";
};
window.App.Utils.isLoggedIn = function () {
	var J_SESSION_ID_PARAM_NAME = "JSESSIONID";

	return isCookieSession() || isURLSession();

	// helper functions
	function isURLSession() {
		var J_SESSION_ID_PARAM_ASSIGN = J_SESSION_ID_PARAM_NAME + "="
			, qs
			, startIndex
			, isSession = false
			;

		qs = location.search;
		// not sure if URL param used for Java EE sessions is always uppercase so make it so for checking
		qs = (qs != null && qs.length > 0) ? qs.toUpperCase() : "";
		if (qs.length > 0) {
			startIndex = qs.indexOf(J_SESSION_ID_PARAM_ASSIGN);
			endIndex = startIndex + J_SESSION_ID_PARAM_ASSIGN.length;
			isSession =
				startIndex >= 0 &&
				qs.charAt(endIndex) != '&' &&
				endIndex < qs.length;
		}

		console.log("[isURLSession] isSession = ", isSession);
		return isSession;
	}

	function isCookieSession() {
		var isSession = $.cookie(J_SESSION_ID_PARAM_NAME) != null;

		console.log("[isCookieSession] isSession = ", isSession);
		return isSession;
	}
};