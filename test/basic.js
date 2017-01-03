var nodeunit = require('nodeunit');
var micropipe = require('../micro-pipe');

module.exports = nodeunit.testCase({
  'args': function(t) {
    var cnt = 0;
    micropipe(function(next) {
      cnt++, next()
    }, function(next) {
      cnt++, next()
    }, function(next) {
      t.equal(cnt, 2), t.done()
    });
  },
  'array': function(t) {
    var cnt = 0;
    var fns = [];
    fns.push(function(next) {
      cnt++, next()
    });
    fns.push(function(next) {
      cnt++, next()
    });
    fns.push(function(next) {
      t.equal(cnt, 2), t.done()
    });
    micropipe(fns);
  },
  'result': function(t) {
    var cnt = 0;
    micropipe(function(next) {
      cnt++, next('b');
    }, function(v, next) {
      cnt++, t.equal(v, 'b'), next('c');
    }, function(v, next) {
      cnt++, t.equal(v, 'c'), next('d');
    }).then(function(args){
      t.equal(cnt, 3), t.equal(args[0], 'd');
      t.done();
    })['catch'](function(e){
      console.error(e);
      t.fail(e);
    });
  },
  'readme': function(t) {
    var cnt = 0;
    var fns = [];
    fns.push(function(next){ cnt++, next('b'); });
    fns.push(function(v, next){ cnt++, t.equal(v, 'b'), next('c'); });
    fns.push(function(v, next){ cnt++, t.equal(v, 'c'), next(1,2,3); });
    micropipe(fns).then(function(args){ 
      t.equal(cnt, 3), t.equal(args[2], 3);
      t.done();
    })['catch'](function(e){
      console.error(e);
      t.fail(e);
    }); // => 'a', 'b', 'c', [1, 2, 3]
  }
});
