#!/usr/bin/env node

var NeJS = require('./nejs');
var Program = require('commander');

Program
	.version('0.0.1')
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.parse(process.argv);

var fs = require('fs');
var file = Program.source;
var newFile = Program.output || (file + '.js');

fs.readFile(file, function (err, data) {
	if (err) {
		console.log(err);

	} else {
		fs.writeFile(newFile, NeJS.compile(String(data)), function (err) {
			if (err) {
				console.log(err);

			} else {
				console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
			}
		});
	}
});