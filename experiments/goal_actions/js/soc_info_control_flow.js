
// ---------------- 3. CONTROL FLOW ------------------
// This .js file determines the flow of the variable elements in the experiment as dictated
// by the various calls from pragmods html.


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
	response: "",

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

	//build goal manipulation slide 
	goals_slide: function() {
		// store the start time of the experiment
		exp.exp_start_time = new Date();

	    if(goal_condition == "learning") {
	    	goal_text_html = "<p>They want to know how well you will learn how the toy works. <br> You will receive a bonus at the end of the task if you learn how the toy works.</p>"
	    } else {
	    	goal_text_html = "<p>performance text</p>"
	    }

    	var instructions_html = `<table align="center"> ${goal_text_html} </table>`;
    
    	$(`#goal_text`).html(instructions_html)
    	showSlide(`goal_manipulation`)
  },

  play_music: function(){
  	  setTimeout(function(){
  	  	$("#sound_player")[0].play();
  	  }, 500);

  	  $("#play_music").prop('disabled', true);
 },

 actions_slide: function() {
 	// store the start time of the actions slide
	exp.action_trial_start_time = new Date();
	showSlide(`actions`)
 },

hypotheses_slide: function() {
 	showSlide('hypotheses')
 },

 hypotheses_check: function() {
 	// move on in the experiment
 	exp.hypotheses_close();
 },

 hypotheses_close: function() {
 	exp.final_slide();
 },

 actions_close: function(response){
 	// store the end time of actions trial
 	exp.action_trial_end_time = new Date();
 	// store the action choice
 	exp.response = response;
 	// move to the final slide
 	exp.hypotheses_slide()
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
