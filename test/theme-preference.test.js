'use strict';

const assert = require('assert').strict;
const path = require('path');

const Theme = require(path.join(__dirname, '..', 'utils', 'theme-preference.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('theme-preference');

test('isValidTheme accepts only the two supported themes', () => {
    assert.equal(Theme.isValidTheme('dark'), true);
    assert.equal(Theme.isValidTheme('light'), true);
    assert.equal(Theme.isValidTheme('Dark'), false);
    assert.equal(Theme.isValidTheme('solarized'), false);
    assert.equal(Theme.isValidTheme(null), false);
});

test('a saved choice beats the OS preference', () => {
    assert.equal(Theme.resolveTheme('light', true), 'light');
    assert.equal(Theme.resolveTheme('dark', false), 'dark');
});

test('the OS preference is used when nothing is saved', () => {
    assert.equal(Theme.resolveTheme(null, true), 'dark');
    assert.equal(Theme.resolveTheme(null, false), 'light');
});

test('corrupt stored values fall back instead of throwing', () => {
    assert.equal(Theme.resolveTheme('{}', false), 'light');
    assert.equal(Theme.resolveTheme(0, true), 'dark');
    assert.equal(Theme.resolveTheme('DARK', undefined), Theme.DEFAULT_THEME);
});

test('with no signal at all the default theme wins', () => {
    assert.equal(Theme.resolveTheme(undefined, undefined), Theme.DEFAULT_THEME);
    assert.equal(Theme.DEFAULT_THEME, 'dark');
});

test('nextTheme flips between the two themes', () => {
    assert.equal(Theme.nextTheme('dark'), 'light');
    assert.equal(Theme.nextTheme('light'), 'dark');
});

test('nextTheme on garbage flips away from the default', () => {
    assert.equal(Theme.nextTheme('nonsense'), 'light');
    assert.equal(Theme.nextTheme(undefined), 'light');
});

test('toggling twice returns to the starting theme', () => {
    assert.equal(Theme.nextTheme(Theme.nextTheme('dark')), 'dark');
    assert.equal(Theme.nextTheme(Theme.nextTheme('light')), 'light');
});

test('describeToggle announces the action, not the current state', () => {
    assert.equal(Theme.describeToggle('dark'), 'Switch to light theme');
    assert.equal(Theme.describeToggle('light'), 'Switch to dark theme');
});

test('storage key is namespaced to this site', () => {
    assert.equal(Theme.STORAGE_KEY, 'portfolio-theme');
});

finish();
