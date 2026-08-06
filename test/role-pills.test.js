'use strict';

const assert = require('assert').strict;
const path = require('path');

const Resume = require(path.join(__dirname, '..', 'utils', 'resume-data.js'));
const RolePills = require(path.join(__dirname, '..', 'utils', 'role-pills.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('role-pills');

test('there is exactly one pill per EXPERIENCE role, newest first', () => {
    assert.equal(RolePills.ROLE_PILLS.length, Resume.EXPERIENCE.length);
    assert.deepEqual(
        RolePills.ROLE_PILLS.map((pill) => pill.roleId),
        Resume.EXPERIENCE.map((role) => role.id)
    );
});

test('getRolePillIds returns every pill id in order', () => {
    assert.deepEqual(RolePills.getRolePillIds(), [
        'pill-youtube-playables',
        'pill-google-search-intelligence',
        'pill-google-modern-creators'
    ]);
    assert.deepEqual(RolePills.getRolePillIds([]), []);
    assert.deepEqual(RolePills.getRolePillIds(null), RolePills.getRolePillIds());
});

test('getPillByRoleId finds a pill or returns null', () => {
    const pill = RolePills.getPillByRoleId('youtube-playables');
    assert.equal(pill.id, 'pill-youtube-playables');
    assert.equal(RolePills.getPillByRoleId('missing'), null);
    assert.equal(RolePills.getPillByRoleId(''), null);
    assert.equal(RolePills.getPillByRoleId(null), null);
});

test('findOrphanRolePills is empty for the shipping data', () => {
    assert.deepEqual(RolePills.findOrphanRolePills(), []);
});

test('findOrphanRolePills reports pills whose roleId is unknown', () => {
    const orphans = RolePills.findOrphanRolePills(
        [{ id: 'bad-pill', roleId: 'not-a-role', title: 'x', problem: 'p', approach: 'a', outcome: 'o' }],
        Resume.EXPERIENCE
    );
    assert.deepEqual(orphans, ['bad-pill']);
});

test('findOrphanRolePills treats a missing roleId as an orphan', () => {
    const orphans = RolePills.findOrphanRolePills(
        [{ id: 'no-role', title: 'x', problem: 'p', approach: 'a', outcome: 'o' }],
        Resume.EXPERIENCE
    );
    assert.deepEqual(orphans, ['no-role']);
});

test('findRolesMissingPills is empty when every role has a pill', () => {
    assert.deepEqual(RolePills.findRolesMissingPills(), []);
});

test('findRolesMissingPills surfaces a new role with no pill', () => {
    const roles = Resume.EXPERIENCE.concat([
        { id: 'future-role', company: 'X', team: 'Y', role: 'Z', start: { year: 2026, month: 8 }, end: null }
    ]);
    assert.deepEqual(RolePills.findRolesMissingPills(RolePills.ROLE_PILLS, roles), ['future-role']);
});

test('validatePillShape lists every missing required field', () => {
    assert.deepEqual(RolePills.validatePillShape(null), ['pill must be an object']);
    assert.deepEqual(
        RolePills.validatePillShape({ id: ' ', roleId: 'x' }).sort(),
        ['approach', 'id', 'outcome', 'problem', 'title'].sort()
    );
    assert.deepEqual(RolePills.validatePillShape(RolePills.ROLE_PILLS[0]), []);
});

test('every shipping pill has a complete shape', () => {
    RolePills.ROLE_PILLS.forEach((pill) => {
        assert.deepEqual(RolePills.validatePillShape(pill), [], pill.id + ' is incomplete');
    });
});

finish();
