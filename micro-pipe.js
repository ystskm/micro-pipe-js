/***/
(function(has_win, has_mod) {

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

    var idx = 0;
    var opts = isFunction(actors.slice(-1)[0]) ? {}: actors.pop();
    var self = opts.self || this;
    return next();

    function next() {
      var timer, actor = actors.shift(), args = casting(arguments);
      if(!isFunction(actor)) return Promise.resolve(args);
      return new Promise(function(rsl, rej) {
        var _next;
        if(opts.timeout) {

          timer = setTimeout(function() {
            rej(new Error('Timeout on micro-pipe(' + idx + ')'));
          }, opts.timeout);

        }
        _next = function() {

          // User calls this function with arguments given to next.
          clearTimeout(timer);
          rsl(arguments);

        };
        _next.index = idx;
        _next.options = opts;
        _next.reject = rej;
        actor.apply(self, args.concat(_next));
      }).then(function(args) {
        return idx++, next.apply(null, args);
      });
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
