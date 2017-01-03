/***/
(function(has_win, has_mod){

  var g;
  if(has_win) {
    g = window;
  } else {
    g = typeof self == 'undefined' ? this: self;
  }
  g.micropipe = micropipe;

  if(has_mod) module.exports = micropipe;
  function micropipe() {
    
    // Support (fn, fn, ..., [opt]) or (Array(fn, fn,... ,fn), [opt])
    var actors = casting(arguments);
    if(isArray(actors[0])) actors = actors[0].concat(actors[1] || {});
    
    var opts = isFunction(actors.slice(-1)[0]) ? {}: actors.pop();
    return next();
  
    function next() {
      var self = opts.self || next.self || this;
      var actor = actors.shift();
      if(isFunction( actor )) {
        next.options = opts;
        actor.apply(self, casting(arguments).concat(next));
      }
    }
  
    function casting(a) {
      return Array.prototype.slice.call(a);
    }
    function isArray(x) {
      return Array.isArray(x);
    }
    function isFunction(x) {
      return typeof x == 'function';
    }
  
  }

}).call(this, typeof window != 'undefined', typeof module != 'undefined');