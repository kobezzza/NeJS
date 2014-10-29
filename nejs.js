/*!
 * Исключительно кривой транслятор ECMAScript6 в ECMAScript3
 */

var NeJS = {
	VERSION: [0, 1, 16],
	quotContent: []
};

var compiler = require('./lib/compiler'),
	escaper = require('escaper');

NeJS.compile = compiler.compile;
NeJS.escaper = escaper;

module.exports = NeJS;
