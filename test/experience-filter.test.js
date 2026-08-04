'use strict';

const assert = require('assert').strict;
const path = require('path');

const Filter = require(path.join(__dirname, '..', 'utils', 'experience-filter.js'));
const Resume = require(path.join(__dirname, '..', 'utils', 'resume-data.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('experience-filter');

const ROLES = [
    { id: 'a', start: { year: 2025, month: 10 }, tags: ['TypeScript', 'React'] },
    { id: 'b', start: { year: 2024, month: 7 }, tags: ['React', 'Java'] },
    { id: 'c', start: { year: 2023, month: 10 }, tags: ['Java', 'Kotlin'] }
];

test('normalizeTag trims and lowercases, and empties invalid input', () => {
    assert.equal(Filter.normalizeTag('  React '), 'react');
    assert.equal(Filter.normalizeTag('HTML/CSS'), 'html/css');
    assert.equal(Filter.normalizeTag(null), '');
    assert.equal(Filter.normalizeTag(7), '');
});

test('matchesTag compares tags case-insensitively', () => {
    assert.equal(Filter.matchesTag(ROLES[0], 'typescript'), true);
    assert.equal(Filter.matchesTag(ROLES[0], 'TYPESCRIPT'), true);
    assert.equal(Filter.matchesTag(ROLES[0], 'Java'), false);
    assert.equal(Filter.matchesTag({}, 'Java'), false);
    assert.equal(Filter.matchesTag(ROLES[0], ''), false);
});

test('filterRolesByTag narrows to roles carrying the tag', () => {
    assert.deepEqual(Filter.filterRolesByTag(ROLES, 'React').map((r) => r.id), ['a', 'b']);
    assert.deepEqual(Filter.filterRolesByTag(ROLES, 'kotlin').map((r) => r.id), ['c']);
});

test('the All tag returns every role in any casing', () => {
    assert.equal(Filter.filterRolesByTag(ROLES, Filter.ALL_TAG).length, 3);
    assert.equal(Filter.filterRolesByTag(ROLES, 'all').length, 3);
    assert.equal(Filter.filterRolesByTag(ROLES, ' ALL ').length, 3);
});

test('an unknown tag falls back to every role instead of rendering an empty page', () => {
    assert.equal(Filter.filterRolesByTag(ROLES, 'COBOL').length, 3);
    assert.equal(Filter.filterRolesByTag(ROLES, '').length, 3);
    assert.equal(Filter.filterRolesByTag(ROLES, null).length, 3);
    assert.equal(Filter.filterRolesByTag(ROLES, undefined).length, 3);
});

test('filterRolesByTag survives malformed inputs', () => {
    assert.deepEqual(Filter.filterRolesByTag(null, 'React'), []);
    assert.deepEqual(Filter.filterRolesByTag('nope', 'React'), []);
    assert.deepEqual(Filter.filterRolesByTag([null, undefined, {}], 'React'), []);
});

test('filterRolesByTag does not mutate the source array', () => {
    const source = ROLES.slice();
    Filter.filterRolesByTag(source, 'React');
    assert.deepEqual(source.map((r) => r.id), ['a', 'b', 'c']);
});

test('isKnownTag distinguishes real tags from fallbacks', () => {
    assert.equal(Filter.isKnownTag(ROLES, 'React'), true);
    assert.equal(Filter.isKnownTag(ROLES, 'COBOL'), false);
    assert.equal(Filter.isKnownTag(ROLES, Filter.ALL_TAG), false);
    assert.equal(Filter.isKnownTag([], 'React'), false);
});

test('sortRolesByRecency puts the newest role first', () => {
    const shuffled = [ROLES[2], ROLES[0], ROLES[1]];
    assert.deepEqual(Filter.sortRolesByRecency(shuffled).map((r) => r.id), ['a', 'b', 'c']);
});

test('sortRolesByRecency is stable for identical start dates', () => {
    const sameStart = [
        { id: 'x', start: { year: 2024, month: 1 }, tags: [] },
        { id: 'y', start: { year: 2024, month: 1 }, tags: [] }
    ];
    assert.deepEqual(Filter.sortRolesByRecency(sameStart).map((r) => r.id), ['x', 'y']);
});

test('sortRolesByRecency tolerates missing start dates and bad input', () => {
    const messy = [{ id: 'noStart', tags: [] }, ROLES[0]];
    assert.deepEqual(Filter.sortRolesByRecency(messy).map((r) => r.id), ['a', 'noStart']);
    assert.deepEqual(Filter.sortRolesByRecency(undefined), []);
});

test('countRolesByTag counts each role once per tag', () => {
    const counts = Filter.countRolesByTag(ROLES);
    assert.equal(counts.react, 2);
    assert.equal(counts.java, 2);
    assert.equal(counts.kotlin, 1);
    assert.equal(counts.cobol, undefined);
});

test('countRolesByTag ignores duplicate tags inside one role', () => {
    const counts = Filter.countRolesByTag([{ tags: ['React', 'react', 'REACT'] }]);
    assert.equal(counts.react, 1);
});

test('real resume tags each match at least one role', () => {
    Resume.getAllSkillTags().forEach((tag) => {
        assert.ok(
            Filter.isKnownTag(Resume.EXPERIENCE, tag),
            'tag has no owning role: ' + tag
        );
    });
});

finish();
