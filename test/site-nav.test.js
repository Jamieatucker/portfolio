'use strict';

const assert = require('assert').strict;
const path = require('path');

const SiteNav = require(path.join(__dirname, '..', 'utils', 'site-nav.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('site-nav');

test('the nav exposes the seven sections in document order', () => {
    assert.deepEqual(SiteNav.getSectionKeys(), [
        'proof',
        'approach',
        'about',
        'work',
        'experience',
        'skills',
        'contact'
    ]);
});

test('every section carries a label and a fragment that match its key', () => {
    SiteNav.SECTIONS.forEach((section) => {
        assert.equal(section.hash, '#' + section.key, section.key + ' hash should match its key');
        assert.ok(section.label && section.label.trim().length, section.key + ' needs a label');
        assert.ok(section.label.length <= 12, section.label + ' is too long for the header nav');
    });
});

test('normalizeHash accepts anything that could name a section', () => {
    assert.equal(SiteNav.normalizeHash('about'), '#about');
    assert.equal(SiteNav.normalizeHash('#about'), '#about');
    assert.equal(SiteNav.normalizeHash('  #About  '), '#about');
    assert.equal(SiteNav.normalizeHash('/index.html#about'), '#about');
    assert.equal(SiteNav.normalizeHash('/index.html?tech=React#about'), '#about');
    assert.equal(SiteNav.normalizeHash('#about?tech=React'), '#about');
});

test('normalizeHash rejects what cannot name a section', () => {
    assert.equal(SiteNav.normalizeHash(''), null);
    assert.equal(SiteNav.normalizeHash('   '), null);
    assert.equal(SiteNav.normalizeHash('#'), null);
    assert.equal(SiteNav.normalizeHash('/'), null);
    assert.equal(SiteNav.normalizeHash(null), null);
    assert.equal(SiteNav.normalizeHash(42), null);
});

test('resolveSectionKey answers only for sections that exist', () => {
    assert.equal(SiteNav.resolveSectionKey('#work'), 'work');
    assert.equal(SiteNav.resolveSectionKey('/index.html#contact'), 'contact');
    assert.equal(SiteNav.resolveSectionKey('#top'), null, 'the hero is not a nav section');
    assert.equal(SiteNav.resolveSectionKey('#nope'), null);
    assert.equal(SiteNav.resolveSectionKey(undefined), null);
});

test('getSection returns the whole record or nothing', () => {
    assert.deepEqual(SiteNav.getSection('skills'), {
        key: 'skills',
        label: 'Skills',
        hash: '#skills'
    });
    assert.equal(SiteNav.getSection('#missing'), null);
});

test('getAdjacentSections walks the page and stops at both ends', () => {
    assert.equal(SiteNav.getAdjacentSections('proof').previous, null);
    assert.equal(SiteNav.getAdjacentSections('proof').next.key, 'approach');
    assert.equal(SiteNav.getAdjacentSections('#work').previous.key, 'about');
    assert.equal(SiteNav.getAdjacentSections('contact').next, null);
    assert.deepEqual(SiteNav.getAdjacentSections('nope'), { previous: null, next: null });
});

test('every retired page maps to a section that still exists', () => {
    Object.keys(SiteNav.LEGACY_PATHS).forEach((page) => {
        const hash = SiteNav.LEGACY_PATHS[page];
        assert.ok(
            SiteNav.resolveSectionKey(hash),
            page + ' maps to ' + hash + ', which is not a section'
        );
    });
});

test('resolveLegacyPath finds the new home of an old URL', () => {
    assert.equal(SiteNav.resolveLegacyPath('/pages/projects/html/projects.html'), '#work');
    assert.equal(SiteNav.resolveLegacyPath('/pages/projects/html/projects.html?tech=React'), '#work');
    assert.equal(SiteNav.resolveLegacyPath('/index.html'), null);
    assert.equal(SiteNav.resolveLegacyPath(null), null);
});

finish();
