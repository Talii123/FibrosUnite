package fibrolamellar.info.resources;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.api.client.extensions.appengine.http.UrlFetchTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.UrlEncodedContent;

import fibrolamellar.info.SimpleForwarder;
import fibrolamellar.info.resources.GoogleSpreadsheetResourceController.RESOURCE;

@Path("discover")
public class DiscoverResource extends BaseResource {
	private static final Logger LOGGER = LoggerFactory.getLogger(DiscoverResource.class);
	

	@GET
	public void getDiscoverPage(@Context HttpServletRequest request, @Context HttpServletResponse response) 
			throws IOException {
		LOGGER.debug("[Discover Resource] forwarding to JSP");
		SimpleForwarder.forward(request, response);
	}
	
	@GET
	@Path("{documentID}/description/edit")
	@Produces(MediaType.TEXT_HTML)
	public void getSuggestAnEditHTML(@PathParam("documentID") String documentToEditID, @Context HttpServletRequest request, @Context HttpServletResponse response) 
			throws ServletException, IOException {
		// TODO: use some kind of request property (BUT MAKE SURE IT DOESN'T INCLUDE QUERY PARAMETERS/IS NOT HACKABLE)
		// NOTE: using request.setAttribute here so that it can't be hacked
		request.setAttribute("action", "/discover/"+documentToEditID+"/description/edit");
		request.setAttribute("resourceProperty", "description");
		request.setAttribute("currentValue", HardcodedDocumentResource.INSTANCE.getDocument(documentToEditID));
		includeJSPResponse("suggestAnEditForm.jsp", request, response);
	}
	
	@POST
	@Path("{documentID}/description/edit")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	//public String doSuggestAnEdit(@PathParam("documentID") String documentToEditID, 
			/*
			 * FormParams are evil and STILL don't work even after upgrading to 3.0.7 
			@FormParam("newDescription") String newDescription, 
			@FormParam("resourceProperty") String resourceProperty/*, 
			@Context HttpServletRequest request, 
			@Context HttpServletResponse response ) {*/
	
		
	public void doSuggestAnEdit(@PathParam("documentID") String documentID,
			//@FormParam("dummy") String dummy,
			@Context HttpServletRequest request, 
			@Context HttpServletResponse response,
			MultivaluedMap<String, String> form) throws IOException, ServletException {	
								
		Map<String, String> resourcePropertiesMap = new HashMap<>();
		resourcePropertiesMap.put("documentID", documentID);
		
		final String[] PROPERTIES_TO_COPY = new String[] {
			"property",
			"suggestedDescription", 
			"suggestedTags", 
			"tagsToAdd", 
			"tagsToRemove"
		};				
		for (int propertyIter = 0; propertyIter < PROPERTIES_TO_COPY.length; propertyIter++) {
			String property = PROPERTIES_TO_COPY[propertyIter];
			resourcePropertiesMap.put(property, form.getFirst(property));
		}
		
//		resourcePropertiesMap.put("newDescription", form.getFirst("newDescription"));
//		resourcePropertiesMap.put("suggestedTags", form.getFirst("suggestedTags"));
//		resourcePropertiesMap.put("tagsToAdd", form.getFirst("tagsToAdd"));
//		resourcePropertiesMap.put("tagsToRemove", form.getFirst("tagsToRemove"));
		
		boolean isSuccessful = GoogleSpreadsheetResourceController.RESOURCE.DISCOVER_DOCUMENTS_ALL.putEntry(resourcePropertiesMap);
		if (isSuccessful) {
			request.setAttribute("heading", "Thank you!");
			request.setAttribute("msg", "Your suggestion has been submitted and will be reviewed by an administrator soon. If an administrator approves this change we will update the page with your suggestion. Thank you so much for your help making our site better!");
			request.setAttribute("links", new String[][]{{"/discover", "Continue to the Discover page"}});
			includeJSPResponse("Msg.jsp", request, response);
		}
		else {
			request.setAttribute("heading", "Oops!");
			request.setAttribute("msg", "An error prevented us from recording your suggestion. Please reload the page and try again.");
			includeJSPResponse("Msg.jsp", request, response);			
		}
		
		//return "dummy-ok; documentID="+documentToEditID + ", resourceProperty = " + resourceProperty +  ", newDescription = " + newDescription + ", isSuccessful="+isSuccessful;
	}
	
	@Path("test")
	@GET
	public String main() throws IOException {
		final String TEST_URL =// "http://localhost:8888/discover/test"; 
			"https://script.google.com/macros/s/AKfycbwZdcH5cRAcW_UHjy9TkfysDFT9oBgAWiVn7PbNwimfTyAC16II/exec";
		HttpRequestFactory requestFactory = UrlFetchTransport.getDefaultInstance().createRequestFactory();
		/*HttpRequest request = requestFactory.buildPostRequest(new GenericUrl(TEST_URL), 
				new UrlEncodedContent("description=TESTING"));*/
		Map<String, String> testData = new HashMap<>();
		testData.put("debug", "true");
		HttpRequest request = requestFactory.buildPostRequest(new GenericUrl(TEST_URL), new UrlEncodedContent(testData));
		HttpResponse response = request.execute();
		response.disconnect();
		return ""+response.getStatusCode();
	}
	
	@Path("test")
	@POST
	public String test(String input) {
		System.out.println("received: "+input);
		return input;
	}
}
