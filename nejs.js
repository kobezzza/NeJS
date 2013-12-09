/*!
 * Исключительно кривой транслятор ECMAScript6 в ECMAScript3
 * @status stable
 * @version 1.0.0
 */

var NeJS = {
	VERSION: '0.1.9',
	quotContent: []
};

var compiler = require('./lib/compiler');
var escaper = require('escaper');

NeJS.compile = compiler.compile;
NeJS.escaper = escaper;

module.exports = NeJS;