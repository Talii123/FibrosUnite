package fibrolamellar.info.models;

import java.util.HashSet;
import java.util.Set;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable
public class FacebookMemberSetJDO {
	@PrimaryKey
	private String _name;
	
	@Persistent(serialized = "true")
	private Set<FacebookUser> _facebookUsers;
	
	public FacebookMemberSetJDO(String aName, Set<FacebookUser> aSetOfFacebookUsers) {
		this._name = aName;
		this._facebookUsers = aSetOfFacebookUsers;
	}
	
	public void updateMemberSet(Set<FacebookUser> aSetOfFacebookUsers) {
		this._facebookUsers = aSetOfFacebookUsers;
	}
	
	public Set<FacebookUser> getMemberSet() {
		Set<FacebookUser> memberSet= new HashSet<FacebookUser>();
		memberSet.addAll(this._facebookUsers);
		return memberSet;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("{")
		.append("\n\t _name: ").append(_name)
		.append("\n\t _facebookUsers: ").append(_facebookUsers)
		.append("\n}");
		return sb.toString();
	}
}
