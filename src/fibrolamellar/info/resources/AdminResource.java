package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.isAdmin;
import static friedman.tal.util.Helpers.isSet;
import static friedman.tal.util.Helpers.getCookieFor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Path("admin")
public class AdminResource {

	@GET
	@Path("session")
	@Produces(MediaType.TEXT_PLAIN)
	public String deleteCurrentSession(@Context HttpServletRequest request, @Context HttpServletResponse response, @QueryParam("delete") String deleteParam) {
		if (isAdmin()) {
			if (isSet(deleteParam)) {
				HttpSession currentSession = request.getSession(false);
				if (currentSession != null) {
					deleteSession(request, response, currentSession);
					return "Current Session Deleted";
				}
				else {
					return "There is no session to delete.";
				}
			}
			else {
				return "Current session NOT deleted because you did not request it properly.";
			}
		}
		return "Session not deleted because you do not have the authority to do it!";
	}
	
	private void deleteSession(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		session.invalidate();
		/* DOES NOT WORK
		Cookie sessionCookie = getCookieFor("JSESSIONID", request.getCookies());
		if (sessionCookie != null) {
			System.out.println("Trying to delete session cookie; found cookie: " + sessionCookie);
			sessionCookie.setMaxAge(0);
			response.addCookie(sessionCookie);			
		} else {
			System.out.println("Could not find a cookie for JSESSION ID!!");
		}
		*/
	}
}
