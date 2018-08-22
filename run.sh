#!/bin/bash

echo "generating test commands...."
node ./lib/gen-cmd.js


echo "run tests..."
./test-cmd.sh