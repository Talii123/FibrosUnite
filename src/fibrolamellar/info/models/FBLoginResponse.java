package fibrolamellar.info.models;

import java.io.Serializable;

// TODO: make my fields private
public class FBLoginResponse implements Serializable {
	private static final long serialVersionUID = -5143426997422539514L;
	
	public FBLoginStatusEnum status;
	public FBAuthResponse authResponse;
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(this.getClass()).append(" {")
			.append("\n\t status: ").append(status)
			.append("\n\t authResponse: ").append(authResponse)
			.append("\n}");
		return sb.toString();	
	}
}
