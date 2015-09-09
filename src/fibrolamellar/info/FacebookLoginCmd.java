package fibrolamellar.info;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fibrolamellar.info.models.FBAuthResponse;
import fibrolamellar.info.models.FBLoginResponse;
import fibrolamellar.info.models.FBLoginStatusEnum;
import fibrolamellar.info.resources.FacebookRequester;
import fibrolamellar.info.resources.FibrosUniteApplication;
import friedman.tal.util.Helpers;

public class FacebookLoginCmd extends AbstractLoginCmd {
	private static final Logger LOGGER = LoggerFactory.getLogger(FacebookLoginCmd.class);
	
	private static final String ERROR_MSG_INVALID_ACCESS_TOKEN = "Invalid Access Token";
	//private static final String FB_USER_ID_SESSION_ATTR_NAME = "fbUserID";
	
	
	public FacebookLoginCmd(HttpServletRequest request, HttpServletResponse response) {
		super(request, response);
	}
	

	
	@Override
	public boolean doLogin() throws IOException {
		LOGGER.trace("doLogin()...");
		
		String fbLoginResponseString = Helpers.convertStreamToString(this._request.getInputStream());
		LOGGER.trace("\n\n fbLoginResponseString: "+ fbLoginResponseString + "\n\n");		
		if (Helpers.empty(fbLoginResponseString)) {
			return false;
		}

		ObjectMapper mapper = new ObjectMapper();
		FBLoginResponse loginResponse = mapper.readValue(fbLoginResponseString, FBLoginResponse.class);

		ensureGroupMember(loginResponse);		// check this first as it's the cheapest operation
		authenticateResponse(loginResponse);
		
		createNewSession(loginResponse.authResponse);
		
		LOGGER.trace("login successful!!!");
		return true;
	}

	private void authenticateResponse(FBLoginResponse loginResponse) {
		LOGGER.debug("Authenticating response...");
		String errorMsg = null;
		
		if (FBLoginStatusEnum.connected != loginResponse.status) 
			errorMsg = ERROR_MSG_USER_NOT_SIGNED_IN;
		else {
			FBAuthResponse authResponse = loginResponse.authResponse;
			if (FacebookRequester.INSTANCE.isValidTokenForUser(authResponse.accessToken, String.valueOf(authResponse.userID))) {
				errorMsg = ERROR_MSG_INVALID_ACCESS_TOKEN;
			}
		}
		
		if (errorMsg != null) {
			throw new IllegalAccessError(errorMsg);
		}		
		LOGGER.debug("Response is authentic!");
	}

	private void ensureGroupMember(FBLoginResponse loginResponse) {
		LOGGER.debug("ensuring valid group member...");
		try {				
			if (FibrosUniteApplication.getFBMemberResource().isMemberOfFWU(loginResponse.authResponse.userID)) {
				LOGGER.debug("group member is valid!");
				return;
			}
		} catch (Throwable t) {
			t.printStackTrace(System.err);
		}
		throw new IllegalAccessError("Not a member of FWU!!");
	}
}
