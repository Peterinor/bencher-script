#!/bin/bash

echo "generating test commands...."
node ./lib/gen-cmd.js -x sh "$@"


echo "run tests..."
./test-cmd.sh