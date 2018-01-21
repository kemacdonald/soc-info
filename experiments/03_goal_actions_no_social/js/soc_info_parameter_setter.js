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
    var filename = "soc_info_goals_no_soc_full_sample";
    var condCounts = "1,25;2,25;3,25;4,25;5,25;6,25;7,50;";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false);
    xmlHttp.send(null);
    var cond = xmlHttp.responseText; // For actual experimental runs
} catch (e) {
    var cond = random(1, numConditions); // if maker-getter fails, generate condition number randomly
}

cond = cond.toString();

cond = "7"

// set up experiment variables based on condition
switch (cond) {
    case "1":
        goal_condition = "learning";
        social_condition = "social";
        break;
    case "2":
        goal_condition = "learning";
        social_condition = "no-social";
        break;
    case "3":
        goal_condition = "performance";
        social_condition = "social";
        break;
    case "4":
        goal_condition = "performance";
        social_condition = "no-social";
        break;
    case "5":
        goal_condition = "noGoal";
        social_condition = "social";
        break
    case "6":
        goal_condition = "noGoal";
        social_condition = "no-social";
        break
    case "7":
        goal_condition = "presentation";
        social_condition = "social";
        break
}

// randomize outcomes
var outcomes = ["music", "light"]
var outcome = outcomes[random(0, outcomes.length-1)]

// set bonus amount
var bonus_amount = '10 cent'

// select the text for the goals slide based on goal condition
switch(goal_condition) {
    case "learning":
        goal_question = `<br><br> "Can you figure out what label should go on the toy?"`;
        goal_prompt = `to figure out what label should go on the toy`
        bonus_prompt = `figure out what label should go on the toy`;
        break;
    case "performance":
        goal_question = `<br><br> "Can you make the ${outcome} turn on?"`;
        goal_prompt = `to make the ${outcome} turn on`
        bonus_prompt = `make the ${outcome} turn on`;
        break;
    case "presentation":
        goal_question = `<br><br> "Can you show me how the toy works?"`;
        goal_prompt = `to impress your boss and show that you're competent`
        bonus_prompt = `impress your boss`;
        break;
    case "noGoal":
        goal_question = ``
        goal_prompt = `with this toy`
        bonus_prompt = `pay attention`
        break;
  }

// select cover story based on social condition
if (social_condition == "social") {
  cover_story = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. But it looks like you forgot to put on the label! ${goal_question}`;
} else {
  cover_story = `One day you are at your desk working and you see one of these toys lying on the ground. <br><br>Unfortunately, you were in a rush when you built this particular toy and forgot to label it. ${goal_question}`
}

// now build the html text
var action_cover_story = `<br><br>If you only had one chance to try <b>a SINGLE action ${goal_prompt}, which action would you want to take? `
var bonus_text = `<br><br>You will get a ${bonus_amount} bonus after submitting the HIT if you ${bonus_prompt}.`
var goal_text_html = cover_story.concat(action_cover_story, bonus_text)

// build html for the actions slide
var goal_html_action_slide = `Remember, you will receive a <b> ${bonus_amount} bonus if you ${bonus_prompt}</b>. You will lose out on this bonus if you don’t ${bonus_prompt}.`

// select music box images based on outcome
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

// build html for slider labels based on outcome
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
