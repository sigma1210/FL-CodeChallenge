describe("Unit: Fl Parser",function(){
    var _rootScope,
        _flObjectWriter;


    var JSON_TO_WRITE={
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

    var EXPECTED_OUTPUT='id\n\ncreated\n\nemployee\n\n- id\n\n- firstname\n\n- employeeType\n\n-- id\n\n- lastname\n\nlocation\n\n'
    var EXPECTED_ALPHA_FORMAT ='created\n\nemployee\n\n- employeeType\n\n-- id\n\n- firstname\n\n- id\n\n- lastname\n\nid\n\nlocation\n\n'


  beforeEach(module('fl.challenge'));


  beforeEach(inject(function(flObjectWriter,$rootScope){
      _rootScope = $rootScope;
      _flObjectWriter=flObjectWriter;
  }));


  it('should exist',function(){
    expect(_flObjectWriter).not.toBeUndefined();
  });


  it('should be able to handle a null object',function(){
    var _out = _flObjectWriter.write(null);
    expect(_out).toEqual('');

  });


  it('should be able to handle a write a defined object in the normal forward',function(){
    var _out = _flObjectWriter.write(JSON_TO_WRITE);
    expect(_out).toEqual(EXPECTED_OUTPUT);
  });

  it('should be able to handle a write a defined object in the normal forward',function(){
    var _out = _flObjectWriter.write(JSON_TO_WRITE,_flObjectWriter.alphabetical);
    expect(_out).toEqual(EXPECTED_ALPHA_FORMAT);
  });






});
