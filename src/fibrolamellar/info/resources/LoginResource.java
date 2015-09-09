package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.handleThrowable;
import static friedman.tal.util.Helpers.extractParamValue;
import static friedman.tal.util.Helpers.NEXT_PAGE_PARAM_NAME;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import fibrolamellar.info.FacebookLoginCmd;
import fibrolamellar.info.PasswordLoginCmd;
import friedman.tal.util.Helpers;

@Path("login")
public class LoginResource extends BaseResource {
	private static final String PASSWORD_LOGIN_PAGE_URL = "/secret.html";
	private static final String PASSWORD_PARAM_NAME = "code";
	private static final ResponseBuilder BAD_RESPONSE_BUILDER = Response.status(Status.BAD_REQUEST).entity("NOT LOGGED IN");
	private static final ResponseBuilder FORBIDDEN_RESPONSE_BUILDER = Response.status(Status.FORBIDDEN).entity("NOT LOGGED IN");
	private static final ResponseBuilder OK_RESPONSE_BUILDER = Response.ok().entity("LOGGED IN");
	
	private static final Logger LOGGER = LoggerFactory.getLogger(LoginResource.class);
	
	@Path("fb")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public Response fbLogin(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		try {
			String body = Helpers.getRequestBody(request);
			boolean isLoginSuccessful = doFacebookLogin(request, response);
			if (isLoginSuccessful) {
				LOGGER.debug("login successful!");
				String nextPageURL = getNextPageURL(body);
				LOGGER.debug("forwarding to: {}", nextPageURL);
				return OK_RESPONSE_BUILDER.build();
			}
			else {
				return BAD_RESPONSE_BUILDER.build();
			}
		}  catch (IllegalAccessError iae) {
			handleThrowable(iae);
			return FORBIDDEN_RESPONSE_BUILDER.build();
		} catch (IOException ioe) {
			handleThrowable(ioe);
			return BAD_RESPONSE_BUILDER.build();
		}  
		
	}

	@Path("pw")
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.TEXT_PLAIN)
	public Response pwLogin(@Context HttpServletRequest request, @Context HttpServletResponse response) {
		try {
			String body = Helpers.getRequestBody(request);
			boolean isLoginSuccessful = doPasswordFormLogin(request, response, body);
			String nextPageURL = getNextPageURL(body);
			if (isLoginSuccessful) {
				LOGGER.debug("login successful!");
				
				LOGGER.debug("forwarding to: {}", nextPageURL);
				return Response.seeOther(new URI(nextPageURL)).build();
			}
			else {
				LOGGER.debug("login NOT successful!");

				final String PARAMS_STRING = NEXT_PAGE_PARAM_NAME+"=" + nextPageURL+"&loginError";
				URI loginErrorPageURI = new URI(PASSWORD_LOGIN_PAGE_URL+"?"+PARAMS_STRING);

				LOGGER.debug("forwarding to: {}", loginErrorPageURI);
				
				return Response.seeOther(loginErrorPageURI).build();
			}						 
		} catch (IllegalAccessError iae) {
			handleThrowable(iae);
			return FORBIDDEN_RESPONSE_BUILDER.build();
		} catch (IOException ioe) {
			handleThrowable(ioe);
			return BAD_RESPONSE_BUILDER.build();
		} catch (URISyntaxException e) {
			handleThrowable(e);
			return BAD_RESPONSE_BUILDER.build();
		} 	 
	}
	
	
	public boolean doFacebookLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {		
		FacebookLoginCmd facebookLoginCmd = new FacebookLoginCmd(request, response); 
		return facebookLoginCmd.doLogin();			
	}	
	
	public boolean doPasswordLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String password = request.getParameter(PASSWORD_PARAM_NAME);
		return new PasswordLoginCmd(request, response, password).doLogin();
	}
	
	public boolean doPasswordFormLogin(HttpServletRequest request, HttpServletResponse response, String body) throws IOException {
		String password = extractPassword(body);		
		return new PasswordLoginCmd(request, response, password).doLogin();		
	}

	private static String extractPassword(String body) throws IOException {
		String password = extractParamValue(body, PASSWORD_PARAM_NAME);
		LOGGER.debug("Extracted password: {} \t from body: {}", password, body);
		return password;
	}


}
