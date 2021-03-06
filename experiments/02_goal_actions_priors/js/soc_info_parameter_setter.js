// ---------------- 2. STIMULUS SETUP ------------------
// Parameters and Stimulus Setup

// Defining the parameters for the study:

// Number of actions on the critical trial
var num_actions = 3

// set up global experiment variables
goal_condition = "noGoal";
outcome = "music";
var bonus_amount = '10 cent'

if (goal_condition == "learning" && outcome == "light") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. But it looks like you forgot to put on the label! Can you figure out whether this toy is a ButtonLight toy, HandleLight toy, or BothLightMusic toy?" <br><br> If you only had one chance to try <b>a SINGLE action to figure out which toy this is</b>, which action would you want to take? <b>you will get a ${bonus_amount} bonus after submitting the HIT if you figure it out correctly</b>.`
    goal_html_action_slide = `Remember, you will receive a <b> ${bonus_amount} bonus if you correctly learn which toy this is</b>. You will lose out on this bonus if you don’t learn which toy it is.`
} else if (goal_condition == "performance" && outcome == "light") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. I want to see the light turn on." <br><br> Unfortunately, you were in a rush when you built this particular toy and forgot to label it. <br><br> If you only had one chance to try <b>a SINGLE action to get the toy to turn on the light for your boss</b>, which action would you want to take? <b>You will get a ${bonus_amount} bonus if the light turns on</b>.
`
    goal_html_action_slide = `Remember, you will receive a <b>${bonus_amount} bonus if you make the toy play music</b>. You will lose out on this bonus if your action doesn't make the toy turn on the light.`
} else if (goal_condition == "learning" && outcome == "music") {
    goal_text_html = `One day you are at your desk working and your boss walks by. He says, "That must be one of the new toys that you've been working on. But it looks like you forgot to put on the label! Can you figure out whether this toy is a ButtonMusic toy, HandleMusic toy, or BothMusicLight toy?" <br><br> If you only had one chance to try <b>a SINGLE action to figure out which toy this is</b>, which action would you want to take? <b>you will get a ${bonus_amount} bonus after submitting the HIT if you figure it out correctly</b>.`
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
    goal_text_html = `One day you see one of these toys lying on the ground.<br><br>If you only had <b>one chance to play with this toy</b>, which action would you want to take?
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
    music_box_html = `<img src="imgs/${music_box[i]}" height="120" width="200">`
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
