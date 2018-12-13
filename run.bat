@echo "generating test commands...."
@node ./lib/gen-cmd.js -s bat %1 %2 %3 %4 %5 %6 %7 %8 %9 


@echo "run tests..."
@./test-cmd.bat