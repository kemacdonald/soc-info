# CAT JSON to CSV ---------------------------------------------------------

source(here::here("R/soc_info_helpers.R"))
path <- "data/01_raw_data/cat-v1/production-results/"
files <- dir(here(path))
results <- batch_process_cat(files)
results_tidy <- tidy_cat_data(results)

write_csv(results_tidy, 
          path = here("/data/02_tidy_data",
                      "soc-info-cat-pilot1-tidy.csv"))
