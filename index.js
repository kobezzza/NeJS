#!/usr/bin/env node --harmony

var NeJS = require('./nejs');
var Program = require('commander');

Program
	.version('0.0.2')
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.parse(process.argv);

var fs = require('fs');
var file = Program.source;
var newFile = Program.output || (file + '.js');
var defs = require('defs');

fs.readFile(file, function (err, data) {
	if (err) {
		console.log(err);

	} else {
		var res = defs(NeJS.compile(String(data)), {
			"environments": ["node", "browser"],
			"disallowVars": false,
			"disallowDuplicated": false,
			"disallowUnknownReferences": false
		});

		if (res.exitcode !== 0) {
			process.exit(res.exitcode);
		}

		if (res.stats) {
			console.log(res.stats.toString());
			process.exit(0);
		}

		if (res.ast) {
			console.log(JSON.stringify(res.ast, null, 4));
		}

		fs.writeFile(newFile, res.src, function (err) {
			if (err) {
				console.log(err);

			} else {
				console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
			}
		});
	}
});