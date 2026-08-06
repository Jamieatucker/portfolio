'use strict';

const path = require('path');
const { execFileSync } = require('child_process');

const SUITES = [
    'resume-data.test.js',
    'site-nav.test.js',
    'role-pills.test.js',
    'experience-filter.test.js',
    'theme-preference.test.js',
    'home-sections.test.js',
    'project-data.test.js',
    'color-contrast.test.js',
    'page-markup.test.js'
];

let failures = 0;

SUITES.forEach((suite) => {
    console.log('=== ' + suite + ' ===');
    try {
        execFileSync(process.execPath, [path.join(__dirname, suite)], { stdio: 'inherit' });
    } catch (err) {
        failures += 1;
    }
    console.log('');
});

if (failures > 0) {
    console.error(failures + ' of ' + SUITES.length + ' suites failed.');
    process.exit(1);
}
console.log('All ' + SUITES.length + ' suites passed.');
