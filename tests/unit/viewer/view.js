describe('unit test : <dr:version/> component',function(){

  var VIEWER_TEMPLATE='<fl:challenge:view/>'

  var HEADER_HTML ='<h2>Frontline Education Code Challenge</h2>';

  var _rootScope,
      _compile,
      _componentController,
      _viewCTRLInjections;


  beforeEach(module('fl.challenge'));
  beforeEach(inject(function($rootScope,$compile,$componentController,$log,$filter,flParser,flObjectWriter){
      _rootScope = $rootScope;
      _compile=$compile;
      _componentController=$componentController;
      _viewCTRLInjections={
            $log:$log,
            $filter:$filter,
            flParser:flParser,
            flObjectWriter:flObjectWriter
          };

  }));

  it('should compile without error',function(){
      var $scope= _rootScope.$new(true);
      var element = _compile(VIEWER_TEMPLATE)($scope);
      $scope.$digest();
      expect(element.html()).toContain(HEADER_HTML);
      $scope.$destroy();
  });

  it('should have a controller',function(){
      var ctrl = _componentController('flChallengeView',_viewCTRLInjections);
      expect(ctrl).not.toBeUndefined();
  });

  it('the controller should have a test method',function(){
      var ctrl = _componentController('flChallengeView',_viewCTRLInjections);
      expect(ctrl.test).not.toBeUndefined();
  });

  it('the controller should execute the test methods with defasults and not error',function(){
      var ctrl = _componentController('flChallengeView',_viewCTRLInjections);

      function _test(){
        ctrl.test();
        _rootScope.$apply();
      }

      expect(_test).not.toThrow();
  });

  it('the controller should execute the test methods with an empty string and not error',function(){
      var ctrl = _componentController('flChallengeView',_viewCTRLInjections);

      function _test(){
        ctrl.strToParse='';
        ctrl.test();
        _rootScope.$apply();
      }

      expect(_test).not.toThrow();
  });
  it('the controller should execute the test methods with an null string and not error',function(){
      var ctrl = _componentController('flChallengeView',_viewCTRLInjections);

      function _test(){
        ctrl.strToParse=null;
        ctrl.test();
        _rootScope.$apply();
      }

      expect(_test).not.toThrow();
  });


});
