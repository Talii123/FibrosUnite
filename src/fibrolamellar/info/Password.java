package fibrolamellar.info;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Password {
	private static final Logger LOGGER = LoggerFactory.getLogger(Password.class);

	//private static final String THE_PASSWORD = "Welcome 2 Our Community";
	private static final String THE_PASSWORD = "This is only temporary";
	
	public static boolean isValid(String aPassword) {
		LOGGER.debug("checking to see if this password: [{}] is equal to THE password: [{}]", aPassword, THE_PASSWORD);
		return THE_PASSWORD.equals(aPassword);
	}
}
