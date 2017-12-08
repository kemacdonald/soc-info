// ---------------- 2. STIMULUS SETUP ------------------
// Parameters and Stimulus Setup

// Defining the parameters for the study:
// when all the required answers are given this is 1, and the experiment can advance or be submited
var all_answers_provided = 0;

// Permuted questions: Are the questions randomly shuffled, or are they asked in a default order?
// 0 means no permutation, 1 is shuffled.
var questions_permuted = 1;

// Skip the checks/tests for particpants' answers (for debugging mostly)
// 0 means no skip, 1 means it skips
var skip_check = 1;

// Controls the number of training blocks in the experiment 
var block = 0;
var num_blocks = 8;

// Training regime
// 0 delivers an uninformative table of examples.
// 1 delivers an informative table of examples.
// 2 provides descriptions of the qualities of each of the quadrilaterals.
// 3 active learning: Participant can click on any of the 12 example. Turns blue if shape_of_focus, red otherwise
// 4 Passive learning condition: few boxes get highlighted and participant is required to click on the highlighted boxes, a teacher says "these are parallelograms", etc.
// 5 Baseline condition: You present the same layout as in 3 and 4. But no highlighting or anything.
// 6 Active teaching: based on pretest answers, select the shape of focus. otherwise the same as passive learning
var training_conditions = ["active_passive", "passive_active", "active_active", "passive_passive"]
var numConditions = 4;

/*try { 
    var filename = "KM_quadmods_passive_8";
    var condCounts = "3,50";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/KM/subject_equalizer_km/maker_getter.php?conds=" + condCounts + "&filename=" + filename, false );
    xmlHttp.send( null );
    var cond = xmlHttp.responseText; // For actual experimental runs
} catch (e) {
    var cond = random(2,numConditions-1); // if maker-getter fails, generate condition number randomly
}*/

cond = 3;


var training_condition = training_conditions[cond];


// Number of examples to show. This is specifically for the case of training_regime == 3. If training_regime == 4
// then you control the number of examples by editing the highlighted_boxes function, which determines the specific examples used.
var examples_to_show = 3;


// Shape of focus for training:
//  0 -> squares
//  1 -> rectangles
//  2 -> rhombuses
//  3 -> parallelograms
// this does not affect condition 6
// var to_choose_from = [1, 2, 3];
// var shape_of_focus = choose_from(to_choose_from);

var shape_of_focus = 2; // just teach about rhombus


// For the specfic case of training_regime = 4, you have to specify which shapes actually get highlighted.
/*var highlighted_boxes= [];
if (shape_of_focus == 0) {
    highlighted_boxes = [[0, 1], [1, 0], [3, 2]];
}
if (shape_of_focus == 1) {
    highlighted_boxes = [[0, 0], [1, 2], [3, 1]];
}
if (shape_of_focus == 2) {
    highlighted_boxes = [[0, 1], [2, 0], [3, 2]];
}
if (shape_of_focus == 3) {
    highlighted_boxes = [[2, 1], [1, 0], [3, 1]];
}*/

// Randomly generate the shapes that get highlighted (examples) in the passive condition
// 0-2 used because training table contains 3 columns; 0-3 used because training table contains 4 rows
// checkExamples function ensures that each example is unique 
// var highlighted_boxes_block1 = checkExamples([[random(0,3), random(0,2)], [random(0,3), random(0,2)], [random(0,3), random(0,2)]]); 
// var highlighted_boxes_block2 = checkExamples([[random(0,3), random(0,2)], [random(0,3), random(0,2)], [random(0,3), random(0,2)]]);


// This ise to give participants only positive examples of a rhombus
var highlighted_boxes_block1 = [[2,0], [2,1], [2,2]]; 
var highlighted_boxes_block2 = [[2,0], [2,1], [2,2]]; 


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization of the variables that track the responses of users:  Global tracking variables (just a couple).
// In these cases, 0 means yes, 1 means no, and -1 means "answer not provided"
// Unless skip_check is 1, the values cannot be -1 when they are submitted to Turk.
var r_pretest_answers = [];
for (var i = 0; i < 12; i++) {
    r_pretest_answers.push(-1);
}

var r_posttest_answers = [];
for (var i = 0; i < 12; i++) {
    r_posttest_answers.push(-1);
}

