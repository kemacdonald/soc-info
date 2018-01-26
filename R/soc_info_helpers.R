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