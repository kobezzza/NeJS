// Таблица экранирований
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
	'(': true,
	'{': true
};

/**
 * Заметить блоки вида ' ... ', " ... ", / ... / на
 * __NEJS_QUOT__номер
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
exports.replaceDangerBlocks = function (str) {
	var stack = this.quotContent;
	str = str.replace(/^[\s]*(?:\/\/.*|\/\*[\s\S]*?\*\/)/gm, function (sstr) {
		var label = '__NEJS_QUOT__' + stack.length;

		stack.push(sstr);
		return label;
	});

	var begin,
		escape,
		end = true,

		selectionStart,
		lastCutLength = 0,

		block = false;

	return String(str.split('').reduce(function (res, el, i) {
		if (!begin) {
			if (escapeEndMap[el]) {
				end = true;

			} else if (/[^\s\/]/.test(el)) {
				end = false;
			}
		}

		if (begin === '/' && !escape) {
			if (el === '[') {
				block = true;

			} else if (el === ']') {
				block = false;
			}
		}

		if (escapeMap[el] && (el === '/' ? end : true) && !begin) {
			begin = el;
			selectionStart = i;

		} else if (begin && (el === '\\' || escape)) {
			escape = !escape;

		} else if (escapeMap[el] && begin === el && !escape && (begin === '/' ? !block : true)) {
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
exports.pasteDangerBlocks = function (str) {
	var stack = this.quotContent;
	return str.replace(/__NEJS_QUOT__(\d+)/gm, function (sstr, pos) {
		return stack[pos];
	});
};