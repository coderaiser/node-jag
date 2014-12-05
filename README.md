Jag
=======

Pack files and folders with tar and gzip

## Install

`npm i jag --save`

## Hot to use?

```js
var jag         = require('jag'),
    fn          = function(error) {
        if (error)
            console.error(error.message);
    }

jag.pack('lib', fn);
jag.unpack('lib.tar.gz', fn);
```

## License

MIT

