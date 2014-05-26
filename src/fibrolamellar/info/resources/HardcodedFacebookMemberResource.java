package fibrolamellar.info.resources;

import static friedman.tal.util.Helpers.getRedirectToLoginURL;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.restfb.Connection;

import fibrolamellar.info.AbstractLoginCmd;
import fibrolamellar.info.models.FBAuthResponse;
import fibrolamellar.info.models.FacebookUser;

@Path("admin/facebook/members")
public enum HardcodedFacebookMemberResource implements IFacebookMemberResource {
	INSTANCE;
	
	private final Logger LOGGER = LoggerFactory.getLogger(HardcodedFacebookMemberResource.class);
	
	private Map<Long, FacebookUser> fbUserMap;

	
/*	static {
		createUserMap();
	}*/
	
	private HardcodedFacebookMemberResource() {
		createUserMap();
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getMembers() {
		return fbUserMap.values().toString();
	}
	
	@GET
	@Path("update")
	@Produces(MediaType.TEXT_PLAIN)
	@Override
	public Response getMemberUpdate(@Context HttpServletRequest request) {
		String userInfo = null;
		HttpSession session = request != null ? request.getSession(false) : null;
		if (session != null) {
			FBAuthResponse response = AbstractLoginCmd.getAuthResponseForOwner(session); 
			if (response != null )  {
				userInfo = getMemberUpdate(response.accessToken);
				
			}
		}
		
		if (userInfo != null) {
			return Response.ok(userInfo).build();
		}
		else {
			try {
				return Response.seeOther(new URI(getRedirectToLoginURL(request))).build();	
			} catch (URISyntaxException e) {
				LOGGER.error("Caught exception while trying to redirect to login page.");
				return Response.serverError().build();
			}
			
		}
	}
	
	private String getMemberUpdate(String anAccessToken) {
		Connection<FacebookUser> fbUserConnection  = FacebookRequester.INSTANCE.getMembersUpdate(anAccessToken);
		if (fbUserConnection == null) {
			LOGGER.error("Unable to get members list from Facebook.");
		}
		
		LOGGER.debug("Before update, members count is: {}", fbUserMap.size());
		
		List<FacebookUser> newMembers = new ArrayList<FacebookUser>();
		Map<Long, FacebookUser> latestMemberMap = new HashMap<Long, FacebookUser>();
		
		List<FacebookUser> allMembers =  fbUserConnection.getData();
		LOGGER.debug("allMembers.size is: {}", allMembers.size());
		//List<FacebookUser> allMembers =  FacebookRequester.INSTANCE.getMembersUpdate();
		
		Iterator<FacebookUser> memberIter = allMembers.iterator();
		while (memberIter.hasNext()) {
			FacebookUser fbUser = memberIter.next();
			latestMemberMap.put(fbUser.id, fbUser);
			if (!fbUserMap.containsKey(fbUser.id)) {
				LOGGER.info("Adding new member {}", fbUser);
				newMembers.add(fbUser);
			}
			else {
				LOGGER.trace("Not adding member because they're already listed.  Member = {}", fbUser);
			}			
		}	

		
		/*FacebookUser[] allMembers = FacebookRequester.INSTANCE.getMembersUpdate(accessToken);
		for (int memberIter = 0; memberIter < allMembers.length; memberIter++) {
			FacebookUser fbUser = allMembers[memberIter];
			latestMemberMap.put(fbUser.id, fbUser);
			if (!fbUserMap.containsKey(fbUser.id)) {
				LOGGER.info("Adding new member {}", fbUser);
				fbUserMap.put(fbUser.id, fbUser);
				newMembers.add(fbUser);
			}
			else {
				LOGGER.debug("Not adding member because they're already listed.  Member = {}", fbUser);
			}
		}*/
				
		
		// replace old map so that ex-members are removed
		this.fbUserMap = latestMemberMap;
		LOGGER.debug("After update, members count is: {}", fbUserMap.size());
		
		return "Newly added members: " + newMembers.toString();
		
	}
	
	@Override
	public boolean isMemberOfFWU(long anFBUserID) {
		return fbUserMap.containsKey(anFBUserID);
	}


	private void createUserMap() {
		LOGGER.info("\n\n creating hardcoded static map... \n\n");
		fbUserMap = new HashMap<Long, FacebookUser>();
		
		// paste generated code here...
		fbUserMap.put(1769564097L, new FacebookUser(1769564097L, "Kristy Glatt Harrington", false));
		fbUserMap.put(1057713610L, new FacebookUser(1057713610L, "Theresa Kapler", false));
		fbUserMap.put(1310991560L, new FacebookUser(1310991560L, "Tina Brown", false));
		fbUserMap.put(1082329082L, new FacebookUser(1082329082L, "Renaye Watson-O'neil", false));
		fbUserMap.put(1219325132L, new FacebookUser(1219325132L, "Antony Lake", false));
		fbUserMap.put(1407407271L, new FacebookUser(1407407271L, "Peg Solomon", false));
		fbUserMap.put(524122610L, new FacebookUser(524122610L, "Preston Rey Killian", false));
		fbUserMap.put(20805284L, new FacebookUser(20805284L, "Chris Sweeney", false));
		fbUserMap.put(1557886166L, new FacebookUser(1557886166L, "Jill Pulvermacher", false));
		fbUserMap.put(100001187240557L, new FacebookUser(100001187240557L, "Nancy Houglum Dahling", false));
		fbUserMap.put(1589163029L, new FacebookUser(1589163029L, "Patti Wagner", false));
		fbUserMap.put(800583873L, new FacebookUser(800583873L, "Larry McKenzie", false));
		fbUserMap.put(664408696L, new FacebookUser(664408696L, "Matt Gooch", false));
		fbUserMap.put(100000595168248L, new FacebookUser(100000595168248L, "Ahmed Fadl", false));
		fbUserMap.put(1522977001L, new FacebookUser(1522977001L, "Vanessa Ziegler Achey", false));
		fbUserMap.put(660284460L, new FacebookUser(660284460L, "Amanda Ziegler", false));
		fbUserMap.put(100001048170167L, new FacebookUser(100001048170167L, "Claire Littlefield-Rabun", false));
		fbUserMap.put(100000189877174L, new FacebookUser(100000189877174L, "Steve Jacques", false));
		fbUserMap.put(558125022L, new FacebookUser(558125022L, "Hailey Burge", false));
		fbUserMap.put(100000048343550L, new FacebookUser(100000048343550L, "Amanda Hansen", false));
		fbUserMap.put(641184713L, new FacebookUser(641184713L, "Rachel Mathis", false));
		fbUserMap.put(100000986956199L, new FacebookUser(100000986956199L, "Prateek Joshi", false));
		fbUserMap.put(100000949415668L, new FacebookUser(100000949415668L, "Rosalie Davenport", false));
		fbUserMap.put(1020483220L, new FacebookUser(1020483220L, "Vicki Mills", false));
		fbUserMap.put(1298641192L, new FacebookUser(1298641192L, "Patrick Gorman", false));
		fbUserMap.put(100002051282546L, new FacebookUser(100002051282546L, "Parag Joshi", false));
		fbUserMap.put(1676319822L, new FacebookUser(1676319822L, "Carrie Peterson Stockwell", false));
		fbUserMap.put(1081151694L, new FacebookUser(1081151694L, "Alexie Schneider", false));
		fbUserMap.put(1084320242L, new FacebookUser(1084320242L, "tyler davis", false));
		fbUserMap.put(1463220157L, new FacebookUser(1463220157L, "Emily Shaeffer", false));
		fbUserMap.put(100005313090782L, new FacebookUser(100005313090782L, "Gabby Johnson", false));
		fbUserMap.put(653991984L, new FacebookUser(653991984L, "Sarah Crook", false));
		fbUserMap.put(100002936306410L, new FacebookUser(100002936306410L, "Tadhg Mac Liam", false));
		fbUserMap.put(798782117L, new FacebookUser(798782117L, "Robin Mckenzie", false));
		fbUserMap.put(7939541L, new FacebookUser(7939541L, "Laura Tuten", false));
		fbUserMap.put(57903135L, new FacebookUser(57903135L, "Scott McKenzie", false));
		fbUserMap.put(655917637L, new FacebookUser(655917637L, "Connie Reid", false));
		fbUserMap.put(660134156L, new FacebookUser(660134156L, "Rozlyn Jean McKenzie", false));
		fbUserMap.put(100004404091069L, new FacebookUser(100004404091069L, "Melda Rodriguez", false));
		fbUserMap.put(100007213272360L, new FacebookUser(100007213272360L, "Kelly Lynn", false));
		fbUserMap.put(514068548L, new FacebookUser(514068548L, "Adeel Ghaffar", false));
		fbUserMap.put(1335180056L, new FacebookUser(1335180056L, "Isadora Seibert", false));
		fbUserMap.put(1594714110L, new FacebookUser(1594714110L, "Jessica Funk", false));
		fbUserMap.put(100001103627499L, new FacebookUser(100001103627499L, "Linda J Crosby", false));
		fbUserMap.put(1079663949L, new FacebookUser(1079663949L, "Cindy Lowenthal", false));
		fbUserMap.put(1498093988L, new FacebookUser(1498093988L, "Sherry Shaeffer", false));
		fbUserMap.put(1242758764L, new FacebookUser(1242758764L, "Sallie Woodall Creech", false));
		fbUserMap.put(183401224L, new FacebookUser(183401224L, "Valerie Vinson", false));
		fbUserMap.put(1359506658L, new FacebookUser(1359506658L, "Denys Aldrich", false));
		fbUserMap.put(1434372010L, new FacebookUser(1434372010L, "Chiara Rubertini", false));
		fbUserMap.put(1526838110L, new FacebookUser(1526838110L, "John Schubert", false));
		fbUserMap.put(1390440104L, new FacebookUser(1390440104L, "Rebecca Stempel", false));
		fbUserMap.put(658084572L, new FacebookUser(658084572L, "Carol Steiger Stempel", false));
		fbUserMap.put(1146001463L, new FacebookUser(1146001463L, "Will Easland", false));
		fbUserMap.put(100000169998580L, new FacebookUser(100000169998580L, "Nakita Sindermann", false));
		fbUserMap.put(529366278L, new FacebookUser(529366278L, "Shannon Lynch", false));
		fbUserMap.put(1356764564L, new FacebookUser(1356764564L, "Mary Bourgeois Parham", false));
		fbUserMap.put(855540187L, new FacebookUser(855540187L, "Monique Brigette Woodrow", false));
		fbUserMap.put(100000237158898L, new FacebookUser(100000237158898L, "Theresa McLaughlin", false));
		fbUserMap.put(100000636701690L, new FacebookUser(100000636701690L, "Duana Roegner", false));
		fbUserMap.put(1616568591L, new FacebookUser(1616568591L, "Rebecca Dutton", false));
		fbUserMap.put(1099754652L, new FacebookUser(1099754652L, "Candi K Patterson", false));
		fbUserMap.put(100001951475325L, new FacebookUser(100001951475325L, "Rose Kibbe", false));
		fbUserMap.put(704044358L, new FacebookUser(704044358L, "Karen Critchlow Davis", false));
		fbUserMap.put(5808143L, new FacebookUser(5808143L, "Jaime Lila Losch", false));
		fbUserMap.put(1118830318L, new FacebookUser(1118830318L, "Anne Rippy Turtle", false));
		fbUserMap.put(1410345549L, new FacebookUser(1410345549L, "Lois Patterson", false));
		fbUserMap.put(557440848L, new FacebookUser(557440848L, "Michelle Wilson", false));
		fbUserMap.put(561437486L, new FacebookUser(561437486L, "Kyle Lynch", false));
		fbUserMap.put(100003519514229L, new FacebookUser(100003519514229L, "Matthew Hilton Lynch", false));
		fbUserMap.put(1432411582L, new FacebookUser(1432411582L, "Sofia Godsi", false));
		fbUserMap.put(100000398437686L, new FacebookUser(100000398437686L, "Carla Moore Allen", false));
		fbUserMap.put(540209042L, new FacebookUser(540209042L, "Carisa Flood Vincent", false));
		fbUserMap.put(773348852L, new FacebookUser(773348852L, "Hulya Eler", false));
		fbUserMap.put(1227868424L, new FacebookUser(1227868424L, "Timothy Fenner", false));
		fbUserMap.put(100000978590729L, new FacebookUser(100000978590729L, "Heather Francisco", false));
		fbUserMap.put(1401385445L, new FacebookUser(1401385445L, "Nicky Smith", false));
		fbUserMap.put(1189849137L, new FacebookUser(1189849137L, "Kimberley Smith", false));
		fbUserMap.put(1199044150L, new FacebookUser(1199044150L, "Jacqueline Smith", false));
		fbUserMap.put(100000863397642L, new FacebookUser(100000863397642L, "Martha Anne Shapcott", false));
		fbUserMap.put(891250650L, new FacebookUser(891250650L, "Joey Veloso", false));
		fbUserMap.put(586433796L, new FacebookUser(586433796L, "Devashish Saraswat", false));
		fbUserMap.put(100006364660902L, new FacebookUser(100006364660902L, "Irina Khubuluri", false));
		fbUserMap.put(31200495L, new FacebookUser(31200495L, "Ashley Green", false));
		fbUserMap.put(1208570798L, new FacebookUser(1208570798L, "Gwen Burke Bramlett", false));
		fbUserMap.put(1322472206L, new FacebookUser(1322472206L, "Rachel Holloway Moore", false));
		fbUserMap.put(1397823192L, new FacebookUser(1397823192L, "Angela Link Sullenger", false));
		fbUserMap.put(506926751L, new FacebookUser(506926751L, "Benjamin Sussman", false));
		fbUserMap.put(100000411490812L, new FacebookUser(100000411490812L, "Ann Hennessy O'Leary", false));
		fbUserMap.put(32806268L, new FacebookUser(32806268L, "Jennifer Chan Marcelo", false));
		fbUserMap.put(2203765L, new FacebookUser(2203765L, "Karlo Barrios Marcelo", false));
		fbUserMap.put(5214807L, new FacebookUser(5214807L, "Rachel Wiggins Gilmore", false));
		fbUserMap.put(100000812974835L, new FacebookUser(100000812974835L, "Glenda Klint", false));
		fbUserMap.put(675877904L, new FacebookUser(675877904L, "Margaret LeRoy", false));
		fbUserMap.put(100001438954862L, new FacebookUser(100001438954862L, "Thomas Tillman", false));
		fbUserMap.put(562061097L, new FacebookUser(562061097L, "Carissa-Len Tillman", false));
		fbUserMap.put(779250488L, new FacebookUser(779250488L, "Christine Tillman", false));
		fbUserMap.put(525235357L, new FacebookUser(525235357L, "Jenny Newman", false));
		fbUserMap.put(545662097L, new FacebookUser(545662097L, "Debi Sheehan", false));
		fbUserMap.put(100000049900002L, new FacebookUser(100000049900002L, "Adrian Lewis Jr.", false));
		fbUserMap.put(100003826491187L, new FacebookUser(100003826491187L, "Mick Cotton", false));
		fbUserMap.put(1518859493L, new FacebookUser(1518859493L, "Amelia StClair", false));
		fbUserMap.put(845719356L, new FacebookUser(845719356L, "Nick Howe-Smith", false));
		fbUserMap.put(1433011238L, new FacebookUser(1433011238L, "Duane Eggert", false));
		fbUserMap.put(100005862193762L, new FacebookUser(100005862193762L, "Joanna Al Ghawi", false));
		fbUserMap.put(100002920431106L, new FacebookUser(100002920431106L, "Valeria von Sperling", false));
		fbUserMap.put(1408583156L, new FacebookUser(1408583156L, "Jennifer Spink Strickland", false));
		fbUserMap.put(100000986810264L, new FacebookUser(100000986810264L, "Giovanna Giovanardi", false));
		fbUserMap.put(100006109683740L, new FacebookUser(100006109683740L, "Michelle Bray", false));
		fbUserMap.put(1475155008L, new FacebookUser(1475155008L, "Rita Schexneider", false));
		fbUserMap.put(47914285L, new FacebookUser(47914285L, "Jonathan Schexneider", false));
		fbUserMap.put(100000631044460L, new FacebookUser(100000631044460L, "Maximilian Burdette", false));
		fbUserMap.put(1628430974L, new FacebookUser(1628430974L, "Lizzie Wallace", false));
		fbUserMap.put(689225832L, new FacebookUser(689225832L, "Elizabeth Lessner", false));
		fbUserMap.put(680125067L, new FacebookUser(680125067L, "Ʊ Wayne Brummett Ʊ", false));
		fbUserMap.put(100003934952909L, new FacebookUser(100003934952909L, "Cathy Budlong", false));
		fbUserMap.put(1478357516L, new FacebookUser(1478357516L, "Michelle Palmer", false));
		fbUserMap.put(504138813L, new FacebookUser(504138813L, "Nicole Trimm", false));
		fbUserMap.put(1456354193L, new FacebookUser(1456354193L, "Noelle Woodrow Datta", false));
		fbUserMap.put(751078753L, new FacebookUser(751078753L, "Siobhan Lett", false));
		fbUserMap.put(1192175306L, new FacebookUser(1192175306L, "Tawanda Hudson", false));
		fbUserMap.put(1486956753L, new FacebookUser(1486956753L, "Christina M. Burdette", false));
		fbUserMap.put(729012765L, new FacebookUser(729012765L, "Katie Egle", false));
		fbUserMap.put(1491005514L, new FacebookUser(1491005514L, "San Skemp Crandall", false));
		fbUserMap.put(100000048842975L, new FacebookUser(100000048842975L, "Rosemarie Hirsch von Cannon", false));
		fbUserMap.put(1708952424L, new FacebookUser(1708952424L, "Val Catello", false));
		fbUserMap.put(643045508L, new FacebookUser(643045508L, "Emilie MacFarlane", false));
		fbUserMap.put(1397991708L, new FacebookUser(1397991708L, "Linda McClure", false));
		fbUserMap.put(1298773470L, new FacebookUser(1298773470L, "Lisa Walters", false));
		fbUserMap.put(1467720025L, new FacebookUser(1467720025L, "Joe Pietracatello", false));
		fbUserMap.put(28004219L, new FacebookUser(28004219L, "Megan Rarick", false));
		fbUserMap.put(1289385727L, new FacebookUser(1289385727L, "Ryan Rarick", false));
		fbUserMap.put(510440152L, new FacebookUser(510440152L, "Bill Reid", false));
		fbUserMap.put(1343695469L, new FacebookUser(1343695469L, "Kristy Hammerschmidt-Malecha", false));
		fbUserMap.put(1808957366L, new FacebookUser(1808957366L, "Emily Ann Williams", false));
		fbUserMap.put(566136636L, new FacebookUser(566136636L, "Mike Roest", false));
		fbUserMap.put(100004842880113L, new FacebookUser(100004842880113L, "Virginia Kapinos", false));
		fbUserMap.put(1664464824L, new FacebookUser(1664464824L, "Tiffany Snead Schwantes", false));
		fbUserMap.put(100000645409995L, new FacebookUser(100000645409995L, "Thomas Heavey", false));
		fbUserMap.put(100000894024003L, new FacebookUser(100000894024003L, "Cathleen Kyle", false));
		fbUserMap.put(7916497L, new FacebookUser(7916497L, "Bernie Lee", false));
		fbUserMap.put(1293496068L, new FacebookUser(1293496068L, "Martha Bourgeois", false));
		fbUserMap.put(1349418128L, new FacebookUser(1349418128L, "Stephanie Vogt", false));
		fbUserMap.put(100003317408274L, new FacebookUser(100003317408274L, "Bronte Doyne", false));
		fbUserMap.put(1042342176L, new FacebookUser(1042342176L, "Rebecca Maxwell Stuart", false));
		fbUserMap.put(1580717351L, new FacebookUser(1580717351L, "Amy Malmsten Aleck", false));
		fbUserMap.put(100002647899032L, new FacebookUser(100002647899032L, "Jeff Fryer", false));
		fbUserMap.put(1582406138L, new FacebookUser(1582406138L, "Christine O'Flaherty", false));
		fbUserMap.put(1609316681L, new FacebookUser(1609316681L, "Brooke Koopman", false));
		fbUserMap.put(511985596L, new FacebookUser(511985596L, "Amanda Allen", false));
		fbUserMap.put(515826489L, new FacebookUser(515826489L, "Sadaf Tavakoli", false));
		fbUserMap.put(591403404L, new FacebookUser(591403404L, "Bart Slabbinck", false));
		fbUserMap.put(1388504846L, new FacebookUser(1388504846L, "Lauren Trecosta", false));
		fbUserMap.put(100001956859841L, new FacebookUser(100001956859841L, "Shari Lynn Turner", false));
		fbUserMap.put(790975555L, new FacebookUser(790975555L, "Ashley Kelly", false));
		fbUserMap.put(731294565L, new FacebookUser(731294565L, "Judi Cannon", false));
		fbUserMap.put(10025193L, new FacebookUser(10025193L, "Lisa Krogwold", false));
		fbUserMap.put(522923265L, new FacebookUser(522923265L, "Gail Trecosta", false));
		fbUserMap.put(1364763830L, new FacebookUser(1364763830L, "Deborah T. Hinton", false));
		fbUserMap.put(1607649699L, new FacebookUser(1607649699L, "Elana Simon", false));
		fbUserMap.put(100000595997993L, new FacebookUser(100000595997993L, "Jay Hawthorn", false));
		fbUserMap.put(100002759802890L, new FacebookUser(100002759802890L, "Kristin Parker", false));
		fbUserMap.put(100000421736899L, new FacebookUser(100000421736899L, "Peter Tinella", false));
		fbUserMap.put(100004581194433L, new FacebookUser(100004581194433L, "Georgene Brueland", false));
		fbUserMap.put(10517303L, new FacebookUser(10517303L, "Laura McLaughlin Zale", false));
		fbUserMap.put(100001562368189L, new FacebookUser(100001562368189L, "Billy Cannon", false));
		fbUserMap.put(100001270352995L, new FacebookUser(100001270352995L, "Christi Proctor Benton", false));
		fbUserMap.put(1725477994L, new FacebookUser(1725477994L, "Patsy Self McWhorter", false));
		fbUserMap.put(100001025749206L, new FacebookUser(100001025749206L, "Bonnie Cannon Dunham", false));
		fbUserMap.put(1444392658L, new FacebookUser(1444392658L, "Lou Jean Cannon", false));
		fbUserMap.put(1549263749L, new FacebookUser(1549263749L, "Cindy Cannon", false));
		fbUserMap.put(100001110472536L, new FacebookUser(100001110472536L, "Shandel Bowling", false));
		fbUserMap.put(1473953600L, new FacebookUser(1473953600L, "Derick Williams", false));
		fbUserMap.put(657105653L, new FacebookUser(657105653L, "Cindy Ulrey", false));
		fbUserMap.put(100000244519108L, new FacebookUser(100000244519108L, "Lyssa Williams", false));
		fbUserMap.put(8208310L, new FacebookUser(8208310L, "Shannon Lamond", false));
		fbUserMap.put(708679038L, new FacebookUser(708679038L, "Karen Sewell", false));
		fbUserMap.put(100004437126062L, new FacebookUser(100004437126062L, "Jake Hollingsworth", false));
		fbUserMap.put(100001930234870L, new FacebookUser(100001930234870L, "Jodi Rarick", false));
		fbUserMap.put(100000632281089L, new FacebookUser(100000632281089L, "Janet Budlong", false));
		fbUserMap.put(100004094561140L, new FacebookUser(100004094561140L, "Greg Langford", false));
		fbUserMap.put(100000580044603L, new FacebookUser(100000580044603L, "Maria Chastain Garrett", false));
		fbUserMap.put(100000114337020L, new FacebookUser(100000114337020L, "Stephanie Lowe", false));
		fbUserMap.put(100000531972743L, new FacebookUser(100000531972743L, "Kim Brown Turner", false));
		fbUserMap.put(100000567842017L, new FacebookUser(100000567842017L, "Cathy Salisbury", false));
		fbUserMap.put(748762809L, new FacebookUser(748762809L, "David Langford", false));
		fbUserMap.put(1281912877L, new FacebookUser(1281912877L, "Tammy Jones Jaracz", false));
		fbUserMap.put(100003198242040L, new FacebookUser(100003198242040L, "Jane Byrd Gandy", false));
		fbUserMap.put(100004113455791L, new FacebookUser(100004113455791L, "Ann Karen Flynn", false));
		fbUserMap.put(100002868263422L, new FacebookUser(100002868263422L, "Lorraine Doyne", false));
		fbUserMap.put(65601023L, new FacebookUser(65601023L, "Ellen Casazza", false));
		fbUserMap.put(1368882901L, new FacebookUser(1368882901L, "Tim Weddleton", false));
		fbUserMap.put(591547091L, new FacebookUser(591547091L, "Barry Rook", false));
		fbUserMap.put(1477325040L, new FacebookUser(1477325040L, "Andrea Plauche Bourgeois", false));
		fbUserMap.put(100003074266893L, new FacebookUser(100003074266893L, "Cecilia Williamson Taunton", false));
		fbUserMap.put(1326985921L, new FacebookUser(1326985921L, "Robert Bramlett", false));
		fbUserMap.put(6220696L, new FacebookUser(6220696L, "Leila Green", false));
		fbUserMap.put(1298063497L, new FacebookUser(1298063497L, "Cathy Morris Green", false));
		fbUserMap.put(68125927L, new FacebookUser(68125927L, "Austin Green", false));
		fbUserMap.put(1499232101L, new FacebookUser(1499232101L, "Susan Burke", false));
		fbUserMap.put(100004048360418L, new FacebookUser(100004048360418L, "Jeff Lapinski", false));
		fbUserMap.put(100000051058434L, new FacebookUser(100000051058434L, "Kristina Taber Rawlings", false));
		fbUserMap.put(100001122386224L, new FacebookUser(100001122386224L, "Kyle Edwards", false));
		fbUserMap.put(1708691062L, new FacebookUser(1708691062L, "Susan Millwood Scruggs", false));
		fbUserMap.put(1386487859L, new FacebookUser(1386487859L, "Jon Oeltjenbruns", false));
		fbUserMap.put(100000145705219L, new FacebookUser(100000145705219L, "Pat Corcoran", false));
		fbUserMap.put(802843L, new FacebookUser(802843L, "Rachael Migler", false));
		fbUserMap.put(119087L, new FacebookUser(119087L, "Jenny 'Polonsky' Ingber", false));
		fbUserMap.put(6604987L, new FacebookUser(6604987L, "Nick Fenner", false));
		fbUserMap.put(1302990012L, new FacebookUser(1302990012L, "Dawn Taylor-Ring", false));
		fbUserMap.put(100001110843860L, new FacebookUser(100001110843860L, "David Fenner", false));
		fbUserMap.put(100001093732645L, new FacebookUser(100001093732645L, "Libby Beede-Vreonis", false));
		fbUserMap.put(1292127926L, new FacebookUser(1292127926L, "Ronnie Cooper", false));
		fbUserMap.put(100000641529305L, new FacebookUser(100000641529305L, "Derinna Dine", false));
		fbUserMap.put(100000192611794L, new FacebookUser(100000192611794L, "Lylenette Canfield", false));
		fbUserMap.put(100001250676166L, new FacebookUser(100001250676166L, "Josiah Hardwick", false));
		fbUserMap.put(646553531L, new FacebookUser(646553531L, "Brandon Ellefson", false));
		fbUserMap.put(100000131166717L, new FacebookUser(100000131166717L, "Randy Woodbury", false));
		fbUserMap.put(567335535L, new FacebookUser(567335535L, "Kayla Beckwith", false));
		fbUserMap.put(535010763L, new FacebookUser(535010763L, "Christine Yambrick-Lockhart", false));
		fbUserMap.put(100000837102068L, new FacebookUser(100000837102068L, "Sarah Silverman", false));
		fbUserMap.put(637848790L, new FacebookUser(637848790L, "Robert Lockhart", false));
		fbUserMap.put(1603384137L, new FacebookUser(1603384137L, "Craig Domsitz", false));
		fbUserMap.put(502221658L, new FacebookUser(502221658L, "Jennifer Emery", false));
		fbUserMap.put(100003461128237L, new FacebookUser(100003461128237L, "Star Patch", false));
		fbUserMap.put(1831390958L, new FacebookUser(1831390958L, "Jessica Shepard", false));
		fbUserMap.put(606832547L, new FacebookUser(606832547L, "Jessica Lynn", false));
		fbUserMap.put(637315121L, new FacebookUser(637315121L, "Kati Eggleton", false));
		fbUserMap.put(100000463518082L, new FacebookUser(100000463518082L, "Kyle Reffitt", false));
		fbUserMap.put(100000276091190L, new FacebookUser(100000276091190L, "Rebecca Moggo", false));
		fbUserMap.put(100000186755934L, new FacebookUser(100000186755934L, "Sharon Marsh-Ames", false));
		fbUserMap.put(505177276L, new FacebookUser(505177276L, "June Dugan", false));
		fbUserMap.put(1550054621L, new FacebookUser(1550054621L, "Stacy Michelle Bidstrup", false));
		fbUserMap.put(100000216427169L, new FacebookUser(100000216427169L, "Cassy Overmyer Ames", false));
		fbUserMap.put(100001027297210L, new FacebookUser(100001027297210L, "Freddie Apps", false));
		fbUserMap.put(1241396583L, new FacebookUser(1241396583L, "James Apps Jr", false));
		fbUserMap.put(100000172071820L, new FacebookUser(100000172071820L, "Jacob Apps", false));
		fbUserMap.put(100002540741498L, new FacebookUser(100002540741498L, "Judy Apps", false));
		fbUserMap.put(100000172525685L, new FacebookUser(100000172525685L, "Michelle Wiggins", false));
		fbUserMap.put(100000227566420L, new FacebookUser(100000227566420L, "Connie Wallace Wagner", false));
		fbUserMap.put(1144764367L, new FacebookUser(1144764367L, "Brittany Reynolds Nemkovich", false));
		fbUserMap.put(1188823609L, new FacebookUser(1188823609L, "Brandy Lynn Moon", false));
		fbUserMap.put(1635595602L, new FacebookUser(1635595602L, "Dawn Akrie-Edwards", false));
		fbUserMap.put(100000403815001L, new FacebookUser(100000403815001L, "Laura Imperia O'Malley", false));
		fbUserMap.put(506389719L, new FacebookUser(506389719L, "Michael Waitforit Stowell", false));
		fbUserMap.put(661461188L, new FacebookUser(661461188L, "Shaun Doyle", false));
		fbUserMap.put(100002140887682L, new FacebookUser(100002140887682L, "Tom Neiwirth", false));
		fbUserMap.put(113000294L, new FacebookUser(113000294L, "Matt Cler", false));
		fbUserMap.put(546007992L, new FacebookUser(546007992L, "William F Beermann", false));
		fbUserMap.put(100002676469869L, new FacebookUser(100002676469869L, "Brandy Black", false));
		fbUserMap.put(100000185054013L, new FacebookUser(100000185054013L, "Kirk Stowell", false));
		fbUserMap.put(740411254L, new FacebookUser(740411254L, "Anne Adler", false));
		fbUserMap.put(100000654085658L, new FacebookUser(100000654085658L, "Jessica Glatt", false));
		fbUserMap.put(1613332723L, new FacebookUser(1613332723L, "Theodoros Porfyridis", false));
		fbUserMap.put(574775361L, new FacebookUser(574775361L, "Matt Pockrandt", false));
		fbUserMap.put(611220536L, new FacebookUser(611220536L, "Josh Fletcher", false));
		fbUserMap.put(502962330L, new FacebookUser(502962330L, "Kirk Stowell II", false));
		fbUserMap.put(100000221622174L, new FacebookUser(100000221622174L, "Laurie Apps", false));
		fbUserMap.put(1705411294L, new FacebookUser(1705411294L, "Chris Turner", false));
		fbUserMap.put(687950693L, new FacebookUser(687950693L, "Aaron Edquist", false));
		fbUserMap.put(1640566755L, new FacebookUser(1640566755L, "Tom Allison", false));
		fbUserMap.put(698906436L, new FacebookUser(698906436L, "Selena Marie", false));
		fbUserMap.put(1368315627L, new FacebookUser(1368315627L, "Julie Roberts Buckner", false));
		fbUserMap.put(1211037990L, new FacebookUser(1211037990L, "Will Harris", false));
		fbUserMap.put(1794708627L, new FacebookUser(1794708627L, "Melinda Violante", false));
		fbUserMap.put(1302580163L, new FacebookUser(1302580163L, "Holly Hahn Krueger", false));
		fbUserMap.put(1541320673L, new FacebookUser(1541320673L, "Trina Walker Turner", false));
		fbUserMap.put(1818276281L, new FacebookUser(1818276281L, "Kathy Schubert", false));
		fbUserMap.put(1806187929L, new FacebookUser(1806187929L, "Sheila Alexander", false));
		fbUserMap.put(1667675875L, new FacebookUser(1667675875L, "Terra Goudge", false));
		fbUserMap.put(501579892L, new FacebookUser(501579892L, "Elisabeth Rippy", false));
		fbUserMap.put(507035059L, new FacebookUser(507035059L, "Heather Steger", false));
		fbUserMap.put(1507129319L, new FacebookUser(1507129319L, "George N Terrianne Flynn-Bowen", false));
		fbUserMap.put(1432125656L, new FacebookUser(1432125656L, "Hannah Cork", false));
		fbUserMap.put(570407483L, new FacebookUser(570407483L, "Charles Beermann", false));
		fbUserMap.put(100000464749112L, new FacebookUser(100000464749112L, "Vickie Boone", false));
		fbUserMap.put(1686044744L, new FacebookUser(1686044744L, "Pam Danner", false));
		fbUserMap.put(1574093576L, new FacebookUser(1574093576L, "Kelly Russell", false));
		fbUserMap.put(582708746L, new FacebookUser(582708746L, "Michelle Desmond", false));
		fbUserMap.put(1611943985L, new FacebookUser(1611943985L, "Wendy Mayo", false));
		fbUserMap.put(1586884018L, new FacebookUser(1586884018L, "Georgine Bagnato", false));
		fbUserMap.put(1041334217L, new FacebookUser(1041334217L, "Kerri Jane Hebert", false));
		fbUserMap.put(100000539642179L, new FacebookUser(100000539642179L, "Joe Bagnato", false));
		fbUserMap.put(100001951861387L, new FacebookUser(100001951861387L, "Tiffany Hinton Gilmore", false));
		fbUserMap.put(100000101374278L, new FacebookUser(100000101374278L, "Judy Hinton", false));
		fbUserMap.put(1533591965L, new FacebookUser(1533591965L, "Jeremiah Joseph Vizzo", false));
		fbUserMap.put(78201179L, new FacebookUser(78201179L, "Natalie Walker Ward", false));
		fbUserMap.put(671101613L, new FacebookUser(671101613L, "Nel Andrews", false));
		fbUserMap.put(573096018L, new FacebookUser(573096018L, "Hugh Teegan", false));
		fbUserMap.put(589171151L, new FacebookUser(589171151L, "Toni Roberts Pimentel", false));
		fbUserMap.put(2722446L, new FacebookUser(2722446L, "Sara McClain", false));
		fbUserMap.put(1647603740L, new FacebookUser(1647603740L, "Sandy Simon", false));
		fbUserMap.put(603926848L, new FacebookUser(603926848L, "Sean Kaufman", false));
		fbUserMap.put(667970175L, new FacebookUser(667970175L, "Kirsty Cotton", false));
		fbUserMap.put(737323300L, new FacebookUser(737323300L, "Alberto Tuñón", false));
		fbUserMap.put(100001400685984L, new FacebookUser(100001400685984L, "Erin Brueland", false));
		fbUserMap.put(329900005L, new FacebookUser(329900005L, "Carrie Reiners", false));
		fbUserMap.put(100001840177509L, new FacebookUser(100001840177509L, "Amy Kaufman", false));
		fbUserMap.put(693903335L, new FacebookUser(693903335L, "Shauna Klassen", false));
		fbUserMap.put(46204674L, new FacebookUser(46204674L, "Teresa E Manning", false));
		fbUserMap.put(100002611123098L, new FacebookUser(100002611123098L, "Mark Anthony Smith Jr.", false));
		fbUserMap.put(1522369988L, new FacebookUser(1522369988L, "Cathleen Murphy Watson", false));
		fbUserMap.put(1460233931L, new FacebookUser(1460233931L, "Angela Tinella Larue", false));
		fbUserMap.put(1418863197L, new FacebookUser(1418863197L, "Li Sweet", false));
		fbUserMap.put(516993205L, new FacebookUser(516993205L, "Courtney Robinson", false));
		fbUserMap.put(1461974155L, new FacebookUser(1461974155L, "Amanda Russell", false));
		fbUserMap.put(1193691626L, new FacebookUser(1193691626L, "Tracy A Hollum", false));
		fbUserMap.put(580455248L, new FacebookUser(580455248L, "Tiffanie Duke", false));
		fbUserMap.put(100002540547579L, new FacebookUser(100002540547579L, "Gay Horsfield", false));
		fbUserMap.put(629781846L, new FacebookUser(629781846L, "Aimee Elizabeth", false));
		fbUserMap.put(18400576L, new FacebookUser(18400576L, "Ryan Stoker", false));
		fbUserMap.put(100001060878162L, new FacebookUser(100001060878162L, "Joyce Simpson", false));
		fbUserMap.put(100000166871194L, new FacebookUser(100000166871194L, "Lori Hollingsworth Hinton", false));
		fbUserMap.put(1279564284L, new FacebookUser(1279564284L, "Jennifer Nolf-Jean", false));
		fbUserMap.put(100000487104365L, new FacebookUser(100000487104365L, "Frances Kay Huffman", false));
		fbUserMap.put(1378524088L, new FacebookUser(1378524088L, "Katie Jenkins Shaffer", false));
		fbUserMap.put(1313448910L, new FacebookUser(1313448910L, "J Bennett Cole", false));
		fbUserMap.put(1173067231L, new FacebookUser(1173067231L, "Suzy Watson Vinson", false));
		fbUserMap.put(100000281550753L, new FacebookUser(100000281550753L, "Darci Findley", false));
		fbUserMap.put(1324286981L, new FacebookUser(1324286981L, "Lacy Lane", false));
		fbUserMap.put(1233240124L, new FacebookUser(1233240124L, "Nina Boylan", false));
		fbUserMap.put(1499314860L, new FacebookUser(1499314860L, "Melissa Findley", false));
		fbUserMap.put(1005180283L, new FacebookUser(1005180283L, "Liza Findley", false));
		fbUserMap.put(100000027237567L, new FacebookUser(100000027237567L, "Lisa Schuler", false));
		fbUserMap.put(100000435194626L, new FacebookUser(100000435194626L, "Shelly McElwee Mabery", false));
		fbUserMap.put(1559894674L, new FacebookUser(1559894674L, "Kayte Hollingsworth", false));
		fbUserMap.put(100001126421362L, new FacebookUser(100001126421362L, "Beth Webb Pothast", false));
		fbUserMap.put(100000915612056L, new FacebookUser(100000915612056L, "Zach Grullon", false));
		fbUserMap.put(1526778453L, new FacebookUser(1526778453L, "Sandy Hawthorn", true));
		fbUserMap.put(1320529520L, new FacebookUser(1320529520L, "April Faircloth Grullon", false));
		fbUserMap.put(681709199L, new FacebookUser(681709199L, "Kellie Grogan", false));
		fbUserMap.put(655080005L, new FacebookUser(655080005L, "Autumn Smith", false));
		fbUserMap.put(1166246483L, new FacebookUser(1166246483L, "Lynn Guerrieri O'Malley", false));
		fbUserMap.put(546561654L, new FacebookUser(546561654L, "Marna Olsen Davis", false));
		fbUserMap.put(657430672L, new FacebookUser(657430672L, "Debbie Marston", false));
		fbUserMap.put(1174191029L, new FacebookUser(1174191029L, "Naomi Glynn", false));
		fbUserMap.put(1425364464L, new FacebookUser(1425364464L, "Lisa Rebekah", false));
		fbUserMap.put(1626669370L, new FacebookUser(1626669370L, "Becky Scroggs Garrett", false));
		fbUserMap.put(10205206L, new FacebookUser(10205206L, "Alisha Anne", false));
		fbUserMap.put(1359338069L, new FacebookUser(1359338069L, "Alison Stone", false));
		fbUserMap.put(594111927L, new FacebookUser(594111927L, "Rachel Evans", false));
		fbUserMap.put(694956781L, new FacebookUser(694956781L, "Jenna Moloney", false));
		fbUserMap.put(1372148375L, new FacebookUser(1372148375L, "Kelly Langford", false));
		fbUserMap.put(686292703L, new FacebookUser(686292703L, "Tracy Crouse Oeltjenbruns", true));
		fbUserMap.put(1575316750L, new FacebookUser(1575316750L, "Ashley Summerlin Murphy", false));
		fbUserMap.put(732992020L, new FacebookUser(732992020L, "Dave Day", false));
		fbUserMap.put(1595106785L, new FacebookUser(1595106785L, "Nicolas Flamerie de Lachapelle", false));
		fbUserMap.put(616585219L, new FacebookUser(616585219L, "Casey Allison O'Callaghan", false));
		fbUserMap.put(677682091L, new FacebookUser(677682091L, "Tabitha Dickinson", false));
		fbUserMap.put(697958408L, new FacebookUser(697958408L, "Tal Friedman", true));		
		LOGGER.info("\n\n done populating static map\n\n");	
	}
}
