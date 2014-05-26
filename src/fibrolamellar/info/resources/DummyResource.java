package fibrolamellar.info.resources;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.util.Helpers;

@Path("dummy")
public class DummyResource {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(DummyResource.class);

	@POST
	public void readBody(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException {
		LOGGER.info("[dummy] I'm reading from body...");
		LOGGER.info("[dummy] here's the body I read {}", Helpers.getRequestBody(request));
	}
	
}
