const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Spellchecker = require('../lib/index');

describe('hunspell-tojson', () => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    const testDictPath = path.join(fixturesDir, 'test');
    const outputJsonPath = path.join(fixturesDir, 'test-dict.json');

    it('should create identical result when writing to JSON and reloading vs reading fresh', function() {
        // Load dictionary fresh from .dic and .aff files
        const spellchecker1 = new Spellchecker();
        var originalDICT = spellchecker1.parse({
            dic: fs.readFileSync(path.join(fixturesDir,"test.dic"), { encoding: "utf8" }),
            aff: fs.readFileSync(path.join(fixturesDir,"test.aff"), { encoding: "utf8" })
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

        const stringified = JSON.stringify(originalDICT, replacer);

        // spellcheckerFresh.use(testDictPath);
        // const freshResult = spellcheckerFresh.getDictionary();

        // Reviver to reconstruct RegExp objects
        const reviver = (key, value) => {
            if (value && value.$type === 'RegExp') {
                return new RegExp(value.source, value.flags);
            }
            return value;
        };

        // Write dictionary to JSON with proper RegExp serialization
        fs.writeFileSync(outputJsonPath, stringified);

        // Load dictionary from JSON
        const reloadedJson = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'), reviver);

        // Compare results
        assert.deepStrictEqual(reloadedJson, originalDICT, 
            'Dictionary loaded from JSON should match fresh dictionary from .dic and .aff files');
        
        // Now check if spellchecker works with reloaded dictionary that WASN'T revived
        const spellchecker2 = new Spellchecker();
        // Load dictionary from JSON without reviving
        const reloadedRAWJson = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'));
        spellchecker2.use(reloadedRAWJson);
        assert.deepStrictEqual(spellchecker1, spellchecker2, 
            'Spellchecker instances should be identical when using original vs JSON-loaded unrevived dictionary');   

        // Now check if spellchecker works with reloaded dictionary that WAS revived
        const spellchecker3 = new Spellchecker();
        spellchecker3.use(reloadedJson);
        assert.deepStrictEqual(spellchecker1, spellchecker3, 
            'Spellchecker instances should be identical when using original vs JSON-loaded revived dictionary');   

            // Cleanup
        fs.unlinkSync(outputJsonPath);
    });
});