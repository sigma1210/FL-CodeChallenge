
// inject angular as ng from the global space into the closure
(function(ng){
  'use strict';
  /**
      *@ngdoc overview
      *@name fl.challenge
      *@description
          an module which provides the solution the Front line code challenge
          This code is placed in the root of the src directory to insure it appears on the top of the resultant
          angular distrubution and minimized distribution file
  */
  ng.module('fl.challenge',['fl.challenge.templateCache']);
})(angular);

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

(function(ng,component){
  'use strict';
  /**
   * @ngdoc component
   * @name flChallengeView
   * @memberof fl.challenge
   * @requires $log                - can't live without $log
   * @requires $filter             - provide access to json filter
   * @requires flParser            - the string parser service used in the challenge
   * @requires flObjectWriter      - the objevt writer that can output an hrml representation of the string
   *                                  html injection

   * @restrict E
   * @description
        a directive used to display the results of the Front line challeneg
   * @example
      <fl:challenge:view/>
  **/
  component('flChallengeView',{
      templateUrl:'flTemplateCache:/viewer/fl-challenge-view.html',
      controller:['$log','$filter','flParser','flObjectWriter', function($log,$filter,flParser,flObjectWriter){
        var _self = this;
        _self.strToParse = "(id,created,employee(id,firstname,employeeType(id), lastname),location)";
        _self.error=null;
        _self.result = null;
        _self.test = function(){
          flParser
            .parse(_self.strToParse)
            .then(function(result){
              _self.error=null;
              _self.result = result;
              _self.printResults = flObjectWriter.write(result);
              _self.sortedPrintResults = flObjectWriter.write(result,flObjectWriter.alphabetical);
            })
            .catch(function(error){
              _self.error=error;
              _self.results = null;
              _self.printResults = '';
              _self.sortedPrintResults='';
              $log.error(error);
            });
        };
        _self.test();
      }]
  });
})(angular,angular.module('fl.challenge').component);

//inject angular as ng
//inject angular.module('fl.challenge').factory as factory
(function(ng,factory){
  'use strict';
  /**
   * @ngdoc service
   * @name flObJectWriter
   *
   * @description
   *   write the keys of a javascript object out as a string such that
   *   each key is written with 2 newline characters, if the key points to a child object the child object
   *   is also written with a number of '-' equal to the depth of the object with in the object graph.
   *   Sort order can be specified, in which case the objects key will be sorted alphabetically
   * @requires $log          $its $great for a $snack $it $fits on $your $back
   *                         $its $log,$log,$log
 */

  factory('flObjectWriter',['$log', _flWriter]);
  function _flWriter($log){

    var NULL_OBJECT_EXCEPTION ="No object was specified to write",
        ALPHABETICAL = "ALPHABETICAL",
        SPACER= " ", // non breaking space
        NEW_LINE ="\n\n",// double spaced
        DEPTH_DELIM ='-';// prefix used in displaying hierarcy
    //define the interface
    var flObjectWriter={
      write:_write,
      alphabetical:ALPHABETICAL
    };
    /**
    * @ngdoc function
    * @name flObjectWriter.write
    * @param {object} object the object to write
    * @param {string} mode option parameter to determine the order of the output
    *
    * @description
    *   creates a string representation of object by iterating through each key within the object
    *   if the mode is equal to flObjectWriter.alphabetical the keys are outputted in alphabetical order.
    *   otherwise the are written in the order they are encountered.
    * @returns a string represetion of the object
    *
    */
    function _write(object,mode){
        if(!object){
          $log.error(NULL_OBJECT_EXCEPTION);
          return('');
        }else{
          var _res =_print(object,0);
          $log.debug(_res);
          return _res;
        }
        /**
        * @ngdoc private function
        * @name _print
        * @param {object} obj the object to write
        * @param {int} depth the depth of the current object in the hierarchy
        * @description
        *  a recursive function used to iterate through each key within the object
        *  being printed
        * @returns a string represention of the object
        */

        function _print(obj, depth){
          var _keys = _getSortedKeys(obj),//an array of keys sorted according to mode
              _output = '',//the string to hold the output
              _depthString = _getDepthString(depth);//the depth prefix
          ng.forEach(_keys,function(key){
            //iterate through each key
             if (depth > 0) {
               //prefix with depth string
               _output += _depthString + SPACER ;
             }
             _output += key + NEW_LINE;
             // if and only if the current key points to an object call the function recursively
             // with the child object and a incremeneted depth
            if(ng.isObject(obj[key])){
              _output += _print(obj[key], depth + 1);
            }
           });
          return _output;
        }
        /**
        * @ngdoc private function
        * @name _getSortedKeys
        * @param {object} obj the object to write

        * @description
        *  creates an array of key names presented in the sort order defined in the current mode
        * @returns an array of keynames sorted according to mode
        */
        function _getSortedKeys(obj) {
          // ask for an arrsy of keys
          var keys = Object.keys(obj);
          if (mode == flObjectWriter.alphabetical) {
            // sort use _alphaSort if the mode is equal to flObjectWriter.alphabetical
            keys.sort(_alphaSort);
          }
          return keys;
        }
        /**
        * @ngdoc private function
        * @name _alphaSort
        * @param {string} a the first element to compare
        * @param {string} b the second element to compare
        * @description
        *  a generic comparer function used within the array sort to the elements alphabetical based on current localization
        * @returns returns true if the value of a comes before b
        */
        function _alphaSort(a,b){
          // standard localized compare
          return a.localeCompare(b);
        }
        /**
        * @ngdoc private function
        * @name _getDepthString
        * @param {int} depth the depth of the current OBJECT_END_TOKEN
        * @description
        *  create a string with a number of depth delimeters equql to the depth specified
        * @returns a string with make up of depth number of depth delimeters
        */

        function _getDepthString(depth){
          var _depthString = "";
          for (var i = 0; i < depth; i++) {
            _depthString += DEPTH_DELIM;
          }
          return _depthString;
        }
    }

    return flObjectWriter;
  }
})(angular, angular.module('fl.challenge').factory);

(function(module) {
try {
  module = angular.module('fl.challenge.templateCache');
} catch (e) {
  module = angular.module('fl.challenge.templateCache', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('flTemplateCache:/viewer/fl-challenge-view.html',
    '<div class="well"><h2>Frontline Education Code Challenge</h2><p>A complete tested soultion to the challenge. Coverage reports can be viewed at <a href="coverage/html/index.html" target="_blank">here</a>.</p><div class="input-group"><input type="text" class="form-control" ng-model="$ctrl.strToParse"> <span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="$ctrl.test()">Parse!</button></span></div><div class="row"><div class="col-sm-6"><h3>formatted output:</h3><pre class="pre-scrollable">{{$ctrl.printResults}}</pre></div><div class="col-sm-6"><h3>Bonus (output in alphabetical order):</h3><pre class="pre-scrollable">{{$ctrl.sortedPrintResults}}</pre></div></div><div class="row"><h3>The parsed object in json format</h3><pre class="pre-scrollable">{{$ctrl.result|json}}\n' +
    '  </pre></div></div>');
}]);
})();
