cd playground
call setup_dev.bat
cd ..

cd easydata.js
call clean.bat
call npm run linkall
call npm run installall
call npm run build:dev
cd ..



