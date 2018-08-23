@echo off
if not exist out mkdir out

{cmd} 

node ./lib/parse-result.js
echo "open group-action.html to view the result"