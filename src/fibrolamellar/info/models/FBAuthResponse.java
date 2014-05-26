package fibrolamellar.info.models;

import java.io.Serializable;

// TODO: make my fields private
public class FBAuthResponse implements Serializable {
	private static final long serialVersionUID = -8055207432468228005L;
	public String accessToken;
	public Short expiresIn;
	public String signedRequest;
	public long userID;

	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(this.getClass()).append(" {")
			.append("\n\t accessToken: ").append(accessToken)
			.append("\n\t expiresIn: ").append(expiresIn)
			.append("\n\t signedRequest: ").append(signedRequest)
			.append("\n\t userID: ").append(userID)
			.append("\n}");
		return sb.toString();	
	}
}
