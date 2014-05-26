package deprecated.fibrolamellar.info;

import static friedman.tal.util.Helpers.isAdmin;
import static friedman.tal.util.Helpers.isSet;
import static friedman.tal.util.Helpers.isUnset;

import javax.servlet.http.HttpServletRequest;

public class TestSessionHelper {
	private static final String TEST_SESSION_PARAM_NAME = "testSession";
	
	
	public static boolean isTestSessionTriggered(HttpServletRequest request) {
		// user service test is probably way more expensive so do efficient test first
		return isSet(request.getParameter(TEST_SESSION_PARAM_NAME)) &&isAdmin();
	}
	
	public static boolean isTestSessionDestroyRequested(HttpServletRequest request) {
		// user service test is probably way more expensive so do efficient test first
		return isUnset(request.getParameter(TEST_SESSION_PARAM_NAME)) && isAdmin();		
	}

}
