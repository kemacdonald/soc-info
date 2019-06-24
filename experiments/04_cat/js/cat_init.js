/// init ///
function init() {
  exp.action_options = ["left", "right"];
  exp.condition = _.sample(["learning-social","learning-no_social",
                            "activation-social", "activation-no_social",
                            "presentation-social",
                            "no_goal-social", "no_goal-no_social"]);
  exp.goal_condition = extract_goal_condition(exp.condition);
  exp.social_condition = extract_soc_condition(exp.condition);
  exp.img_keys = _.shuffle(["cube-spinner.png", "cyl-lever.png", "tri-button.png"]);
  exp.music_keys = _.shuffle(["song1_trim.mp3", "song2_trim.mp3", "song3_trim.mp3"]);
  exp.data_trials = [];
  exp.selected_toys = [];
  exp.bonus_amt = 10;
  exp.system = {
    Browser: BrowserDetect.browser,
    OS: BrowserDetect.OS,
    screenH: screen.height,
    screenW: screen.width,
  };
  //blocks of the experiment
  exp.structure = ["i0", "sound_test", "instructions", "toy_training_trial", "toy_training_trial", "final_toy_choice", "subj_info", "thanks"];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  // hide everything
  $('.slide').hide();
  $('#').hide();

  // get client ip address and store in exp object
  $.getJSON('https://ipapi.co/json/', function(data) {
    exp.system.ip_data = data;
  });

  if ( !(["chrome", "firefox"].includes(exp.system.Browser.toLowerCase())) ) {
    $("#start_button").attr('disabled', true);
    $("#init_msg").html(`This HIT only works with the Chrome or Firefox browsers. <br> Please switch browsers to complete the HIT, thank you.`)
    $("#init_msg").show();
  } else if (turk.previewMode) {
    $("#start_button").attr('disabled', true);
    $("#init_msg").html(`Note that this HIT is too short to preview. Please accept the HIT first, thank you.`)
    $("#init_msg").show();
  } else  {
    $("#start_button").click(function() {
      exp.go();
    });
  }
  exp.go(); //show first slide
}
