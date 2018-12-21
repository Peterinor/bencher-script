#!/bin/bash

echo "***************** generating test commands ****************"
node ./lib/gen-cmd.js -x sh "$@"


echo "************************ run tests ************************"
./test-cmd.sh


echo "************************ generating test result ************************"
node ./lib/parse-result.js "$@"
echo "open <scene>-<action>.html to view the result"