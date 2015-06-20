(function() {
    'use strict';
    
    var path        = require('path'),
        fs          = require('fs'),
        zlib        = require('zlib'),
        
        tar         = require('tar'),
        fstream     = require('fstream'),
        
        check       = require('checkup'),
        pipe        = require('pipe-io'),
        files       = require('files-io');
    
    exports.pack    = function(from, to, callback) {
        check
            .type('callback', callback, 'function')
            .check({
                to: to,
                from: from
            });
        
        isDir(from, function(is) {
            var dir, name,
                
                optionsDir  = { path: from, type: 'Directory' },
                optionsTar  = { noProprietary: true },
                
                streamDir,
                streamTar,
                streamZip   = zlib.createGzip(),
                streamFile,
                
                isStr   = typeof to === 'string', 
                options = {
                    gzip: true
                };
            
            if (!is) {
                files.pipe(from, to, options, callback);
            } else {
                streamDir   = fstream.Reader(optionsDir);
                streamTar   = tar.Pack(optionsTar);
                    
                if (!isStr) {
                    streamFile  = to;
                } else {
                    dir     = path.dirname(to);
                    name    = path.basename(to, '.gz');
                    
                    if (dir !== '/')
                        dir += path.sep;
                    
                    to      = dir + name + '.tar.gz';
                    
                    streamFile = fs.createWriteStream(to);
                }
                
                pipe([
                    streamDir,
                    streamTar,
                    streamZip,
                    streamFile
                ], callback);
            }
        });
    };
    
    exports.unpack  = function(from, to, callback) {
        var write, error,
            isStr   = typeof from === 'string',
            isGz    = /\.gz$/.test(from),
            isTarGz = /\.tar\.gz$/.test(from),
            
            options = {
                gunzip    : true
            };
        
        check
            .type('callback', callback, 'function')
            .check({
                to: to,
                from: from
            });
        
        if (!isStr || isGz)
            write   = to;
        else if (isTarGz)
            write   = tar.Extract({ path: path.dirname(to) });
        else 
            error = Error('wrong file type: can be ".gz" or ".tar.gz"!');
        
        if (error)
            callback(error);
        else
            files.pipe(from, write, options, callback);
    };
    
    function isDir(name, callback) {
        fs.stat(name, function(error, stat) {
            var isDir;
            
            if (!error)
                isDir = stat.isDirectory();
            
            callback(isDir);
        });
    }
})();
