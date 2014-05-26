package fibrolamellar.info.resources;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public interface IFacebookMemberResource {

	boolean isMemberOfFWU(long anFBUserID);

	@GET
	@Path("update")
	@Produces(MediaType.TEXT_PLAIN)
	public Response getMemberUpdate(@Context HttpServletRequest request);
}
