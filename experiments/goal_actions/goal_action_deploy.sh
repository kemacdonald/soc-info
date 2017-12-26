#!/bin/bash
# Deploy script for goal-actions web experiment

# build the directory destination from user input and experiment library path
read -p "Enter the destination directory name: " DIR_NAME
DIR_PATH="../../../kemacdonald.github.io/experiments/"
DIRECTORY=$DIR_PATH$DIR_NAME


# check if directory exists
if [ ! -d "$DIRECTORY" ]; then
  echo "This directory does not exist, I will create it now."
  mkdir $DIRECTORY
fi

echo "This directory already exists, now copying experiment files."

## copy the experiment files to github experiment library
cp -r * $DIRECTORY

echo "Finished copying experiment!"

## deploy to github

# change to experiment library directory
cd DIRECTORY

# add, commit, and push to github
git add .  
read -p "Enter a commit description: " desc  
git commit -m "$desc"
git push origin master

echo "Finished deploying experiment to github!"