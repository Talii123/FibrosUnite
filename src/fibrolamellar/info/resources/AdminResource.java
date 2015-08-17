package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.isAdmin;
import static friedman.tal.util.Helpers.isSet;
import static friedman.tal.util.Helpers.empty;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;

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
import javax.ws.rs.core.Response;

@Path("admin")
public class AdminResource {
	
	/*
	@GET
	@Path("testRead")
	public String testRead(@QueryParam("path") String path) {
		System.out.println("\n\n path = "+path+"\n\n");
		if (empty(path)) path = "./";
		StringBuilder sb = new StringBuilder();
		try {
			sb.append("\n\n FILE: \n\n");
			sb.append(readFile(path));	
		} catch (IOException ioe) {
			System.err.println("Caught error while trying to read FILE: "+path);
			ioe.printStackTrace(System.err);
		}

		try {
			sb.append("\n\n RESOURCE: \n\n");
			sb.append(readResource(path));	
		} catch (IOException ioe2) {
			System.err.println("Caught error while trying to read RESOURCE: "+path);
			ioe2.printStackTrace(System.err);
		}
	
		return sb.toString();
		
	}
	
	@GET
	@Path("testReadResource")
	public String readResource(@QueryParam("path") String aFilename) throws IOException {
		System.out.println("\n\n aFilename = "+aFilename+"\n\n");
		if (empty(aFilename)) {
			aFilename = "./";
			System.out.println("\n\n NOW aFilename = "+aFilename+"\n\n");
		}

		return readStream(getClass().getResourceAsStream(aFilename)).toString();
	}

	@GET
	@Path("testReadFile")
	public String readFile(@QueryParam("path") String aFilename) throws IOException {
		System.out.println("\n\n aFilename = "+aFilename+"\n\n");
		if (empty(aFilename)) {
			aFilename = "./";
			System.out.println("\n\n NOW aFilename = "+aFilename+"\n\n");
		}
		File file = new File(aFilename);
		System.out.println("absolutePath: "+ file.getAbsolutePath());
		System.out.println("canonicalPath: "+ file.getCanonicalPath());
		System.out.println("path: "+ file.getPath());
		
		return readStream(new FileInputStream(file)).toString();
	}
	
	private StringBuilder readStream(InputStream in) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(in));
		StringBuilder sb = new StringBuilder();
		String line = reader.readLine();
		while (line != null) {
			System.out.println(line);
			sb.append(line);
			line = reader.readLine();
		}
		
		reader.close();
		return sb;
	}*/

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
