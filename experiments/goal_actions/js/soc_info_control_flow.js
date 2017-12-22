// ---------------- 3. CONTROL FLOW ------------------
// This .js file determines the flow of the variable elements in the experiment as dictated

showSlide("instructions");


// hide start button if we are in turk preview mode
if (turk.previewMode) {
	$('#start_button').hide()
}

// The main experiment:
//		The variable/object 'experiment' has two distinct but interrelated components:
//		1) It collects the variables that will be delivered to Turk at the end of the experiment
//		2) It has all the functions that change the visual aspect of the experiment such as showing images, etc.

exp = {
  // These variables are the ones that will be sent to Turk at the end.
  // The first batch, however, is set determined by the experiment conditions
  // and therefore should not be affected by the decisions made by the experimental subject.

	// store participant's intervention choice
	action_response: "",

	// store participant's browser info
	browser: BrowserDetect.browser,
	browser_height: $(window).height(),
	browser_width: $(window).width(),
	screen_width: screen.width,
	screen_height: screen.height,
	mobile_device: /Mobi/.test(navigator.userAgent),

	// store slider responses for beliefs over hypotheses
	prior_beliefs: [],
	posterior_beliefs: [],

	// Participant demo info
	about: "",
	comment: "",
	age: "",
	gender: "",
	language: "",

	// Time variables
	exp_start_time: "",
	exp_end_time: "",

	action_trial_start_time: "",
	action_trial_end_time: "",

	hyp_type: "prior", // this is hacky solution to make the hypotheses slides show up in the correct order: basically, we start with the hyp_type as prior and later switch to the posterior for displaying the correct slider bars

	toy_slide: function() {
		// show music box
		$(`#music_box_intro`).html(music_box_html)
		// store the start time of the experiment
		exp.exp_start_time = new Date();
		showSlide('toy_intro')
	},

	//build goal manipulation slide 
	goals_slide: function() {
		$(`#music_box_goals`).html(music_box_html)

		var time_interval = 2500 // in ms should be 2500

		// disable advance button to ensure that participants read goal manipulation
		$('#goals_to_action').prop("disabled", true); 

		// set up goal instructions based on condition
    	var instructions_html = `<table align="center"> ${goal_text_html} </table>`;
    	$(`#goal_text`).html(instructions_html)


    	showSlide(`goal_manipulation`)

    	setTimeout(function() {
    		$('#goals_to_action').prop("disabled", false);
    	}, time_interval); 

  },

  play_music: function(slide_id){

  	myAudio = $('#sound_player')[0];
  	$("#play_music").prop('disabled', true); // disable the music button so participant can only play once
  	 
  	if (slide_id == "action_slide") {
  		var audio_delay = 1500 // ms
  	} else {
  		var audio_delay = 500 // ms
  	}
  	setTimeout(function(){
  	  	myAudio.play(); // play sound
  	 }, audio_delay);

  	 // this function checks that the music has ended 
  	 // and then advances to either goal manipulation or posterior hypotheses slide depending on location in experiment
  	myAudio.addEventListener("ended", function() {
     myAudio.currentTime = 0;

     if(slide_id == "toy_slide") {
     	exp.goals_slide();
     } else if (slide_id == "action_slide") {
     	exp.hypotheses_slide();
     }
 	});	 

 },

 actions_slide: function() { 
 	// show music box
 	$(`#music_box_actions`).html(music_box_html)

 	// show action text based on condition assignment
 	$("#goal_text_action").html(goal_html_action_slide)

 	// store the start time of the actions slide
	exp.action_trial_start_time = new Date();
	showSlide(`actions`)
 },

hypotheses_slide: function() {
	// show music box
	$(`#music_box_hyps`).html(music_box_html)

	// display the correct text
	if(exp.hyp_type == "posterior") {
 		hyp_text_html = "After hearing the toy play music, how likely is it that each of the following are <b>necessary</b> to make the toy play music?";
 	} else if (exp.hyp_type == "prior") {
 		hyp_text_html = "Before performing any action, how likely is it that each of the following are <b>necessary</b> to make the toy play music?";
 	}

 	var hypotheses_html = `<table align="center"> ${hyp_text_html} </table>`;
    $(`#hypotheses_text`).html(hypotheses_html);

    // todo: loop to create sliders programatically and randomize order of hypotheses

 	showSlide('hypotheses')
 },

 hypotheses_check: function() {
 	// get number of sliders
 	n_sliders = $('.slider').length
 	var temp_beliefs = [];
 	var slider_check = "not_changed";

 	// extract all slider values
 	for(i = 0; i < n_sliders; i++) {
 		temp_beliefs.push($('.slider')[i].value == slider_start_val);
 	}

 	// check the slider beliefs array to see if all the values are true, which means
 	if(temp_beliefs.every(checkTrue) == false) {
 		slider_check = "at_least_one_slider_changed"
 	}

 	if(slider_check == "not_changed") {
 		var adjust_sliders_message = '<font color="red">Please adjust at least one of the sliders.</font>';
 		$("#sliders_test_check").show();
 		$("#sliders_test_check").html(adjust_sliders_message);
 	} else if (slider_check == "at_least_one_slider_changed") {
 		// move on in the experiment
 		exp.hypotheses_close();
 	}
 },


 hypotheses_close: function(hyp_type) {
 	// get number of sliders
 	n_sliders = $('.slider').length;

 	// remove slider error message
 	$("#sliders_test_check").hide();

 	// store data
 	if(exp.hyp_type == "prior") {
 		// store the data from the slider bars in the prior beliefs object
		for(i = 0; i < n_sliders; i++) {
 			exp.prior_beliefs.push($('.slider')[i].value);
 		}
 		// reset slider values
 		resetSliders(n_sliders);

 		// show actions slide
 		exp.actions_slide();
 	} else if (exp.hyp_type == "posterior") {
 		// store the data from the slider bars
 		for(i = 0; i < n_sliders; i++) {
 			exp.posterior_beliefs.push($('.slider')[i].value);
 		}
 		// move on to final slide
 		exp.final_slide();	
 	}

 },

 actions_close: function(response){
 	// store the end time of actions trial
 	exp.action_trial_end_time = new Date();
 	// store the action choice
 	exp.action_response = response;

 	// switch the hypothesis type to posterior
 	exp.hyp_type = "posterior";	

 	// play sound which also advances slide (a little hacky)
 	exp.play_music('action_slide');
 },

 final_slide: function() {
 	showSlide('final_questions')
 },

  // Tests if the participant responded to action question
  actions_check: function() {
	// store response 
	response = $(`input:radio[name=intervention]:checked`).val();

	// if response field is empty, then throw an error message
		if (typeof response == 'undefined') {
    		var answer_all_message = '<font color="red">Please select an action.</font>';
    		$("#actions_test_check").html(answer_all_message);
    	} else {
    		exp.actions_close(response); // move on in the experiment
    	};
	},

   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS EXPERIMENT
    check_finished: function() {
		if (document.getElementById('about').value.length < 1) {
		    $("#checkMessage").html('<font color="red">' +
				       'Please make sure you have answered all the questions. Thank you!' +
				       '</font>');
		} else {
		    exp.about = document.getElementById("about").value;
		    exp.comment = document.getElementById("comments").value;
		    exp.age = document.getElementById("age").value;
		    exp.gender = document.getElementById("gender").value;
		    exp.language = document.getElementById("language").value;
		    showSlide("finished");
		    exp.end();
		}
    },

    // END FUNCTION
    end: function () {
    	
    	// decrement maker-getter if this is a turker 
	    if (turk.workerId.length > 0) {
	        var xmlHttp = null;
	        xmlHttp = new XMLHttpRequest()
	        xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
	        xmlHttp.send(null)
	    }
    	
    	// store experiment end time
    	exp.exp_end_time = new Date();

    	showSlide("finished");

    	setTimeout(function () {
			turk.submit(exp);
        }, 500);
    }
}
