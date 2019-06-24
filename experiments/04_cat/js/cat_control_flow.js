function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
    name: "i0",
    start: function() {
      exp.startT = Date.now();
    }
  });

  slides.sound_test = slide({
    name: "sound_test",
    start: function() {
      $("#soundtest_wrong").hide();
    },
    play_test: function() {
      $("#sound_player_check")[0].play();
    },
    check_sound_test: function() {
      const user_input_word = $("#soundtest_input").val().trim().toLowerCase();
      if ( user_input_word.length == 0 ) {
        $("#soundtest_wrong").html("Please type in the object you were asked to find.")
        $("#soundtest_wrong").show();
      } else if ( user_input_word != "shoe" ) {
        $("#soundtest_wrong").html("Hmm, that's the incorrect word. Please make sure your sound is on.")
        $("#soundtest_wrong").show();
      } else {
        exp.go()
      }
    }
  });

  slides.instructions = slide({
    name: "instructions",
    start: function() {
      build_img_html(exp.img_keys, "toy_imgs_intro");
    },
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.toy_training_trial = slide({
    name: "toy_training_trial",
    start: function() {
      this.action_counter = 1; this.success_counter = 0;
      get_music( exp.music_keys.pop() );
      clear_training_slide();
      show_select_prompt(exp.img_keys);
      build_img_html(exp.img_keys, "toy_imgs_train");
      handle_img_click(this.name);
    },
    build_action_selection: function(curr_img) {
      build_radio_html(curr_img, "toy_action_radios");
      show_action_prompts();
      $("#notes_gif_actions").css('visibility', 'hidden');
      enable_radios("action_select");
      $("#submit_action").html("Submit Action");
      enable_button("submit_action");
      $("#play_music").prop('disabled', true); // disable the music button so participant can only play once
      this.toy = curr_img;
      this.start_time = Date.now();
    },
    submit_action: function() {
      if ($("#submit_action").html() == "Try Again") {
        init_try_again(this.toy);
      } else {
        if (check_radio_buttons("action_select")) {
          const curr_action = $(`input[name='action_select']:checked`).val();
          if (this.action_counter == 1) {
            this.toy_type = get_toy_type(curr_action)
          };
          const curr_success = curr_action == this.toy_type

          exp.data_trials.push({
            "trial_type": this.name,
            "toy": this.toy,
            "toy_type": this.toy_type,
            "action_number": this.action_counter,
            "action": curr_action,
            "success": curr_success,
            "rt": Date.now() - this.start_time
          });

          this.action_counter++

          if (curr_success) {
            this.success_counter++
            handle_success(this.success_counter, this.toy);
          } else {
            handle_failure(this.toy)
          }
        } else {
          show_error_msg();
        }
      }
    }
  });

  slides.final_toy_choice = slide({
    name: "final_toy_choice",
    start: function() {
      this.start_time = Date.now();
      $(".err").hide();
      $("#why_prompt").hide()
      $("#adv_qa").hide();

      if (exp.social_condition == "no_social") {
        $("#bob_test").remove()
        $( "div.test_column" ).removeClass()
      }

      build_img_html(exp.img_keys, "toy_imgs_test");
      build_final_prompt(exp.goal_condition, exp.social_condition);
      handle_img_click(this.name);
    },
    log_toy_choice: function(toy_selection) {
      if ( $("#why_toy").val().trim().length > 0 ) { // checks if there is text
        exp.data_trials.push({
          "trial_type": this.name,
          "toy": this.toy_selection,
          "toy_type": "NA",
          "action_number": "NA",
          "action": "NA",
          "success": "NA",
          "rt": Date.now() - this.start_time,
          "why_toy": $("#why_toy").val()
        });
        setTimeout(function() {
          exp.go();
        }, 500);
      } else {
        $('#error_msg_toy_choice').html("Please enter a response before advancing")
        $('#error_msg_toy_choice').show()
      };
    }
  });

  slides.subj_info = slide({
    name: "subj_info",
    submit: function(e) {
      exp.subj_data = {
        language: $("#language").val(),
        enjoyment: $("#enjoyment").val(),
        asses: $('input[name="assess"]:checked').val(),
        age: $("#age").val(),
        gender: $("#gender").val(),
        education: $("#education").val(),
        comments: $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name: "thanks",
    start: function() {
      exp.data = {
        "trials": exp.data_trials,
        "system": exp.system,
        "goal_condition": exp.goal_condition,
        "social_condition": exp.social_condition,
        "subject_information": exp.subj_data,
        "time_in_minutes": (Date.now() - exp.startT) / 60000
      };
      setTimeout(function() {
        turk.submit(exp.data);
      }, 1000);
    }
  });

  return slides;
}