package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.extractParamValue;
import fibrolamellar.info.Constants;

public class BaseResource {

	public BaseResource() {
		super();
	}

	protected String getNextPageURL(String body) {
		String nextPageURL = extractParamValue(body, Constants.NEXT_PAGE_PARAM_NAME);
		nextPageURL = nextPageURL.length() > 0 ? nextPageURL : Constants.DEFAULT_NEXT_PAGE_URL;
		return nextPageURL;
	}

}