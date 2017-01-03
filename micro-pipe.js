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
    return next();

    function next() {
      var self = opts.self || next.self || this;
      var timer, actor = actors.shift(), args = casting(arguments);
      if(!isFunction(actor)) return Promise.resolve();
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
          rsl([this, arguments]);

        };
        _next.index = idx;
        _next.options = opts;
        actor.apply(self, args.concat(_next));
      }).then(function(pair) {
        return idx++, next.apply(pair[0], pair[1]);
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
