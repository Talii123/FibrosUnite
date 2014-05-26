package fibrolamellar.info;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import fibrolamellar.info.models.FacebookUser;

public class Membership {
	private static final Logger LOGGER = LoggerFactory.getLogger(Membership.class);
	//private static final String PATH_TO_MEMBERS_JSON = "/WEB-INF/members.json";
	private static Set<String> _MEMBERS;
	
	private static void loadMembers() throws IOException {
		LOGGER.info("begin loadMembers()...");
		if (_MEMBERS == null) {
			synchronized (Membership.class) {
				if (_MEMBERS == null) {
					_MEMBERS = new HashSet<String>();
					/*InputStream in = ClassLoader.getSystemResourceAsStream("huh.txt");
							//Membership.class.getResourceAsStream("/WEB-INF/huh.txt");
					if (in == null) {
						LOGGER.error("Why is it null?!?!");
					}
					BufferedReader reader = new BufferedReader(new InputStreamReader(in));
					String line = reader.readLine();
					while (line != null) {
						LOGGER.debug(line);
						line = reader.readLine();
					}
					String jsonMembers = convertStreamToString(in);
					LOGGER.debug("jsonMembers = "+jsonMembers);*/
					ObjectMapper mapper = new ObjectMapper();
					try {
						List<FacebookUser> facebookUsers = mapper.readValue(new File("/WEB-INF/members.json")/*jsonMembers*/, new TypeReference<List<FacebookUser>>(){});
						LOGGER.debug("facebookUsers.size() is "+ facebookUsers.size());
						for (FacebookUser facebookUser : facebookUsers) {
							LOGGER.debug("user: " + facebookUser.toString());
						}						
					} catch (Exception e) {
						LOGGER.error("{}", e);
					}
				}
			}
		}
		LOGGER.info("done loadMembers()...");
	}
	
	public static void main(String[] args) throws IOException {
		printMembers();
	}
	
	public static void printMembers() throws IOException {
		loadMembers();
	}
}
