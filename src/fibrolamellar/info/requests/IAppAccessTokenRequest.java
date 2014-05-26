package fibrolamellar.info.requests;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

@Path("/oauth/access_token")
public interface IAppAccessTokenRequest {

	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getToken(@QueryParam("client_id") String clientID, @QueryParam("client_secret") String clientSecret, @QueryParam("grant_type") String grantType);
}
