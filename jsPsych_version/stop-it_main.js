/**
 * stop-it_main.js
 * Kyoung Whan Choe (https://github.com/kywch/)
 *
 * The below codes are copied and adapted from https://github.com/fredvbrug/STOP-IT
 * 
 **/



/*
 * Generic task variables for Qualtrics
 */
var sbj_id = ""; // mturk id
var task_id = ""; // the prefix for the save file -- the main seq
var flag_debug = false;



/* 
 * STOP-IT specific variables
 */

// Current block & trial index
var trial_ind = 1; // trial indexing variable starts at 1 for convenience
var block_ind = 0; // block indexing variables: block 0 is considered to be the practice block

// activity tracking
var focus = 'focus'; // tracks if the current tab/window is the active tab/window, initially the current tab should be focused
var fullscr_ON = 'no'; // tracks fullscreen activity, initially not activated


/* #########################################################################
Create the design based on the input from 'experiment_variables.js'
######################################################################### */
// Since we have two stimuli, the number of trials of the basic design = 2 * nstim
// This design will later be repeated a few times for each block
// (number of repetitions is also defined in 'experiment_variables.js')
var ngostop = 1 / nprop // covert proportion to trial numbers. E.g. 1/5 = 1 stop signal and 4 go
var ntrials = ngostop * 2 // total number of trials in basic design (2 two choice stimuli x ngostop)
var signalArray = Array(ngostop - 1).fill('go'); // no-signal trials
signalArray[ngostop - 1] = ('stop'); // stop-signal trials

// create factorial design from choices(2) and signal(nstim)
var factors = {
    stim: [choice_stim1, choice_stim2],
    signal: signalArray,
};
var design = jsPsych.randomization.factorial(factors, 1);

// modify the design to make it compatible with the custom stop signal plugin
//  - set a first/second stimulus property.
//    on no-signal trials, only one image will be used (i.e. the go image/stimulus)
//    on stop-signal trials, two images will be used (i.e. the go and stop images/stimuli)
//  - set a data property with additional attributes for identifying the type of trial
for (var ii = 0; ii < design.length; ii++) {
    design[ii].data = {}
    if ((design[ii].stim == choice_stim1) && (design[ii].signal == 'go')) {
        design[ii].fixation = fix_stim;
        design[ii].first_stimulus = go_stim1;
        design[ii].second_stimulus = go_stim1;
        design[ii].data.stim = choice_stim1;
        design[ii].data.correct_response = cresp_stim1;
        design[ii].data.signal = "no";
    } else if ((design[ii].stim == choice_stim2) && (design[ii].signal == 'go')) {
        design[ii].fixation = fix_stim;
        design[ii].first_stimulus = go_stim2;
        design[ii].second_stimulus = go_stim2;
        design[ii].data.stim = choice_stim2;
        design[ii].data.correct_response = cresp_stim2;
        design[ii].data.signal = "no";
    } else if ((design[ii].stim == choice_stim1) && (design[ii].signal == 'stop')) {
        design[ii].fixation = fix_stim;
        design[ii].first_stimulus = go_stim1;
        design[ii].second_stimulus = stop_stim1;
        design[ii].data.stim = choice_stim1;
        design[ii].data.correct_response = "undefined";
        design[ii].data.signal = "yes";
    } else if ((design[ii].stim == choice_stim2) && (design[ii].signal == 'stop')) {
        design[ii].fixation = fix_stim;
        design[ii].first_stimulus = go_stim2;
        design[ii].second_stimulus = stop_stim2;
        design[ii].data.stim = choice_stim2;
        design[ii].data.correct_response = "undefined";
        design[ii].data.signal = "yes";
    }
    delete design[ii].signal;
    delete design[ii].stim;
};
if (flag_debug) {
    console.log(design); // uncomment to print the design in the browser's console
}


/* #########################################################################
  Define the individual events/trials that make up the experiment
######################################################################### */

// welcome message trial. Also: end the experiment if browser is not Chrome or Firefox
var welcome = {
    type: "instructions",
    pages: welcome_message,
    show_clickable_nav: true,
    allow_backward: false,
    button_label_next: label_next_button,
    on_start: function (trial) {
        trial.pages = welcome_message;
    }
};

// these events turn fullscreen mode on in the beginning and off at the end, if enabled (see experiment_variables.js)
var fullscr = {
    type: 'fullscreen',
    fullscreen_mode: true,
    message: full_screen_message,
    button_label: label_next_button,
};

var fullscr_off = {
    type: 'fullscreen',
    fullscreen_mode: false,
    button_label: label_next_button,
};

