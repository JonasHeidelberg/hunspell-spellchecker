#! /usr/bin/env node

var fs = require("fs");
var path = require("path");

var Spellchecker = require("../lib");

var input = path.resolve(process.cwd(), process.argv[2]);
var sp = new Spellchecker();


console.log("Start converting:");
console.log("\tAFF:", input+".aff");
console.log("\tDIC:", input+".dic");

var DICT = sp.parse({
    dic: fs.readFileSync(input+".dic", { encoding: "utf8" }),
    aff: fs.readFileSync(input+".aff", { encoding: "utf8" })
});

// Replacer to handle RegExp serialization
const replacer = (key, value) => {
    if (value instanceof RegExp) {
        return {
            $type: 'RegExp',
            source: value.source,
            flags: value.flags
        };
    }
    return value;
};

const stringified = JSON.stringify(DICT, replacer);
fs.writeFileSync(input+".json", stringified);

console.log("Dictionary written in ", input+".json");

