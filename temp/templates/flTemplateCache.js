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
