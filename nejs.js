/*!
 * Исключительно кривой транслятор ECMAScript6 в ECMAScript3
 */

var NeJS = {
	VERSION: '0.1.5',
	quotContent: []
};

var compiler = require('./lib/compiler');
var escape = require('./lib/escape');

NeJS.compile = compiler.compile;
NeJS.replaceDangerBlocks = escape.replaceDangerBlocks;
NeJS.pasteDangerBlocks = escape.pasteDangerBlocks;

module.exports = NeJS;