package friedman.tal.filters;

import static friedman.tal.util.Helpers.getRequestData;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DebugFilter implements Filter {

	private static Logger LOGGER = LoggerFactory.getLogger(DebugFilter.class);
	
	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) 
			throws IOException, ServletException {
		LOGGER.debug("Inside debug filter...");
		HttpServletRequest request = new DebugWrapper((HttpServletRequest)servletRequest);
		debug(request);
		
		LOGGER.debug("going on to the next filter/servlet..");
		filterChain.doFilter(request, servletResponse);
	}

	private void debug(HttpServletRequest request) {
		LOGGER.info(getRequestData(request).toString());		
	}
	


	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}

}
