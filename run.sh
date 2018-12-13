#!/bin/bash

echo "generating test commands...."
node ./lib/gen-cmd.js -s sh "$@"


echo "run tests..."
./test-cmd.sh