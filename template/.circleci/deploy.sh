#!/bin/bash

source $(dirname $0)/getopts.sh

SITE_ID=""
SITE_URL=""

# First see if site is already on Netlify. If it was previously deployed using
# this script, it should have generated a `.netlify` file with the site ID.
if [ -f ./.circleci/.netlify ]; then
  SITE_ID=$(cat .circleci/.netlify)
fi

if [ "$SITE_ID" != "" ]; then
  echo -e "Fetching info from Netlify for site ID $(cyan $SITE_ID)..."
  echo

  RESULT=$(curl -H "User-Agent: $CIRCLE_PROJECT_USERNAME ($CIRCLE_PROJECT_USERNAME@users.noreply.github.com)" $NETLIFY_API/sites/$SITE_ID?access_token=$NETLIFY_KEY)
  RESPONSE_CODE=$(echo $RESULT | jq -r ".code")

  # Site not found.
  if [ "$RESPONSE_CODE" = "404" ]; then
    SITE_ID=""
  else
    SITE_URL=$(echo $RESULT | jq -r ".url")
  fi
fi

# If this is the first deploy (i.e. there is no site ID found), create a new
# site on Netlify.
if [ "$SITE_ID" = "" ]; then
  echo
  echo -e $(yellow "No .netlify file detected or site is not found, creating a new site on Netlify...")
  echo

  RESULT=$(curl -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_KEY" --data-binary "@build/$PACKAGE_FILE" $NETLIFY_API/sites)

  SITE_ID=$(echo $RESULT | jq -r ".id")
  SITE_NAME=$(echo $RESULT | jq -r ".subdomain")
  SITE_URL=https://$SITE_NAME.netlify.com

  echo "$SITE_ID" > .circleci/.netlify

  # Push the generated `.netlify` file to repo.
  ORIGIN_URL=`git config --get remote.origin.url`
  git config user.name "$CIRCLE_PROJECT_USERNAME"
  git config user.email "$CIRCLE_PROJECT_USERNAME@users.noreply.github.com"
  git add ./.circleci/.netlify
  git commit -m "[Skip CI] Adding generated .netlify file"
  git push -f $ORIGIN_URL

  echo
  echo "Done! Your site URL is:"
  echo -e $(green $SITE_URL)
else
  echo
  echo -e "Successfully fetched info. Deploying to $(cyan $SITE_URL), site ID $(cyan $SITE_ID)..."
  echo

  RESULT=$(curl -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_KEY" --data-binary "@build/$PACKAGE_FILE" $NETLIFY_API/sites/$SITE_ID/deploys)

  echo
  echo "Done! Your site URL is:"
  echo -e $(green $SITE_URL)
fi
