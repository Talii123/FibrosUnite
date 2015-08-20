
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

// slight tweak of code provide by Facebook for login
window.App.Utils.loadScript = function(src, options) {
	var js
		, id = options.id
		, doc = options.doc || window.document
		, ref = doc.getElementsByTagName('script')[0]
		;

	// only load script once
	if (id && doc.getElementById(id)) return;

	js = doc.createElement('script');
	js.src = src;
	if (id) js.id = id;
	js.async = options.async || true;
	ref.parentNode.insertBefore(js, ref);
}