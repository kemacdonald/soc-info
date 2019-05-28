/// init ///
function init() {
  exp.action_options = ["left", "right"];
  exp.condition = _.sample(["learning", "activation", "presentation"]);
  exp.img_keys = _.shuffle(["cube-spinner.png", "cyl-lever.png", "tri-button.png"]);
  exp.data_trials = [];
  exp.selected_toys = [];
  exp.system = {
    Browser: BrowserDetect.browser,
    OS: BrowserDetect.OS,
    screenH: screen.height,
    screenW: screen.width,
  };
  //blocks of the experiment
  exp.structure = ["i0", "instructions", "toy_training_trial", "toy_training_trial", "final_toy_choice", "subj_info", "thanks"];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {
        $("#mustaccept").show();
      });
      exp.go();
    }
  });

  exp.go(); //show first slide
}
