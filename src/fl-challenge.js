
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
