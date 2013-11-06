var nodeunit = require('nodeunit');
var micropipe = require('../micro-pipe');

module.exports = nodeunit.testCase({
  'pipe': function(t) {
    var cnt = 0;
    micropipe(function(next){ cnt++, next()}
    ,function(next){ cnt++, next()}
    ,function(next){ t.equal(cnt,2), t.done()});
  }
});
