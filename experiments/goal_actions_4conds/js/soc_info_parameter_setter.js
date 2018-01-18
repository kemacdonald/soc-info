// ---------------- 2. STIMULUS SETUP ------------------
// Parameters and Stimulus Setup

// Defining the parameters for the study:

// Number of actions on the critical trial
var num_actions = 3

/* Call Maker getter to get cond variables
 * Takes number and counts for each condition
 * Returns a condition number
 */

var numConditions = 8
var slider_start_val = "50"

try {
    var filename = "soc_info_goals_4conds_full_sample";
    var condCounts = "1,25;2,25;3,25;4,25;5,25;6,25;7,25;8,25";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false);
    xmlHttp.send(null);
    var cond = xmlHttp.responseText; // For actual experimental runs
} catch (e) {
    var cond = random(1, numConditions); // if maker-getter fails, generate condition number randomly
}

cond = cond.toString();

// set up experiment variables based on condition
switch (cond) {
    case "1":
        goal_condition = "learning";
        outcome = "music";
        break;
    case "2":
        goal_condition = "performance";
        outcome = "music";
        break;
    case "3":
        goal_condition = "presentation";
        outcome = "music";
        break
    case "4":
        goal_condition = "learning";
        outcome = "light";
        break;
    case "5":
        goal_condition = "performance";
        outcome = "light";
        break;
    case "6":
        goal_condition = "presentation";
        outcome = "light";
        break
    case "7":
        goal_condition = "noGoal";
        outcome = "music";
        break
    case "8":
        goal_condition = "noGoal";
        outcome = "light";
        break
}

var bonus_amount = '10 cent'

if (goal_condition == "learning" && outcome == "light") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. But it looks like you forgot to put on the label! Can you figure out what label should go on the toy?" <br><br> If you only had one chance to try <b>a SINGLE action to figure out the correct label for the toy</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus after submitting the HIT if you figure it out correctly</b>.`
    goal_html_action_slide = `Remember, you will receive a <b> ${bonus_amount} bonus if you correctly learn which toy this is</b>. You will lose out on this bonus if you don’t learn which toy it is.`
} else if (goal_condition == "performance" && outcome == "light") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. I want to see the light turn on." <br><br> Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br> If you only had one chance to try <b>a SINGLE action to get the toy to turn on the light for your boss</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus if the light turns on</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you make the toy play music</b>. You will lose out on this bonus if your action doesn't make the toy turn on the light.`
} else if (goal_condition == "learning" && outcome == "music") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. But it looks like you forgot to put on the label! Can you figure out what label should go on the toy?" <br><br> If you only had one chance to try <b>a SINGLE action to figure out the correct label for the toy</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus after submitting the HIT if you figure it out correctly</b>.`
    goal_html_action_slide = `Remember, you will receive a <b> ${bonus_amount} bonus if you correctly learn which toy this is</b>. You will lose out on this bonus if you don’t learn which toy it is.`
} else if (goal_condition == "performance" && outcome == "music") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. I want to hear the music it plays." <br><br> Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br> If you only had one chance to try <b>a SINGLE action to get the toy to play music for your boss</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus if the toy plays music</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you make the toy play music</b>. You will lose out on this bonus if your action doesn't make the toy play music.`
} else if (goal_condition == "presentation") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. How does it work?" <br><br>Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br>If you only had <b>one chance to impress your boss and show that you're competent</b>, which action would you want to take? <b>You will get a ${bonus_amount} for impressing your boss</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you successfully impress your supervisor with a SINGLE action </b>. You will lose out on this bonus if your supervisor is not impressed.`
} else if (goal_condition == "noGoal") {
    goal_text_html = `One day you see one of these toys lying on the ground. <br><br>Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br>If you only had <b>one chance to play with this toy</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus at the end of the task for paying attention</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you successfully impress your supervisor with a SINGLE action </b>. You will lose out on this bonus if your supervisor is not impressed.`
}

if (outcome == "music") {
   music_box_imgs = ["BothMusicLight.jpeg", "ButtonMusic.jpeg", "HandleMusic.jpeg"]
} else {
   music_box_imgs = ["BothLightMusic.jpeg", "HandleLight.jpeg", "ButtonLight.jpeg"]
}

music_box = shuffle(music_box_imgs)
for (i = 0; i < music_box.length; i++) {
    music_box_html = `<img src="imgs/${music_box[i]}" height="250" width="200">`
    //    	$(`#music_box_intro_` + i.toString()).html(music_box_html);
    $(`#music_box_goals_` + i.toString()).html(music_box_html);
    $(`#music_box_actions_` + i.toString()).html(music_box_html);
    $(`#music_box_hyps_` + i.toString()).html(music_box_html);
}

if (outcome == "music") {
    hypotheses_slider_labels = ["ButtonMusic", "HandleMusic", "BothMusicLight"]
        action_labels = ["Press the button on its own", "Pull the handle on its own", "Press the button and pull the handle<br>at the same time"]
    effect_labels = ["play music", "turn on the light", "play music AND turn on the light"]
    label_inst = "LabelInst1.jpeg"
} else {
    hypotheses_slider_labels = ["ButtonLight", "HandleLight", "BothLightMusic"]
        action_labels = ["Press the button on its own", "Pull the handle on its own", "Press the button and pull the handle<br>at the same time"]
    effect_labels = ["turn on the light", "play music", "turn on the light AND play music"]
    label_inst = "LabelInst2.jpeg"

}
