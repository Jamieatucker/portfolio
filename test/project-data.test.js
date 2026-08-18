'use strict';

const assert = require('assert').strict;
const path = require('path');

const Projects = require(path.join(__dirname, '..', 'utils', 'project-data.js'));
const Resume = require(path.join(__dirname, '..', 'utils', 'resume-data.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('project-data');

test('every project has the problem/approach/outcome the card renders', () => {
    Projects.PROJECTS.forEach((project) => {
        assert.ok(project.id, 'project needs an id');
        assert.ok(project.name.length > 0, project.id + ' needs a name');
        assert.ok(project.category.length > 0, project.id + ' needs a category');
        assert.ok(project.problem.length > 0, project.id + ' needs a problem');
        assert.ok(project.approach.length > 0, project.id + ' needs an approach');
        assert.ok(project.outcome.length > 0, project.id + ' needs an outcome');
        assert.ok(project.tags.length > 0, project.id + ' needs tags');
    });
});

test('project ids are unique', () => {
    const ids = Projects.PROJECTS.map((project) => project.id);
    assert.equal(new Set(ids).size, ids.length);
});

test('no project points at a role that does not exist', () => {
    assert.deepEqual(Projects.findOrphanProjects(), []);
});

test('findOrphanProjects catches a broken role reference', () => {
    const orphans = Projects.findOrphanProjects(
        [{ id: 'ghost', roleId: 'no-such-role' }, { id: 'ok', roleId: null }],
        Resume.EXPERIENCE
    );
    assert.deepEqual(orphans, ['ghost']);
});

test('the home page has featured projects, but not all of them', () => {
    const featured = Projects.getFeaturedProjects();
    assert.ok(featured.length >= 3, 'home page needs at least 3 featured projects');
    assert.ok(featured.length < Projects.PROJECTS.length, 'featuring everything defeats the purpose');
});

test('getFeaturedProjects ignores non-boolean featured flags', () => {
    const featured = Projects.getFeaturedProjects([
        { id: 'a', featured: true },
        { id: 'b', featured: 'true' },
        { id: 'c' }
    ]);
    assert.deepEqual(featured.map((p) => p.id), ['a']);
});

test('getProjectsByRoleId groups case studies under their role', () => {
    const shipped = Projects.getProjectsByRoleId('google-search-intelligence');
    assert.ok(shipped.length >= 2);
    shipped.forEach((project) => assert.equal(project.roleId, 'google-search-intelligence'));
    assert.deepEqual(Projects.getProjectsByRoleId('no-such-role'), []);
});

test('getProjectsByRoleId(null) returns the personal projects', () => {
    const personal = Projects.getProjectsByRoleId(null);
    assert.ok(personal.some((project) => project.id === 'portfolio-site'));
});

test('describeProvenance names the company and team', () => {
    const project = Projects.PROJECTS.find((p) => p.roleId === 'youtube-playables');
    assert.equal(Projects.describeProvenance(project), 'YouTube \u00b7 Playables Game Creation');
});

test('describeProvenance labels personal and unresolvable work', () => {
    assert.equal(Projects.describeProvenance({ roleId: null }), 'Personal project');
    assert.equal(Projects.describeProvenance({ roleId: 'ghost' }), 'Personal project');
    assert.equal(Projects.describeProvenance(null), 'Personal project');
});

test('every project tag is a real resume skill', () => {
    const listed = new Set();
    Resume.SKILL_GROUPS.forEach((group) => {
        group.skills.forEach((skill) => listed.add(skill.toLowerCase()));
    });
    Projects.PROJECTS.forEach((project) => {
        project.tags.forEach((tag) => {
            assert.ok(listed.has(tag.toLowerCase()), project.id + ' has unlisted tag: ' + tag);
        });
    });
});

finish();