var e_pretest_responses = [];
var e_posttest_responses = [];

// In case of training regime 3, keeps track of the number of examples clicked/revealed/tried
var examples_clicked = 0;


// This is to track the shapes that were guessed:
var guessed_shapes = [];

// Time variables
var times = [];
var exp_times = [];



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Processing of variables to set experiment.



// All shapes involved
singular_shapes = ["square", "rectangle", "rhombus", "parallelogram"];
shapes = ["squares", "rectangles", "rhombuses", "parallelograms"];
var questions = [];
var shape_abreviations = [];
for (var i = 0; i < shapes.length; i++) {
    for (var j = 0; j < shapes.length; j++) {
        if (i != j) {
            var this_question = "Are all " + shapes[i] + " also " + shapes[j] +"?";
            questions.push(this_question);
            var this_abreviation = shapes[i][0] + shapes[i][1] + "," + shapes[j][0] + shapes[j][1];
            shape_abreviations.push(this_abreviation);
        }
    }
}

// Permuted arrangement
var permutations = [];
for (var i = 0; i < questions.length; i++) {
    permutations.push(i);
}

if (questions_permuted == 1) {
    permutations = shuffle(permutations);
}

var permuted_abreviations = [];
for (var i = 0; i < questions.length; i ++) {
    permuted_abreviations.push(shape_abreviations[permutations[i]]);
}

// All of the radial buttons
var pretest_radials = [["q0_0_yes", "q0_0_no"], ["q0_1_yes", "q0_1_no"], ["q0_2_yes", "q0_2_no"], ["q0_3_yes", "q0_3_no"],
["q0_4_yes", "q0_4_no"], ["q0_5_yes", "q0_5_no"], ["q0_6_yes", "q0_6_no"], ["q0_7_yes", "q0_7_no"], ["q0_8_yes", "q0_8_no"],
["q0_9_yes", "q0_9_no"], ["q0_10_yes", "q0_10_no"], ["q0_11_yes", "q0_11_no"]];

var posttest_radials = [["q1_0_yes", "q1_0_no"], ["q1_1_yes", "q1_1_no"], ["q1_2_yes", "q1_2_no"], ["q1_3_yes", "q1_3_no"],
["q1_4_yes", "q1_4_no"], ["q1_5_yes", "q1_5_no"], ["q1_6_yes", "q1_6_no"], ["q1_7_yes", "q1_7_no"], ["q1_8_yes", "q1_8_no"],
["q1_9_yes", "q1_9_no"], ["q1_10_yes", "q1_10_no"], ["q1_11_yes", "q1_11_no"]];



// Seting up the variables for the training slide.
// Uninformative training
// In the following order (two of each): ["squares", "rectangles", "rhombuses", "parallelograms"]
var uninformative_training = [["square_1.png", "square_2.png"], ["rectangle_1.png", "rectangle_2.png"],
["rhombus_1.png", "rhombus_2.png"], ["parallelogram_1.png", "parallelogram_2.png"]];

var informative_training = [["square_1.png", "square_2.png"], ["rectangle_1.png", "square_1.png"],
["square_2.png", "rhombus_2.png"], ["rhombus_1.png", "rectangle_2.png"]];

var all_shapes = [["square_1.png", "square_2.png", "square_3.png"], ["rectangle_1.png", "rectangle_2.png", "rectangle_3.png"],
["rhombus_1.png", "rhombus_2.png", "rhombus_3.png"], ["parallelogram_1.png", "parallelogram_2.png", "parallelogram_3.png"]];

var isSquare = [1, 0, 0, 0];
var isRectangle = [1, 1, 0, 0];
var isRhombus = [1, 0, 1, 0];
var isParallelogram = [1, 1, 1, 1];

var isShape = [isSquare, isRectangle, isRhombus, isParallelogram];

// Here is where you set which training regime to use
/*if (training_condition == "uninformative_training") {
    example_list = informative_training;
}*/
var example_list = uninformative_training;

// Teacher says the following facts:
var teacher_facts = [" For a given angle in a rhombus, its opposite angle is the same", " All of the sides of a rhombus have the same length",
" A square has four sides of equal length, and four 90 degree angles", " The angles of a rectangle are all 90 degree, and opposite sides have the same length",
" The opposite sides of a parallelogram are parallel", " A parallelogram can have 4 equal sides"];
