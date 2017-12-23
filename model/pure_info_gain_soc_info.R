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

info_gain_question <- function(prior_ent, info_gain_answer_vect, prob_answer_vect) {
  posterior_ent <- (info_gain_answer_vect * prob_answer_vect) %>% sum()
  prior_ent - posterior_ent
}


################### Prior Knowledge: state of the world

p_a <- 0.4
p_b <- 0.4
p_ab <- 0.2

p_not_a <- 1 - p_a
p_not_b <- 1 - p_b
p_not_ab <- 1 - p_ab

## conditional probabilities
p_music_a <- 0.5
p_music_b <- 0.5
p_music_ab <- 1

### compute prior entropy
prior_ent <- compute_entropy(c(p_a, p_b, p_ab))

### compute information gain of "music plays" answer

ig_music_plays <- info_gain_answer(prior_ent = prior_ent, cond_probs = c(0.5, 1))