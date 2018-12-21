

@echo "***************** generating test commands ****************"
@node ./lib/gen-cmd.js -x bat %1 %2 %3 %4 %5 %6 %7 %8 %9 


echo "************************ run tests ************************"
@./test-cmd.bat


echo "************************ generating test result ************************"
node ./lib/parse-result.js %1 %2 %3 %4 %5 %6 %7 %8 %9 
echo "open <scene>-<action>.html to view the result"