package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.extractParamValue;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fibrolamellar.info.Constants;

public class BaseResource {

	public BaseResource() {
		super();
	}

	protected String getNextPageURL(String body) {
		String nextPageURL = extractParamValue(body, Constants.NEXT_PAGE_PARAM_NAME);
		// ugly hack/primitive url decoding; not sure how to do it cleanly since need @Context request and response, otherwise
		// could have jaxrs pass in the request body
		// @FormParam and Form cannot be combined with ServletRequest/Response, and we need to pass them to the
		// login cmd so that it can create the session
		nextPageURL = nextPageURL.length() > 0 ? nextPageURL.replace("%2F", "/") : Constants.DEFAULT_NEXT_PAGE_URL;
		return nextPageURL;
	}

	protected void includeJSPResponse(String pathToJsp, HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.getRequestDispatcher("/WEB-INF/" + pathToJsp).include(request, response);
		response.flushBuffer();
	}
}