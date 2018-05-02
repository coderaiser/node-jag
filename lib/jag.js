'use strict';

const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const tar = require('tar');
const fstream = require('fstream');

const check = require('checkup');
const pipe = require('pipe-io');
const files = require('files-io');

exports.pack = (from, to, callback) => {
    check
        .type('callback', callback, 'function')
        .check({
            to,
            from,
        });
    
    isDir(from, (is) => {
        const optionsDir = { path: from, type: 'Directory' };
        const optionsTar = { noProprietary: true };
        const streamZip = zlib.createGzip();
        const isStr = typeof to === 'string';
        const options = {
            gzip: true
        };
        
        if (!is) {
            return files.pipe(from, to, options, callback);
        
        const streamDir = fstream.Reader(optionsDir);
        const streamTar = tar.Pack(optionsTar);
        
        let streamFile;
        if (!isStr) {
            streamFile  = to;
        } else {
            const dir = path.dirname(to);
            const name = path.basename(to, '.gz');
            
            if (dir !== '/')
                dir += path.sep;
            
            const to = dir + name + '.tar.gz';
            
            streamFile = fs.createWriteStream(to);
        }
        
        pipe([
            streamDir,
            streamTar,
            streamZip,
            streamFile
        ], callback);
    });
};

exports.unpack  = (from, to, callback) => {
    const isStr = typeof from === 'string';
    const isGz = /\.gz$/.test(from);
    const isTarGz = /\.tar\.gz$/.test(from);
    
    const options = {
        gunzip: true
    };
    
    check
        .type('callback', callback, 'function')
        .check({
            to,
            from,
        });
    
    let write;
    if (isTarGz)
        write   = tar.Extract({ path: path.dirname(to) });
    else if (!isStr || isGz)
        write   = to;
    else
        return callback(Error('wrong file type: can be ".gz" or ".tar.gz"!'));
    
    files.pipe(from, write, options, callback);
};

function isDir(name, callback) {
    fs.stat(name, (error, stat) => {
        if (!error)
            isDir = stat.isDirectory();
        
        callback(isDir);
    });
}

