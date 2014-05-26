package deprecated.fibrolamellar.info;

import org.jboss.resteasy.client.ProxyFactory;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;

import fibrolamellar.info.requests.IAppAccessTokenRequest;

@Deprecated
public enum DeprecatedRequester {
	INSTANCE;
	
	private static final String GRANT_TYPE = "client_credentials";
	private static final String GRAPH_API_HOST = "https://graph.facebook.com";
	private static final String APP_ID = "496081500497931";
	private static final String APP_SECRET = "14dbaaf13f26edda31f865cf53f44a0b";
	
	private IAppAccessTokenRequest appAccessTokenRequester;
	
	private DeprecatedRequester() {
		RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
		this.appAccessTokenRequester = makeAppAccessTokenRequester();
	}
	
	public String getAppAccessTokenRequest() {
		return this.appAccessTokenRequester.getToken(APP_ID, APP_SECRET, GRANT_TYPE);
	}
	
	private IAppAccessTokenRequest makeAppAccessTokenRequester() {
		return ProxyFactory.create(IAppAccessTokenRequest.class, GRAPH_API_HOST);
	}
	
}
