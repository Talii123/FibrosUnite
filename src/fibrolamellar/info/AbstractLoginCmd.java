package fibrolamellar.info;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import fibrolamellar.info.models.FBAuthResponse;

public abstract class AbstractLoginCmd {

	private static final String FB_USER_AUTH_RESPONSE = "fbUserAuthResponse";
	protected static final String ERROR_MSG_USER_NOT_SIGNED_IN = "User is not signed in";
	protected static final int HOUR = 3600;
	protected static final int SESSION_INACTIVE_INTERVAL = HOUR;
	
	protected final HttpServletRequest _request;
	protected final HttpServletResponse _response;

	public AbstractLoginCmd(HttpServletRequest request, HttpServletResponse response) {
		this._request = request;
		this._response = response;
	}

	public HttpServletResponse getResponse() {
		return this._response;
	}

	public abstract boolean doLogin() throws IOException;
	
	public static FBAuthResponse getAuthResponseForOwner(HttpSession aSession) {
		return (FBAuthResponse) (aSession != null ? aSession.getAttribute(FB_USER_AUTH_RESPONSE) : null);
	}

	protected final HttpSession createNewSession(FBAuthResponse sessionOwnerAuthResponse) {
		HttpSession session = this._request.getSession(true);
		session.setMaxInactiveInterval(SESSION_INACTIVE_INTERVAL);
		if (sessionOwnerAuthResponse != null) {
			session.setAttribute(FB_USER_AUTH_RESPONSE, sessionOwnerAuthResponse);
		}
		return session;
	}

}