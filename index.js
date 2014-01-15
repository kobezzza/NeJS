#!/usr/bin/env node --harmony

/**!
 * @status stable
 * @version 1.0.2
 */

var NeJS = require('./nejs');
var Program = require('commander');

Program
	.version(NeJS.VERSION.join('.'))
	.option('-s, --source [src]', 'source file')
	.option('-o, --output [src]', 'output file')
	.option('-c, --smart', 'smart compile')
	.parse(process.argv);

var input;

if (!Program.source) {
	input = process.argv[2];
}

if (!input && !Program.source) {
	Program.help();
}

var fs = require('fs');
var path = require('path');

var text = Program.source ? String(fs.readFileSync(Program.source)) : input;

var file = Program.source;
var newFile = Program.output || (file ? file + '.js' : '');
var defs = require('defs');

if (Program.source && (!Program.output || Program.output === file) && Program.smart && path.extname(file) === '.js') {
	console.error('Invalid output src!');
	process.exit(-1);
}

var ShaBang = '';
text = text.replace(/^(#!\/.*\s+)/, function (sstr, $1) {
	ShaBang = $1;
	return '';
});

var res = defs(NeJS.compile(text), {
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

res.src = ShaBang + res.src;
if (newFile) {
	fs.writeFile(newFile, res.src, function (err) {
		if (err) {
			console.log(err);

		} else {
			console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
		}
	});

} else {
	console.log(res.src);
}