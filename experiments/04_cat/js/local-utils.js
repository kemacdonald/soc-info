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

const build_final_prompt = (condition) => {
  switch (condition) {
    case "activation":
      $(".display_condition").html("and you want to hear music.")
      break;
    case "learning":
      $(".display_condition").html("and you want to learn about these toys.")
      break;
    case "presentation":
      $(".display_condition").html("and you want to impress Bob.")
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
    if (selected_img != "bob.png") {
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
}

const show_select_prompt = (img_array) => {
  switch (img_array.length) {
    case 3:
      $("#toy_select_prompt").html("Which one of Bob's toys do you want to play with first?")
      break;
    case 2:
      $("#toy_select_prompt").html("Bob is still making food in the kitchen. Which toy do you want to play with next?")
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
  $("#action_prompt").css('visibility', 'hidden');
  $("#submit_action").css('visibility', 'hidden');
  $("#error_msg").css('color', 'red');
  $("#error_msg").html("Oh no, that didn't work! You couldn't make the toy play music. <br> <font color='black'> Click <font color = 'blue'>[here]</font> to try again.</font>")
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


const handle_failure = (curr_toy) => {
  disable_radios("action_select");
	disable_button("submit_action");
  show_failure_msg();

  $("#error_msg").one("click", function() {
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
  });
}


const handle_success = (n_successes, curr_toy) => {
	disable_radios("action_select");
	disable_button("submit_action");
  show_success_msg(n_successes);

  const myAudio = $('#sound_player')[0];
  myAudio.play();

  $('#sound_player').on('ended', function() {
    if (n_successes == 2) {
      $('#sound_player').off('ended') // remove event listener
      exp.go()
    } else {
      console.log()
      exp.slides.toy_training_trial.build_action_selection(curr_toy);
    }
  });
}
