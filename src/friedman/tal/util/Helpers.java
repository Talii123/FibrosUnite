package friedman.tal.util;

import static fibrolamellar.info.Constants.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collection;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.appengine.api.users.UserServiceFactory;

public class Helpers {
	public static final String NEXT_PAGE_PARAM_NAME = "continue";
	private static final Logger LOGGER = LoggerFactory.getLogger(Helpers.class);
	
	public static void ensureAdmin() {
		if (!isAdmin()) {
			throw new IllegalAccessError("access denied");
		}
	}
	
	public static boolean isAdmin() {
		return UserServiceFactory.getUserService().isUserAdmin();
	}
	

	public static String convertStreamToString(InputStream in) throws IOException {
		StringBuilder sb = new StringBuilder();
		BufferedReader reader = new BufferedReader(new InputStreamReader(in));
		String line = reader.readLine();
		while (line != null) {
			sb.append(line).append("\n");
			line = reader.readLine();
		}
		reader.close();
		return sb.toString();
	}

	public static StringBuilder getCookieData(Cookie aCookie) {
		StringBuilder sb = new StringBuilder();
		if (aCookie == null) {
			sb.append("[null cookie]");
		}
		else {
			sb.append(aCookie.getClass().getName()).append(": {");
			sb.append("name=").append(aCookie.getName());
			sb.append(", value=").append(aCookie.getValue());
			sb.append(", maxAge=").append(aCookie.getMaxAge());
			sb.append(", path=").append(aCookie.getPath());
			sb.append(", domain=").append(aCookie.getDomain());
			sb.append(", secure=").append(aCookie.getSecure());
			sb.append(", version=").append(aCookie.getVersion());
			sb.append("}");		
		}
		
		return sb;
	}
	
	public static StringBuilder getRequestData(HttpServletRequest request) {
		StringBuilder sb = new StringBuilder();
		sb.append(request.getClass().getName()).append(": {");
		
		sb.append("\n\t attributes: ").append(request.getAttributeNames());
		sb.append("\n\t authType: ").append(request.getAuthType());
		sb.append("\n\t characterEncoding: ").append(request.getCharacterEncoding());
		sb.append("\n\t contentLength: ").append(request.getContentLength());
		sb.append("\n\t contentType: ").append(request.getContentType());
		sb.append("\n\t contextPath: ").append(request.getContextPath());
		
		sb.append(getCookiesData(request.getCookies()));
		
		sb.append(getHeadersData(request.getHeaderNames()));
		
		sb.append("\n\t localAddr: ").append(request.getLocalAddr());
		sb.append("\n\t localName: ").append(request.getLocalName());
		sb.append("\n\t localPort: ").append(request.getLocalPort());
		sb.append("\n\t method: ").append(request.getMethod());
		
		sb.append("\n\t parameters: ").append(request.getParameterMap());
		/*Set<Map.Entry<String, Object>> paramSet = request.getParameterMap().entrySet();
		for (Map.Entry<String, Object> entry : paramSet) {
			sb.append(entry.getKey()).append("=").append(entry.getValue());
		}
		Enumeration parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			sb.append(parameterNames.nextElement());
			if (parameterNames.hasMoreElements()) {
				sb.append(", ");
			}
		}*/

		
		sb.append("\n\t pathInfo: ").append(request.getPathInfo());
		sb.append("\n\t pathTranslated: ").append(request.getPathTranslated());
		sb.append("\n\t protocol: ").append(request.getProtocol());
		sb.append("\n\t quertyString: ").append(request.getQueryString());
		
		sb.append("\n\t request body: \n");
		try {
			sb.append(getRequestBody(request));	
		} catch (IOException ioe) {
			sb.append("[caught an io exception while trying to read request body]");
		}
		sb.append("\n");
		
		sb.append("\n\t remoteAddress: ").append(request.getRemoteAddr());
		sb.append("\n\t remoteHost: ").append(request.getRemoteHost());
		sb.append("\n\t remotePort: ").append(request.getRemotePort());
		sb.append("\n\t remoteUser: ").append(request.getRemoteUser());
		sb.append("\n\t requestedSessionId: ").append(request.getRequestedSessionId());
		sb.append("\n\t requestURI: ").append(request.getRequestURI());
		sb.append("\n\t requestURL: ").append(request.getRequestURL());
		sb.append("\n\t scheme: ").append(request.getScheme());
		sb.append("\n\t serverName: ").append(request.getServerName());
		sb.append("\n\t serverPort: ").append(request.getServerPort());
		sb.append("\n\t servletPath: ").append(request.getServletPath());
		sb.append("\n\t isSecure: ").append(request.isSecure());
		sb.append("\n}");
		
		return sb;
	}

	private static StringBuilder getHeadersData(Enumeration headers) {
		StringBuilder sb = new StringBuilder();
		sb.append("\n\t headers: {");
		if (headers != null) {
			while (headers.hasMoreElements()) {
				sb.append("\n\t").append(headers.nextElement());
			}			
		}
		else {
			sb.append("\n\t [null headers]");
		}
		sb.append("\n}");

		return sb;
	}