// instruction trial
// the instructions are declared in the configuration/text_variables.js file
var instructions = {
    type: "instructions",
    pages: [page1, page2],
    show_clickable_nav: true,
    button_label_previous: label_previous_button,
    button_label_next: label_next_button,
};

// start of each block
// the start message is declared in the configuration/text_variables.js file
var block_start = {
    type: 'html-keyboard-response',
    stimulus: text_at_start_block,
    choices: ['space']
};

// get ready for beginning of block
// the get ready message is declared in the configuration/text_variables.js file
var block_get_ready = {
    type: 'html-keyboard-response',
    stimulus: get_ready_message,
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
};

// blank inter-trial interval
var blank_ITI = {
    type: 'jspsych-detect-held-down-keys',
    // this enables the detection of held down keys
    stimulus: "",
    // blank
    trial_duration: ITI / 2,
    response_ends_trial: false,
};

// now put the trial in a node that loops (if response is registered)
var held_down_node = {
    timeline: [blank_ITI],
    loop_function: function (data) {
        if (data.values()[0].key_press != null) {
            return true; // keep looping when a response is registered
        } else {
            return false; // break out of loop when no response is registered
        }
    }
};


// the main stimulus

// use custom-stop-signal-plugin.js to show three consecutive stimuli within one trial
// (fixation -> first stimulus -> second stimulus, with variable inter-stimuli-intervals)

var stimulus = {
    type: 'custom-stop-signal-plugin',
    fixation: jsPsych.timelineVariable('fixation'),
    fixation_duration: FIX,
    stimulus1: jsPsych.timelineVariable('first_stimulus'),
    stimulus2: jsPsych.timelineVariable('second_stimulus'),

    trial_duration: MAXRT, // this is the max duration of the actual stimulus (excluding fixation time)
    // inter stimulus interval between first and second stimulus = stop signal delay (SSD)
    ISI: function () {
        var duration = SSD;
        return duration
    },
    response_ends_trial: true,

    choices: [cresp_stim1, cresp_stim2],

    data: jsPsych.timelineVariable('data'),

    // was the response correct? adapt SSD accordingly
    on_finish: function (data) {

        // check if the response was correct
        // keys are stored in keycodes not in character, so convert for convenience
        if (data.key_press == null) {
            // convert explicitly to string so that "undefined" (no response) does not lead to empty cells in the datafile
            data.response = "undefined";
        } else {
            data.response = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press);
        }
        data.correct = (data.response == data.correct_response);

        // if no response was made, the reaction time should not be -250 but null
        if (data.rt == -250) {
            data.rt = null
        };
        // on go trials, reaction times on the fixation (below zero) are always wrong
        if (data.signal == 'no' && data.rt < 0) {
            data.correct = false;
        };
        // set and adapt stop signal delay (SSD)
        data.SSD = SSD;
        data.trial_i = trial_ind;
        data.block_i = block_ind;
        trial_ind = trial_ind + 1;

        if (data.signal == 'yes') {
            if (data.correct) {
                SSD = SSD + SSDstep;
                if (SSD >= MAXRT) {
                    SSD = MAXRT - SSDstep
                };
                if (flag_debug) {
                    console.log('Correct stop, SSD increased: ', SSD);
                }
            } else {
                SSD = SSD - SSDstep;
                if (SSD <= SSDstep) {
                    SSD = SSDstep
                };
                if (flag_debug) {
                    console.log('Failed stop, SSD decreased: ', SSD);
                }
            }
        }
    }
};


// trial-by-trial feedback

// messages are defined in the configuration/text_variables.js file

var trial_feedback = {
    type: 'html-keyboard-response',
    choices: jsPsych.NO_KEYS,
    trial_duration: iFBT,

    stimulus: function () {
        var last_trial_data = jsPsych.data.get().last(1).values()[0];

        if (last_trial_data['signal'] === 'no') {
            // go trials
            if (last_trial_data['correct']) {
                return correct_msg
            } else {
                if (last_trial_data['response'] === "undefined") {
                    // no response previous trial
                    return too_slow_msg
                } else {
                    if (last_trial_data['rt'] >= 0) {
                        return incorrect_msg
                    } else {
                        return too_fast_msg
                    }
                }
            }
        } else {
            // stop trials
            if (last_trial_data['correct']) {
                return correct_stop_msg
            } else {
                if (last_trial_data['rt'] >= 0) {
                    return incorrect_stop_msg
                } else {
                    return too_fast_msg
                }
            }
        }
    }
};

