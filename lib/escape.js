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
 * Заметить блоки вида ' ... ', " ... ", / ... /, // ..., /* ... *\/ на
 * __NEJS_QUOT__номер
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
exports.replaceDangerBlocks = function (str) {
	var stack = this.quotContent;

	var begin,
		escape,
		comment,
		end = true,

		selectionStart,
		lastCutLength = 0,

		block = false;

	var cut,
		label;

	return String(str.split('').reduce(function (res, el, i, data) {
		var prev = data[i - 1],
			next = data[i + 1];

		if (!comment) {
			if (!begin) {
				// //, /*
				if (el === '/') {
					if (next === '*') {
						comment = '/*';

					} else if (next === '/') {
						comment = '//';
					}

					if (comment) {
						selectionStart = i;
						return res;
					}
				}

				// ', ", /
				if (escapeEndMap[el]) {
					end = true;

				} else if (/[^\s\/]/.test(el)) {
					end = false;
				}
			}

			// Блоки [] внутри регулярного выражения
			if (begin === '/' && !escape) {
				if (el === '[') {
					block = true;

				} else if (el === ']') {
					block = false;
				}
			}

			// Анализ содержимого
			if (escapeMap[el] && (el === '/' ? end : true) && !begin) {
				begin = el;
				selectionStart = i;

			} else if (begin && (el === '\\' || escape)) {
				escape = !escape;

			} else if (escapeMap[el] && begin === el && !escape && (begin === '/' ? !block : true)) {
				begin = false;

				cut = str.substring(selectionStart, i + 1);
				label = '__NEJS_QUOT__' + stack.length;

				stack.push(cut);
				res = res.substring(0, selectionStart - lastCutLength) + label + res.substring(i + 1 - lastCutLength);

				lastCutLength += cut.length - label.length;

			}

		// Конец комментария
		} else if ((el === '\n' && comment === '//') || (el === '/' && prev === '*' && comment === '/*')) {
			comment = false;

			cut = str.substring(selectionStart, i + 1);
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