## Information seeking to learn how a causal system works

library(entropy)
library(tidyverse)

## roll my own information gain functions
get_symbol_ent <- function(prob) {
  if(prob == 0) {
    0
  } else {
    (prob * log2(prob)) * -1  
  }
}

# compute entropy for each symbol in the probability vector 
# and add them up
compute_entropy <- function(probs_vect) {
  sapply(probs_vect, get_symbol_ent) %>% 
    sum()
}

bayes_fun <- function(prior_a, prior_b, likelihood_b_given_a) {
  (prior_a * likelihood_b_given_a) / prior_b
}


info_gain_answer <- function(prior_ent, cond_probs) {
  posterior_ent <- compute_entropy(cond_probs)
  prior_ent - posterior_ent
}

info_gain_question <- function(info_gain_answer_vect, prob_answer_vect) {
  posterior_ent <- (info_gain_answer_vect * prob_answer_vect) %>% sum()
  posterior_ent
}


################### Prior Knowledge: state of the world

# prior distribution over hypotheses (not action-outcome links)
prior_one_button <- 0.8
prior_two_buttons <- 0.2
prior_not_one <- 1 - prior_one_button
prior_not_two <- 1 - prior_two_buttons

### compute prior entropy over hypotheses about how the toy works
prior_ent <- compute_entropy(c(prior_one_button, prior_two_buttons))

############## One button action (question)

## conditional probabilities of data (music) P(D|A) given an action 
p_music_press_one <- 0.5
p_music_press_two <- 0.99

## conditional probability of hypotheses given an action  P(H|A,D) 
condp_one_button_press_one_music <- bayes_fun(prior_a = prior_one_button,
                                              prior_b = 0.5,
                                              likelihood_b_given_a = p_music_press_one)

condp_two_button_press_one_music <- bayes_fun(prior_a = prior_two_buttons,
                                              prior_b = 0.5,
                                              likelihood_b_given_a = p_music_press_two)

# todo: figure out how to generate the conditiontional probabilities that are hard codeded 
# using the given pieces of information from the world

### compute information gain of "yes music plays" answer to the pressing one button question
ig_music_yes <- info_gain_answer(prior_ent = prior_ent, 
                                 cond_probs = c(0.99, 
                                                0))

### compute information gain of "no music plays" answer to the pressing one button question
ig_music_no <- info_gain_answer(prior_ent = prior_ent, 
                                cond_probs = c(0.99, 
                                               0))

info_gain_one_button <- info_gain_question(info_gain_answer_vect = c(ig_music_yes, 
                                                                     ig_music_no),
                                           prob_answer_vect = c(p_music_press_one, 
                                                                1 - p_music_press_one))

############## Two button action (question)

### compute information gain of "yes music plays" answer to the pressing two button question
ig_music_yes_two <- info_gain_answer(prior_ent = prior_ent, 
                                     cond_probs = c(prior_one_button, 
                                                    prior_two_buttons))

### compute information gain of "no music plays" answer to the pressing one button question
ig_music_no_two <- info_gain_answer(prior_ent = prior_ent, 
                                    cond_probs = c(prior_one_button, 
                                                   prior_two_buttons))

info_gain_two_button <- info_gain_question(info_gain_answer_vect = c(ig_music_yes_two, 
                                                                     ig_music_no_two),
                                           prob_answer_vect = c(p_music_press_two, 
                                                                1 - p_music_press_two))
