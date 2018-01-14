// ---------------- 2. STIMULUS SETUP ------------------
// Parameters and Stimulus Setup

// Defining the parameters for the study:

// Number of actions on the critical trial
var num_actions = 3

/* Call Maker getter to get cond variables
 * Takes number and counts for each condition
 * Returns a condition number
 */

var numConditions = 3
var slider_start_val = "50"

try {
    var filename = "soc_info_goals_ver2_pilot";
    var condCounts = "1,25;2,25;3,25";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false );
    xmlHttp.send( null );
    var cond = xmlHttp.responseText; // For actual experimental runs
} catch (e) {
    var cond = random(1,numConditions); // if maker-getter fails, generate condition number randomly
}

cond = cond.toString();

// set up experiment variables based on condition
//cond = "2";
switch (cond) {
    case "1":
        goal_condition = "learning";
        break;
    case "2":
        goal_condition = "performance";
        break;
    case "3":
        goal_condition = "presentation";
        break
}

var bonus_amount = '10 cent'

if(goal_condition == "learning") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. But it looks like you forgot to put on the label! Can you figure out whether this toy is a ButtonMusic toy, HandleMusic toy, or BothMusicLight toy?" <br><br> If you only had one chance to try <b>a SINGLE action to figure out which toy this is</b>, which action would you want to take? <b>you will get a ${bonus_amount} bonus after submitting the HIT if you figure it out correctly</b>.`
    goal_html_action_slide = `Remember, you will receive a <b> ${bonus_amount} bonus if you correctly learn which toy this is</b>. You will lose out on this bonus if you don’t learn which toy it is.`
} else if (goal_condition == "performance") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. I want to hear the music it plays." <br><br> Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br> If you only had one chance to try <b>a SINGLE action to get the toy to play music for your boss</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus if the toy plays music</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you make the toy play music</b>. You will lose out on this bonus if your action doesn't make the toy play music.`
} else {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. How does it work?" <br><br>Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br>If you only had <b>one chance to impress your boss and show that you're competent</b>, which action would you want to take? <b>You will get a ${bonus_amount} for impressing your boss</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you successfully impress your supervisor with a SINGLE action </b>. You will lose out on this bonus if your supervisor is not impressed.`
}

// set up variables for later randomization
//music_box_imgs =  ["music_box_left.jpeg", "music_box_right.jpeg"]
//music_box = music_box_imgs[random(0,1)]
//music_box_html = `<img src="imgs/${music_box}" height="200" width="300">`
music_box_imgs =  ["BothMusicLight.jpeg", "ButtonMusic.jpeg", "HandleMusic.jpeg"]
music_box = shuffle(music_box_imgs)
    for(i = 0; i < music_box.length; i++) {
        music_box_html = `<img src="imgs/${music_box[i]}" height="120" width="200">`
//    	$(`#music_box_intro_` + i.toString()).html(music_box_html);
    	$(`#music_box_goals_` + i.toString()).html(music_box_html);
    	$(`#music_box_actions_` + i.toString()).html(music_box_html);
    	$(`#music_box_hyps_` + i.toString()).html(music_box_html);
    }

//hypotheses_slider_labels = ["Purple" , "Orange", "Purple and Orange"]
//action_labels = ["Purple" , "Orange", "Purple and Orange"]
hypotheses_slider_labels = ["ButtonMusic" , "HandleMusic", "BothMusicLight"]
action_labels = ["Press the button" , "Pull the handle", "Press the button and pull the handle"]
effect_labels = ["play music" , "turn on the light"]
