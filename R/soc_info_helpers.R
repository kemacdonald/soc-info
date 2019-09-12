library(lubridate); library(magrittr); library(jsonlite); 
library(rstanarm); library(brms); library(tidybayes)
library(binom); library(knitr); library(grid); library(ggthemes)
library(here); library(tidyverse) 

# reads the raw json from CAT experiment, extacts the information we care about, 
# and builds a tidy data frame

batch_process_cat <- function(file_list) {
  df_list <- files %>% purrr::map(~ safe_json_to_df_cat(data_path = path, .)) 
  results <- df_list %>% transpose() 
  ok <- results$error %>% map_lgl(is_null)
  df <- results$result %>% keep(ok) %>%  map_df(bind_rows)
  list(meta = results, data = df)
}

json_to_df_cat <- function(file, data_path) {
  d <- read_json(path = here(data_path, file))
  sub_info <- d$answers$subject_information %>% as_tibble()
  
  metadata <- tibble(
    worker_id = d$WorkerId,
    assignment_id = d$AssignmentId,
    goal_condition = d$answers$goal_condition,
    social_condition = d$answers$social_condition,
    complete_time_min = d$answers$time_in_minutes,
    browser = d$answers$system$Browser,
    os = d$answers$system$OS,
    screen_w = d$answers$system$screenW,
    screen_h = d$answers$system$screenH)
  
  metadata <- metadata %>% mutate(condition = paste(social_condition, goal_condition, sep = "-"))
  
  if( !(is.null(d$answers$system$ip_data)) ) {metadata <- metadata %>% mutate(ip = d$answers$system$ip_data$ip)}
  
  trial_data_list <- d$answers$trials
  final_toy_tr_num <- length(trial_data_list)
  
  # process test data
  d_test <- trial_data_list[[final_toy_tr_num]] %>% as_tibble() %>% 
    mutate(trial_num = final_toy_tr_num,
           success = as.logical(success)) %>% 
    rename(train_attempt_num = action_number)
  
  # process training data
  d_train <- trial_data_list[1:final_toy_tr_num-1] %>% 
    imap_dfr(~ as_tibble(.x) %>% mutate(trial_num = .y)) %>% 
    mutate(action_number = as.character(action_number)) %>% 
    rename(train_attempt_num = action_number)
  
  d_all_trials <- bind_rows(d_train, d_test) %>% 
    mutate(worker_id = d$WorkerId) %>% 
    mutate_if(is.character, str_to_lower)
  
  # bring it all together and return
  left_join(bind_cols(metadata, sub_info), d_all_trials, by = "worker_id") 
  
}

tidy_cat_data <- function(d) {
  d$data %>% 
    anonymize_ids() %>% 
    score_test_trials()
}

score_test_trials <- function(d) {
  d %>% 
    group_by(id) %>% 
    nest() %>% 
    mutate(final_toy_type = map_chr(data, code_test_trial)) %>% 
    unnest() 
}

code_test_trial <- function(d_sub) {
  final_toy_choice <- d_sub %>% 
    distinct(trial_type, toy) %>% 
    filter(trial_type == "final_toy_choice") %>% 
    pull(toy)
  
  training_toys_chosen <- d_sub %>% 
    distinct(trial_type, toy) %>% 
    filter(trial_type != "final_toy_choice")
  
  if (final_toy_choice %in% training_toys_chosen$toy) {
    training_toys_chosen %>% filter(toy == final_toy_choice) %>% pull(trial_type)
  } else if ( !(final_toy_choice %in% training_toys_chosen$toy) ) {
    "learning"
  } else {
    "error - toy choice not coded"
  }
  
}

anonymize_ids <- function(d) {
  df_anonymized <- d %>%
    dplyr::distinct(worker_id) %>%
    dplyr::mutate(id = 1:n())
  
  left_join(d, df_anonymized, by = "worker_id") %>% select(id, everything(), -worker_id)
}

safe_json_to_df_cat <- safely(json_to_df_cat)

