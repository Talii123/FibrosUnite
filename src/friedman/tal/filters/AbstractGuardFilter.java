package friedman.tal.filters;

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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractGuardFilter implements Filter {
	private static final Logger LOGGER = LoggerFactory.getLogger(AbstractGuardFilter.class);
	
	
	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public abstract void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException;
	
	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

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

	
}
