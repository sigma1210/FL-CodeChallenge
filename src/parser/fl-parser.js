//inject angular as ng
//inject angular.module('fl.challenge').factory as factory
(function(ng,factory){
  'use strict';
  /**
   * @ngdoc service
   * @name flParser
   *
   * @description
      The flParser is a service which can parse nested delimeted strings in the form
      (
        foo,
        bar(snaf, fu),
        charlie,
        foxtrot
      )
      into the javascript object
      {
        foo:null,
        bar:{
          snaf:null,
          fu :null,
        },
        charlie:null,
        foxtrot:null
      }

      Due to the nature of the overlapping delimeted normal methods of string
      tokenizing such as String.split will not be useful

      * @requires $log              What $rolls $down $stairs
                                    $alone || in $pairs,
                                    && $over your $neighbor's $dog?
      * @requires $q                promises must be kept.
      *
      */

  factory('flParser',['$log','$q', _flParser]);
  function _flParser($log,$q){
    //define the interface
    var flParser={
      parse:_parse,
    };

    // define error messages and delimeter tokens constants

    var EMPTY_STRING_EXCEPTION  = 'The string provided was empty or null.It cannot be parsed',
        KEY_DELIM_TOKEN         = ',',//the token that defines the end of an object key
        OBJECT_START_TOKEN      = '(',//the token that defines the start of an object
        OBJECT_END_TOKEN        = ')';// the token that defines the end of an object
    /**
    * @ngdoc function
    * @name flParser.parse
    * @param {string} strToParse the input string to parse
    * @description
    *   Parses a delimeted string into a javascript object
    * @returns a promise to resolve a javascript object represention the string to be parse or rejecting
    * with a defined error
    *
  */
    function _parse(strToParse) {
      return $q(function(resolve,reject){

            var _strToParse = ng.copy(strToParse),// clone the string to a local var
            _curKey ='',    // the current key being read
            _stack =[],     // a stack to manage the object hierarcy
            _result = null, // object containing the deserialixed srting
            _tokenHandlers = {};//a hash set of token handlers
            //create a hash for the special tokens to parse
            //akin to SAX type xml parser define handlers for the tokens
            //in this example there are only 3 tokens which require handling

            _tokenHandlers[KEY_DELIM_TOKEN]    = _addKey;//handler the end key token
            _tokenHandlers[OBJECT_START_TOKEN] = _startObject;//handle the start of an object
            _tokenHandlers[OBJECT_END_TOKEN]   = _closeObject;// handler the end of an object

            if(!_strToParse){
              // if there is no string to parse reject with error message
              reject({
                message: EMPTY_STRING_EXCEPTION
              });
            }else{

              _deSerialize();
            }
            /**
            * @ngdoc private function
            * @name _deSerialize
            * @description
            *    iterates through each character in string to parse and calls the _parseToken method to determine how the token
            *    should be handler based on the tokenHandler hashset for the corresponding token. Once all tokens are handled
            *    resolves the promise with the last well form object parse
            * @returns null
            */

            function _deSerialize(){
                // read forward throw the string one char at a time
                for(var _charIndex =0, len = _strToParse.length;_charIndex<len;_charIndex++ ){
                  _parseToken(_strToParse.charAt(_charIndex));
                }
                // _result is the last valid object parsed
                resolve(_result);
            }

            /**
            * @ngdoc private function
            * @name _parseToken
            * @param {string} token the current token being handled
            * @description
            *    check to see if there is a handler for the current token. if the token has a handler the handler is executed.
            *    Otherwise a key is still being read -- spaces are ignored.
            * @returns null
            */
            function _parseToken(token){
              //get the cooresponding handler from the charHandlers hash
              var _handler = _tokenHandlers[token];
              //if it exists and it is a function execute it
              if (ng.isFunction(_handler)) {
                _handler();
              } else if (' ' !== token) {
                  //ignore spaces -- this will concatinate keys with spaces which are invalid
                  //todo extend to include all white spaces
                  _curKey += token;
              }
            }


            /**
            * @ngdoc private function
            * @name _addKey
            * @description
            *  A handler function that is called when a key end delimeted is being handler or when an object end token is being handler.
            *  The function gets the last object place on the stack and adds a hash with the name of the current key being handled.
            *  rests the current key when complete
            *
            * @returns null
            */

            function _addKey(){
              if ( _stack.length > 0 && _curKey.length > 0) {
                //set the a new hash
                _peek()[_curKey] = null;
              }
              //clear the current key
              _clearCurrentKey();
            }
            /**
            * @ngdoc private function
            * @name _startObject
            * @description
            *  A handler function that is called when a key a start object token is being read
            *  a new object is created and is set to the hash of the current Key on te last object in the stack
            *  pushes the object on the statck such that all subsequent calls act on the new object until a close object token is handled
            * @returns null
            */
            function _startObject(){
              var _obj = {};
              if(_stack.length > 0 && _curKey.length >0){
                //set the new hash to be the new object
                _peek()[_curKey] = _obj;
              }
              //push it onto stack so that it will be return by _peek()
              _stack.push(_obj);
                //clear the current key
              _clearCurrentKey();
            }


            /**
            * @ngdoc private function
            * @name _closeObject
            * @description
            *  A handler function that is called when a  close object token is being read
            *  it adds a new key is needed, pops the object off the stack and clears the current key
            * @returns null
            */
            function _closeObject(){
              //add key is needed
              _addKey();
              _result = _stack.pop();
              _clearCurrentKey();
            }

            /**
            * @ngdoc private function
            * @name _peek
            * @description
            * returns the last object place on the stack without removing it
            * @returns the last object pushed on the stack
            */
            function _peek(){
              // return last object on the statck
              return _stack[_stack.length - 1];
            }
            /**
            * @ngdoc private function
            * @name _clearCurrentKey
            * @description
            * resets the currentKey to '' so that a new key can be read
            * @returns null
            */
            function _clearCurrentKey(){
              _curKey= "";
            }

      });
    }


    return flParser;
  }
})(angular, angular.module('fl.challenge').factory);
