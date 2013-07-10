#NeJS

ECMAScript6 to ECMAScript3 compiler

##Synopsis
* let, const delclaration (defs.js)
* arrow functions

Examples:

    () => ...
    param => ...
    (param1, param2) => {
        ...
        return ...
    }

* rest parameters

Examples:

    function foo(a, b, ...other) {
        ...
    }

* default parameters

Examples:

    function foo(a, b = 1) {

    }

* named parameters

Examples:

    function foo({name, body: lastName}) {
        console.log(name);
        console.log(lastName);
    }

    foo({name: 'Foo', body: 'Bar'});

##Usage
    npm install -g nejs
    nejs -s <source> -o <output>