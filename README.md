# micro

Support for making functions pipeline.
You can use this both node and browsers.

## Install

Install with [npm](http://github.com/isaacs/npm):

    npm install micro-pipe
    
## API - Queries

    var micropipe = require('micro-pipe');
    micropipe(function(next){ console('a'), next()}
              ,function(next){ console('b'), next()}
              ,function(next){ console('c'), next()}); // => 'a', 'b', 'c'

### also use on browser

```html
<script type="text/javascript" src="micro-pipe.js"></script>
<script type="text/javascript">

    micropipe(function(next){ console('x'), next()}
              ,function(next){ console('y'), next()}
              ,function(next){ console('z'), next()}); // => 'x', 'y', 'z'

</script>
```
