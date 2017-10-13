describe("Unit: Fl Parser",function(){
    var _rootScope,
        _flParser;

    var TEST_STRING = "(id,created,employee(id,firstname,employeeType(id), lastname),location)";

    // the inner fragment (id,firstname,employeeType(id), lastname) will be parsewd
    var UNBALANCED_TEST_STRING = "(id,created,employee(id,firstname,employeeType(id), lastname),location";


    var EXPECTED_PARSED_JSON={
      "id": null,
      "created": null,
      "employee": {
        "id": null,
        "firstname": null,
        "employeeType": {
          "id": null
        },
        "lastname": null
      },
      "location": null
    };

    var EXPECTED_UNBALANCED_PARSED_JSON={
        "id": null,
        "firstname": null,
        "employeeType": {
          "id": null
        },
        "lastname": null
      };

  beforeEach(module('fl.challenge'));


  beforeEach(inject(function(flParser,$rootScope){
      _rootScope = $rootScope;

      _flParser=flParser
  }));


  it('should exist',function(){
    expect(_flParser).not.toBeUndefined();
  });


  it('it should be able to parse the test string without error',function(done){

    function _validTest(result){
      expect(result).not.toBeUndefined();
    }

    function _invalidTest(error){
      expect(error).toBeUndefined();
    }
    _flParser
      .parse(TEST_STRING)
      .then(_validTest)
      .catch(_invalidTest)
      .finally(done);
    _rootScope.$apply();
  })


  it('it should be able to parse the test string to be eqaul to the expect parsed json',function(done){

    function _validTest(result){
      expect(result).not.toBeUndefined();
      expect(result).toEqual(EXPECTED_PARSED_JSON);
    }

    function _invalidTest(error){
      expect(error).toBeUndefined();
    }
    _flParser
      .parse(TEST_STRING)
      .then(_validTest)
      .catch(_invalidTest)
      .finally(done);
    _rootScope.$apply();
  });

  it('it should be able to parse an unbalanced fragment  to be the json representation of all balanced inner fragments',function(done){

    function _validTest(result){
      expect(result).not.toBeUndefined();
      expect(result).toEqual(EXPECTED_UNBALANCED_PARSED_JSON);
    }

    function _invalidTest(error){
      expect(error).toBeUndefined();
    }
    _flParser
      .parse(UNBALANCED_TEST_STRING)
      .then(_validTest)
      .catch(_invalidTest)
      .finally(done);
    _rootScope.$apply();
  });

  it('it should throw an exception when parsing an empty string',function(done){

    function _validTest(result){
      expect(result).toBeUndefined();

    }

    function _invalidTest(error){
      expect(error).not.toBeUndefined();
    }
    _flParser
      .parse('')
      .then(_validTest)
      .catch(_invalidTest)
      .finally(done);
    _rootScope.$apply();
  });

  it('it should throw an exception when parsing an null string',function(done){

    function _validTest(result){
      expect(result).toBeUndefined();

    }

    function _invalidTest(error){
      expect(error).not.toBeUndefined();
    }
    _flParser
      .parse(null)
      .then(_validTest)
      .catch(_invalidTest)
      .finally(done);
    _rootScope.$apply();
  })



});
