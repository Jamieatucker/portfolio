'use strict';

const assert = require('assert').strict;
const path = require('path');

const SiteNav = require(path.join(__dirname, '..', 'utils', 'site-nav.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('site-nav');

test('nav exposes the six pages in tour order', () => {
    assert.deepEqual(
        SiteNav.NAV_LINKS.map((link) => link.key),
        ['home', 'about', 'experience', 'projects', 'skills', 'contact']
    );
});

test('every nav href is root-absolute so any page can link to any page', () => {
    SiteNav.NAV_LINKS.forEach((link) => {
        assert.match(link.href, /^\//, link.key + ' href must start with /');
        assert.ok(link.label.length > 0);
    });
});

test('normalizePath strips hashes, queries, and trailing slashes', () => {
    assert.equal(SiteNav.normalizePath('/pages/about/html/about.html#top'), '/pages/about/html/about.html');
    assert.equal(SiteNav.normalizePath('/pages/about/html/about.html?utm=li'), '/pages/about/html/about.html');
    assert.equal(SiteNav.normalizePath('/pages/about/html/'), '/pages/about/html');
    assert.equal(SiteNav.normalizePath('/'), '/');
});

test('normalizePath repairs missing leading slash, duplicate slashes, and casing', () => {
    assert.equal(SiteNav.normalizePath('pages/skills/html/skills.html'), '/pages/skills/html/skills.html');
    assert.equal(SiteNav.normalizePath('//pages//skills//html//skills.html'), '/pages/skills/html/skills.html');
    assert.equal(SiteNav.normalizePath('/Pages/Skills/HTML/Skills.HTML'), '/pages/skills/html/skills.html');
});

test('normalizePath falls back to / for empty or non-string input', () => {
    assert.equal(SiteNav.normalizePath(''), '/');
    assert.equal(SiteNav.normalizePath('   '), '/');
    assert.equal(SiteNav.normalizePath(undefined), '/');
    assert.equal(SiteNav.normalizePath(null), '/');
    assert.equal(SiteNav.normalizePath(42), '/');
});

test('root, /index, and /index.html all resolve to home', () => {
    assert.equal(SiteNav.resolveActiveNavKey('/'), 'home');
    assert.equal(SiteNav.resolveActiveNavKey('/index.html'), 'home');
    assert.equal(SiteNav.resolveActiveNavKey('/index'), 'home');
    assert.equal(SiteNav.resolveActiveNavKey('/?ref=resume'), 'home');
});

test('each page path resolves to its own nav key', () => {
    SiteNav.NAV_LINKS.forEach((link) => {
        assert.equal(SiteNav.resolveActiveNavKey(link.href), link.key);
    });
});

test('directory-style and extensionless URLs resolve like the .html URL', () => {
    assert.equal(SiteNav.resolveActiveNavKey('/pages/contact/html/'), 'contact');
    assert.equal(SiteNav.resolveActiveNavKey('/pages/contact/html'), 'contact');
    assert.equal(SiteNav.resolveActiveNavKey('/pages/contact/html/contact'), 'contact');
});

test('unknown paths activate nothing rather than guessing', () => {
    assert.equal(SiteNav.resolveActiveNavKey('/pages/blog/html/blog.html'), null);
    assert.equal(SiteNav.resolveActiveNavKey('/media/docs/jamie-tucker-resume.pdf'), null);
    assert.equal(SiteNav.resolveActiveNavKey('/pages'), null);
});

test('getNavLink finds known keys and returns null otherwise', () => {
    assert.equal(SiteNav.getNavLink('skills').label, 'Skills');
    assert.equal(SiteNav.getNavLink('nope'), null);
});

test('getAdjacentLinks walks the tour and stops at both ends', () => {
    assert.equal(SiteNav.getAdjacentLinks('about').previous, null);
    assert.equal(SiteNav.getAdjacentLinks('about').next.key, 'experience');
    assert.equal(SiteNav.getAdjacentLinks('projects').previous.key, 'experience');
    assert.equal(SiteNav.getAdjacentLinks('contact').next, null);
});

test('getAdjacentLinks excludes home and handles unknown keys', () => {
    assert.deepEqual(SiteNav.getAdjacentLinks('home'), { previous: null, next: null });
    assert.deepEqual(SiteNav.getAdjacentLinks('nope'), { previous: null, next: null });
});

finish();
