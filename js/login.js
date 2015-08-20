
function setupFacebookLogin() {
	var currentPage = location.pathname
		, PAGE_ALLOWS_LOGIN = {
			'/' : true
			, '/home.html' : true
			, '/login.html' : true
		};

	if (!PAGE_ALLOWS_LOGIN[currentPage]) {
		console.log("NOT setting up FB login because this page does not allow/support it.");
		return;
	}

	console.log("setting up FB login..");
	window.fbAsyncInit = function() {
	  console.log("fbAsyncInit called");
	  FB.init({
	    appId      : '496081500497931',
	    status     : false, // check login status
	    cookie     : true, // enable cookies to allow the server to access the session
	    xfbml      : true  // parse XFBML
	  });
	};


	window.App.Utils.loadScript('//connect.facebook.net/en_US/all.js', {
		doc: document
		, id: 'facebook-jssdk'
	});
}

function initLogin() {
	var IS_DEBUG = true,
		SELECTORS = {
			LOGIN_HELPER : ".loginHelper"
		},
		nextPage = getValueFor("continue", location.search) || "/";

	function getValueFor(aParamName, paramsString) {
		var continueIndex,
			nextParamIndex,
			paramAssign = aParamName + "=";

		if (typeof paramsString === 'string') {
			continueIndex = paramsString.indexOf(paramAssign);
			if (continueIndex >= 0) { // this could probably be > 0
				continueIndex += paramAssign.length;
				nextParamIndex = paramsString.indexOf("&", continueIndex+1);
				if (nextParamIndex > 0) {
					return paramsString.substring(continueIndex, nextParamIndex);
				}
				else {
					return paramsString.substring(continueIndex);
				}
			}
		}
		return "";		
	}

	function onStayOnPage() {
		var $loginHelper = $(SELECTORS.LOGIN_HELPER);

		$loginHelper.find("#loggingInMsg").remove()
		$loginHelper.find(".fb-login-button").remove()			
		$loginHelper.append("<span class='highlight' style='margin-left: 20px;'>Success! You are now logged in.</span>");
		$loginHelper.delay(2500).slideUp();
		$loginHelper.find("#logInFailedMsg").remove()
	}

	function onLoginAttempt() {
		var $loginHelper = $(SELECTORS.LOGIN_HELPER);
		
		$loginHelper.find("#logInFailedMsg").hide()
		$loginHelper.find(".fb-login-button").hide()
		$loginHelper.find("#loggingInMsg").show()
	}

	function onLoginFailed() {
		var $loginHelper = $(SELECTORS.LOGIN_HELPER);
		
		$loginHelper.find("#loggingInMsg").hide()
		$loginHelper.find(".fb-login-button").show()
		$loginHelper.find("#logInFailedMsg").show()
	}

	function onLoginComplete(appResponse) {
		console.log("appResponse = ", appResponse);
		console.log("nextPage = ", nextPage);
		if (location.pathname != nextPage)
			location.href = nextPage;
		else {
			onStayOnPage();
		}
	}

	function finishLogin(fbResponse) {
		$.ajax({
			url: "/login/fb",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(fbResponse), 
			success: onLoginComplete,
			error: onLoginFailed
		});
		onLoginAttempt();
	}

	console.log ("initLogin called with arguments=", arguments);
	FB.getLoginStatus(function(response) {
		console.log("response from facebook: ", response);
		if (response.status === 'connected') {
			finishLogin(response);
		}
		else {
			console.log("nothing to do because not logged in with Facebook..");
		}
	});
}

setupFacebookLogin();