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

    // store manipulation check responses
    manip_check_music_response: [],
    manip_check_light_response: [],
    manip_check_order: [],
    manip_check_effect_order: effect_labels,

    // store participant's intervention choice
    action_response: "",
    goal_condition: goal_condition,

    // store randomization stuff
    music_box: music_box,
    hypotheses_slider_order_prior: "",
    hypotheses_slider_order_posterior: "",
    actions_buttons_order: "",
    toy_inst_num: 0,

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
    experiment_completion_time: "",
    action_trial_time: "",

    hyp_type: "prior", // this is hacky solution to make the hypotheses slides show up in the correct order: basically, we start with the hyp_type as prior and later switch to the posterior for displaying the correct slider bars
    rand_slider_labels: shuffle(hypotheses_slider_labels),
    rand_action_labels: shuffle(action_labels),

    toy_slide: function () {
        // hide music gif
        $(`#notes_gif`).css('visibility', 'hidden')
        // show music box
        $(`#music_box_intro`).html('<img src="imgs/' + label_inst + '" height="350" width="500">')
        // store the start time of the experiment
        exp.exp_start_time = new Date();
        showSlide('toy_intro')
    },

    //    //build goal manipulation slide
    //    goals_slide: function () {
    //        //		$(`#music_box_goals`).html(music_box_html)
    //
    //        time_interval = 2500 // in ms should be 2500
    //
    //        // disable advance button to ensure that participants read goal manipulation
    //        $('#goals_to_action').prop("disabled", true);
    //
    //        // set up goal instructions based on condition
    //        instructions_html = `<table align="center"> ${goal_text_html} </table>`;
    //        $(`#goal_text`).html(instructions_html)
    //
    //
    //        showSlide(`goal_manipulation`)
    //
    //        setTimeout(function () {
    //            $('#goals_to_action').prop("disabled", false);
    //        }, time_interval);
    //
    //    },

    play_music: function (slide_id) {

        myAudio = $('#sound_player')[0];
        $("#play_music").prop('disabled', true); // disable the music button so participant can only play once

        if (slide_id == "action_slide") {
            var audio_delay = 1500 // ms
        } else if (slide_id == "toy_slide") {
            var audio_delay = 500 // ms
        }

        // this error handling code deals with a change in Safari which made user interaction required for starting audio
        var promise = myAudio.play();

        if (promise !== undefined) {
            promise.catch(error => {
                // Auto-play was prevented, so we just show the visual GIF and advance the slide without playing music
                setTimeout(function () {
                    if (slide_id == "action_slide") {
                        $(`#notes_gif_actions`).css('visibility', 'visible')
                    } else {
                        $(`#notes_gif`).css('visibility', 'visible')
                    }

                    if (slide_id == "toy_slide") {
                        exp.goals_slide();
                    } else if (slide_id == "action_slide") {
                        exp.hypotheses_slide();
                    }
                }, audio_delay);

            }).then(() => {
                // Auto-play started
                console.log("all good")
                // if we don't get a promise error, then execute the rest of the function
                setTimeout(function () {
                    window.scrollTo(0, 0);
                    myAudio.play(); // play sound
                    if (slide_id == "action_slide") {
                        $(`#notes_gif_actions`).css('visibility', 'visible')
                    } else {
                        $(`#notes_gif`).css('visibility', 'visible')
                    }
                }, audio_delay);

                // this function checks that the music has ended
                // and then advances to either goal manipulation or posterior hypotheses slide depending on location in experiment
                myAudio.addEventListener("ended", function () {
                    myAudio.currentTime = 0;

                    if (slide_id == "toy_slide") {
                        exp.goals_slide();
                    } else if (slide_id == "action_slide") {
                        exp.hypotheses_slide();
                    }
                });
            });
        }


    },

    toy_instructions_slide: function () {
        exp.toy_inst_num++;
        window.scrollTo(0, 0);

        if (outcome == "music") {
            toys_not_both = remove(exp.rand_slider_labels, "BothMusicLight");
            toy_both = "BothMusicLight"
            toys_inst = {
                ButtonMusic: "<b>ButtonMusic toy</b> instructions: Press the button on the right to play music. Pull the handle on the left to turn on the light. Doing both produces both effects at the same time.",
                HandleMusic: "<b>HandleMusic toy</b> instructions: Pull the handle on the left to play music. Press the button on the right to turn on the light. Doing both produces both effects at the same time.",
                BothMusicLight: "<b>BothMusicLight toy</b> instructions: Pull the handle on the left AND press the button on the right to play music and turn on the light at the same time. The button press or handle pull on its own doesn’t produce any effect."
            }
        } else {
            toys_not_both = remove(exp.rand_slider_labels, "BothLightMusic");
            toy_both = "BothLightMusic"
            toys_inst = {
                ButtonLight: "<b>ButtonLight toy</b> instructions: Press the button on the right to turn on the light. Pull the handle on the left to play music. Doing both produces both effects at the same time.",
                HandleLight: "<b>HandleLight toy</b> instructions: Pull the handle on the left to turn on the light. Press the button on the right to play music. Doing both produces both effects at the same time.",
                BothLightMusic: "<b>BothLightMusic toy</b> instructions: Pull the handle on the left AND press the button on the right to turn on the light and play music at the same time. The button press or handle pull on its own doesn’t produce any effect."

            }
        };

        if (exp.toy_inst_num == 1) {
            exp.manip_check_order.push(toys_not_both[0]);
            $(`#music_box_instructions`).html(
                '<p class="action-text" align="center">These are the instructions for <b>the ' + toys_not_both[0] + ' toy</b>.</p>' +
                '<img src="imgs/' + toys_not_both[0] + '.jpeg" height="200" width="300">' +
                '<p class="action-text"><i>' + toys_inst[toys_not_both[0]] + '</i></p>')
        } else if (exp.toy_inst_num == 2) {
            exp.manip_check_order.push(toys_not_both[1]);
            $(`#music_box_instructions`).html(
                '<p class="action-text" align="center">These are the instructions for <b>the ' + toys_not_both[1] + ' toy</b>.</p>' +
                '<img src="imgs/' + toys_not_both[1] + '.jpeg" height="200" width="300">' +
                '<p class="action-text"><i>' + toys_inst[toys_not_both[1]] + '</i></p>')
        } else if (exp.toy_inst_num == 3) {
            exp.manip_check_order.push(toy_both);
            $(`#music_box_instructions`).html(
                '<p class="action-text" align="center">These are the instructions for <b>the  ' + toy_both + ' toy</b>.</p>' +
                '<img src="imgs/' + toy_both + '.jpeg" height="200" width="300">' +
                '<p class="action-text"><i>' + toys_inst[toy_both] + '</i></p>')
        };

        for (i = 0; i < exp.rand_action_labels.length; i++) {
            action_label = exp.rand_action_labels[i];

            // check if there is whitespace handles the case of  "both purple and orange buttons"
            if (action_label.includes(" and ")) {
                initial_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="initial_action1" value="both"/>' + action_label + '</label></span>'
            } else if (action_label.includes("button")) {
                initial_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="initial_action1" value="button"/>' + action_label + '</label></span>'
            } else if (action_label.includes("handle")) {
                initial_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="initial_action1" value="handle"/>' + action_label + '</label></span>'
            }

            $(`#initial1_button_` + i.toString()).html(initial_html);

            if (action_label.includes(" and ")) {
                initial_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="initial_action2" value="both"/>' + action_label + '</label></span>'
            } else if (action_label.includes("button")) {
                initial_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="initial_action2" value="button"/>' + action_label + '</label></span>'
            } else if (action_label.includes("handle")) {
                initial_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="initial_action2" value="handle"/>' + action_label + '</label></span>'
            }
            $(`#initial2_button_` + i.toString()).html(initial_html);
        }

        $('#initial_question1').html('How would you make this toy <b>' + effect_labels[0] + '</b>?');
        $('#initial_question2').html('How would you make this toy <b>' + effect_labels[1] + '</b>?');


        showSlide('toy-instructions')

    },

    initial_check_close: function (response) {
        // store the end time of actions trial
        //        exp.initial_trial_end_time = new Date();
        // store the action choice
        response1 = response[0];
        response2 = response[1];
        exp.manip_check_music_response.push(response1);
        exp.manip_check_light_response.push(response2);
        $("#initial_test_check").html('');

        // switch the hypothesis type to posterior
        // 	exp.hyp_type = "posterior";

        // wait 500 ms and then display the sucess message
        //  setTimeout(function(){
        //        $("#actions_test_check").html(answer_success_message);
        //     }, 1000);

        // then play sound which also advances slide (a little hacky)
        // 	exp.play_music('action_slide');
        if (exp.toy_inst_num == 3) {
            exp.hypotheses_slide();
        } else {
            exp.toy_instructions_slide();
        }
    },

    // Tests if the participant responded to action question
    initial_check: function () {
        // store response
        response1 = $(`input:radio[name=initial_action1]:checked`).val()
        response2 = $(`input:radio[name=initial_action2]:checked`).val()

        // if response field is empty, then throw an error message
        if (typeof response1 == 'undefined' | typeof response2 == 'undefined') {
            answer_error_message = '<font color="red"><b>Please select a response.</b></font>';
            $("#initial_test_check").html(answer_error_message);
        } else {
            //disable the radio buttons so user can't change answer while music is playing
            $(`input:radio[name=initial_action1]`).attr('disabled', true)
            $(`input:radio[name=initial_action2]`).attr('disabled', true)
            // create answer message
            answer_success_message = `<font color="green"><b>Congratulations! You made the toy play music.</b></font>`
            // clean up the response string and move on in the experiment
            response_clean1 = response1.toLowerCase().replace("/", "");
            response_clean2 = response2.toLowerCase().replace("/", "");
            response_clean = [response_clean1, response_clean2]
            exp.initial_check_close(response_clean);
        };
    },


    hypotheses_slide: function () {
        window.scrollTo(0, 0);
        // show music box
        //	$(`#music_box_hyps`).html(music_box_html)
        $(`#music_box_hyps`).html('<img src="imgs/NoLabel.jpeg" height="200" width="300">')

        // randomize slider labels
        rand_slider_labels = shuffle(hypotheses_slider_labels)


        // display the correct text
        if (exp.hyp_type == "posterior") {
            exp.hypotheses_slider_order_posterior = rand_slider_labels;
            hyp_text_html = "After performing your action, how likely do you think this toy is a ...";
        } else if (exp.hyp_type == "prior") {
            hyp_text_html = "Imagine that one of your toys was missing its label. <br><br> How likely do you think this toy is a ...";
            // store slider label order to link responses to hypothesis later on
            exp.hypotheses_slider_order_prior = rand_slider_labels;
        }

        hypotheses_html = `<table align="center"> ${hyp_text_html} </table>`;
        $(`#hypotheses_text`).html(hypotheses_html);

        // for loop to create sliders programatically and randomize order of hypotheses
        for (i = 0; i < rand_slider_labels.length; i++) {
            toy_label = rand_slider_labels[i];

            // check if there is whitespace handles the case of  "both purple and orange buttons"
            if (toy_label.includes("Both")) {
                slider_html = `<td align="right"><img src="imgs/` + hypotheses_slider_labels[2] + `.jpeg" height="120" width="150" align="right"></td><td><b>` + hypotheses_slider_labels[2] + ` toy</b></td>
          <td>
             <div id="slidecontainer">
                <input type="range" min="1" max="100" value="50" class="slider" id="myRange3">
            </div>
          </td>`
            } else if (toy_label.includes("Button")) {
                slider_html = `<td align="right"><img src="imgs/` + hypotheses_slider_labels[0] + `.jpeg" height="120" width="150" align="right"></td><td><b>` + hypotheses_slider_labels[0] + ` toy</b></td>
    		<td>
    			<div id="slidecontainer">
    				<input type="range" min="1" max="100" value="50" class="slider" id="myRange1">
    			</div>
    		</td>`
            } else if (toy_label.includes("Handle")) {
                slider_html = `<td align="right"><img src="imgs/` + hypotheses_slider_labels[1] + `.jpeg" height="120" width="150" align="right"></td><td><b>` + hypotheses_slider_labels[1] + ` toy</b></td>
    		<td>
    			<div id="slidecontainer">
    				<input type="range" min="1" max="100" value="50" class="slider" id="myRange1">
    			</div>
    		</td>`
            }
            $(`#hyp_row_` + i.toString()).html(slider_html);
        }

        showSlide('hypotheses')
    },

    hypotheses_check: function () {
        // get number of sliders
        n_sliders = $('.slider').length
        var temp_beliefs = [];
        var slider_check = "not_changed";

        // extract all slider values
        for (i = 0; i < n_sliders; i++) {
            temp_beliefs.push($('.slider')[i].value == slider_start_val);
        }

        // check the slider beliefs array to see if all the values are true, which means
        if (temp_beliefs.every(checkTrue) == false) {
            slider_check = "at_least_one_slider_changed"
        }

        if (slider_check == "not_changed") {
            var adjust_sliders_message = '<font color="red"><b>Please adjust at least one of the sliders.</b></font>';
            $("#sliders_test_check").show();
            $("#sliders_test_check").html(adjust_sliders_message);
        } else if (slider_check == "at_least_one_slider_changed") {
            // move on in the experiment
            exp.hypotheses_close();
        }
    },


    hypotheses_close: function (hyp_type) {
        // get number of sliders
        n_sliders = $('.slider').length;

        // remove slider error message
        $("#sliders_test_check").hide();

        // store data
        if (exp.hyp_type == "prior") {
            // store the data from the slider bars in the prior beliefs object
            for (i = 0; i < n_sliders; i++) {
                exp.prior_beliefs.push($('.slider')[i].value);
            }
            // reset slider values
            resetSliders(n_sliders);

            // show actions slide
            exp.actions_slide();
        } else if (exp.hyp_type == "posterior") {
            // store the data from the slider bars
            for (i = 0; i < n_sliders; i++) {
                exp.posterior_beliefs.push($('.slider')[i].value);
            }
            // move on to final slide
            exp.final_slide();
        }

    },

    actions_slide: function () {
        window.scrollTo(0, 100);
        // hide music gif
        $(`#notes_gif_actions`).css('visibility', 'hidden')
        // show music box
        // 		$(`#music_box_actions`).html(music_box_html)
        $(`#music_box_actions`).html('<img src="imgs/LabelInstNoGoal.jpeg" height="400" width="600">')

        // set up goal instructions based on condition
        instructions_html = `<table align="center"> ${goal_text_html} </table>`;
        $(`#goal_text`).html(instructions_html)
        // show action text based on condition assignment
        $("#goal_text_action").html(goal_html_action_slide)
        // create the randomized radio buttons
        //        rand_hyp_labels = shuffle(action_labels);
        //        exp.actions_buttons_order = rand_hyp_labels; // store order in the experiment object

        // build up button html using a for loop
        for (i = 0; i < exp.rand_action_labels.length; i++) {
            //    	button_label = rand_hyp_labels[i];
            action_label = exp.rand_action_labels[i];

            // check if there is whitespace handles the case of  "both purple and orange buttons"
            //    	if(hasWhiteSpace(button_label)) {
            if (action_label.includes(" and ")) {
                button_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="intervention" value="both"/>' + action_label + '</label></span>'
            } else if (action_label.includes("button")) {
                button_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="intervention" value="button"/>' + action_label + '</label></span>'
            } else if (action_label.includes("handle")) {
                button_html = '<span><label class="btn btn-default btn-action"><input type="radio" name="intervention" value="handle"/>' + action_label + '</label></span>'
            }

            $(`#action_button_` + i.toString()).html(button_html);
        }

        // store the start time of the actions slide
        exp.action_trial_start_time = new Date();
        showSlide(`actions`)
    },

    actions_close: function (response) {
        // store the end time of actions trial
        exp.action_trial_end_time = new Date();
        // store the action choice
        exp.action_response = response;

        // switch the hypothesis type to posterior
        exp.hyp_type = "posterior";

        // wait 500 ms and then display the sucess message
//        setTimeout(function () {
//            window.scrollTo(0, 0);
//            $("#actions_test_check").html(answer_success_message);
//            $(`#music_box_actions`).html('<img src="imgs/'+ response_outcome + '" height="200" width="300">')
//        }, 500);

//        if (response == "both" || outcome == "music") {
//        // then play sound which also advances slide (a little hacky)
//        exp.play_music('action_slide');            
//        } else {
//        setTimeout(function () {
//          exp.hypotheses_slide();
//        }, 2000);
//        }
        
        setTimeout(function () {
            exp.final_slide();
        }, 500);
        
    },

    final_slide: function () {
        showSlide('final_questions')
    },

    // Tests if the participant responded to action question
    actions_check: function () {
        // store response
        response = $(`input:radio[name=intervention]:checked`).val()

        // if response field is empty, then throw an error message
        if (typeof response == 'undefined') {
            answer_error_message = '<font color="red"><b>Please select an action.</b></font>';
            $("#actions_test_check").html(answer_error_message);
        } else {
            //disable the radio buttons so user can't change answer while music is playing
            $(`input:radio[name=intervention]`).attr('disabled', true)
            // create answer message
            if (response == "both") {
                answer_success_message = `<font color="green"><b>Look, you made the toy play music and turn on the light!</b></font>`
                response_outcome = "toyLight.jpeg"
            } else if (outcome == "music") {
                answer_success_message = `<font color="green"><b>Look, you made the toy play music!</b></font>`
                response_outcome = "NoLabel.jpeg"
            } else if (outcome == "light") {
                answer_success_message = `<font color="green"><b>Look, you made the toy turn on the light!</b></font>`
                response_outcome = "toyLight.jpeg"
            }
            // clean up the response string and move on in the experiment
            response_clean = response.toLowerCase().replace("/", "");
            exp.actions_close(response_clean);
        };
    },

    // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS EXPERIMENT
    check_finished: function () {
        if (document.getElementById('about').value.length < 1) {
            $("#checkMessage").html('<font color="red">' +
                '<b>Please make sure you have answered all the questions. Thank you!</b>' +
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

        // store experiment end time
        exp.exp_end_time = new Date();

        // compute experiment time variables (all in ms)
        exp.experiment_completion_time = exp.exp_end_time.getTime() - exp.exp_start_time.getTime();

        exp.action_trial_time = exp.action_trial_end_time.getTime() - exp.action_trial_start_time.getTime();

        // decrement maker-getter if this is a turker
        if (turk.workerId.length > 0) {
            var xmlHttp = null;
            xmlHttp = new XMLHttpRequest()
            xmlHttp.open("GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
            xmlHttp.send(null)
        }

        showSlide("finished");

        setTimeout(function () {
            turk.submit(exp);
        }, 500);
    }
}