package fibrolamellar.info.resources;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fibrolamellar.info.SimpleForwarder;

@Path("discover")
public class DiscoverResource {
	private static final Logger LOGGER = LoggerFactory.getLogger(DiscoverResource.class);

	@GET
	public void getDiscoverPage(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException {
		LOGGER.debug("[Discover Resource] forwarding to JSP");
		SimpleForwarder.forward(request, response);
	}
}
