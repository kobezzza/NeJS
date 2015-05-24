#!/usr/bin/env node --harmony

var nejs = require('../nejs'),
	fs = require('fs');

var program = require('commander'),
	defs = require('defs');

program
	.version(nejs.VERSION.join('.'))
	.usage('[options] [dir|file ...]')

	.option('-s, --source [src]')
	.option('-o, --output [src]')

	.parse(process.argv);

var args = program['args'],
	input;

var file = program['source'],
	newFile = program['output'];

if (!file && args.length) {
	input = args.join(' ');

	if (fs.existsSync(input)) {
		file = input;
		input = false;
	}
}

function action(data) {
	var toConsole = input && !program['output'] ||
		!newFile;

	var ShaBang = '';
	data = data.replace(/^(#!\/.*\s+)/, function (sstr, $1) {
		ShaBang = $1;
		return '';
	});

	var res = defs(nejs.compile(data), {
		'environments': ['node', 'browser'],
		'disallowVars': false,
		'disallowDuplicated': false,
		'disallowUnknownReferences': false
	});

	if (res.errors) {
		console.error(res.errors.join('\n'));
		console.error('\n');
		process.exit(1);
	}

	if (res.ast) {
		console.log(JSON.stringify(res.ast, null, 4));
	}

	res.src = ShaBang + res.src;

	if (toConsole) {
		console.log(res.src);

	} else {
		fs.writeFileSync(newFile, res.src);
		console.log('File "' + file + '" was successfully compiled -> "' + newFile + '"');
	}

	process.exit(0);
}

if (!file && input == null) {
	var buf = '';
	var stdin = process.stdin,
		stdout = process.stdout;

	stdin.setEncoding('utf8');
	stdin.on('data', function (chunk) {
		buf += chunk;
	});

	stdin.on('end', function () {
		action(buf);
	}).resume();

	process.on('SIGINT', function () {
		stdout.write('\n');
		stdin.emit('end');
		stdout.write('\n');
		process.exit();
	});

} else {
	action(file ? fs.readFileSync(file).toString() : input);
}
