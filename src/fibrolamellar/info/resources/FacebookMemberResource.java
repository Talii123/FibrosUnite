package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.*;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheFactory;
import net.sf.jsr107cache.CacheManager;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fibrolamellar.info.models.FacebookMemberSetJDO;
import fibrolamellar.info.models.FacebookUser;
import friedman.tal.util.PMF;


@Path("admin/facebook/members")
public class FacebookMemberResource implements IFacebookMemberResource {
	private static final String FACEBOOK_MEMBERS_CACHE_KEY = "Facebook_Members";
	private static final String FACEBOOK_MEMBERS_DB_KEY = "Facebook_Members";
	
	private static final Logger LOGGER = LoggerFactory.getLogger(FacebookMemberResource.class);
	
	private Cache _cache;
	private final PersistenceManagerFactory _pmf;

	
	public FacebookMemberResource() {
		initCache();
		_pmf = PMF.get();
	}

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getMembersAsString() {
		ensureAdmin();
		Set<FacebookUser> facebookMembers = getMembers();
		return facebookMembers != null ? facebookMembers.toString() : "null";		
	}
		
	

	@GET
	@Path("update")
	@Produces("text/plain")
	@Override	
	public Response getMemberUpdate(@Context HttpServletRequest reqeust) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Tal needs to build this!");
	}

	@POST // should probably be @PUT but don't want to worry about POST overloading to support PUTs from HTML forms
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.TEXT_PLAIN)
	public String updateMembers(@Context HttpServletRequest request, @FormParam("membersJSON") String membersJSON) {
		ensureAdmin();  // check it here regardless of whether or not helper methods check it 
		Set<FacebookUser> facebookUsers = getMembers();
		String result = "OK";
		LOGGER.debug("membersJSON = {}", membersJSON);				
		try {
			ObjectMapper mapper = new ObjectMapper();
			facebookUsers = mapper.readValue(membersJSON, new TypeReference<Set<FacebookUser>>(){});
			LOGGER.debug("facebookUsers = {}", facebookUsers);
			
			boolean isSaved = updateMembers(facebookUsers);
			if (!isSaved) result = "NOT SAVED!";
		} catch (Exception e) {
			System.err.println(e);
			e.printStackTrace(System.err);
			result = e.getMessage();
		}
		
		return result;
	}

	@GET
	@Path("/form")
	@Produces(MediaType.TEXT_HTML)
	public void getMemberUpdateForm(@Context HttpServletRequest request, @Context HttpServletResponse response) throws ServletException, IOException {
		ensureAdmin();
		request.getRequestDispatcher("/WEB-INF/MemberUpdateForm.jsp").include(request, response);
		response.flushBuffer();
	}
	
		
	@Override
	@Deprecated
	// DO NOT USE THIS RIGHT NOW
	//TODO
	public boolean isMemberOfFWU(long anFBUserID) {
		Set<FacebookUser> fbUserSet = getMembers();
		//return notEmpty(fbUserSet) && fbUserSet.contains(o)
		return false;
	}
	

	private void initCache() {
        try {
            CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
            _cache = cacheFactory.createCache(Collections.emptyMap());
        } catch (CacheException e) {
            System.err.println("Unable to create cache :(");
        }		
	}
	
	private boolean updateMembers(Set<FacebookUser> fwuMembers) {
		boolean isSavedToCache = saveMembersToCache(fwuMembers);
		boolean isSavedToDB = saveMembersToDB(fwuMembers);
		return isSavedToCache && isSavedToDB;
	}
	
	private boolean saveMembersToCache(Set<FacebookUser> fwuMembers) {
		boolean isSaved = false;
		LOGGER.debug("Attempting to store facebook member list in CACHE...");
		try {
			_cache.put(FACEBOOK_MEMBERS_CACHE_KEY, fwuMembers);
			isSaved = true;
		} catch (Throwable t) {
			LOGGER.error("caught throwable; t = {}", t);
			t.printStackTrace(System.err);
		}
		System.out.println("Done storing facebook member list in CACHE!");
		return isSaved;
	}
	
	private boolean saveMembersToDB(Set<FacebookUser> facebookMemberSet) {
		LOGGER.debug("Attempting to store facebook member list in DATABASE...");
		PersistenceManager pm = _pmf.getPersistenceManager();
		try {
			FacebookMemberSetJDO fbMemberSetJDO = new FacebookMemberSetJDO(FACEBOOK_MEMBERS_DB_KEY, facebookMemberSet);
			pm.makePersistent(fbMemberSetJDO);
			LOGGER.debug("Done storing facebook member set in DATABASE!");
			return true;
		} catch (Throwable t) {
			t.printStackTrace(System.err);
			return false;
		} finally {
			pm.close();
		}		
	}
	
	private Set<FacebookUser> getMembers() {
		Set<FacebookUser> users = loadMembersFromCache();
		if (notEmpty(users)) {
			users = loadMembersFromDB();
			if (notEmpty(users)) {
				saveMembersToCache(users);
			}
		}
		
		return users;
	}
	
	private Set<FacebookUser> loadMembersFromCache() {
		LOGGER.debug("Attempting to retrieve Facebook members list from CACHE..");
		Set<FacebookUser> facebookMembers = (Set<FacebookUser>)_cache.get(FACEBOOK_MEMBERS_CACHE_KEY);
		LOGGER.debug("Found these facebook members in CACHE: {}", facebookMembers);
		LOGGER.debug("\n Done getting facebook members from CACHE");
		return facebookMembers;		
	}
	
	private Set<FacebookUser> loadMembersFromDB() {
		LOGGER.debug("Attempting to retrieve Facebook members list from DATABASE..");
		PersistenceManager pm = _pmf.getPersistenceManager();
		try {
			FacebookMemberSetJDO memberListJDO = 
					pm.getObjectById(FacebookMemberSetJDO.class, FACEBOOK_MEMBERS_DB_KEY);
			Set<FacebookUser> facebookMembers = memberListJDO.getMemberSet();
			LOGGER.debug("Found these facebook members in DATABASE: {}", facebookMembers);
			System.out.println("\n Done getting facebook members from DATABASE");
			return facebookMembers;
		} catch (JDOObjectNotFoundException e) {
			System.out.println("Caught an exception while trying to retrieve fb users from DB; e = "+e);
			return new HashSet<FacebookUser>();
		} finally {
			pm.close();
		}
	}
	
}
