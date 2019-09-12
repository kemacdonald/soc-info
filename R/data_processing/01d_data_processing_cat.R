# CAT JSON to CSV ---------------------------------------------------------

source("R/soc_info_helpers.R")
exp_name <- "cat-full-exp1"
path <- paste0("data/01_raw_data/", exp_name ,"/production-results/")
files <- dir(path)
results <- batch_process_cat(files)
results_tidy <- tidy_cat_data(results)


# check number of participant in each condition 
results_tidy %>% 
  distinct(id, condition) %>% 
  count(condition)
  
write_csv(results_tidy, 
          path = here("/data/02_tidy_data",
            paste("soc-info", exp_name,"tidy.csv", 
                  sep = "-")))
