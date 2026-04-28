# Hunspell Spellchecker in Javascript

[![Build Status](https://travis-ci.org/GitbookIO/hunspell-spellchecker.png?branch=master)](https://travis-ci.org/GitbookIO/hunspell-spellchecker)
[![NPM version](https://badge.fury.io/js/hunspell-spellchecker.svg)](http://badge.fury.io/js/hunspell-spellchecker)

A lightweight spellchecker written in Javascript, it can be used in Node.JS and in the browser. It has been build to be able to pre-parse a Hunspell dictionary to JSON.

### Installation

```
$ npm install hunspell-spellchecker
```

### API

Initialize a spellchecker instance:

```js
var Spellchecker = require("hunspell-spellchecker");

var spellchecker = new Spellchecker();
```

Parse and serialize a dictionary

```js
// Parse an hunspell dictionary that can be serialized as JSON
var DICT = spellchecker.parse({
    aff: fs.readFileSync("./en_EN.aff");
    dic: fs.readFileSync("./en_EN.dic")
});
```

Note that if you want to store DICT into a file, you need to run JSON.stringify() with a replacer function, otherwise important data (all regular expressions) get lost. See test/hunspell-tojson.js for how to do it. For reloading the JSON, the corresponding "reviver" functionality is built into the spellchecker.use() implementation, so you can just reload with

```js
DICT = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'));
```

You then load that serialized dictionary into spellchecker with

```js
// Load a dictionary
spellchecker.use(DICT);
```

Check a word:

```js
// Check a word
var isRight = spellchecker.check("tll");
```
