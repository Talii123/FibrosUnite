package fibrolamellar.info.models;

import java.io.Serializable;

import com.restfb.Facebook;

public class FacebookUser implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6392565955181856845L;
	
	@Facebook
	public boolean administrator;
	
	@Facebook
	public long id;
	
	@Facebook
	public String name;
	
	public FacebookUser() {};
	
	public FacebookUser(long anID, String aName, boolean isAdmin) {
		this.id = anID;
		this.name = aName;
		this.administrator = isAdmin;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("{")
			.append("\n\t id: ").append(id)
			.append("\n\t name: ").append(name)
			.append("\n\t administrator: ").append(administrator)
			.append("\n}");
		
		return sb.toString();
	}
}
