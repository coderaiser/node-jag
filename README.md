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
## Related

- [Jaguar](https://github.com/coderaiser/node-jaguar "Jaguar") - Pack and extract .tar.gz archives with emitter.
- [Bizzy](https://github.com/coderaiser/node-bizzy "Bizzy") - Pack and extract .tar.bz2 archives with emitter.
- [OneZip](https://github.com/coderaiser/node-onezip "OneZip") - Pack and extract zip archives with emitter.
- [Tar-to-zip](https://github.com/coderaiser/node-tar-to-zip "tar-to-zip") - Convert tar and tar.gz archives to zip.

## License
MIT
