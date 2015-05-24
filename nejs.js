/*!
 * Real bad transpiler ES6 to ES5
 */

var NeJS = {
	VERSION: [0, 1, 18],
	quotContent: []
};

var
	compiler = require('./lib/compiler'),
	escaper = require('escaper');

NeJS.compile = compiler.compile;
NeJS.escaper = escaper;

module.exports = NeJS;
