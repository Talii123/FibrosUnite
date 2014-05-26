package fibrolamellar.info.resources;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fibrolamellar.info.SimpleForwarder;

@Path("map")
public class MapResource {
	private static final Logger LOGGER = LoggerFactory.getLogger(MapResource.class);

	@GET
	@Produces(MediaType.TEXT_HTML)
	public void getMapPage(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException {
		LOGGER.debug("[Map Resource] forwarding to JSP");
		SimpleForwarder.forward(request, response);
	}
}
