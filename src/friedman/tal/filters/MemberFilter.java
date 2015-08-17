package friedman.tal.filters;

import static friedman.tal.util.Helpers.redirectToLogin;
import static friedman.tal.util.Helpers.handleThrowable;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fibrolamellar.info.resources.FibrosUniteApplication;


public class MemberFilter extends AbstractLoginGuardFilter implements Filter {

	private static final Logger LOGGER = LoggerFactory.getLogger(MemberFilter.class);
	

	@Override
	protected void tryToCreateSession(FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		
		try {			
			boolean isLoginSuccessful = FibrosUniteApplication.getLoginResource().doFacebookLogin(request, response);
			if (isLoginSuccessful) {
				LOGGER.debug("login successful so permitting request to continue to the next filter/servlet.");
				permit(request, response, filterChain);
			}
			else {
				LOGGER.debug("login unsuccessful so blocking request.");
				deny(request, response, ERROR_MSG_LOGIN_WAS_UNSUCCESSFUL);	
			}							
		} catch (IOException ioe) {
			handleThrowable(ioe);
			redirectToLogin(request, response);
		} catch (IllegalAccessError iae) {
			handleThrowable(iae);
			redirectToLogin(request, response);
		}
	}

}
