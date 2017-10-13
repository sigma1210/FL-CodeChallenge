(function(mod){
  'use strict';
  var sharedConfig = require('./karma-shared.conf'),
      fs = require('fs'),
      _needed = JSON.parse(fs.readFileSync('./def/needed.json'));

  mod.exports = unitTestConfig;
  function unitTestConfig(config){
    var conf = sharedConfig();
    config.set(setFiles(conf));
    function setFiles(conf){
      var f   =[].concat(_needed.lib)
                 .concat(_needed.testSupport)
                 .concat(_needed.source)
                 .concat(_needed.tests);
      conf.files = f;
      return conf;
    }
  }
})(module);
