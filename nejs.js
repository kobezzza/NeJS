/*!
 * Исключительно кривой транслятор ECMAScript6 в ECMAScript3
 */

var NeJS = {
	VERSION: '0.0.4',
	quotContent: []
};

(function () {
/**
 * Преобразовать ECMAScript6 в ECMAScript3
 *
 * @param {string} src - исходный текст
 * @return {string}
 */
NeJS.compile = function (src) {
	src = NeJS.replaceDangerBlocks(src);
	var i = 1;

	// Arrow function
	while (i) {
		i--;

		src.replace(/(\([^()]*\))\s*=>\s*({|)/m, function (sstr, $1, $2, pos, str) {
			i++;
			var res = 'function ' + $1 + ' {"__NEJS__";' + (!$2 ? 'return ' : '');

			var bOpen = 0,
				word = '',
				start = 0,

				inFunc = false,
				inFuncBOpen;

			for (var j = pos + sstr.length; j < str.length; j++) {
				var el = str.charAt(j);

				if (/[$\w]/.test(el)) {
					if (!word) {
						start = j;
					}

					word += el;

				} else {
					// Замена this
					if (word === 'this' && !inFunc) {
						str = str.substring(0, start) + '__NEJS_THIS__' + str.substring(j);
						j += '__NEJS_THIS__'.length - 'this'.length;

					// Внутри вложенный функций this не заменяем
					} else if (word === 'function') {
						inFunc = true;
						inFuncBOpen = bOpen;
					}

					word = '';
				}

				// Управление скобками
				if ($2 || inFunc) {
					if (el === '{') {
						bOpen++;

					} else if (el === '}') {
						if (!bOpen) {
							break;
						}

						bOpen--;
						if (inFuncBOpen === bOpen) {
							inFunc = false;
							inFuncBOpen = null;
						}

					}

				} else if (!$2) {
					if (el === '(') {
						bOpen++;

					} else if (el === ')') {
						bOpen--;
					}

					if (
						((el === ',' || el === ';' || el === '\n') && !bOpen) ||
						(el === ')' && bOpen < 0)
					) {

						str = str.substring(0, j) + '}' + str.substring(j);
						break;
					}
				}
			}

			src = str.substring(0, pos) + res + str.substring(pos + sstr.length);
		});
	}

	// Параметры функции
	src = src.replace(/(?:^([ \t]*).*?|^)function\s*\(([\s\S]*?)\)\s*{("__NEJS__";|)/gm, function (sstr, $1, $2, $3) {
		var restRgxp = /\.\.\./,
			defRgxp = /=/;

		var s = '\n' + $1 + '\t';
		sstr += s + (!$3 ? 'var __NEJS_THIS__ = this;' : '');

		$2.split(',').forEach(function (el, i) {
			// rest
			if (restRgxp.test(el)) {
				var paramName = el.replace(restRgxp, '').trim();

				sstr += s + 'var ' + paramName + ' = [];' +
					s + 'for (var _i = 0; _i < (arguments.length - ' + i + '); _i++) {' +
						s + '\t' + paramName + '[_i] = arguments[_i + ' + i + '];' +
					s + '}';

				sstr = sstr.replace(new RegExp('(?:,|)\\s*' + el.replace(restRgxp, '\\.\\.\\.') + '\\s*'), '');

			// Параметры по умолчанию
			} else if (defRgxp.test(el)) {
				var param = el.split('=');
				param[0] = param[0].trim();

				sstr += '\n' + $1 + '\tif (typeof ' + param[0] + ' === "undefined") { ' + el.trim() + '; }';
				sstr = sstr.replace(new RegExp('\\b' + el + '\\b'), param[0]);
			}
		});

		return sstr;
	});

	return NeJS.pasteDangerBlocks(src.replace(/"__NEJS__";/gm, ''));
};// Таблица экранирований
var escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

var escapeEndMap = {
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'?': true,
	':': true,
	'(': true
};

/**
 * Заметить блоки вида ' ... ', " ... ", / ... / на
 * __NEJS_QUOT__номер
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
NeJS.replaceDangerBlocks = function (str) {
	var begin,
		escape,
		end = true,

		selectionStart,
		lastCutLength = 0;

	var stack = NeJS.quotContent;

	str = str.replace(/^[\s]*(?:\/\/.*|\/\*[\s\S]*?\*\/)/gm, function (sstr) {
		var label = '__NEJS_QUOT__' + stack.length;

		stack.push(sstr);
		return label;
	});

	return String(str.split('').reduce(function (res, el, i) {
		if (!begin) {
			if (escapeEndMap[el]) {
				end = true;

			} else if (/[^\s\/]/.test(el)) {
				end = false;
			}
		}

		if (escapeMap[el] && (el === '/' ? end : true) && !begin) {
			begin = el;
			selectionStart = i;

		} else if (begin && (el === '\\' || escape)) {
			escape = !escape;

		} else if (escapeMap[el] && begin === el && !escape) {
			begin = false;
			var cut = str.substring(selectionStart, i + 1),
				label = '__NEJS_QUOT__' + stack.length;

			stack.push(cut);
			res = res.substring(0, selectionStart - lastCutLength) + label + res.substring(i + 1 - lastCutLength);
			lastCutLength += cut.length - label.length;

		}

		return res;
	}, str));
};

/**
 * Заметить __SNAKESKIN_QUOT__номер в строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
NeJS.pasteDangerBlocks = function (str) {
	return str.replace(/__NEJS_QUOT__(\d+)/gm, function (sstr, pos) {
		return NeJS.quotContent[pos];
	});
};})();

module.exports = NeJS;
