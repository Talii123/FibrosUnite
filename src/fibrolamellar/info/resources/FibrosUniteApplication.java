package fibrolamellar.info.resources;

import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import friedman.tal.BaseApplication;

public class FibrosUniteApplication extends BaseApplication {
	private static final Logger LOGGER = LoggerFactory.getLogger(FibrosUniteApplication.class);
	
	private static final boolean USE_HARDCODED = true;
	
	//private static FibrosUniteApplication theApplication;
	private static LoginResource theLoginResource;
	private static IFacebookMemberResource theFBMemberResource; 
	

	public FibrosUniteApplication() {
		Set<Object> singletonsSet = new HashSet<Object>();
		singletonsSet.add(new DiscoverResource());
		if (!USE_HARDCODED)
			theFBMemberResource = new FacebookMemberResource();
		else
			theFBMemberResource =  HardcodedFacebookMemberResource.INSTANCE;
		singletonsSet.add(theFBMemberResource);
		
		theLoginResource = new LoginResource(); 
		singletonsSet.add(theLoginResource);
		
		singletonsSet.add(new AdminResource());
		singletonsSet.add(new MapResource());
		
		//singletonsSet.add(new DummyResource());
		
		LOGGER.info("setting singletons to: {}", singletonsSet);
		super.setSingletons(singletonsSet);
		
		//theApplication = this;
	}
	
	public static LoginResource getLoginResource() {
		return theLoginResource;
	}
	
	public static IFacebookMemberResource getFBMemberResource() {
		return theFBMemberResource;
	}
	
}
