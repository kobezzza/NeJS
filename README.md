# NeJS

ECMAScript 6 to ECMAScript 3 compiler

## Usage
	npm install -g nejs
	nejs -s <source> -o <output>

## Synopsis
* let, const delclaration ([defs.js](https://github.com/olov/defs))
* arrow functions

Examples:

```js
() => ...
param => ...
(param1, param2) => {
	...
	return ...
}
```

* rest parameters

Examples:

```js
function foo(a, b, ...other) {
	...
}
```

* default parameters

Examples:

```js
function foo(a, b = 1) {
	...
}
```

* named parameters

Examples:

```js
function foo({name, body: lastName}) {
	console.log(name);
	console.log(lastName);
}

foo({name: 'Foo', body: 'Bar'});
```

## License

The MIT License (MIT)

Copyright (c) 2014 Andrey Kobets (Kobezzza)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.