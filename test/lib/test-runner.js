'use strict';

/**
 * Minimal TAP-ish runner. Node 16 on this machine predates the stable
 * `node:test` module, so tests stay on `assert` plus this shared harness
 * instead of pulling in a dev dependency.
 */
function createSuite(suiteName) {
    var passed = 0;
    var failed = 0;

    function test(name, fn) {
        try {
            fn();
            passed += 1;
            console.log('ok - ' + name);
        } catch (err) {
            failed += 1;
            console.error('not ok - ' + name);
            console.error(err && err.stack ? err.stack : err);
        }
    }

    function summary() {
        console.log('');
        console.log(suiteName + ': ' + passed + ' passed, ' + failed + ' failed');
        return { suiteName: suiteName, passed: passed, failed: failed };
    }

    /** Exit non-zero when run directly so `npm test` fails loudly. */
    function finish() {
        var result = summary();
        if (result.failed > 0) process.exitCode = 1;
        return result;
    }

    return { test: test, summary: summary, finish: finish };
}

module.exports = { createSuite: createSuite };
