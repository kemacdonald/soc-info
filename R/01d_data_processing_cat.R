# CAT JSON to CSV ---------------------------------------------------------

source(here::here("R/soc_info_helpers.R"))
exp_name <- "cat-pilot2"
path <- paste0("data/01_raw_data/", exp_name ,"/production-results/")
files <- dir(here(path))
results <- batch_process_cat(files)
results_tidy <- tidy_cat_data(results)

write_csv(results_tidy, 
          path = here("/data/02_tidy_data",
            paste("soc-info", exp_name,"tidy.csv", 
                  sep = "-")))
