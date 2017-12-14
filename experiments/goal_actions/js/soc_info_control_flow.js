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
	beliefs_hypotheses: [],

	// Participant demo info
	about: "",
	comment: "",
	age: "",
	gender: "",

	// Time variables
	exp_start_time: "",
	exp_end_time: "",

	action_trial_start_time: "",
	action_trial_end_time: "",

	hyp_type: "prior", // this is hacky solution to make the hypotheses slides show up in the correct order: basically, we start with the hyp_type as prior and later switch to the posterior for displaying the correct slider bars

	toy_slide: function() {
		showSlide('toy_intro')
	},

	//build goal manipulation slide 
	goals_slide: function() {
		// store the start time of the experiment
		exp.exp_start_time = new Date();

		// disable advance button to ensure that participants read goal manipulation
		$('#goals_to_action').prop("disabled", true); 

	    if(goal_condition == "learning") {
	    	goal_text_html = "<p>The toy developer wants to know how quickly children could <b>learn</b> how to make the toy play music. <br><br> You will receive a bonus at the end of the task for learning which action makes the toy work.</p>"
	    } else {
	    	goal_text_html = "<p>performance text</p>"
	    }

    	var instructions_html = `<table align="center"> ${goal_text_html} </table>`;
    	
    	$(`#goal_text`).html(instructions_html)
    	showSlide(`goal_manipulation`)

    	setTimeout(function() {
    		$('#goals_to_action').prop("disabled", false);
    	}, 0); // should be 2500

  },

  play_music: function(){
  	myAudio = $('#sound_player')[0];
  	$("#play_music").prop('disabled', true); // disable the music button so participant can only play once
  	 setTimeout(function(){
  	  	myAudio.play(); // play sound
  	  }, 500);

  	// this function checks that the music has ended and then advances to the goal manipulation slide
  	/*myAudio.addEventListener("ended", function() {
     myAudio.currentTime = 0;
     exp.goals_slide()
 	});	 */

 	exp.goals_slide();
 },

 actions_slide: function() {
 	// store the start time of the actions slide
	exp.action_trial_start_time = new Date();
	showSlide(`actions`)
 },

hypotheses_slide: function() {
	if(exp.hyp_type == "posterior") {
 		hyp_text_html = "After performing your action, how likely is it that each of the following actions are how the toy plays music?";
 	} else if (exp.hyp_type == "prior") {
 		hyp_text_html = "Before performing any action, how likely is it that each of the following actions are how the toy plays music?";
 	}

 	var hypotheses_html = `<table align="center"> ${hyp_text_html} </table>`;
    $(`#hypotheses_text`).html(hypotheses_html);

    //loop to create sliders
    hypotheses = ['Press just the Orange Button', 'Press just the Purple Button', 'Press both the Purple and Orange Buttons'];
    randomized_hyps = shuffle(hypotheses);

    for (var i = 0; i<hypotheses.length; i++) {
        // display prompt
        $("#ref" + i).html(randomized_hyps[i]);
        //var responses["target" + i] = randomized_hyps[i];
        $('#hyp_slider' + i).slider({
            animate: true,
            orientation: "horizontal",
            max: 1 , min: 0, step: 0.01, value: 0.5,
        });
    }


 	showSlide('hypotheses')
 },

 hypotheses_check: function() {
 	// todo: some code to make sure participants adjusted the sliders

 	// move on in the experiment
 	exp.hypotheses_close();
 },


 hypotheses_close: function(hyp_type) {
 	if(exp.hyp_type == "prior") {
 		// todo store the data from the slider bars
 		showSlide('actions')
 	} else if (exp.hyp_type == "posterior") {
 		// todo store the data from the slider bars
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
 	// move to the final slide
 	exp.hypotheses_slide();
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
				       'Please make sure you have answered all the questions!' +
				       '</font>');
		} else {
		    exp.about = document.getElementById("about").value;
		    exp.comment = document.getElementById("comments").value;
		    exp.age = document.getElementById("age").value;
		    exp.gender = document.getElementById("gender").value;
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
