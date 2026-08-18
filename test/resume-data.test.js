'use strict';

const assert = require('assert').strict;
const path = require('path');

const Resume = require(path.join(__dirname, '..', 'utils', 'resume-data.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('resume-data');

test('profile exposes the contact details recruiters need', () => {
    assert.equal(Resume.PROFILE.name, 'Jamie Tucker');
    assert.match(Resume.PROFILE.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    assert.match(Resume.PROFILE.linkedin, /^https:\/\//);
    assert.equal(Resume.PROFILE.resumePath, './media/docs/jamie-tucker-resume.pdf');
    assert.equal(Resume.PROFILE.photoPath, './media/images/pro_headshot.jpeg');
});

test('experience is ordered newest first', () => {
    const starts = Resume.EXPERIENCE.map((role) => role.start.year * 12 + role.start.month);
    const sorted = starts.slice().sort((a, b) => b - a);
    assert.deepEqual(starts, sorted);
});

test('every role carries the fields the timeline renders', () => {
    Resume.EXPERIENCE.forEach((role) => {
        assert.ok(role.id, 'role needs an id');
        assert.ok(role.company && role.team && role.role, 'role needs company/team/title');
        assert.ok(role.highlights.length > 0, role.id + ' needs highlights');
        assert.ok(role.tags.length > 0, role.id + ' needs tags');
    });
});

test('role ids are unique so anchors and filters cannot collide', () => {
    const ids = Resume.EXPERIENCE.map((role) => role.id);
    assert.equal(new Set(ids).size, ids.length);
});

test('formatMonthYear renders a short month and full year', () => {
    assert.equal(Resume.formatMonthYear({ year: 2026, month: 7 }), 'Jul 2026');
    assert.equal(Resume.formatMonthYear({ year: 2023, month: 1 }), 'Jan 2023');
    assert.equal(Resume.formatMonthYear({ year: 2023, month: 12 }), 'Dec 2023');
});

test('formatMonthYear rejects malformed month parts', () => {
    assert.throws(() => Resume.formatMonthYear(null), /year, month/);
    assert.throws(() => Resume.formatMonthYear({ year: 2026, month: 0 }), /year, month/);
    assert.throws(() => Resume.formatMonthYear({ year: 2026, month: 13 }), /year, month/);
    assert.throws(() => Resume.formatMonthYear({ year: '2026', month: 5 }), /year, month/);
});

test('formatDateRange renders Present for an open-ended role', () => {
    assert.equal(
        Resume.formatDateRange({ year: 2025, month: 10 }, { year: 2026, month: 7 }),
        'Oct 2025 \u2013 Jul 2026'
    );
    assert.equal(
        Resume.formatDateRange({ year: 2026, month: 8 }, null),
        'Aug 2026 \u2013 Present'
    );
});

test('monthsBetween counts whole months and never goes negative', () => {
    assert.equal(Resume.monthsBetween({ year: 2023, month: 10 }, { year: 2024, month: 7 }), 9);
    assert.equal(Resume.monthsBetween({ year: 2024, month: 1 }, { year: 2024, month: 1 }), 0);
    assert.equal(Resume.monthsBetween({ year: 2026, month: 7 }, { year: 2025, month: 7 }), 0);
});

test('formatDuration reads like a resume line item', () => {
    assert.equal(Resume.formatDuration({ year: 2024, month: 7 }, { year: 2025, month: 10 }), '1 yr 3 mo');
    assert.equal(Resume.formatDuration({ year: 2024, month: 7 }, { year: 2025, month: 7 }), '1 yr');
    assert.equal(Resume.formatDuration({ year: 2024, month: 7 }, { year: 2024, month: 8 }), '1 mo');
    assert.equal(Resume.formatDuration({ year: 2024, month: 7 }, { year: 2024, month: 7 }), '0 mo');
});

test('getTotalYearsExperience rounds down to the nearest half year', () => {
    const roles = [
        { start: { year: 2024, month: 1 }, end: { year: 2025, month: 1 } },
        { start: { year: 2025, month: 1 }, end: { year: 2025, month: 11 } }
    ];
    assert.equal(Resume.getTotalYearsExperience(roles), 1.5);
});

test('getTotalYearsExperience measures an open role against a reference date', () => {
    const roles = [{ start: { year: 2025, month: 1 }, end: null }];
    assert.equal(Resume.getTotalYearsExperience(roles, new Date(2027, 0, 1)), 2);
});

test('getTotalYearsExperience defaults to the real resume and stays plausible', () => {
    const years = Resume.getTotalYearsExperience(undefined, new Date(2026, 7, 4));
    assert.ok(years >= 2.5 && years <= 3, 'expected ~3 years, got ' + years);
});

test('getAllSkillTags de-duplicates case-insensitively and sorts', () => {
    const tags = Resume.getAllSkillTags([
        { tags: ['React', 'TypeScript'] },
        { tags: ['react', 'Java'] }
    ]);
    assert.deepEqual(tags, ['Java', 'React', 'TypeScript']);
});

test('getAllSkillTags tolerates roles without tags', () => {
    assert.deepEqual(Resume.getAllSkillTags([{}, { tags: ['Git'] }]), ['Git']);
    assert.ok(Resume.getAllSkillTags([]).length === 0);
});

test('every experience tag appears somewhere in the skills page groups', () => {
    const listed = new Set();
    Resume.SKILL_GROUPS.forEach((group) => {
        group.skills.forEach((skill) => listed.add(skill.toLowerCase()));
    });
    Resume.getAllSkillTags().forEach((tag) => {
        assert.ok(listed.has(tag.toLowerCase()), 'skills page is missing tag: ' + tag);
    });
});

test('impact metrics are non-empty value/label pairs', () => {
    assert.ok(Resume.IMPACT_METRICS.length >= 3);
    Resume.IMPACT_METRICS.forEach((metric) => {
        assert.ok(metric.value.length > 0 && metric.label.length > 0);
    });
});

finish();
