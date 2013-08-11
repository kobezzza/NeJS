#!/usr/bin/env node --harmony

var NeJS = require('./nejs');
var Program = require('commander');

Program
	.version(NeJS.VERSION)
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.option('-m, --smart', 'smart compile')
	.parse(process.argv);

var fs = require('fs');
var path = require('path');

var file = Program.source;
var newFile = Program.output || (file + '.js');
var defs = require('defs');

if ((!Program.output || Program.output === file) && Program.smart && path.extname(file) === '.js') {
	console.error('Invalid output src!');
	process.exit(-1);
}

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

		if (res.errors) {
			console.error(res.errors.join("\n"));
			console.error("\n");
			process.exit(-1);
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