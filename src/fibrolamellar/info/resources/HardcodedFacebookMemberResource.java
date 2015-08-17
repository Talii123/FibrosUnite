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
		fbUserMap.put(1520039448281743L, new FacebookUser(1520039448281743L, "Tom Stockwell", false));
		fbUserMap.put(790023501050295L, new FacebookUser(790023501050295L, "Josh Johnson", false));
		fbUserMap.put(10153402712928835L, new FacebookUser(10153402712928835L, "Christina Ayala", false));
		fbUserMap.put(274795269379411L, new FacebookUser(274795269379411L, "Court Kev Janz", false));
		fbUserMap.put(10203971957757415L, new FacebookUser(10203971957757415L, "Lisa Huseman Nichols", false));
		fbUserMap.put(10152954670493824L, new FacebookUser(10152954670493824L, "Gavin Daly", false));
		fbUserMap.put(10205232666314201L, new FacebookUser(10205232666314201L, "Linzy Staples Dean", false));
		fbUserMap.put(267028476837189L, new FacebookUser(267028476837189L, "Missa JB", false));
		fbUserMap.put(379134475585439L, new FacebookUser(379134475585439L, "Madelynn Moore", false));
		fbUserMap.put(953762434651137L, new FacebookUser(953762434651137L, "Rose Ann Jones", false));
		fbUserMap.put(10154984992905311L, new FacebookUser(10154984992905311L, "Susan Rice", false));
		fbUserMap.put(562597940529296L, new FacebookUser(562597940529296L, "Kimberly D. Mons", false));
		fbUserMap.put(10152981509923413L, new FacebookUser(10152981509923413L, "Rachel Kalb Padilla", false));
		fbUserMap.put(10152993927804973L, new FacebookUser(10152993927804973L, "Angelina Mae", false));
		fbUserMap.put(10205097458373516L, new FacebookUser(10205097458373516L, "Rosemary Kelly", false));
		fbUserMap.put(10152851710800797L, new FacebookUser(10152851710800797L, "Dawn McQuinn", false));
		fbUserMap.put(1010948748920194L, new FacebookUser(1010948748920194L, "Bilal Sadıkoğlu", false));
		fbUserMap.put(432026360270444L, new FacebookUser(432026360270444L, "Alexander Bear", false));
		fbUserMap.put(10153492833109012L, new FacebookUser(10153492833109012L, "Tahnee Shah", false));
		fbUserMap.put(10101661903294377L, new FacebookUser(10101661903294377L, "Shelli Galati", false));
		fbUserMap.put(10100478822567876L, new FacebookUser(10100478822567876L, "Pat McDonough", false));
		fbUserMap.put(10152655396653795L, new FacebookUser(10152655396653795L, "Kyle W Strickland", false));
		fbUserMap.put(10205489505541579L, new FacebookUser(10205489505541579L, "Jovanny Arredondo", false));
		fbUserMap.put(754917021266022L, new FacebookUser(754917021266022L, "Patrick Hirst", false));
		fbUserMap.put(1522084628062988L, new FacebookUser(1522084628062988L, "Jim Goudge", false));
		fbUserMap.put(4975005229560L, new FacebookUser(4975005229560L, "Kevin D Jacobson", false));
		fbUserMap.put(4964725371463L, new FacebookUser(4964725371463L, "Ashley C Widener", false));
		fbUserMap.put(10152886750465926L, new FacebookUser(10152886750465926L, "Katie Frontz", false));
		fbUserMap.put(10101896232426829L, new FacebookUser(10101896232426829L, "Colleen Hirst", false));
		fbUserMap.put(10205748375372695L, new FacebookUser(10205748375372695L, "Mary Hendrix", false));
		fbUserMap.put(10152521913798299L, new FacebookUser(10152521913798299L, "Angelique Lynch", false));
		fbUserMap.put(765188070185018L, new FacebookUser(765188070185018L, "Uljana Miller", false));
		fbUserMap.put(519171961550001L, new FacebookUser(519171961550001L, "Stefanie Carter", false));
		fbUserMap.put(351429075034219L, new FacebookUser(351429075034219L, "Idania Ceron", false));
		fbUserMap.put(10203676255854934L, new FacebookUser(10203676255854934L, "Isabella Bailey", false));
		fbUserMap.put(426303410856603L, new FacebookUser(426303410856603L, "Cyndi Wade", false));
		fbUserMap.put(10152395695846419L, new FacebookUser(10152395695846419L, "Ann-Marie McDonough", false));
		fbUserMap.put(10152650697903565L, new FacebookUser(10152650697903565L, "Chrystal Leann", false));
		fbUserMap.put(10204524205858232L, new FacebookUser(10204524205858232L, "Nancy Gilbert Jacques", false));
		fbUserMap.put(10204691344990687L, new FacebookUser(10204691344990687L, "Alyssa Hernandez", false));
		fbUserMap.put(4857936382326L, new FacebookUser(4857936382326L, "Carol Christiansen", false));
		fbUserMap.put(10203193822474103L, new FacebookUser(10203193822474103L, "Miranda Christiansen", false));
		fbUserMap.put(664484006979492L, new FacebookUser(664484006979492L, "Glenn Murphy", false));
		fbUserMap.put(909934645684064L, new FacebookUser(909934645684064L, "LaDonna Jones Murphy", false));
		fbUserMap.put(10152909299539719L, new FacebookUser(10152909299539719L, "Michelle Bray", false));
		fbUserMap.put(10205673339171591L, new FacebookUser(10205673339171591L, "Michael David Matthews", false));
		fbUserMap.put(10204573633494863L, new FacebookUser(10204573633494863L, "Joyce Labbe Matthews", false));
		fbUserMap.put(10204495543821875L, new FacebookUser(10204495543821875L, "Mike Adriance", false));
		fbUserMap.put(10152885307483151L, new FacebookUser(10152885307483151L, "Anna Adamthwaite", false));
		fbUserMap.put(893045414047032L, new FacebookUser(893045414047032L, "Linda Reilly Tormey", false));
		fbUserMap.put(10152807576035306L, new FacebookUser(10152807576035306L, "Katalja Harrington", false));
		fbUserMap.put(10204722006443061L, new FacebookUser(10204722006443061L, "Tania Matthews Adriance", false));
		fbUserMap.put(10203155094823010L, new FacebookUser(10203155094823010L, "Stacy Seibert", false));
		fbUserMap.put(10100737566918714L, new FacebookUser(10100737566918714L, "Meghan Killian", false));
		fbUserMap.put(976030719078121L, new FacebookUser(976030719078121L, "Suzanne Dupont Mahoney", false));
		fbUserMap.put(10152553308599175L, new FacebookUser(10152553308599175L, "Angela Saviano Sander", false));
		fbUserMap.put(10203895972749704L, new FacebookUser(10203895972749704L, "Justin Saxton", false));
		fbUserMap.put(926711320679995L, new FacebookUser(926711320679995L, "Jeffrey Y. Shapcott", false));
		fbUserMap.put(1515507178701195L, new FacebookUser(1515507178701195L, "Caroline Taunton", false));
		fbUserMap.put(10203198912307067L, new FacebookUser(10203198912307067L, "Joyce Mahaney Brewster", false));
		fbUserMap.put(384642255007706L, new FacebookUser(384642255007706L, "Nancianne Moore", false));
		fbUserMap.put(859827477364985L, new FacebookUser(859827477364985L, "Cathy Froese Mueller", false));
		fbUserMap.put(10152412837630903L, new FacebookUser(10152412837630903L, "Tim Widener", false));
		fbUserMap.put(10204020831546843L, new FacebookUser(10204020831546843L, "Courtney Brewster", false));
		fbUserMap.put(10202362735286729L, new FacebookUser(10202362735286729L, "Jen Zander", false));
		fbUserMap.put(846997191979084L, new FacebookUser(846997191979084L, "Kayla Arredondo", false));
		fbUserMap.put(10205551217570567L, new FacebookUser(10205551217570567L, "Sasha Watson", false));
		fbUserMap.put(765106573544340L, new FacebookUser(765106573544340L, "Chris Watson", false));
		fbUserMap.put(857102344311881L, new FacebookUser(857102344311881L, "Karen Tremper Dolly", false));
		fbUserMap.put(10204735583923430L, new FacebookUser(10204735583923430L, "Anne Leslie Albers", false));
		fbUserMap.put(530845587033121L, new FacebookUser(530845587033121L, "Nicole Jacques", false));
		fbUserMap.put(10203447353973621L, new FacebookUser(10203447353973621L, "Robert Stockwell", false));
		fbUserMap.put(10154207611605497L, new FacebookUser(10154207611605497L, "Laura Stockwell", false));
		fbUserMap.put(773519229349953L, new FacebookUser(773519229349953L, "Sara Stockwell", false));
		fbUserMap.put(10202920530149102L, new FacebookUser(10202920530149102L, "Teresa Stafford", false));
		fbUserMap.put(10201594830867363L, new FacebookUser(10201594830867363L, "Roni Pence", false));
		fbUserMap.put(983012138382521L, new FacebookUser(983012138382521L, "Troy Colvin Jr.", false));
		fbUserMap.put(1515134672098612L, new FacebookUser(1515134672098612L, "Lorraine Jones", false));
		fbUserMap.put(10152720163219674L, new FacebookUser(10152720163219674L, "Emily Chislett", false));
		fbUserMap.put(4283067372791L, new FacebookUser(4283067372791L, "Kristy Glatt Harrington", false));
		fbUserMap.put(10202835927393396L, new FacebookUser(10202835927393396L, "Theresa Kapler", false));
		fbUserMap.put(10201852194809138L, new FacebookUser(10201852194809138L, "Tina Brown", false));
		fbUserMap.put(10204850639920770L, new FacebookUser(10204850639920770L, "Renaye Watson-O'neil", false));
		fbUserMap.put(10205472962603015L, new FacebookUser(10205472962603015L, "Antony Lake", false));
		fbUserMap.put(10205503074322058L, new FacebookUser(10205503074322058L, "Peg Solomon", false));
		fbUserMap.put(10152105526132611L, new FacebookUser(10152105526132611L, "Preston Rey Killian", false));
		fbUserMap.put(10100286426645709L, new FacebookUser(10100286426645709L, "Chris Sweeney", false));
		fbUserMap.put(10205294336788766L, new FacebookUser(10205294336788766L, "Jill Pulvermacher", false));
		fbUserMap.put(794244803958420L, new FacebookUser(794244803958420L, "Nancy Houglum Dahling", false));
		fbUserMap.put(10204731430517504L, new FacebookUser(10204731430517504L, "Patti Wagner", false));
		fbUserMap.put(10152921970663874L, new FacebookUser(10152921970663874L, "Larry McKenzie", false));
		fbUserMap.put(10152582096313697L, new FacebookUser(10152582096313697L, "Matt Gooch", false));
		fbUserMap.put(931801143516382L, new FacebookUser(931801143516382L, "Ahmed Fadl", false));
		fbUserMap.put(10204415432655548L, new FacebookUser(10204415432655548L, "Vanessa Ziegler Achey", false));
		fbUserMap.put(10152903905474461L, new FacebookUser(10152903905474461L, "Amanda Ziegler Hcc Fight", false));
		fbUserMap.put(870329469678651L, new FacebookUser(870329469678651L, "Claire Littlefield-Rabun", false));
		fbUserMap.put(857848890898099L, new FacebookUser(857848890898099L, "Steve Jacques", false));
		fbUserMap.put(10154951179705023L, new FacebookUser(10154951179705023L, "Hailey Burge", false));
		fbUserMap.put(776029012408703L, new FacebookUser(776029012408703L, "Amanda Hansen", false));
		fbUserMap.put(10152540637989714L, new FacebookUser(10152540637989714L, "Rachel McKenzie", false));
		fbUserMap.put(714102908632601L, new FacebookUser(714102908632601L, "Prateek Joshi", false));
		fbUserMap.put(10202945922901974L, new FacebookUser(10202945922901974L, "Vicki Mills", false));
		fbUserMap.put(2476884163643L, new FacebookUser(2476884163643L, "Patrick Gorman", false));
		fbUserMap.put(659576177454086L, new FacebookUser(659576177454086L, "Parag Joshi", false));
		fbUserMap.put(10152371154501921L, new FacebookUser(10152371154501921L, "Ruth Davenport", false));
		fbUserMap.put(10201423681388748L, new FacebookUser(10201423681388748L, "Carrie Peterson Stockwell", false));
		fbUserMap.put(10202684419766581L, new FacebookUser(10202684419766581L, "Alexie Schneider", false));
		fbUserMap.put(10202908828096755L, new FacebookUser(10202908828096755L, "tyler davis", false));
		fbUserMap.put(10203341050634678L, new FacebookUser(10203341050634678L, "Emily Shaeffer", false));
		fbUserMap.put(265476930306075L, new FacebookUser(265476930306075L, "Gabby Johnson", false));
		fbUserMap.put(10152223273851985L, new FacebookUser(10152223273851985L, "Sarah Crook", false));
		fbUserMap.put(707145796059957L, new FacebookUser(707145796059957L, "Tadhg Mac Liam", false));
		fbUserMap.put(10152446430022118L, new FacebookUser(10152446430022118L, "Robin Mckenzie", false));
		fbUserMap.put(10105359329722150L, new FacebookUser(10105359329722150L, "Laura Tuten", false));
		fbUserMap.put(857988138310L, new FacebookUser(857988138310L, "Scott McKenzie", false));
		fbUserMap.put(10152276975872638L, new FacebookUser(10152276975872638L, "Connie Reid", false));
		fbUserMap.put(10152168908514157L, new FacebookUser(10152168908514157L, "Rozlyn Jean McKenzie", false));
		fbUserMap.put(405650696258397L, new FacebookUser(405650696258397L, "Melda Rodriguez", false));
		fbUserMap.put(1526867754230319L, new FacebookUser(1526867754230319L, "Kelly Lynn", false));
		fbUserMap.put(10152579372668549L, new FacebookUser(10152579372668549L, "Adeel Ghaffar", false));
		fbUserMap.put(2661856429052L, new FacebookUser(2661856429052L, "Isadora Seibert", false));
		fbUserMap.put(10203019114550860L, new FacebookUser(10203019114550860L, "Jessica Funk", false));
		fbUserMap.put(831030520277061L, new FacebookUser(831030520277061L, "Linda J Crosby", false));
		fbUserMap.put(10203012335404217L, new FacebookUser(10203012335404217L, "Cindy Lowenthal", false));
		fbUserMap.put(10202074911943164L, new FacebookUser(10202074911943164L, "Sherry Shaeffer", false));
		fbUserMap.put(10202346438162639L, new FacebookUser(10202346438162639L, "Sallie Woodall Creech", false));
		fbUserMap.put(10100256062372585L, new FacebookUser(10100256062372585L, "Valerie Vinson", false));
		fbUserMap.put(10203964465936213L, new FacebookUser(10203964465936213L, "Denys Aldrich", false));
		fbUserMap.put(10203543134325682L, new FacebookUser(10203543134325682L, "Chiara Rubertini", false));
		fbUserMap.put(10205522090561433L, new FacebookUser(10205522090561433L, "John Schubert", false));
		fbUserMap.put(10152461586439573L, new FacebookUser(10152461586439573L, "Carol Steiger Stempel", false));
		fbUserMap.put(3935727028715L, new FacebookUser(3935727028715L, "Will Easland", false));
		fbUserMap.put(987487577933566L, new FacebookUser(987487577933566L, "Nakita Sindermann", false));
		fbUserMap.put(10152569381636279L, new FacebookUser(10152569381636279L, "Shannon Lynch", false));
		fbUserMap.put(10202725423360832L, new FacebookUser(10202725423360832L, "Mary Bourgeois Parham", false));
		fbUserMap.put(10154891170245188L, new FacebookUser(10154891170245188L, "Monique Brigette Woodrow", false));
		fbUserMap.put(772597776091454L, new FacebookUser(772597776091454L, "Theresa McLaughlin", false));
		fbUserMap.put(778949338802949L, new FacebookUser(778949338802949L, "Duana Roegner", false));
		fbUserMap.put(10204673550111443L, new FacebookUser(10204673550111443L, "Rebecca Dutton", false));
		fbUserMap.put(630273637047680L, new FacebookUser(630273637047680L, "Rose Kibbe", false));
		fbUserMap.put(10152979944854359L, new FacebookUser(10152979944854359L, "Karen Critchlow Davis", false));
		fbUserMap.put(10101993119853689L, new FacebookUser(10101993119853689L, "Jaime Lila Losch", false));
		fbUserMap.put(10203695063073288L, new FacebookUser(10203695063073288L, "Anne Rippy Turtle", false));
		fbUserMap.put(10205426686252502L, new FacebookUser(10205426686252502L, "Lois Patterson", false));
		fbUserMap.put(10152541056735849L, new FacebookUser(10152541056735849L, "Michelle Wilson", false));
		fbUserMap.put(10152897099087487L, new FacebookUser(10152897099087487L, "Kyle Lynch", false));
		fbUserMap.put(550977765029536L, new FacebookUser(550977765029536L, "Matthew Hilton Lynch", false));
		fbUserMap.put(10204617235457474L, new FacebookUser(10204617235457474L, "Sofia Godsi", false));
		fbUserMap.put(753768534646421L, new FacebookUser(753768534646421L, "Carla Moore Allen", false));
		fbUserMap.put(10152830431124043L, new FacebookUser(10152830431124043L, "Carisa Flood Vincent", false));
		fbUserMap.put(10152264804518853L, new FacebookUser(10152264804518853L, "Hulya Eler", false));
		fbUserMap.put(10203855803975344L, new FacebookUser(10203855803975344L, "Timothy Fenner", false));
		fbUserMap.put(742692702440009L, new FacebookUser(742692702440009L, "Heather Francisco", false));
		fbUserMap.put(10202282629292744L, new FacebookUser(10202282629292744L, "Nicky Smith", false));
		fbUserMap.put(10203752947602732L, new FacebookUser(10203752947602732L, "Kimberley Smith", false));
		fbUserMap.put(10204135220359619L, new FacebookUser(10204135220359619L, "Jacqueline Smith", false));
		fbUserMap.put(731770693528370L, new FacebookUser(731770693528370L, "Martha Anne Shapcott", false));
		fbUserMap.put(10154552666495651L, new FacebookUser(10154552666495651L, "Joey Veloso", false));
		fbUserMap.put(10152998954643797L, new FacebookUser(10152998954643797L, "Devashish Saraswat", false));
		fbUserMap.put(1584244008464406L, new FacebookUser(1584244008464406L, "Irina Khubuluri", false));
		fbUserMap.put(10203803205499772L, new FacebookUser(10203803205499772L, "Gwen Burke Bramlett", false));
		fbUserMap.put(10203877684445496L, new FacebookUser(10203877684445496L, "Rachel Holloway Moore", false));
		fbUserMap.put(10203277059552761L, new FacebookUser(10203277059552761L, "Angela Link Sullenger", false));
		fbUserMap.put(773573055999737L, new FacebookUser(773573055999737L, "Ann Hennessy O'Leary", false));
		fbUserMap.put(10101670840199969L, new FacebookUser(10101670840199969L, "Jennifer Chan Marcelo", false));
		fbUserMap.put(10104645885075883L, new FacebookUser(10104645885075883L, "Karlo Barrios Marcelo", false));
		fbUserMap.put(10105374402566023L, new FacebookUser(10105374402566023L, "Rachel Wiggins Gilmore", false));
		fbUserMap.put(764999600203799L, new FacebookUser(764999600203799L, "Glenda Klint", false));
		fbUserMap.put(10152931438337905L, new FacebookUser(10152931438337905L, "Margaret LeRoy", false));
		fbUserMap.put(771515356239756L, new FacebookUser(771515356239756L, "Thomas Tillman", false));
		fbUserMap.put(10152992108406098L, new FacebookUser(10152992108406098L, "Curtis Len Tillman", false));
		fbUserMap.put(10152930252710489L, new FacebookUser(10152930252710489L, "Christine Tillman", false));
		fbUserMap.put(10152454315250358L, new FacebookUser(10152454315250358L, "Jenny Newman", false));
		fbUserMap.put(10152189936032098L, new FacebookUser(10152189936032098L, "Debi Sheehan", false));
		fbUserMap.put(873069322704723L, new FacebookUser(873069322704723L, "Adrian Lewis Jr.", false));
		fbUserMap.put(541914162612795L, new FacebookUser(541914162612795L, "Mick Cotton", false));
		fbUserMap.put(10205858902781262L, new FacebookUser(10205858902781262L, "Amelia StClair", false));
		fbUserMap.put(10152975424724357L, new FacebookUser(10152975424724357L, "Nick Howe-Smith", false));
		fbUserMap.put(338464566358947L, new FacebookUser(338464566358947L, "Joanna Al Ghawi", false));
		fbUserMap.put(609411025832906L, new FacebookUser(609411025832906L, "Valeria von Sperling", false));
		fbUserMap.put(10204175552414879L, new FacebookUser(10204175552414879L, "Jennifer Spink Strickland", false));
		fbUserMap.put(811234865586066L, new FacebookUser(811234865586066L, "Giovanna Giovanardi", false));
		fbUserMap.put(10203177485666053L, new FacebookUser(10203177485666053L, "Rita Schexneider", false));
		fbUserMap.put(10101235492764870L, new FacebookUser(10101235492764870L, "Jonathan Schexneider", false));
		fbUserMap.put(865485696815790L, new FacebookUser(865485696815790L, "Maximilian Burdette", false));
		fbUserMap.put(10204543696905590L, new FacebookUser(10204543696905590L, "Lizzie Wallace", false));
		fbUserMap.put(10152394255775833L, new FacebookUser(10152394255775833L, "Elizabeth Lessner", false));
		fbUserMap.put(10154888428345068L, new FacebookUser(10154888428345068L, "Ʊ Wayne Brummett Ʊ", false));
		fbUserMap.put(491916077616220L, new FacebookUser(491916077616220L, "Cathy Budlong", false));
		fbUserMap.put(10202553715232289L, new FacebookUser(10202553715232289L, "Michelle Palmer", false));
		fbUserMap.put(10152540327103814L, new FacebookUser(10152540327103814L, "Nicole Trimm", false));
		fbUserMap.put(10204745460503818L, new FacebookUser(10204745460503818L, "Noelle Woodrow Datta", false));
		fbUserMap.put(10152474366373754L, new FacebookUser(10152474366373754L, "Siobhan Lett", false));
		fbUserMap.put(10205383241008952L, new FacebookUser(10205383241008952L, "Christina M. Burdette", false));
		fbUserMap.put(10152884109937766L, new FacebookUser(10152884109937766L, "Katie Egle", false));
		fbUserMap.put(10205956068369413L, new FacebookUser(10205956068369413L, "San Skemp Crandall", false));
		fbUserMap.put(806913329320288L, new FacebookUser(806913329320288L, "Rosemarie Hirsch von Cannon", false));
		fbUserMap.put(4397794118868L, new FacebookUser(4397794118868L, "Val Catello", false));
		fbUserMap.put(10152529309860509L, new FacebookUser(10152529309860509L, "Emilie MacFarlane", false));
		fbUserMap.put(10201785232858031L, new FacebookUser(10201785232858031L, "Linda McClure", false));
		fbUserMap.put(10202227514271483L, new FacebookUser(10202227514271483L, "Lisa Walters", false));
		fbUserMap.put(10202265767513422L, new FacebookUser(10202265767513422L, "Joe Pietracatello", false));
		fbUserMap.put(10100103589333221L, new FacebookUser(10100103589333221L, "Megan Rarick", false));
		fbUserMap.put(10202079344567020L, new FacebookUser(10202079344567020L, "Ryan Rarick", false));
		fbUserMap.put(10154295324660153L, new FacebookUser(10154295324660153L, "Bill Reid", false));
		fbUserMap.put(10205080385872987L, new FacebookUser(10205080385872987L, "Kristy Hammerschmidt-Malecha", false));
		fbUserMap.put(10201160381410834L, new FacebookUser(10201160381410834L, "Emily Ann Williams", false));
		fbUserMap.put(10152430357451637L, new FacebookUser(10152430357451637L, "Mike Roest", false));
		fbUserMap.put(366180733553353L, new FacebookUser(366180733553353L, "Virginia Kapinos", false));
		fbUserMap.put(10202239311778603L, new FacebookUser(10202239311778603L, "Tiffany Snead Schwantes", false));
		fbUserMap.put(758912830806890L, new FacebookUser(758912830806890L, "Thomas Heavey", false));
		fbUserMap.put(847935301912929L, new FacebookUser(847935301912929L, "Cathleen Kyle", false));
		fbUserMap.put(10105458024277470L, new FacebookUser(10105458024277470L, "Bernie Lee", false));
		fbUserMap.put(10205324720819535L, new FacebookUser(10205324720819535L, "Martha Bourgeois", false));
		fbUserMap.put(10205432688480523L, new FacebookUser(10205432688480523L, "Stephanie Vogt", false));
		fbUserMap.put(689438457843395L, new FacebookUser(689438457843395L, "Bronte Doyne", false));
		fbUserMap.put(10204479144672288L, new FacebookUser(10204479144672288L, "Rebecca Maxwell Stuart", false));
		fbUserMap.put(10204373569930931L, new FacebookUser(10204373569930931L, "Amy Malmsten Aleck", false));
		fbUserMap.put(688466974584893L, new FacebookUser(688466974584893L, "Jeff Fryer", false));
		fbUserMap.put(10202985966041757L, new FacebookUser(10202985966041757L, "Christine O'Flaherty", false));
		fbUserMap.put(10203505428668895L, new FacebookUser(10203505428668895L, "Brooke Koopman", false));
		fbUserMap.put(10154970748695597L, new FacebookUser(10154970748695597L, "Amanda Allen", false));
		fbUserMap.put(10152919603636490L, new FacebookUser(10152919603636490L, "Sadaf Tavakoli", false));
		fbUserMap.put(10152421368413405L, new FacebookUser(10152421368413405L, "Bart Slabbinck", false));
		fbUserMap.put(10205367632895477L, new FacebookUser(10205367632895477L, "Lauren Trecosta", false));
		fbUserMap.put(775326069209281L, new FacebookUser(775326069209281L, "Shari Lynn Turner", false));
		fbUserMap.put(10155121603920556L, new FacebookUser(10155121603920556L, "Ashley Kelly Smith", false));
		fbUserMap.put(10152860324034566L, new FacebookUser(10152860324034566L, "Judi Cannon", false));
		fbUserMap.put(10104390903141801L, new FacebookUser(10104390903141801L, "Lisa Krogwold", false));
		fbUserMap.put(10152964280338266L, new FacebookUser(10152964280338266L, "Gail Trecosta", false));
		fbUserMap.put(10205575498931207L, new FacebookUser(10205575498931207L, "Deborah T. Hinton", false));
		fbUserMap.put(10201876766753310L, new FacebookUser(10201876766753310L, "Elana Simon", false));
		fbUserMap.put(962714143758443L, new FacebookUser(962714143758443L, "Jay Hawthorn", false));
		fbUserMap.put(581282201973768L, new FacebookUser(581282201973768L, "Kristin Parker", false));
		fbUserMap.put(776332249057492L, new FacebookUser(776332249057492L, "Peter Tinella", false));
		fbUserMap.put(10100945735779816L, new FacebookUser(10100945735779816L, "Laura McLaughlin Zale", false));
		fbUserMap.put(813249602070444L, new FacebookUser(813249602070444L, "Billy Cannon", false));
		fbUserMap.put(778057282246610L, new FacebookUser(778057282246610L, "Christi Proctor Benton", false));
		fbUserMap.put(4844009514524L, new FacebookUser(4844009514524L, "Patsy Self McWhorter", false));
		fbUserMap.put(885813911462792L, new FacebookUser(885813911462792L, "Bonnie Cannon Dunham", false));
		fbUserMap.put(10203984359116360L, new FacebookUser(10203984359116360L, "Lou Jean Cannon", false));
		fbUserMap.put(10203354487133450L, new FacebookUser(10203354487133450L, "Cindy Cannon", false));
		fbUserMap.put(10203261279000794L, new FacebookUser(10203261279000794L, "Derick Williams", false));
		fbUserMap.put(10154006676075654L, new FacebookUser(10154006676075654L, "Cindy Ulrey", false));
		fbUserMap.put(922389901112485L, new FacebookUser(922389901112485L, "Lyssa Williams", false));
		fbUserMap.put(10152761965284039L, new FacebookUser(10152761965284039L, "Karen Sewell", false));
		fbUserMap.put(404597309698170L, new FacebookUser(404597309698170L, "Jake Hollingsworth", false));
		fbUserMap.put(759664917441176L, new FacebookUser(759664917441176L, "Jodi Rarick", false));
		fbUserMap.put(772433729454363L, new FacebookUser(772433729454363L, "Janet Budlong", false));
		fbUserMap.put(611910558955424L, new FacebookUser(611910558955424L, "Greg Langford", false));
		fbUserMap.put(981047338591258L, new FacebookUser(981047338591258L, "Maria Chastain Garrett", false));
		fbUserMap.put(987848717895597L, new FacebookUser(987848717895597L, "Stephanie Lowe", false));
		fbUserMap.put(845969152097476L, new FacebookUser(845969152097476L, "Kim Brown Turner", false));
		fbUserMap.put(806397356055852L, new FacebookUser(806397356055852L, "Cathy Salisbury", false));
		fbUserMap.put(10152595544472810L, new FacebookUser(10152595544472810L, "David Langford", false));
		fbUserMap.put(677894902316112L, new FacebookUser(677894902316112L, "Lorraine Doyne", false));
		fbUserMap.put(713421695697L, new FacebookUser(713421695697L, "Ellen Casazza", false));
		fbUserMap.put(10205580146287525L, new FacebookUser(10205580146287525L, "Tim Weddleton", false));
		fbUserMap.put(10152409223977092L, new FacebookUser(10152409223977092L, "Barry Rook", false));
		fbUserMap.put(10203436272975647L, new FacebookUser(10203436272975647L, "Andrea Plauche Bourgeois", false));
		fbUserMap.put(533974913381646L, new FacebookUser(533974913381646L, "Cecilia Williamson Taunton", false));
		fbUserMap.put(10202387916242372L, new FacebookUser(10202387916242372L, "Robert Bramlett", false));
		fbUserMap.put(10103061914640373L, new FacebookUser(10103061914640373L, "Leila Green", false));
		fbUserMap.put(10202175250684902L, new FacebookUser(10202175250684902L, "Cathy Morris Green", false));
		fbUserMap.put(10103630810005122L, new FacebookUser(10103630810005122L, "Austin Green", false));
		fbUserMap.put(10203896697766709L, new FacebookUser(10203896697766709L, "Susan Burke", false));
		fbUserMap.put(567848310026776L, new FacebookUser(567848310026776L, "Jeff Lapinski", false));
		fbUserMap.put(926569607354732L, new FacebookUser(926569607354732L, "Kristina Taber Rawlings", false));
		fbUserMap.put(762886023758803L, new FacebookUser(762886023758803L, "Kyle Edwards", false));
		fbUserMap.put(4975588803365L, new FacebookUser(4975588803365L, "Susan Millwood Scruggs", false));
		fbUserMap.put(10206134701591648L, new FacebookUser(10206134701591648L, "Jon Oeltjenbruns", false));
		fbUserMap.put(976233869058127L, new FacebookUser(976233869058127L, "Pat Corcoran", false));
		fbUserMap.put(10103495564282959L, new FacebookUser(10103495564282959L, "Rachael Migler", false));
		fbUserMap.put(10101589653109222L, new FacebookUser(10101589653109222L, "Jenny 'Polonsky' Ingber", false));
		fbUserMap.put(10100116915562137L, new FacebookUser(10100116915562137L, "Nick Fenner", false));
		fbUserMap.put(10203321357297016L, new FacebookUser(10203321357297016L, "Dawn Taylor-Ring", false));
		fbUserMap.put(793408374039517L, new FacebookUser(793408374039517L, "David Fenner", false));
		fbUserMap.put(798298000216650L, new FacebookUser(798298000216650L, "Libby Beede-Vreonis", false));
		fbUserMap.put(10203267388627470L, new FacebookUser(10203267388627470L, "Ronnie Cooper", false));
		fbUserMap.put(891427610888615L, new FacebookUser(891427610888615L, "Derinna Dine", false));
		fbUserMap.put(886656924684053L, new FacebookUser(886656924684053L, "Lylenette Canfield", false));
		fbUserMap.put(847361638648851L, new FacebookUser(847361638648851L, "Josiah Hardwick", false));
		fbUserMap.put(10153922886343532L, new FacebookUser(10153922886343532L, "Brandon Ellefson", false));
		fbUserMap.put(986972537983776L, new FacebookUser(986972537983776L, "Randy Woodbury", false));
		fbUserMap.put(10152891603355536L, new FacebookUser(10152891603355536L, "Kayla Beckwith", false));
		fbUserMap.put(10152459274200764L, new FacebookUser(10152459274200764L, "Christine Yambrick-Lockhart", false));
		fbUserMap.put(673985572639340L, new FacebookUser(673985572639340L, "Sarah Silverman", false));
		fbUserMap.put(10152670913233791L, new FacebookUser(10152670913233791L, "Robert Lockhart", false));
		fbUserMap.put(10203002429334029L, new FacebookUser(10203002429334029L, "Craig Domsitz", false));
		fbUserMap.put(10152538164041659L, new FacebookUser(10152538164041659L, "Jennifer Emery", false));
		fbUserMap.put(358461694279198L, new FacebookUser(358461694279198L, "Star Stowell", false));
		fbUserMap.put(10202371996661206L, new FacebookUser(10202371996661206L, "Jessica Shepard", false));
		fbUserMap.put(10152242106667548L, new FacebookUser(10152242106667548L, "Jessica", false));
		fbUserMap.put(10155056524045122L, new FacebookUser(10155056524045122L, "Kati Eggleton", false));
		fbUserMap.put(1007014549323986L, new FacebookUser(1007014549323986L, "Kyle Reffitt", false));
		fbUserMap.put(889024267783435L, new FacebookUser(889024267783435L, "Rebecca Moggo", false));
		fbUserMap.put(975926582423558L, new FacebookUser(975926582423558L, "Sharon Marsh-Ames", false));
		fbUserMap.put(10152943709602277L, new FacebookUser(10152943709602277L, "June Dugan", false));
		fbUserMap.put(10205302835080957L, new FacebookUser(10205302835080957L, "Stacy Michelle Bidstrup", false));
		fbUserMap.put(971279889555883L, new FacebookUser(971279889555883L, "Cassy Overmyer Ames", false));
		fbUserMap.put(869422476435321L, new FacebookUser(869422476435321L, "Freddie Apps", false));
		fbUserMap.put(10203287020276558L, new FacebookUser(10203287020276558L, "James Apps Jr", false));
		fbUserMap.put(1002451893103870L, new FacebookUser(1002451893103870L, "Jacob Apps", false));
		fbUserMap.put(755941581167193L, new FacebookUser(755941581167193L, "Judy Apps", false));
		fbUserMap.put(999191303429944L, new FacebookUser(999191303429944L, "Michelle Wiggins", false));
		fbUserMap.put(897488740268703L, new FacebookUser(897488740268703L, "Connie Wallace Wagner", false));
		fbUserMap.put(10203113742421499L, new FacebookUser(10203113742421499L, "Brittany Reynolds Nemkovich", false));
		fbUserMap.put(10205123861554690L, new FacebookUser(10205123861554690L, "Brandy Lynn Moon", false));
		fbUserMap.put(10203494712041862L, new FacebookUser(10203494712041862L, "Dawn Akrie-Edwards", false));
		fbUserMap.put(840917885931664L, new FacebookUser(840917885931664L, "Laura Imperia O'Malley", false));
		fbUserMap.put(10152825549309720L, new FacebookUser(10152825549309720L, "Michael Waitforit Stowell", false));
		fbUserMap.put(10152980394301189L, new FacebookUser(10152980394301189L, "Shaun Doyle", false));
		fbUserMap.put(749019601846062L, new FacebookUser(749019601846062L, "Tom Neiwirth", false));
		fbUserMap.put(539771931691L, new FacebookUser(539771931691L, "Matt Cler", false));
		fbUserMap.put(10152585354792993L, new FacebookUser(10152585354792993L, "William F Beermann", false));
		fbUserMap.put(684678684964674L, new FacebookUser(684678684964674L, "Brandy Black", false));
		fbUserMap.put(993343894015103L, new FacebookUser(993343894015103L, "Kirk Stowell", false));
		fbUserMap.put(10152437432056255L, new FacebookUser(10152437432056255L, "Anne Adler", false));
		fbUserMap.put(860790170619444L, new FacebookUser(860790170619444L, "Jessica Glatt", false));
		fbUserMap.put(10203215686545657L, new FacebookUser(10203215686545657L, "Theodoros Porfyrides", false));
		fbUserMap.put(10152998002240362L, new FacebookUser(10152998002240362L, "Matt Pockrandt", false));
		fbUserMap.put(10154922863070537L, new FacebookUser(10154922863070537L, "Josh Fletcher", false));
		fbUserMap.put(10152064593347331L, new FacebookUser(10152064593347331L, "Kirk Stowell II", false));
		fbUserMap.put(1023228521027859L, new FacebookUser(1023228521027859L, "Laurie Apps", false));
		fbUserMap.put(4897683055661L, new FacebookUser(4897683055661L, "Chris Turner", false));
		fbUserMap.put(10154976936555694L, new FacebookUser(10154976936555694L, "Aaron Edquist", false));
		fbUserMap.put(10204524670870355L, new FacebookUser(10204524670870355L, "Tom Allison", false));
		fbUserMap.put(10152491169866437L, new FacebookUser(10152491169866437L, "Selena Marie", false));
		fbUserMap.put(10205732762062805L, new FacebookUser(10205732762062805L, "Julie Roberts Buckner", false));
		fbUserMap.put(10202990190134978L, new FacebookUser(10202990190134978L, "Will Harris", false));
		fbUserMap.put(10202069635381140L, new FacebookUser(10202069635381140L, "Melinda Violante", false));
		fbUserMap.put(10203788639258759L, new FacebookUser(10203788639258759L, "Holly Hahn Krueger", false));
		fbUserMap.put(10203823584500326L, new FacebookUser(10203823584500326L, "Trina Walker Turner", false));
		fbUserMap.put(10201146902114171L, new FacebookUser(10201146902114171L, "Kathy Schubert", false));
		fbUserMap.put(10201070607606453L, new FacebookUser(10201070607606453L, "Sheila Alexander", false));
		fbUserMap.put(10204449589514272L, new FacebookUser(10204449589514272L, "Terra Goudge", false));
		fbUserMap.put(10152516055069893L, new FacebookUser(10152516055069893L, "Elisabeth Rippy", false));
		fbUserMap.put(10152186526470060L, new FacebookUser(10152186526470060L, "Heather Steger", false));
		fbUserMap.put(10202067491197951L, new FacebookUser(10202067491197951L, "George N Terrianne Flynn-Bowen", false));
		fbUserMap.put(10203223397452385L, new FacebookUser(10203223397452385L, "Hannah Cork", false));
		fbUserMap.put(10152443264967484L, new FacebookUser(10152443264967484L, "Charles Beermann", false));
		fbUserMap.put(10202597093803649L, new FacebookUser(10202597093803649L, "Pam Danner", false));
		fbUserMap.put(10203168847813410L, new FacebookUser(10203168847813410L, "Kelly Russell", false));
		fbUserMap.put(10152904715163747L, new FacebookUser(10152904715163747L, "Michelle Desmond", false));
		fbUserMap.put(10204771243513563L, new FacebookUser(10204771243513563L, "Wendy Mayo", false));
		fbUserMap.put(10202955474919648L, new FacebookUser(10202955474919648L, "Georgine Bagnato", false));
		fbUserMap.put(10204709594993369L, new FacebookUser(10204709594993369L, "Kerri Jane Hebert", false));
		fbUserMap.put(958106294217350L, new FacebookUser(958106294217350L, "Joe Bagnato", false));
		fbUserMap.put(695156143892775L, new FacebookUser(695156143892775L, "Tiffany Lynn Hinton", false));
		fbUserMap.put(864827036864001L, new FacebookUser(864827036864001L, "Judy Hinton", false));
		fbUserMap.put(10203818150764228L, new FacebookUser(10203818150764228L, "Jeremiah Joseph Vizzo", false));
		fbUserMap.put(10100103233711393L, new FacebookUser(10100103233711393L, "Natalie Walker Ward", false));
		fbUserMap.put(10153022883051614L, new FacebookUser(10153022883051614L, "Nel Andrews", false));
		fbUserMap.put(10153048859021019L, new FacebookUser(10153048859021019L, "Hugh Teegan", false));
		fbUserMap.put(10152411251236152L, new FacebookUser(10152411251236152L, "Toni Roberts Pimentel", false));
		fbUserMap.put(10102445624570578L, new FacebookUser(10102445624570578L, "Sara McClain", false));
		fbUserMap.put(10202968039475778L, new FacebookUser(10202968039475778L, "Sandy Simon", false));
		fbUserMap.put(10152603856316849L, new FacebookUser(10152603856316849L, "Sean Kaufman", false));
		fbUserMap.put(10154936260960176L, new FacebookUser(10154936260960176L, "Kirsty Cotton", false));
		fbUserMap.put(10152578501803301L, new FacebookUser(10152578501803301L, "Alberto Tuñón", false));
		fbUserMap.put(10152464461548119L, new FacebookUser(10152464461548119L, "Julie Hollum Gitchel", false));
		fbUserMap.put(831476813575667L, new FacebookUser(831476813575667L, "Erin Brueland", false));
		fbUserMap.put(622058331260L, new FacebookUser(622058331260L, "Carrie Reiners", false));
		fbUserMap.put(808560505881948L, new FacebookUser(808560505881948L, "Amy Kaufman", false));
		fbUserMap.put(10152536008983336L, new FacebookUser(10152536008983336L, "Shauna Klassen", false));
		fbUserMap.put(10100822130111923L, new FacebookUser(10100822130111923L, "Teresa E Manning", false));
		fbUserMap.put(728108493952848L, new FacebookUser(728108493952848L, "Mark Anthony Smith Jr.", false));
		fbUserMap.put(10204976883931459L, new FacebookUser(10204976883931459L, "Cathleen Murphy Watson", false));
		fbUserMap.put(10205292115729986L, new FacebookUser(10205292115729986L, "Angela Marie Tinella", false));
		fbUserMap.put(10205989083312361L, new FacebookUser(10205989083312361L, "Li Sweet-Lukins", false));
		fbUserMap.put(10153437556983206L, new FacebookUser(10153437556983206L, "Courtney Robinson", false));
		fbUserMap.put(10203533397123178L, new FacebookUser(10203533397123178L, "Amanda Russell", false));
		fbUserMap.put(10204089184408570L, new FacebookUser(10204089184408570L, "Tracy A Hollum", false));
		fbUserMap.put(10154991980015249L, new FacebookUser(10154991980015249L, "Tiffanie Duke", false));
		fbUserMap.put(638144872946858L, new FacebookUser(638144872946858L, "Gay Horsfield", false));
		fbUserMap.put(10152650625031847L, new FacebookUser(10152650625031847L, "Aimee Elizabeth", false));
		fbUserMap.put(10101854362444775L, new FacebookUser(10101854362444775L, "Ryan Stoker", false));
		fbUserMap.put(869702873075067L, new FacebookUser(869702873075067L, "Joyce Simpson", false));
		fbUserMap.put(1004836649531888L, new FacebookUser(1004836649531888L, "Lori Hollingsworth Hinton", false));
		fbUserMap.put(10204162149755521L, new FacebookUser(10204162149755521L, "Jennifer Nolf-Jean", false));
		fbUserMap.put(945756772117217L, new FacebookUser(945756772117217L, "Frances Kay Huffman", false));
		fbUserMap.put(10205220735862810L, new FacebookUser(10205220735862810L, "Katie Jenkins Shaffer", false));
		fbUserMap.put(10202678259015630L, new FacebookUser(10202678259015630L, "Suzy Watson Vinson", false));
		fbUserMap.put(910983428921034L, new FacebookUser(910983428921034L, "Darci Findley", false));
		fbUserMap.put(10205428919345459L, new FacebookUser(10205428919345459L, "Lacy Lane", false));
		fbUserMap.put(10202323619471869L, new FacebookUser(10202323619471869L, "Nina Boylan", false));
		fbUserMap.put(10202203956049227L, new FacebookUser(10202203956049227L, "Melissa Findley", false));
		fbUserMap.put(799351380075762L, new FacebookUser(799351380075762L, "Lisa Schuler", false));
		fbUserMap.put(932309020126929L, new FacebookUser(932309020126929L, "Shelly McElwee Mabery", false));
		fbUserMap.put(10202942173106211L, new FacebookUser(10202942173106211L, "Kayte Hollingsworth", false));
		fbUserMap.put(782531865127687L, new FacebookUser(782531865127687L, "Beth Webb Pothast", false));
		fbUserMap.put(856932517680594L, new FacebookUser(856932517680594L, "Zach Grullon", false));
		fbUserMap.put(10204003291152395L, new FacebookUser(10204003291152395L, "Sandy Hawthorn", false));
		fbUserMap.put(10205900544575670L, new FacebookUser(10205900544575670L, "April Faircloth Grullon", false));
		fbUserMap.put(10152234377254200L, new FacebookUser(10152234377254200L, "Kellie Grogan", false));
		fbUserMap.put(10154209224085006L, new FacebookUser(10154209224085006L, "Autumn Smith", false));
		fbUserMap.put(10203054479780686L, new FacebookUser(10203054479780686L, "Lynn Guerrieri O'Malley", false));
		fbUserMap.put(10152306608546655L, new FacebookUser(10152306608546655L, "Marna Olsen Davis", false));
		fbUserMap.put(10152835447715673L, new FacebookUser(10152835447715673L, "Debbie Marston", false));
		fbUserMap.put(10204339751791948L, new FacebookUser(10204339751791948L, "Bella Naomi Glynn", false));
		fbUserMap.put(10204344732284830L, new FacebookUser(10204344732284830L, "Lisa Rebekah Harris", false));
		fbUserMap.put(10204472257919601L, new FacebookUser(10204472257919601L, "Becky Scroggs Garrett", false));
		fbUserMap.put(10102792931958863L, new FacebookUser(10102792931958863L, "Alisha Anne", false));
		fbUserMap.put(10203968277031483L, new FacebookUser(10203968277031483L, "Alison Stone", false));
		fbUserMap.put(10152830066221928L, new FacebookUser(10152830066221928L, "Rachel Evans", false));
		fbUserMap.put(10152056938436782L, new FacebookUser(10152056938436782L, "Jenna Moloney", false));
		fbUserMap.put(10205616068825675L, new FacebookUser(10205616068825675L, "Kelly Langford", false));
		fbUserMap.put(10152547565957704L, new FacebookUser(10152547565957704L, "Tracy Crouse Oeltjenbruns", true));
		fbUserMap.put(10204736388760995L, new FacebookUser(10204736388760995L, "Ashley Summerlin Murphy", false));
		fbUserMap.put(10152486985482021L, new FacebookUser(10152486985482021L, "Dave Day", false));
		fbUserMap.put(10204683075428855L, new FacebookUser(10204683075428855L, "Nicolas Flamerie de Lachapelle", false));
		fbUserMap.put(10154997305915220L, new FacebookUser(10154997305915220L, "Casey Allison O'Callaghan", false));
		fbUserMap.put(10152409223972092L, new FacebookUser(10152409223972092L, "Tabitha Dickinson", false));
		fbUserMap.put(697958408L, new FacebookUser(697958408L, "Tal Friedman", true));
		
		LOGGER.info("\n\n done populating static map\n\n");	
	}
}
