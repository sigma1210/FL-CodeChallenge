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
