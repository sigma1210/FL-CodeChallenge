#fl.challenge

#Frontline Education Code Challenge

  This challenge requires the parsing of a string into a formatted and sortable output. Due to the nested delimiters within
  the string, simple methods of string tokenizing such as underscore.js or javascript String.split method
  are not sufficient to solve this problem. This solution is similar to how a SAX XML parser works. The parser iterates through the string and
  calls registered handlers when it encounters one of the delimiting tokens. In this example the tokens used are '(' to represent the start of an object
  , ')' to represent the end of the object, and ',' to represent a separation of the object keys.

  These delimiters are represented by CONSTANTS in the application so that it can be easily refactor to use other delimiters.

  The solution assumes that the string is a well balanced Json fragment where each '(' will have a corresponding closing ')'. As a result only the
  inner portion of a string that is well balanced will be parsed into the javascript object. It should also be noted that the example does
  not concern it self with the the primitive value of the object keys. Handling the values will require another delimiter, ':'.

  The solution is complete angular 1.6 application. It includes all information needed to build, and test the application can produces coverage reports demonstrating complete test coverage of the source code.

  The solution can be viewed by opening the index.html file in a modern web browser. To reduce the size of the solution, none of the node packages used to build, package, and test the solution are included. Executing npm install will install all the need packages

  Although the solutions output can be run within modern web browser, to demonstrate the building , packaging , and test of the applications
  node.js must be installed https://nodejs.org/en/ .

  Since bower is used to manage the javascript git will also need to be installed. https://git-scm.com/

  It is also assumed that the following node modules be installed

  gulp
     use the command (it may be necessary to use sudo to insure proper rights)
     npm install --global gulp-cli

  bower
    used to download required packages from github    
    npm install -g bower


  http-server
    npm install -g http-server


  to rebuild the application and execute all test

    (sudo) npm install
    bower install
    gulp test

     
