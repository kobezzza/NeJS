NeJS
====

ECMAScript 6 to ECMAScript 3 compiler

## Deprecated. Use [Babel](https://github.com/babel/babel)
## Usage

```bash
npm install -g nejs
nejs [options] [dir|file ...]
```

## Synopsis

* let, const delclaration ([defs.js](https://github.com/olov/defs));
* arrow functions.

**Examples:**

```js
() => ...
param => ...
(param1, param2) => {
  ...
  return ...
}
```

* rest parameters

**Examples:**

```js
function foo(a, b, ...other) {
  ...
}
```

* default parameters

**Examples:**

```js
function foo(a, b = 1) {
  ...
}
```

* named parameters

**Examples:**

```js
function foo({name, body: lastName}) {
  console.log(name);
  console.log(lastName);
}

foo({name: 'Foo', body: 'Bar'});
```

## [License](https://github.com/kobezzza/NeJS/blob/master/LICENSE)

The MIT License.
