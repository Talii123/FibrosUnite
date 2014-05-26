package fibrolamellar.info;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class PasswordLoginCmd extends AbstractLoginCmd {
	private static final Logger LOGGER = LoggerFactory.getLogger(PasswordLoginCmd.class);
	
	private final String _password;
	
	public PasswordLoginCmd(HttpServletRequest request, HttpServletResponse response, String aPassword) {
		super(request, response);
		
		this._password = aPassword != null ? aPassword.trim().replace('+', ' ') : "";
	}
	
	@Override
	public boolean doLogin() {
		boolean isLoginSuccessful = false;
		if (Password.isValid(this._password)) {
			LOGGER.debug("Password is valid.  Going to create a new session now.");
			createNewSession(null);
			isLoginSuccessful = true;
		}
		else {
			LOGGER.debug("Password is NOT valid. NOT creating a session now.");
		}
		return isLoginSuccessful;
	}

}
