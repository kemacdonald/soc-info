
// ---------------- 3. CONTROL FLOW ------------------
// This .js file determines the flow of the variable elements in the experiment as dictated
// by the various calls from pragmods html.

/*
Here the images used in the experiment are loaded in two arrays.
The first is base_image_pl, which stores the "underlying" or base images
which will then be modified with props stored in the props_image_pl Array.

NOTE: Unfortunately the number of variations for each type of object is hardcoded.
To make the code more usable it will be necessary to
*/



showSlide("instructions");

// hide start button if we are in turk preview mode
if (turk.previewMode) {
	$('#start_button').hide()
}

// The main experiment:
//		The variable/object 'experiment' has two distinct but interrelated components:
//		1) It collects the variables that will be delivered to Turk at the end of the experiment
//		2) It has all the functions that change the visual aspect of the experiment such as showing images, etc.

shape_pairs = []
for (shape1 of shapes) {
  for (shape2 of shapes) {
    if (shape1 != shape2){
      shape_pairs.push([shape1, shape2])
    }
  }
}

exp = {
  // These variables are the ones that will be sent to Turk at the end.
  // The first batch, however, is set determined by the experiment conditions
  // and therefore should not be affected by the decisions made by the experimental subject.

	// Order of questions
	permutations_used: permutations,

	// Store all data
	data: [],

	// Pre-test answers
	r_pretest_answers,
	e_pretest_responses,

	// Post-test answers
	r_posttest_answers,
	e_posttest_responses,

	// Presentation order for relational tests
	r_pretest_order_as_presented: [],
	r_posttest_order_as_presented: [],

	// Presentation order for entity tests
	e_pretest_q_order_as_presented: [],
	e_posttest_q_order_as_presented: [],
	e_pretest_shape_order_as_presented: [],
	e_posttest_shape_order_as_presented: [],


	// Shapes guessed
	guesses: [],

	// Participant demo info
	about: "",
	comment: "",
	age: "",
	gender: "",

	// measuring time of experiment
	exp_time: "",

	// measuring time of training
	training_time: "",


	// To keep the parameters in the csv file
	all_answers_provided: all_answers_provided,
	questions_permuted: questions_permuted,
	skip_check: skip_check,
	training_condition: training_condition,
	examples_to_show: examples_to_show,
	shape_of_focus: shape_of_focus,


	//build relational slide for both pretest and posttest
	relational_slide: function(test_id) {

		if (test_id == "pretest") {
			exp_times.push(new Date());
		}

		r_pretest_shuffled = _.shuffle(shape_pairs); // shuffle shape pairs to randmoize presentation order	
	    question_html = ""
	    for (pair of r_pretest_shuffled) {
	      shape1 = pair[0]; shape2 = pair[1]
	      if (shape1 != shape2) {
	        q_id = `r_${test_id}_${shape1}_${shape2}`
	        exp.r_pretest_order_as_presented.push(q_id); // store presentation order 
	        question_html += 
		        `<tr> 
		        	<td>Are all ${shape1} also ${shape2}?</td> 
		        	<td> 
		        		<label class="btn btn-default"><input type="radio" name="${q_id}" value="yes"/>Yes</label> 
		        		<label class="btn btn-default"><input type="radio" name="${q_id}" value="no"/>No</label>  
		        	</td> 
		        </tr>`
	      }
    }
    var relational_html = `Here are some questions testing your knowledge of quadrilaterals. <br> Please answer yes or no to each of the questions: <br> <br> <table align="center"> ${question_html} </table>`;
    
    $(`#relational_${test_id}_questions`).html(relational_html)
    showSlide(`relational_${test_id}`)
  },

  relational_answers: function (test_id) {
  	// get participants answers in the order they gave them
    answers = [];
    counter = 0;
    for (pair in shape_pairs) {
    	if (test_id == "pretest") {
    		current_pair = exp.r_pretest_order_as_presented[pair]; 
    		response = $(`input:radio[name=${current_pair}]:checked`).val();
    		answers.push(response);

    		// trial level data storage
    		trial_data = {
	    		trial_type: "relational",
	    		block: test_id,
	    		trial_num_within_block: counter + 1,
	    		response: response,
	    		shape: current_pair.slice(current_pair.lastIndexOf('_')+1),
	    		question: current_pair.slice(current_pair.indexOf('_',3)+1,current_pair.indexOf('_',current_pair.indexOf('_',3)+1))
	    	};
	    	exp.data.push(trial_data);
	    	counter++;
    	} else if (test_id == "posttest") {
    		current_pair = exp.r_posttest_order_as_presented[pair]; 
    		response = $(`input:radio[name=${current_pair}]:checked`).val();
    		answers.push(response);

    		response = $(`input:radio[name=${current_pair}]:checked`).val();
    		trial_data = {
	    		trial_type: "relational",
	    		block: test_id,
	    		trial_num_within_block: counter + 1,
	    		response: response,
	    		shape: current_pair.slice(current_pair.lastIndexOf('_')+1),
	    		question: current_pair.slice(current_pair.indexOf('_',3)+1,current_pair.indexOf('_',current_pair.indexOf('_',3)+1))
	    	};
	    	exp.data.push(trial_data);
	    	counter++;
    	}
    }
    return answers
  },

  relational_close: function (test_id) {
  	if (test_id == "pretest") {
  		exp.r_pretest_answers = exp.relational_answers(test_id)	
  	} else {
  		exp.r_posttest_answers = exp.relational_answers(test_id)
  	}
    
  },

  entity_questions_log: function (shape_name, test_id, q_shape_name) {
  	if (test_id == "pretest") {
  		exp.e_pretest_shape_order_as_presented.push(shape_name);
  		exp.e_pretest_q_order_as_presented.push(q_shape_name); 
  	} else {
  		exp.e_posttest_shape_order_as_presented.push(shape_name);
  		exp.e_posttest_q_order_as_presented.push(q_shape_name); 
  	}

  },

  entity_slide: function(test_id) {
    question_html = ""
    for (q_shape of _.shuffle(singular_shapes)) {
      answer_html = ""
      for (a_shape of _.shuffle(singular_shapes)) {
        a_id = `e_${test_id}_${q_shape}_${a_shape}`
        a_img_src = `shapes/${a_shape}_${_.random(1,3)}.png`

        // make singular shape plural for html
        if (q_shape == "rhombus") {
        	q_id_html = q_shape.concat("es");
        } else {
        	q_id_html = q_shape.concat("s");
        }

        answer_html += `<td class="entity_response"> <img id="${a_id}" class="withoutHover objTable" width="100px" height="100px" src="${a_img_src}" onclick="$('#${a_id}').toggleClass('highlighted')"> </td>`
        
        // log order of presentation of both question and shapes for each entity question
        exp.entity_questions_log(a_shape, test_id, q_shape); 
      }
      question_html += `<br> Click on all of the ${q_id_html}: <br> <table align="center"> <tr> ${answer_html} </tr> </table>`
    }
    entity_html = `For the following prompts, please select <i>all</i> of the correct answers. <br><br> <b> Note: You can select more than one shape for each question. </b> <br> ${question_html} `
    $(`#entity_${test_id}_questions`).html(entity_html)
    showSlide(`entity_${test_id}`)
  },

  entity_answers: function (test_id) {

    answers = [];
    counter = 0;

	// loop over the images in the entity table to see which ones are highlighted
    if (test_id == "pretest") {
    	$('#pretest_entity_table .entity_response img').each(function() {
	    	answers.push($(this).hasClass("highlighted"));   
	    	
	    	// store data at trial level
	    	if ($(this).hasClass("highlighted")) {
	    		response = "yes";
	    	} else {
	    		response = "no";
	    	};

	    	 trial_data = {
	    		trial_type: "entity",
	    		block: test_id,
	    		trial_num_within_block: counter + 1,
	    		response: response,
	    		shape: exp.e_pretest_shape_order_as_presented[counter],
	    		question: exp.e_pretest_q_order_as_presented[counter]
	    	};
	    	exp.data.push(trial_data);
	    	counter++;
	 	});
    } else if (test_id == "posttest") {

    	$('#posttest_entity_table .entity_response img').each(function() {
	    	answers.push($(this).hasClass("highlighted"));  

	    	// store data at trial level
	    	if ($(this).hasClass("highlighted")) {
	    		response = "yes";
	    	} else {
	    		response = "no";
	    	};

	    	trial_data = {
	    		trial_type: "entity",
	    		block: test_id,
	    		trial_num_within_block: counter + 1,
	    		response: response,
	    		shape: exp.e_posttest_shape_order_as_presented[counter],
	    		question: exp.e_posttest_q_order_as_presented[counter]
	    	};
	    	exp.data.push(trial_data);
	    	counter++; 
	 	});
    };

    return answers
  },

  entity_close: function(test_id){
  	if (test_id == "pretest") {
  		exp.e_pretest_responses = exp.entity_answers(test_id);
  	} else if (test_id == "posttest") {
  		exp.e_posttest_responses = exp.entity_answers(test_id);
  	}
  },


	training_slide: function() {
		// record start time
		startTime = new Date();
		times.push(startTime);

		// update block so we know what type of training slide to show
  		block++  		

		var training_html = "";

		// set up training slide based on block and condition
		if (training_condition == "active_active") {
			training_regime = 3; 
		} else if (training_condition == "passive_passive") {
			training_regime = 4;
		} else if (training_condition == "active_passive" && block == 1) {
				training_regime = 3; // active learning
		} else if (training_condition == "passive_active" && block == 2) {
			training_regime = 3; // active learning
		} else {
			training_regime = 4; // passive learning
		}

		if (training_regime < 2) {
			training_html += "<center><br> We are learning about all the shapes you just ";
			training_html += "answered questions about. <br> Here are examples from each of the ";
			training_html += "categories. Take a close look. <br> At the end of the task you will be tested again on your knowledge. </center><br><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr><td>' + shapes[i] + '</td>';
				for (j = 0; j < 2; j++) {
					training_html += '<td><img width=100px height=100px src=shapes/' + example_list[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		if (training_regime == 2) {
			training_html += "<br> <center>A teacher is going to give you some facts: </center> <br><br>";
			training_html += '<table align="center" >';
			for (i = 0; i < teacher_facts.length; i++) {
				training_html += '<tr><td> Fact #  ' + String(i) + ' </td>';
				training_html += '<td> &nbsp &nbsp' + teacher_facts[i] + '</td>';
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		// Active learning
		// This training regime uses the CSS functionality of highlighting specific images to point out
		// elements of a class of shapes.
		if (training_regime == 3) {

			if (block == 1) {
				training_html += "<br>We are learning about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is, and <br> you will get a chance to select your own examples to help you learn. <br><br> Click on <b>three</b> of the shapes below to learn whether each one is a " + singular_shapes[shape_of_focus] +  " or not. <br><br>";
			} else if (block == 2) {
				training_html += "<br>We are going to continue learning about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is, and <br> you will get a chance to select your own examples to help you learn. <br><br> Click on <b>three</b> of the shapes below to learn whether each one is a " + singular_shapes[shape_of_focus] +  " or not. <br><br>";
			};

			training_html +=  "If it's a <b>" + singular_shapes[shape_of_focus] +  "</b>, it'll turn <font color='blue'>blue</font> when you click it. If it isn't, it'll turn <font color='red'>red</font>. <br><br>Choose carefully so that you can learn as much as you can about " + shapes[shape_of_focus] +  ". <br> At the end of the task you will be tested again on your knowledge. <br><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=100px height=100px class="unchosen objTable" id="tdchoice' + String(i) + '_' + String(j) + '"  onclick="exp.guess_this_shape(' + String(i) + ',' + String(j) + ')" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}

		// Passive learning condition
		if (training_regime == 4) {

			// shuffle the table of shapes
			all_shapes = shuffle(all_shapes);

			if (block == 1) {
				training_html +=  "We are learning about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br><br>";
			} else if (block == 2) {
				training_html += "<br>We are going to continue learning about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br><br>";
			};

			training_html +=  "Here are <b>three</b> examples to show you what <b>" + shapes[shape_of_focus] +  "</b> are. <br><br>";
			training_html +=  " Click on the <b>three</b> shapes with the boxes around them to learn whether each one is a <b>"+ singular_shapes[shape_of_focus] + "</b> or not. <br><br>";
			training_html += "If it's a <b>"+ singular_shapes[shape_of_focus] + "</b>, it'll turn <font color='blue'>blue</font> when you click it. If it isn't, it'll turn <font color='red'>red</font>. <br>";
			training_html +=  " At the end of the task you will be tested again on your knowledge. <br><br>";
			training_html += '<table align="center">';

			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					// grab shape name from all_shapes variable
					console.log(all_shapes[i][j]);
					training_html += '<td><img width=100px height=100px class="withoutHover objTable" id="tdchoice' + String(i) + '_' + String(j) + '"  onclick="exp.select_highlighted_shape(' + String(i) + ',' + String(j) + ')" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}

			training_html += '</table>'
		}

		// Control layout: Same as in 3 & 4, but no participant action required.
		if (training_regime == 5) {
			training_html +=  "<center> Look at these examples of quadrilaterals. <br> Take your time. After you are done examining this set, <br> you will be tested again on your knowledge. </center><br>";
			training_html += '<table align="center">';
			for (i = 0; i < 4; i++) {
				training_html += '<tr>';
				for (j = 0; j < 3; j++) {
					training_html += '<td><img width=100px height=100px class="withoutHover objTable" id="tdchoice' + String(i) + '_' + String(j) + '" src=shapes/' + all_shapes[i][j] + '></td>';
				}
				training_html += '</tr>';
			}
			training_html += '</table>'
		}
		

		
		$("#training_examples").html(training_html);
		showSlide("training");

		// After instantiation
		if (training_regime == 4) {
			exp.highlight_boxes(block);
		}
	},
	

	post_test_slide: function(test_id) {

    	post_test_question_html = ""
    	r_post_test_shuffled = _.shuffle(shape_pairs);

	    for (pair of r_post_test_shuffled) {
	      shape1 = pair[0]; shape2 = pair[1]
	      if (shape1 != shape2) {
	        q_id = `r_${test_id}_${shape1}_${shape2}`
	        exp.r_posttest_order_as_presented.push(q_id); // store presentation order
	        post_test_question_html += 
		        `<tr> 
		        	<td>Are all ${shape1} also ${shape2}?</td> 
		        	<td> 
		        		<label class="btn btn-default"><input type="radio" name="${q_id}" value="yes"/> Yes</label> 
		        		<label class="btn btn-default"><input type="radio" name="${q_id}" value="no"/> No</label>  
		        	</td> 
		        </tr>`
	      }
	    }
   		
   		var post_test_html = `Let's start with some questions. <br> Please answer yes or no on each of the questions: <br> <br> <table align="center"> ${post_test_question_html} </table>`;
    
    	$(`#post_test_questions`).html(post_test_html)
    	
    	showSlide("post_test")
  },

  between_training_slide: function(block) {
  		
  		var between_training_text = "";

  		if (training_condition == "active_active") {
  			between_training_text += "Next, you will get another chance to select your own examples to help you learn about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br><br>";
  		} else if (training_condition == "passive_passive") {
  			between_training_text += "Next, you will be given some more examples to help you learn about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br><br>";
  		} else if (block == 1 && training_condition == "active_passive") {
  			between_training_text += "Next, you will be given some examples to help you learn about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br><br>";
  		} else {
  			between_training_text += "Next, you will get a chance to select your own examples to help you learn about what a <b>" + singular_shapes[shape_of_focus] +  "</b> is. <br><br>";
  		};

  		$("#between_training_html").html(between_training_text);
  		showSlide('between_training')		
  },


	final_slide: function() {
		showSlide("final_questions");
	},


	// Functions for dynamic interaction with the participant:
	//$("#tdchoice" + String(c)).removeClass('unchosen').addClass('chosen')
	select_shape: function(i, j) {
		for (var ii=0; ii<all_shapes.length; ii++) {
			for (var jj = 0; jj<all_shapes[0].length; jj++) {
				$("#tdchoice" + String(ii) + '_' + String(jj)).removeClass('chosen').addClass('unchosen');
			}
		}
		$("#tdchoice" + String(i) + '_' + String(j)).removeClass('unchosen').addClass('chosen');
	},

	// For the case of active learning
	guess_this_shape: function(i, j) {
		if (examples_clicked < examples_to_show) {
			if ($("#tdchoice" + String(i) + '_' + String(j)).attr("class") == "unchosen objTable") {
				if (isShape[shape_of_focus][i] == 0) {
					$("#tdchoice" + String(i) + '_' + String(j)).removeClass('unchosen').addClass('chosen');

					highlighted_shape_name = $("#tdchoice" + String(i) + '_' + String(j)).attr('src');
						clean_name = highlighted_shape_name.slice(highlighted_shape_name.indexOf('/')+1, highlighted_shape_name.lastIndexOf('_'));
							trial_data = {
									trial_type: "training",
						    		block: block,
						    		trial_num_within_block: "NA",
						    		response: "no",
						    		shape: clean_name,
						    		question: shape_of_focus
						    	};
						    exp.data.push(trial_data);

				} else {
					$("#tdchoice" + String(i) + '_' + String(j)).removeClass('unchosen').addClass('chosenCorrect');

					highlighted_shape_name = $("#tdchoice" + String(i) + '_' + String(j)).attr('src');
						clean_name = highlighted_shape_name.slice(highlighted_shape_name.indexOf('/')+1, highlighted_shape_name.lastIndexOf('_'));
							trial_data = {
									trial_type: "training",
						    		block: block,
						    		trial_num_within_block: "NA",
						    		response: "yes",
						    		shape: clean_name,
						    		question: shape_of_focus
						    	};
						    exp.data.push(trial_data);
				}
				examples_clicked = examples_clicked + 1;
				guessed_shapes.push([i, j]);
			};
		};
		if (examples_clicked == examples_to_show) {
			for (var ii = 0; ii < all_shapes.length; ii++) {
				for (jj = 0; jj < all_shapes[0].length; jj++) {
					$("#tdchoice" + String(ii) + '_' + String(jj)).removeClass('unchosen').addClass('withoutHover');
				};
			};
		};
	},


	highlight_boxes: function(block) {
		if (block == 1) {
			var in_highlighted = 0;
			for (i = 0; i < all_shapes.length; i++) {
				for (j = 0; j < all_shapes[0].length; j++) {
					for (ii = 0; ii < highlighted_boxes_block1.length; ii++) {
						if (highlighted_boxes_block1[ii][0] == i && highlighted_boxes_block1[ii][1] == j) {
							$("#tdchoice" + String(i) + '_' + String(j)).addClass('highlighted');
							highlighted_shape_name = $("#tdchoice" + String(i) + '_' + String(j)).attr('src');
							clean_name = highlighted_shape_name.slice(highlighted_shape_name.indexOf('/')+1, highlighted_shape_name.lastIndexOf('_'));
							
							trial_data = {
								trial_type: "training",
					    		block: block,
					    		trial_num_within_block: "NA",
					    		response: "yes",
					    		shape: clean_name,
					    		question: shape_of_focus
					    	};
					    	exp.data.push(trial_data);
						}

					}
				}
			}
		} else {
			var in_highlighted = 0;
			for (i = 0; i < all_shapes.length; i++) {
				for (j = 0; j < all_shapes[0].length; j++) {
					for (ii = 0; ii < highlighted_boxes_block2.length; ii++) {
						if (highlighted_boxes_block2[ii][0] == i && highlighted_boxes_block2[ii][1] == j) {
							$("#tdchoice" + String(i) + '_' + String(j)).addClass('highlighted');
							highlighted_shape_name = $("#tdchoice" + String(i) + '_' + String(j)).attr('src');
							clean_name = highlighted_shape_name.slice(highlighted_shape_name.indexOf('/')+1, highlighted_shape_name.lastIndexOf('_'));

							trial_data = {
									trial_type: "training",
						    		block: block,
						    		trial_num_within_block: "NA",
						    		response: "yes",
						    		shape: clean_name,
						    		question: shape_of_focus
						    	};
						    exp.data.push(trial_data);
						}
					}
				}
			}
		};
	},

	select_highlighted_shape: function(i, j) {
		var in_highlighted = 0;

		if (block == 1) {
			for (ii = 0; ii < highlighted_boxes_block1.length; ii++) {
				if (highlighted_boxes_block1[ii][0] == i && highlighted_boxes_block1[ii][1] == j) {
					in_highlighted = 1;
				}
			}
		} else {
			for (ii = 0; ii < highlighted_boxes_block2.length; ii++) {
				if (highlighted_boxes_block2[ii][0] == i && highlighted_boxes_block2[ii][1] == j) {
					in_highlighted = 1;
				}
			}
		};

		if (examples_clicked < 3 && in_highlighted == 1) {
				if ($("#tdchoice" + String(i) + '_' + String(j)).attr("class") == "withoutHover objTable highlighted") {
					if (isShape[shape_of_focus][i] == 0) {
						$("#tdchoice" + String(i) + '_' + String(j)).removeClass('highlighted').addClass('chosen');
						examples_clicked = examples_clicked + 1;
						guessed_shapes.push([i, j]);

					} else {
						$("#tdchoice" + String(i) + '_' + String(j)).removeClass('highlighted').addClass('chosenCorrect');
						examples_clicked = examples_clicked + 1;
						guessed_shapes.push([i, j]);
					};
				};
		};

	},


	// Tests if the answers to the relational pretest were provided fully
	first_test_check: function(test_id) {
		// get radio button values
		check_answers = [];
		for (pair in shape_pairs) {
	    	if (test_id == "pretest") {
	    		current_pair = exp.r_pretest_order_as_presented[pair]; 
	    		response = $(`input:radio[name=${current_pair}]:checked`).val();
	    		check_answers.push(response);
			}
		}
		// check if any are missing
		var one_missing = 0;
		for (var i = 0; i < questions.length; i++) {
			answer_to_i = check_answers[i];
	    	if (answer_to_i == null) {
	    		one_missing = 1;
	    	}
		};
    	if (one_missing == 1 && skip_check == 0) {
    		var answer_all_message = '<font color="red">Please answer all the questions.</font>';
    		$("#pre_test_check").html(answer_all_message);
    	} else {
    		exp.relational_close(test_id);
    		exp.entity_slide('pretest') 
    	};
	},

	// check if participant actually completed the training 
	training_test_check: function() {
		if ((examples_clicked < examples_to_show) && skip_check == 0) {
			var click_on_three = '<font color="red">Please click on three shapes.</font>';
			$("#training_check").html(click_on_three)
		} else {
			if (block == 1) {
				examples_clicked = 0				// reset examples clicked counter so interaction functionality will work in second block
				$("#training_check").hide();		// remove any error messages shown to the user
				exp.between_training_slide(block)	// go to the between training block slide
			} else {
				// get end of training time
				endTime = new Date();
				times.push(endTime);
				// continue experiment
				exp.post_test_slide("posttest");
			};
		};
	},

	// Tests if the answers to the relational posttest were provided fully. If yes, continue to entity posttest
	second_test_check: function(test_id) {
		// get radio button values
		check_answers = [];
		for (pair in shape_pairs) {
	    	if (test_id == "posttest") {
	    		current_pair = exp.r_posttest_order_as_presented[pair]; 
	    		response = $(`input:radio[name=${current_pair}]:checked`).val();
	    		check_answers.push(response);
			}
		}

		//check to see if any are missing
		var one_missing = 0;
		for (var i = 0; i < questions.length; i++) {
			answer_to_i = check_answers[i];
	    	if (answer_to_i == null) {
	    		one_missing = 1;
	    	}
		};
    	if (one_missing == 1 && skip_check == 0) {
    		var answer_all_message = '<font color="red">Please answer all the questions.</font>';
    		$("#post_test_check").html(answer_all_message);
    	} else {
    		exp.relational_close(test_id);
    		exp.entity_slide('posttest');
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

		    exp.guesses = guessed_shapes;
		    exp.training_time = times[1] - times[0];
		    showSlide("finished");

		    // HERE you can performe the needed boolean logic to properly account for the target_filler_sequence possibilities.
		    // In other words, here you can check whether the choice is correct depending on the nature of the trial.


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
    	
    	// compute experiment time
    	exp_times.push(new Date());
    	exp.exp_time = exp_times[1] - exp_times[0];

    	showSlide("finished");
    	setTimeout(function () {
		turk.submit(exp);
        }, 500);
    }
}
