(function() {
    'use strict';
    
    var path        = require('path'),
        fs          = require('fs'),
        zlib        = require('zlib'),
        
        tar         = require('tar'),
        fstream     = require('fstream'),
        
        pipe        = require('pipe-io'),
        files       = require('files-io');
    
    exports.pack    = function(from, to, callback) {
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
                    to      = dir + path.sep + name + '.tar.gz';
                    
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
        var write,
            isTarGz = /\.tar\.gz$/.test(from),
            
            options = {
                gunzip    : true
            };
        
        if (isTarGz)
            write   = tar.Extract({ path: to });
        else
            write   = to;
        
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
