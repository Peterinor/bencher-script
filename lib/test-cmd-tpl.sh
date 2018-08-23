#!/bin/bash 

mkdir -p out

{cmd} 

node ./lib/parse-result.js
echo "open group-action.html to view the result"