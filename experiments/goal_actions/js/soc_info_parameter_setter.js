// ---------------- 2. STIMULUS SETUP ------------------
// Parameters and Stimulus Setup

// Defining the parameters for the study:

// Number of actions on the critical trial
var num_actions = 3

/* Call Maker getter to get cond variables
 * Takes number and counts for each condition
 * Returns a condition number 
 */

var numConditions = 2

/*try { 
    var filename = "soc_info_goals_pilot";
    var condCounts = "1,10;2,10";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false );
    xmlHttp.send( null );
    var cond = xmlHttp.responseText; // For actual experimental runs
} catch (e) {
    var cond = random(1,numConditions); // if maker-getter fails, generate condition number randomly
}*/

cond = 1

cond = cond.toString();

// set up experiment variables based on condition


switch (cond) {
    case "1": 
        goal_condition = "learning";
        break;
    case "2":
        goal_condition = "performance";
        break
}