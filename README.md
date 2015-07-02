Jag
=======

Pack files and folders with tar and gzip. Use [jaguar](https://github.com/coderaiser/node-jaguar "Jaguar") when you need to know a progress of operation.

## Install

`npm i jag --save`

## Hot to use?

```js
var jag = require('jag'),
    fn  = function(error) {
        if (error)
            console.error(error.message);
    };

jag.pack('/tmp/lib', '/tmp/1/lib', fn); /* extenstion would be added */
jag.unpack('/tmp/lib.tar.gz', '/tmp/lib', fn);
```

## License

MIT

