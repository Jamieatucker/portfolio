'use strict';

/**
 * Static-site integration checks. The page content is hand-written HTML (so it
 * renders without JavaScript), which means it can drift from the data modules.
 * These tests fail if that happens, and if any internal link or asset 404s.
 */

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SiteNav = require(path.join(ROOT, 'utils', 'site-nav.js'));
const Resume = require(path.join(ROOT, 'utils', 'resume-data.js'));
const Projects = require(path.join(ROOT, 'utils', 'project-data.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('page-markup');

const PAGES = SiteNav.NAV_LINKS.map((link) => ({
    key: link.key,
    label: link.label,
    href: link.href,
    file: path.join(ROOT, link.href.replace(/^\//, ''))
}));

const ENTITIES = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&rsquo;': '\u2019',
    '&lsquo;': '\u2018',
    '&ldquo;': '\u201c',
    '&rdquo;': '\u201d',
    '&ndash;': '\u2013',
    '&mdash;': '\u2014',
    '&middot;': '\u00b7',
    '&eacute;': '\u00e9',
    '&copy;': '\u00a9',
    '&nbsp;': ' '
};

function decodeEntities(html) {
    return Object.keys(ENTITIES).reduce(
        (text, entity) => text.split(entity).join(ENTITIES[entity]),
        html
    );
}

/** Collapse the line wrapping in source HTML so prose can be matched. */
function readText(file) {
    return decodeEntities(fs.readFileSync(file, 'utf8')).replace(/\s+/g, ' ');
}

const pageText = {};
PAGES.forEach((page) => {
    pageText[page.key] = fs.existsSync(page.file) ? readText(page.file) : '';
});

function collectLocalRefs(html) {
    const refs = [];
    const pattern = /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g;
    let match = pattern.exec(html);
    while (match) {
        refs.push(match[1]);
        match = pattern.exec(html);
    }
    return refs;
}

test('every page in the nav exists on disk', () => {
    PAGES.forEach((page) => {
        assert.ok(fs.existsSync(page.file), 'missing page file: ' + page.href);
    });
});

test('the site entry point is a real home page, not a redirect', () => {
    const home = pageText.home;
    assert.ok(home.indexOf('<!DOCTYPE html>') === 0);
    assert.ok(home.indexOf('http-equiv="refresh"') === -1, 'home must not meta-refresh');
    assert.ok(home.indexOf('<h1') !== -1, 'home needs an h1 hook');
});

test('every page renders the full nav with matching keys and hrefs', () => {
    PAGES.forEach((page) => {
        const html = pageText[page.key];
        SiteNav.NAV_LINKS.forEach((link) => {
            assert.ok(
                html.indexOf('data-nav-key="' + link.key + '" href="' + link.href + '"') !== -1,
                page.key + ' page is missing nav link: ' + link.key
            );
        });
    });
});

test('every page loads theme.css, layout.css, and its own stylesheet', () => {
    PAGES.forEach((page) => {
        const html = pageText[page.key];
        assert.ok(html.indexOf('/pages/shared/css/theme.css') !== -1, page.key + ' missing theme.css');
        assert.ok(html.indexOf('/pages/shared/css/layout.css') !== -1, page.key + ' missing layout.css');
        const own = page.key === 'home' ? 'index' : page.key;
        assert.ok(
            html.indexOf('/pages/' + own + '/css/' + own + '.css') !== -1,
            page.key + ' missing its page stylesheet'
        );
    });
});

test('every page boots the theme before paint and site.js afterwards', () => {
    PAGES.forEach((page) => {
        const html = pageText[page.key];
        assert.ok(html.indexOf('/utils/theme-preference.js') !== -1, page.key + ' missing theme util');
        assert.ok(html.indexOf('/pages/shared/js/theme-init.js') !== -1, page.key + ' missing theme init');
        assert.ok(html.indexOf('/utils/site-nav.js') !== -1, page.key + ' missing site-nav util');
        assert.ok(html.indexOf('/pages/shared/js/site.js') !== -1, page.key + ' missing site.js');
        assert.ok(
            html.indexOf('/utils/theme-preference.js') < html.indexOf('/pages/shared/js/theme-init.js'),
            page.key + ' must load theme-preference.js before theme-init.js'
        );
    });
});

test('every page is accessible-by-default: lang, viewport, skip link, title', () => {
    PAGES.forEach((page) => {
        const html = pageText[page.key];
        assert.ok(html.indexOf('<html lang="en"') !== -1, page.key + ' missing lang');
        assert.ok(html.indexOf('name="viewport"') !== -1, page.key + ' missing viewport');
        assert.ok(html.indexOf('class="pf-skip-link"') !== -1, page.key + ' missing skip link');
        assert.ok(html.indexOf('id="main"') !== -1, page.key + ' missing main landmark');
        assert.ok(/<title>[^<]+<\/title>/.test(html), page.key + ' missing title');
        assert.ok(html.indexOf('name="description"') !== -1, page.key + ' missing meta description');
    });
});

test('every internal link and asset reference resolves to a real file', () => {
    PAGES.forEach((page) => {
        const html = fs.readFileSync(page.file, 'utf8');
        collectLocalRefs(html).forEach((ref) => {
            const target = path.join(ROOT, ref.replace(/^\//, ''));
            assert.ok(fs.existsSync(target), page.key + ' page links to missing file: ' + ref);
        });
    });
});

test('every page except home offers the prev/next tour container', () => {
    PAGES.filter((page) => page.key !== 'home').forEach((page) => {
        assert.ok(pageText[page.key].indexOf('data-tour') !== -1, page.key + ' missing tour container');
    });
});

test('home page shows every impact metric from the data module', () => {
    Resume.IMPACT_METRICS.forEach((metric) => {
        assert.ok(
            pageText.home.indexOf(metric.value) !== -1,
            'home is missing metric value: ' + metric.value
        );
    });
});

test('home page features every project flagged as featured', () => {
    Projects.getFeaturedProjects().forEach((project) => {
        assert.ok(
            pageText.home.indexOf(project.name) !== -1,
            'home is missing featured project: ' + project.name
        );
    });
});

test('home page states the r\u00e9sum\u00e9 download and the email address', () => {
    assert.ok(pageText.home.indexOf(Resume.PROFILE.resumePath) !== -1);
    assert.ok(pageText.home.indexOf(Resume.PROFILE.email) !== -1);
});

test('experience page renders every role, date range, and highlight', () => {
    const html = pageText.experience;
    Resume.EXPERIENCE.forEach((role) => {
        assert.ok(html.indexOf('id="' + role.id + '"') !== -1, 'missing anchor for ' + role.id);
        assert.ok(html.indexOf(role.company) !== -1, 'missing company ' + role.company);
        assert.ok(html.indexOf(role.team) !== -1, 'missing team ' + role.team);
        assert.ok(
            html.indexOf(Resume.formatDateRange(role.start, role.end)) !== -1,
            'missing date range for ' + role.id
        );
        role.highlights.forEach((highlight) => {
            assert.ok(
                html.indexOf(highlight.replace(/\s+/g, ' ')) !== -1,
                role.id + ' is missing a highlight: ' + highlight.slice(0, 48) + '...'
            );
        });
    });
});

test('experience roles expose the tags their filter needs', () => {
    const html = pageText.experience;
    Resume.EXPERIENCE.forEach((role) => {
        assert.ok(
            html.indexOf('data-role-tags="' + role.tags.join(',') + '"') !== -1,
            role.id + ' has no matching data-role-tags attribute'
        );
    });
});

test('projects page renders every case study with problem, approach, outcome', () => {
    const html = pageText.projects;
    Projects.PROJECTS.forEach((project) => {
        assert.ok(html.indexOf(project.name) !== -1, 'missing project ' + project.id);
        assert.ok(
            html.indexOf(project.outcome.replace(/\s+/g, ' ')) !== -1,
            'missing outcome text for ' + project.id
        );
    });
    ['Problem', 'Approach', 'Outcome'].forEach((label) => {
        assert.ok(html.indexOf('>' + label + '</span>') !== -1, 'missing ' + label + ' label');
    });
});

test('skills page lists every skill in every group', () => {
    const html = pageText.skills;
    Resume.SKILL_GROUPS.forEach((group) => {
        group.skills.forEach((skill) => {
            assert.ok(html.indexOf(skill) !== -1, 'skills page is missing: ' + skill);
        });
    });
});

test('skills page deep-links technologies to the experience filter', () => {
    const html = pageText.skills;
    ['TypeScript', 'React', 'Java', 'Kotlin'].forEach((tech) => {
        assert.ok(
            html.indexOf('experience.html?tech=' + tech) !== -1,
            'skills page should deep-link ' + tech
        );
    });
});

test('contact page exposes email, LinkedIn, and the r\u00e9sum\u00e9', () => {
    const html = pageText.contact;
    assert.ok(html.indexOf('mailto:' + Resume.PROFILE.email) !== -1);
    assert.ok(html.indexOf(Resume.PROFILE.linkedin) !== -1);
    assert.ok(html.indexOf(Resume.PROFILE.resumePath) !== -1);
});

test('external links are safe: target=_blank always pairs with rel=noopener', () => {
    PAGES.forEach((page) => {
        const html = fs.readFileSync(page.file, 'utf8');
        const anchors = html.match(/<a\b[^>]*>/g) || [];
        anchors
            .filter((tag) => tag.indexOf('target="_blank"') !== -1)
            .forEach((tag) => {
                assert.ok(
                    tag.indexOf('rel="noopener"') !== -1,
                    page.key + ' has target=_blank without rel=noopener: ' + tag
                );
            });
    });
});

test('no page carries the job-title subheader that broke small viewports', () => {
    PAGES.forEach((page) => {
        assert.ok(
            pageText[page.key].indexOf('pf-brand__role') === -1,
            page.key + ' still renders the nav subheader'
        );
        assert.ok(
            pageText[page.key].indexOf('<span class="pf-brand__text">Jamie Tucker</span>') !== -1,
            page.key + ' lost the brand name'
        );
    });
});

test('the four featured home cards are laid out two per row', () => {
    assert.ok(
        pageText.home.indexOf('pf-grid pf-grid--2 home-featured') !== -1,
        'home featured grid needs the home-featured class'
    );
    const css = fs.readFileSync(path.join(ROOT, 'pages', 'index', 'css', 'index.css'), 'utf8');
    assert.ok(
        /\.home-featured\s*\{[^}]*grid-template-columns:\s*repeat\(2,/.test(css),
        'home-featured must pin two columns on large screens'
    );
});

test('page scripts referenced by each page exist', () => {
    const expected = {
        experience: '/pages/experience/js/experience.js',
        projects: '/pages/projects/js/projects.js',
        contact: '/pages/contact/js/contact.js'
    };
    Object.keys(expected).forEach((key) => {
        assert.ok(pageText[key].indexOf(expected[key]) !== -1, key + ' should load its page script');
        assert.ok(fs.existsSync(path.join(ROOT, expected[key].replace(/^\//, ''))));
    });
});

finish();