// at the end of the block, give feedback on performance
var block_feedback = {
    type: 'html-keyboard-response',
    trial_duration: bFBT,

    choices: function () {
        if (block_ind == NexpBL) {
            return ['p', 'space']
        } else {
            return ['p'] // 'p' can be used to skip the feedback, useful for debugging
        }
    },

    stimulus: function () {
        // calculate performance measures
        var ns_trials = jsPsych.data.get().filter({
            trial_type: 'custom-stop-signal-plugin',
            block_i: block_ind,
            signal: 'no'
        });

        var avg_nsRT = Math.round(ns_trials.select('rt').subset(function (x) {
            return x > 0;
        }).mean());

        var prop_ns_Correct = Math.round(ns_trials.filter({
                correct: true
            }).count() / ns_trials.count() * 1000) /
            1000; // unhandy multiplying and dividing by 1000 necessary to round to two decimals

        var prop_ns_Missed = Math.round(ns_trials.filter({
            key_press: null
        }).count() / ns_trials.count() * 1000) / 1000;

        var prop_ns_Incorrect = Math.round((1 - (prop_ns_Correct + prop_ns_Missed)) * 1000) / 1000;

        var ss_trials = jsPsych.data.get().filter({
            trial_type: 'custom-stop-signal-plugin',
            block_i: block_ind,
            signal: 'yes'
        });

        var prop_ss_Correct = Math.round(ss_trials.filter({
            correct: true
        }).count() / ss_trials.count() * 1000) / 1000;

        // in the last block, we should not say that there will be a next block
        if (block_ind == NexpBL) {
            var next_block_text = final_block_msg
        } else { // make a countdown timer
            var count = (bFBT / 1000);
            var counter;
            clearInterval(counter);
            counter = setInterval(timer, 1000); //1000 will run it every 1 second
            function timer() {
                count = count - 1;
                if (count <= 0) {
                    clearInterval(counter);
                }
                document.getElementById("timer").innerHTML = count;
            }
            var next_block_text = next_block_msg // insert countdown timer
        }

        // the final text to present. Can also show correct and incorrect proportions if requested.
        return [
            no_signal_header +
            sprintf(avg_rt_msg, avg_nsRT) +
            sprintf(prop_miss_msg, prop_ns_Missed) +
            stop_signal_header +
            sprintf(prop_corr_msg, prop_ss_Correct) +
            next_block_text
        ]
    },

    on_finish: function () {
        trial_ind = 1; // reset trial counter
        block_ind = block_ind + 1; // next block
    }
};


// end trial and save the data

var goodbye = {
    type: "html-keyboard-response",
    stimulus: end_message
};


/* #########################################################################
combine trials in procedures (create nested timeline)
#########################################################################*/

if (fullscreen) {
    var start_timeline = [fullscr, instructions]
} else {
    var start_timeline = [instructions]
}

// start the experiment with the previously defined start_timeline trials
var start_procedure = {
    timeline: start_timeline,
};

// put trial_feedback in its own timeline to make it conditional (only to be shown during the practice block)
var feedback_node = {
    timeline: [trial_feedback],

    conditional_function: function () {
        var last_trial_data = jsPsych.data.get().last(1).values()[0];
        var current_block = block_ind;
        if (current_block == 0) {
            // this was previously set to provide feedback only on incorrect trials by adding: && last_trial_data['correct']==false
            return true;
        } else {
            return false;
        }
    }
};

var evaluate_end_if_practice = {
    type: 'call-function',
    func: function () {
        if (block_ind == 0) { // this limits the amount of trials in the practice block
            if (trial_ind > NdesignReps_practice * ntrials) {
                jsPsych.endCurrentTimeline();
            }
        }
    }
};

// timeline_variables determine the stimuli in the 'stimulus' trial
var trial_procedure = {
    timeline: [blank_ITI, held_down_node, stimulus, feedback_node, evaluate_end_if_practice],
    timeline_variables: design,
    randomize_order: true,
    repetitions: NdesignReps_exp,
};

// again: combine the following screen in one timeline, which constitues of the procedure of one block
var block_procedure = {
    timeline: [block_start, block_get_ready, trial_procedure, block_feedback],
    randomize_order: false,
    repetitions: NexpBL + 1, // add one because the first block is the practice block
};

// end of the experiment
if (fullscreen) {
    end_timeline = [fullscr_off, goodbye]
} else {
    end_timeline = [goodbye]
}

var end_procedure = {
    timeline: end_timeline, // here, you could add questionnaire trials etc...
};