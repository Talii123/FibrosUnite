package fibrolamellar.info;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimpleForwarder {
	private static final Logger LOGGER = LoggerFactory.getLogger(SimpleForwarder.class);
	
	public static void forward(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String data = debug(request).toString();
		LOGGER.debug("info: " + data);
		/*PrintWriter out = response.getWriter();
		out.write(data);
		out.flush();
		*/
		
		String resourcePath = "/WEB-INF"+request.getRequestURI()+".jsp";
		LOGGER.debug("router is routing to " + resourcePath + "...\n\n");
		try {
			request.getRequestDispatcher(resourcePath).include(request, response);	
			response.flushBuffer();
		} catch (Throwable t) {
			LOGGER.error("{}", t);
			LOGGER.error("\n\ninfo: {}", data);
			LOGGER.error("router was routing to {}... ", resourcePath);
		}
		
		
	}

	
	public static StringBuilder debug(HttpServletRequest request) {
		StringBuilder sb = new StringBuilder();
		sb.append("\ncontextPath: "+ request.getContextPath());
		sb.append("\ngetPathInfo: "+ request.getPathInfo());
		sb.append("\ngetPathTranslated: "+ request.getPathTranslated());
		sb.append("\ngetRequestURI: "+ request.getRequestURI());
		sb.append("\ngetRequestURL: "+ request.getRequestURL());
		return sb;
	}
}
