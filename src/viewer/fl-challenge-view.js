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
