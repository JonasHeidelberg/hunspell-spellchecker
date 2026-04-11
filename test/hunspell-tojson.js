const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Spellchecker = require('../index');

describe('hunspell-tojson', () => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    const testDictPath = path.join(fixturesDir, 'test');
    const outputJsonPath = path.join(fixturesDir, 'test-dict.json');

    it('should create identical result when writing to JSON and reloading vs reading fresh', function() {
        // Load dictionary fresh from .dic and .aff files
        const spellcheckerFresh = new Spellchecker();
        spellcheckerFresh.use(testDictPath);
        const freshResult = spellcheckerFresh.getDictionary();

        // Replacer to handle RegExp serialization (same as in bin/hunspell-tojson.js)
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

        // Reviver to reconstruct RegExp objects
        const reviver = (key, value) => {
            if (value && value.$type === 'RegExp') {
                return new RegExp(value.source, value.flags);
            }
            return value;
        };

        // Write dictionary to JSON with proper RegExp serialization
        const dictJson = JSON.stringify(freshResult, replacer);
        fs.writeFileSync(outputJsonPath, dictJson);

        // Load dictionary from JSON
        const reloadedJson = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'), reviver);

        // Compare results
        assert.deepStrictEqual(reloadedJson, freshResult, 
            'Dictionary loaded from JSON should match fresh dictionary from .dic and .aff files');

        // Cleanup
        fs.unlinkSync(outputJsonPath);
    });
});