# reads the raw json, extacts the information we care about, and builds a tidy data frame
# takes a list and extracts the information we care about
json_to_df <- function(data_path, file) {
  d <- read_json(path = here(data_path, file))
  tibble(
    workerid = d$WorkerId, 
    condition = d$answers$goal_condition,
    social_condition = d$answers$social_condition,
    outcome = d$answers$outcome,
    music_check_response = d$answers$manip_check_music_response %>% unlist(),
    light_check_response = d$answers$manip_check_light_response %>% unlist(),
    manip_check_order = d$answers$manip_check_order %>% unlist(),
    action_response = d$answers$action_response,
    prior_hypothesis = d$answers$hypotheses_slider_order_prior %>% unlist(),
    prior_beliefs = d$answers$prior_beliefs %>% unlist(),
    posterior_hypothesis = d$answers$hypotheses_slider_order_posterior %>% unlist(),
    posterior_beliefs = d$answers$posterior_beliefs %>% unlist(),
    browser = d$answers$browser,
    browser_width = d$answers$browser_width,
    browser_height = d$answers$browser_height,
    screen_width = d$answers$screen_width,
    screen_height = d$answers$screen_height,
    mobile_device = d$answers$mobile_device,
    about = d$answers$about,
    why_action = d$answers$why_action,
    comment = d$answers$comment,
    age = d$answers$age,
    gender = d$answers$gender,
    first_language = d$answers$language,
    experiment_time = d$answers$experiment_completion_time / 1000,
    action_trial_time = d$answers$action_trial_time / 1000
  )
}

safe_json_to_df <- safely(json_to_df)

# reads the raw json, extacts the information we care about, 
# and builds a tidy data frame. 
# Note that this function is specific to the prior elicitation task, which stores fewer variables.

json_to_df_prior <- function(data_path, file) {
  d <- read_json(path = here(data_path, file))
  tibble(
    workerid = d$WorkerId, 
    condition = d$answers$goal_condition,
    action_response = d$answers$action_response,
    browser = d$answers$browser,
    browser_width = d$answers$browser_width,
    browser_height = d$answers$browser_height,
    screen_width = d$answers$screen_width,
    screen_height = d$answers$screen_height,
    mobile_device = d$answers$mobile_device,
    about = d$answers$about,
    why_action = d$answers$why_action,
    age = d$answers$age,
    gender = d$answers$gender,
    first_language = d$answers$language
  )
}

safe_json_to_df_prior <- safely(json_to_df_prior)

# ggplot theme mods
theme_set(theme_minimal() +
            theme(legend.position = "top",
                  axis.text.x = element_text(angle = 0, vjust = 0.5),
                  panel.border = element_rect(fill=NA, size=0.5, color = "grey")))

# compute entropy for one symbol
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


# convert logits to probabilities
logit_to_prob <- function(x) {
  odds <- exp(x)
  prob <- odds / (1 + odds)
  prob
}


# HPDhi<- function(s){
hdi_upper <- function(s){
  m <- coda::HPDinterval(coda::mcmc(s))
  return(m["var1","upper"])
}
# HPDlo<- function(s){
hdi_lower <- function(s){
  m <- coda::HPDinterval(coda::mcmc(s))
  return(m["var1","lower"])
}


# normalize with small smoothing factor
eps_normalize <- function(x, eps = .0001 ) {
  return((x + eps) / (sum(x+eps)))
}

# calc KL: sum p log (p / q)
dkl <- function(t, p) {
  et <- eps_normalize(t)
  ep <- eps_normalize(p)
  
  return(sum(et * log(et / ep)))
}

# ig function
# note that the "correct" vector of button and handle are defined by position 
# relative to the pd data frame
ig <- function(pd) {
  pd <- arrange(pd, hypothesis_type, hypothesis)
  handle <- c(0, 0, 1) 
  button <- c(0, 1, 0)
  prior <- filter(pd, hypothesis_type == "prior") %>% pull(slider_value_normalized)
  posterior <- filter(pd, hypothesis_type == "posterior") %>% pull(slider_value_normalized)
  
  ig <- case_when(
    pd$action_response[1] == "handle" ~ dkl(handle, prior) - dkl(handle, posterior),
    pd$action_response[1] == "button" ~ dkl(button, prior) - dkl(button, posterior),
    pd$action_response[1] == "both" ~ if (prior[1] > prior[2]) {
      dkl(handle, prior) - dkl(handle, posterior)
    } else {
      dkl(button, prior) - dkl(button, posterior)
    }
  )
  
  pd$ig <- ig
  
  return(pd)
}
