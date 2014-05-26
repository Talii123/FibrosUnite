package friedman.tal.filters;

import static deprecated.fibrolamellar.info.TestSessionHelper.isTestSessionDestroyRequested;
import static deprecated.fibrolamellar.info.TestSessionHelper.isTestSessionTriggered;
import static friedman.tal.util.Helpers.redirectToLogin;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;

import org.slf4j.Logger;

public abstract class AbstractGuardFilter implements Filter {
	private static final Logger LOGGER = LoggerFactory.getLogger(AbstractGuardFilter.class);
	
	protected static final String ERROR_MSG_LOGIN_WAS_UNSUCCESSFUL = "login was unsuccessful";
	protected static final String ERROR_MSG_SESSION_WAS_INVALIDATED = "session was invalidated";

	
	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) 
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)servletRequest;
		HttpServletResponse response = (HttpServletResponse)servletResponse;
		HttpSession session = request.getSession(false);
		if (session != null) {
			// TODO should probably remove this at some point..
			if (isTestSessionDestroyRequested(request)) {
				session.invalidate();
				deny(request, response, ERROR_MSG_SESSION_WAS_INVALIDATED);
			}
			else {
				permit(request, response, filterChain);
			}
		}
		// TODO should probably remove this at some point..
		else if (isTestSessionTriggered(request)) {
			permit(request, response, filterChain);
		}
		else {
			tryToCreateSession(filterChain, request, response);
		}

	}
	
	protected abstract void tryToCreateSession(FilterChain filterChain, HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException;

	
	protected void permit(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
			throws IOException, ServletException {
		LOGGER.info("\n\n session exists, so allowing request to proceed..\n\n");
		filterChain.doFilter(request, response);		
	}
	
	protected void deny(HttpServletRequest request, HttpServletResponse response, String reason) throws IOException {
		LOGGER.info("\n\n "+reason+" so redirecting to login page\n\n");
		redirectToLogin(request, response);
	}
	
	protected void deny(HttpServletRequest request, HttpServletResponse response, String reason, String page) throws IOException {
		LOGGER.info("\n\n "+reason+" so redirecting to page: {}\n\n", page);
		redirectToLogin(request, response, page);
	}	


	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

}
