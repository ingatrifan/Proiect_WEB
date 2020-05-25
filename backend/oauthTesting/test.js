const zlib = require('zlib');
var gzlip = zlib.createGzip();
var fs = require('fs');
var input = fs.createReadStream('./uTorrent.exe');
var out =fs.createWriteStream('./out.gz');
input.pipe(gzlip).pipe(out);