
function checkIfLoggedIn() {
	var J_SESSION_ID_PARAM_NAME = "JSESSIONID",
		CHECK_IF_LOGIN_BUTTON_RENDERED_INTERVAL = 1000,
		SELECTORS = {
			LOGIN_HELPER : ".loginHelper"
		};
	
	console.log("checkIfLoggedIn...");

	function isURLSession() {		
		var J_SESSION_ID_PARAM_ASSIGN = J_SESSION_ID_PARAM_NAME + "=",
			qs,
			startIndex,
			isSession;

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

	function doIfLoggedIn() {
		console.log("doIfLoggedIn");
	}

	function doIfNotLoggedIn() {
		console.log("doIfNotLoggedIn");
		var interval;
		interval = setInterval(function() {
			var isButtonRendered = 
				$(".fb-login-button[fb-xfbml-state='rendered']").length > 0;
			if (isButtonRendered) {
				$(SELECTORS.LOGIN_HELPER).slideDown();
				clearInterval(interval);
			}
		}, CHECK_IF_LOGIN_BUTTON_RENDERED_INTERVAL);
	}

	if (isCookieSession() || isURLSession()) {
		doIfLoggedIn();
	}
	else {
		doIfNotLoggedIn();
	}
}


if (location.pathname == '/home.html' || location.pathname == '/') {
	console.log("going to check if logged in..");
	checkIfLoggedIn();	
}
