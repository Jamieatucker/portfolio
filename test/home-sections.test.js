'use strict';

const assert = require('assert').strict;
const path = require('path');

const Home = require(path.join(__dirname, '..', 'utils', 'home-sections.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('home-sections');

const SECTIONS = [
    { id: 'proof', top: 0 },
    { id: 'approach', top: 900 },
    { id: 'work', top: 1800 },
    { id: 'experience', top: 2700 },
    { id: 'education', top: 5200 }
];

test('the first section is active before anything has scrolled past', () => {
    assert.equal(Home.resolveActiveSection(SECTIONS, 0, 120), 'proof');
    assert.equal(Home.resolveActiveSection(SECTIONS, 400, 120), 'proof');
});

test('a section becomes active as its top edge clears the sticky chrome', () => {
    // 900 top, 120 of chrome: active from 780 on, not before.
    assert.equal(Home.resolveActiveSection(SECTIONS, 779, 120), 'proof');
    assert.equal(Home.resolveActiveSection(SECTIONS, 780, 120), 'approach');
    assert.equal(Home.resolveActiveSection(SECTIONS, 2600, 120), 'experience');
});

test('the last section wins at the bottom of the page', () => {
    // A short trailing section may never clear the offset on its own.
    assert.equal(Home.resolveActiveSection(SECTIONS, 4000, 120), 'experience');
    assert.equal(Home.resolveActiveSection(SECTIONS, 4000, 120, true), 'education');
});

test('resolveActiveSection survives empty and malformed input', () => {
    assert.equal(Home.resolveActiveSection([], 0, 120), null);
    assert.equal(Home.resolveActiveSection(null, 0, 120), null);
    assert.equal(Home.resolveActiveSection(SECTIONS, 0), 'proof');
    assert.equal(Home.resolveActiveSection([{ id: 'only', top: 0 }], 9999, 120), 'only');
});

test('a collapsed timeline shows only the newest role', () => {
    const roles = ['newest', 'middle', 'oldest'];
    assert.deepEqual(Home.limitRoles(roles, true, false), ['newest']);
    assert.deepEqual(Home.limitRoles(roles, false, false), roles);
});

test('filtering overrides collapsing so no match is ever hidden', () => {
    const roles = ['newest', 'oldest'];
    assert.deepEqual(Home.limitRoles(roles, true, true), roles);
});

test('limitRoles never returns the caller its own array', () => {
    const roles = ['newest', 'oldest'];
    assert.notEqual(Home.limitRoles(roles, false, false), roles);
    assert.deepEqual(Home.limitRoles([], true, false), []);
    assert.deepEqual(Home.limitRoles(null, true, false), []);
});

test('the toggle label counts the roles it would reveal', () => {
    assert.deepEqual(Home.describeRoleToggle(3, true, false), {
        label: 'Show 2 earlier roles',
        expanded: false,
        hidden: false
    });
    assert.deepEqual(Home.describeRoleToggle(2, true, false), {
        label: 'Show 1 earlier role',
        expanded: false,
        hidden: false
    });
    assert.equal(Home.describeRoleToggle(3, false, false).label, 'Hide earlier roles');
    assert.equal(Home.describeRoleToggle(3, false, false).expanded, true);
});

test('the toggle disappears when there is nothing left to reveal', () => {
    assert.equal(Home.describeRoleToggle(1, true, false).hidden, true);
    assert.equal(Home.describeRoleToggle(0, true, false).hidden, true);
    // A filter already shows every match, so the control would be a lie.
    assert.equal(Home.describeRoleToggle(3, true, true).hidden, true);
    assert.equal(Home.describeRoleToggle(3, true, true).expanded, true);
});

test('describeRoleToggle treats junk counts as nothing to reveal', () => {
    assert.equal(Home.describeRoleToggle(undefined, true, false).hidden, true);
    assert.equal(Home.describeRoleToggle(-4, true, false).hidden, true);
});

finish();
