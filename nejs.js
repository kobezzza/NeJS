/*!
 * Исключительно кривой транслятор ECMAScript6 в ECMAScript3
 */

var NeJS = {
	VERSION: '0.1.6',
	quotContent: []
};

var compiler = require('./lib/compiler');
var Escaper = require('escaper');

NeJS.compile = compiler.compile;
NeJS.Escaper = Escaper;

module.exports = NeJS;