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