	public static StringBuilder getCookiesData(Cookie[] cookies) {
		StringBuilder sb = new StringBuilder();
		sb.append("\n\t cookies: {");
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				sb.append("\n\t").append(getCookieData(cookie));
			}
		}
		else {
			sb.append("\n\t [null cookies]");
		}
		sb.append("\n}");
		
		return sb;
	}
	
/*	public static void respondWithForbidden(HttpServletResponse response) throws IOException {
		response.setStatus(Response.Status.FORBIDDEN.getStatusCode());
		response.sendRedirect(FACEBOOK_LOGIN_PAGE_URL);		
	}
	
	public static void respondWithBadRequest(HttpServletResponse response) throws IOException {
		response.setStatus(Response.Status.BAD_REQUEST.getStatusCode());
		response.sendRedirect(FACEBOOK_LOGIN_PAGE_URL);		
	}	
	*/

	public static void redirectToLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
		redirectToLogin(request, response, FACEBOOK_LOGIN_PAGE_URL);
	}
	
	public static void redirectToLogin(HttpServletRequest request, HttpServletResponse response, String pageURL) throws IOException {
		response.sendRedirect(getRedirectURL(request, pageURL));		
	}	
	
	
	public static String getRedirectToLoginURL(HttpServletRequest request) {
		return getRedirectURL(request, FACEBOOK_LOGIN_PAGE_URL);
	}
	
	public static String getRedirectURL(HttpServletRequest request, String pageURL) {
		if (pageURL == null || pageURL.length() == 0) pageURL = FACEBOOK_LOGIN_PAGE_URL;
		String nextPageURL = request.getRequestURI();
		nextPageURL = (nextPageURL != null && nextPageURL.length() > 0) ? nextPageURL.substring(1) : DEFAULT_NEXT_PAGE_URL;
		return pageURL + "?" +NEXT_PAGE_PARAM_NAME + "=" + nextPageURL;
	}

	
	public static boolean isSet(String value) {
		if (value == null) return false;
		
		LOGGER.trace("paramValue to test is: {}", value);
		value = value.trim().toLowerCase();
		LOGGER.trace("after cleansing, param to test is: {}", value);
		return "1".equals(value) || "yes".equals(value) || "on".equals(value) || "true".equals(value);
	}
	
	public static boolean isUnset(String value) {
		if (value == null) return false;
		
		value = value.trim().toLowerCase();
		return "0".equals(value) || "no".equals(value) || "off".equals(value) || "false".equals(value);
	}
	
	public static <E> boolean notEmpty(Collection<E> aCollection) {
		return aCollection != null && !aCollection.isEmpty();
	}
	
	public static boolean notEmpty(String input) {
		return input != null && input.trim().length() > 0;
	}
	
	public static boolean empty(String input) {
		return !notEmpty(input);
	}
	
	public static final String getCookieValueFor(String aCookieName, Cookie[] someCookies) {
		if (empty(aCookieName) || someCookies == null) return "";
		for (Cookie cookie : someCookies) {
			if (aCookieName.equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return "";
	}
	
	public static final Cookie getCookieFor(String aCookieName, Cookie[] someCookies) {
		if (empty(aCookieName) || someCookies == null) return null;
		for (Cookie cookie : someCookies) {
			if (aCookieName.equals(cookie.getName())) {
				return cookie;
			}
		}
		return null;
	}	
	
	public static final String getRequestBody(HttpServletRequest request) throws IOException {
		if (request == null) return "";
		
		BufferedReader reader = request.getReader();
		String line = reader.readLine();
		StringBuilder sb = new StringBuilder();
		while (line != null) {
			sb.append(line).append("\n");
			line = reader.readLine();
		}
		// remove extra new line character
		int length = sb.length();
		if (length > 0) {
			sb.deleteCharAt(length-1);	
		}
		
		reader.close();
		return sb.toString();
	}
	
	public static String extractParamValue(String paramsString, String paramName) {
		String paramValue = "";
		if (paramsString == null) return paramValue;
		int startIndex = paramsString.indexOf(paramName);
		if (startIndex >= 0) {
			startIndex += paramName.length() + 1;
			int endIndex = paramsString.indexOf("&", startIndex);
			if (endIndex > 0) {
				paramValue = paramsString.substring(startIndex, endIndex);
			}
			else {
				paramValue = paramsString.substring(startIndex);
			}
		}
		return paramValue;
	}

	public static boolean isExpired(Date anExpirationDate) {
		return anExpirationDate == null || (anExpirationDate.getTime() < System.currentTimeMillis());
	}
	
	public static void handleThrowable(Throwable t) {
		LOGGER.error("Caught an throwable while trying to log in; Throwable is: {}", t.getMessage());
		t.printStackTrace(System.err);
	}
	
	
}
