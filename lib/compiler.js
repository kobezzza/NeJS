/**
 * Преобразовать ECMAScript6 в ECMAScript3
 *
 * @param {string} source - исходный код
 * @return {string}
 */
exports.compile = function (source) {
	source = this.escaper.replace('var __NEJS_THIS__ = this;\n' + source, true);
	var i = 1;

	// Arrow function
	var arrowRgxp = /(\([^()]*\)|[\w$1]+)\s*=>\s*({|)/m;
	while (i) {
		i--;

		source.replace(arrowRgxp, function (sstr, $1, $2, pos, str) {
			i++;
			var res = 'function ' + ($1.charAt(0) === '(' ? $1 : '(' + $1 + ')') +
				' {"__NEJS__";' + (!$2 ? 'return ' : '');

			var bOpen = 0,
				word = '',
				start = 0,

				inFunc = 0,
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
					} else if (word === 'function' || ((word === 'get' || word === 'set') && /\s+[$\w]/.test(el))) {
						inFunc++;
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
							inFunc--;
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

						str = str.substring(0, j) + ';}' + str.substring(j);
						break;
					}
				}
			}

			// Оптимизация обхода
			arrowRgxp.lastIndex = pos + sstr.length;
			source = str.substring(0, pos) + res + str.substring(pos + sstr.length);
		});
	}

	// Параметры функции
	source = source.replace(/(?:^([ \t]*).*?|^)(?:function|get|set)\s+[\w$]*\(([\s\S]*?)\)\s*{("__NEJS__";|)/gm,
		function (sstr, $1, $2, $3) {
			var restRgxp = /\.\.\./,
				defRgxp = /=/;

			var s = '\n' + $1 + '\t';
			sstr += s + (!$3 ? 'var __NEJS_THIS__ = this;' : '');

			var namedParams = false,

				npI = 0,
				skipI = 0,

				npContent;

			$2.split(',').forEach(function (el, i) {
				var val = el.trim();

				if (val.charAt(0) === '{') {
					val = val.slice(1);
					namedParams = true;
					npI++;
					npContent = '';
				}

				// Именованные параметры
				if (namedParams) {
					if (npContent) {
						skipI++;
					}

					if (val.slice(-1) === '}') {
						val = val.slice(0, -1);
						namedParams = false;
					}

					npContent += (npContent ? ',' : '') + el;
					var prop = val.split(':'),
						varName = (prop[1] || prop[0]).trim(),
						npName = '__NEJS_NP_' + npI + '__';

					sstr += '\n' + $1 + '\tvar ' + varName + ' = ' + npName + '.' + prop[0] + ';';
					if (!namedParams) {
						sstr = sstr.replace(new RegExp('((?:,|\\()\\s*)' + npContent), function (sstr, $1) {
							return $1 + npName;
						});
					}

				// rest параметры
				} else if (restRgxp.test(el)) {
					var paramName = el.replace(restRgxp, '').trim();

					sstr += s + 'var ' + paramName + ' = [];' +
						s + 'for (var _i = 0; _i < (arguments.length - ' + (i - skipI) + '); _i++) {' +
							s + '\t' + paramName + '[_i] = arguments[_i + ' + (i - skipI) + '];' +
						s + '}';

					sstr = sstr.replace(
						new RegExp('(,|\\()\\s*' + el.replace(restRgxp, '\\.\\.\\.') + '\\s*'),
						function (sstr, $1) {
							return $1 === '(' ? $1 : '';
						}
					);

				// Параметры по умолчанию
				} else if (defRgxp.test(el)) {
					var param = el.split('=');
					param[0] = param[0].trim();

					sstr += '\n' + $1 + '\tif (typeof ' + param[0] + ' === "undefined") { ' + val + '; }';
					sstr = sstr.replace(new RegExp('((?:,|\\()\\s*)' + el), function (sstr, $1) {
						return $1 + param[0];
					});
				}
			});

			return sstr;
		}
	);

	return this.escaper.paste(source.replace(/"__NEJS__";/gm, ''));
};
