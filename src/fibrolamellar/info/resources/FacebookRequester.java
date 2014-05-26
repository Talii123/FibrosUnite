package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.*;

import java.util.Collections;
import java.util.List;

import org.slf4j.LoggerFactory;

import org.slf4j.Logger;

import com.restfb.Connection;
import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.FacebookClient.AccessToken;
import com.restfb.FacebookClient.DebugTokenInfo;

import fibrolamellar.info.models.FacebookUser;

public enum FacebookRequester {
	INSTANCE;
	
	private static final String APP_ID = "496081500497931";
	private static final String APP_SECRET = "14dbaaf13f26edda31f865cf53f44a0b";
	private static final String FWU_GROUP_ID = "107198479334411";
	
	private final Logger LOGGER;
	
	private FacebookClient _fbClient;
	private AccessToken _appAccessToken;
	
	private FacebookRequester() {
		LOGGER = LoggerFactory.getLogger(FacebookRequester.class);
		initFBClient();
	}
		
	private void initFBClient() {
		LOGGER.debug("Initializing Facebook client..");
		refreshFBClientAndToken();
	}
	
	public boolean isValidTokenForUser(String inputToken, String anFBUserID) {
		LOGGER.info("running isValidTokenForUser({}, {})... ", inputToken, anFBUserID);
		if (inputToken == null || anFBUserID == null) return false;
		
		ensureAppAccessTokenIsValid();  // get debugToken() method will make a call to FB under the covers
		
		DebugTokenInfo tokenInfo =  this._fbClient.debugToken(inputToken);
		return tokenInfo.isValid() &&
				isExpired(tokenInfo.getExpiresAt()) && 
				anFBUserID.trim().equals(tokenInfo.getUserId());
	}
	
	//FacebookUser[] getMembersUpdate(String anAccessToken) {
	Connection<FacebookUser> getMembersUpdate(String anAccessToken) {
		FacebookClient fbClient = new DefaultFacebookClient(anAccessToken);
		//return fbClient.fetchObject(FWU_GROUP_ID + "/members", FacebookUser[].class);
		return fbClient.fetchConnection("/" +FWU_GROUP_ID + "/members", FacebookUser.class);
	}
	
	
	private void refreshFBClientAndToken() {
		LOGGER.info("refreshing facebook client and token... ");
		this._fbClient = new DefaultFacebookClient();
		this._appAccessToken =  this._fbClient.obtainAppAccessToken(APP_ID, APP_SECRET);
		this._fbClient = new DefaultFacebookClient(this._appAccessToken.getAccessToken());
	}

	private void ensureAppAccessTokenIsValid() {
		LOGGER.info("refreshing facebook client and token... ");
		if (isNewAppAccessTokenNeeded()) {
			LOGGER.info("new app access token is needed...");
			refreshFBClientAndToken();
		}
	}
	
	private boolean isNewAppAccessTokenNeeded() {
		return this._appAccessToken == null || isExpired(this._appAccessToken.getExpires());
	}
}
