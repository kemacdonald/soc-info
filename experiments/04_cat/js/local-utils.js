const build_img_html = (img_array, div_id) => {
  const html = [];

  if (div_id == "toy_imgs_test") {
    img_array = img_array.concat(exp.selected_toys);
    exp.img_keys = img_array;
  }

  img_array.forEach((e) => {
    html.push(`<img src="media/${e}" height="110" width="110" hspace="5">`)
  })

  $(`#${div_id}`).html(html)
}

const build_radio_html = (img_name, div_id) => {
  const html = [];
  const action_str = img_name.split("-")[1].replace(".png", "");

  exp.action_options.forEach((e) => {
    html.push(`<label class="radio-inline">
								<input type="radio" name="action_select" value="${e}-${action_str}"> ${e} ${action_str}
    					</label>`)
  })

  $(`#${div_id}`).html(html)
}

const build_final_prompt = (goal_condition, social_condition) => {

  if (social_condition == "social" ) {
    $("#final_toy_prompt").html("Bob came back from making lunch, <br> but you only have time to play with one more toy.");
    $("#bob_test").css('visibility', 'visible')
  } else {
    $("#final_toy_prompt").html("Bob is still in the kitchen making lunch, <br> but you only have time to play with one more toy.");
    $("#bob_test").css('visibility', 'hidden')
  }

  switch (goal_condition) {
    case "no-goal":
      $(".display_condition").html(`You will receive a ${exp.bonus_amt} cent bonus <br> if you pay attention.`)
      break;
    case "activation":
      $(".display_condition").html(`Imagine you want to hear music. You will receive a ${exp.bonus_amt} cent bonus <br> if you are able to play music.`)
      break;
    case "learning":
      $(".display_condition").html(`Imagine you want to learn about these toys. You will receive a ${exp.bonus_amt} cent bonus <br>if you are able to learn about the toys.`)
      break;
    case "presentation":
      $(".display_condition").html(`Imagine you want to impress Bob. You will receive a ${exp.bonus_amt} cent bonus <br> if you are able to impress him.`)
      break;
    default:
  }
}

const remove_unselected_toys = (unselect_imgs, fade_duration) => {
  unselect_imgs.forEach((e) => {
    $(`img[src$='${e}']`).fadeOut(fade_duration)
  })
}

const update_toy_set = (selected_img) => {
  const unselect_imgs = _.without(exp.img_keys, selected_img);
  remove_unselected_toys(unselect_imgs, fade_duration = 1000);
  exp.selected_toys.push(selected_img) // this keeps track of what toys the user selected
  exp.img_keys = unselect_imgs; // this removes toy from set for second training trial
}

const handle_img_click = (slide_name) => {
  $("img").one("click", function() {
    const selected_img = $(this).attr('src').replace("media/", "");
    if ( _.contains(exp.img_keys, selected_img) ) {
      $(this).css('border', "solid 4px green");
      update_toy_set(selected_img);
      if (slide_name == "toy_training_trial") {
        $('#action_prompt').show()
        $('#toy_select_prompt').css('visibility', 'hidden')
        exp.slides.toy_training_trial.build_action_selection(selected_img)
      } else if (slide_name == "final_toy_choice") {
        setTimeout(function() {
          exp.slides.final_toy_choice.log_toy_choice(selected_img)
        }, 2000);
      }
    }
  });
}

const clear_training_slide = () => {
  $('#toy_action_radios').css('visibility', 'hidden');
  $('#action_prompt').hide()
  $("#submit_action").hide()
  $("#error_msg").hide()
  $("#notes_gif_actions").css('visibility', 'hidden');
}

const show_select_prompt = (img_array) => {
  switch (img_array.length) {
    case 3:
      $("#toy_select_prompt").html("Which one of Bob's toys do you want to play with first?")
      break;
    case 2:
      $("#toy_select_prompt").html("Bob is still making food in the kitchen and can't see or hear you. Which toy do you want to play with next?")
      break;
    default:
  }
  $('#toy_select_prompt').css('visibility', 'visible');
}

const show_action_prompts = () => {
  $('#toy_action_radios').css('visibility', 'visible');
  $("#action_prompt").css('visibility', 'visible');
  $("#submit_action").css('visibility', 'visible');
  $("#submit_action").show();
}

const check_radio_buttons = (radio_name) => {
  if (!$(`input[name='${radio_name}']:checked`).val()) {
    return false
  } else {
    return true
  }
}

const get_toy_type = (action_str) => {
  return _.without(exp.action_options, action_str.split("-")[0]).toString() + "-" + action_str.split("-")[1];
}

const show_error_msg = () => {
  $("#error_msg").css('color', 'red');
  $("#error_msg").html('Please select an action')
  $("#error_msg").show()
}

const check_bob_present = () => {
  if ($("img#bob").css('opacity') == 0) {
    return false
  } else {
    return true
  }
}

const disable_radios = (name) => {
  $(`input[name='${name}']`).attr('disabled', true);
}

const enable_radios = (name) => {
  $(`input[name='${name}']`).attr('disabled', false);
}

const disable_button = (button_id) => {
	$(`#${button_id}`).attr('disabled', true);
}

const enable_button = (button_id) => {
	$(`#${button_id}`).attr('disabled', false);
}

const show_failure_msg = () => {
	$("#error_msg").hide()
  $("#submit_action").html("Try Again")
  $("#action_prompt").css('visibility', 'hidden');
  //$("#submit_action").css('visibility', 'hidden');
  $("#error_msg").css('color', 'red');
  if ( check_bob_present() ) {
    $("#error_msg").html(`Bob says, "Hmm, that didn't work! You couldn't make this toy play music."`)
  } else {
    $("#error_msg").html(`That didn't work! You couldn't make this toy play music.`)
  }

  $("#error_msg").show()
}

const show_leave_msg = () => {
	$("#error_msg").hide()
  $("#error_msg").css('color', 'black');
  $("#error_msg").html("Bob just left to make lunch in the kitchen and <br> won’t be able to see or hear you.")
  $("#error_msg").show()
}

const show_success_msg = (n_successes) => {
	$("#error_msg").hide()
	$("#error_msg").css('color', 'green');
  if (n_successes < 2) {
    $("#error_msg").html("That worked! Can you make it play music again?");
  } else {
    $("#error_msg").html("That worked again!");
  }
  $("#error_msg").show()
}

const init_try_again = (curr_toy) => {
    disable_button("submiit_action")
    const fade_duration = 2000;
    const fade_opacity = 0;
    const is_bob_present = check_bob_present();
    $("#error_msg").hide()
    if (is_bob_present) {
      show_leave_msg();
      $("img#bob").fadeTo(fade_duration, fade_opacity)
      setTimeout(function() {
        $("#error_msg").hide()
        _s.build_action_selection(curr_toy);
      }, fade_duration + 1500);
    } else {
      exp.slides.toy_training_trial.build_action_selection(curr_toy);
    }
}

const get_music = (music_path) => {
  $("#sound_player").attr("src", `media/${music_path}`);
}


const handle_failure = () => {
  disable_radios("action_select");
  show_failure_msg();
}

const handle_success = (n_successes, curr_toy) => {
	disable_radios("action_select");
	disable_button("submit_action");
  $("#notes_gif_actions").css('visibility', 'visible');
  const myAudio = $('#sound_player')[0];
  myAudio.play();

  $('#sound_player').on('ended', function() {
    if (n_successes == 2) {
      $('#sound_player').off('ended') // remove event listener
      exp.go()
    } else {
      show_success_msg(n_successes);
      exp.slides.toy_training_trial.build_action_selection(curr_toy);
    }
  });
}
