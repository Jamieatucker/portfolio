'use strict';

/**
 * Static-site integration checks. The site is one hand-written page (so it
 * renders without JavaScript), which means it can drift from the data modules.
 * These tests fail if that happens, if a nav link points at a section that does
 * not exist, or if any internal link or asset 404s.
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

const PAGE = path.join(ROOT, 'index.html');

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

const raw = fs.readFileSync(PAGE, 'utf8');
/** Collapse the line wrapping in source HTML so prose can be matched. */
const html = decodeEntities(raw).replace(/\s+/g, ' ');

function collectLocalRefs(source) {
    const refs = [];
    const pattern = /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g;
    let match = pattern.exec(source);
    while (match) {
        refs.push(match[1]);
        match = pattern.exec(source);
    }
    return refs;
}

function listHtmlFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).reduce((found, entry) => {
        if (entry.name === '.git' || entry.name === 'node_modules') return found;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return found.concat(listHtmlFiles(full));
        return entry.name.endsWith('.html') ? found.concat(full) : found;
    }, []);
}

test('the site is a single page, and that page is real markup', () => {
    assert.deepEqual(listHtmlFiles(ROOT), [PAGE], 'index.html should be the only HTML file');
    assert.equal(raw.indexOf('<!DOCTYPE html>'), 0);
    assert.ok(html.indexOf('http-equiv="refresh"') === -1, 'the page must not meta-refresh');
});

test('the page has exactly one h1, and it is the hero hook', () => {
    const headings = raw.match(/<h1\b/g) || [];
    assert.equal(headings.length, 1, 'a single page takes a single h1');
    assert.ok(raw.indexOf('home-hero__title') !== -1, 'the h1 belongs to the hero');
});

test('every id on the page is unique', () => {
    const ids = (raw.match(/\sid="([^"]+)"/g) || []).map((raw_id) =>
        raw_id.replace(/.*id="([^"]+)"/, '$1')
    );
    const seen = {};
    ids.forEach((id) => {
        assert.ok(!seen[id], 'duplicate id after folding the pages together: ' + id);
        seen[id] = true;
    });
});

test('the nav offers every section, in document order, pointing at real targets', () => {
    let cursor = -1;
    SiteNav.SECTIONS.forEach((section) => {
        const link = 'data-nav-key="' + section.key + '" href="' + section.hash + '"';
        assert.ok(html.indexOf(link) !== -1, 'nav is missing a link to ' + section.key);
        assert.ok(
            html.indexOf('>' + section.label + '</a>') !== -1,
            'nav is missing the label ' + section.label
        );

        const target = new RegExp('id="' + section.key + '"[^>]*data-section');
        assert.ok(target.test(raw), section.key + ' has no [data-section] target');

        const position = raw.indexOf('id="' + section.key + '"');
        assert.ok(position > cursor, section.key + ' is out of document order');
        cursor = position;
    });
});

test('the hero is reachable from the brand and the footer', () => {
    assert.ok(raw.indexOf('class="pf-brand" href="#top"') !== -1, 'brand should return to the top');
    assert.ok(raw.indexOf('id="top"') !== -1, 'the hero needs the #top anchor');
});

test('the page loads the shared chrome and every section stylesheet', () => {
    ['/pages/shared/css/theme.css', '/pages/shared/css/layout.css'].forEach((href) => {
        assert.ok(html.indexOf(href) !== -1, 'missing ' + href);
    });
    ['index', 'about', 'work', 'skills', 'contact'].forEach((name) => {
        const href = '/pages/index/css/' + name + '.css';
        assert.ok(html.indexOf(href) !== -1, 'missing ' + href);
        assert.ok(fs.existsSync(path.join(ROOT, href.replace(/^\//, ''))), href + ' does not exist');
    });
});

test('the page boots the theme before paint and the behaviour after', () => {
    const scripts = [
        '/utils/theme-preference.js',
        '/pages/shared/js/theme-init.js',
        '/utils/site-nav.js',
        '/utils/resume-data.js',
        '/utils/experience-filter.js',
        '/utils/home-sections.js',
        '/pages/shared/js/site.js',
        '/pages/index/js/index.js',
        '/pages/index/js/work.js',
        '/pages/index/js/contact.js'
    ];
    scripts.forEach((src) => {
        assert.ok(html.indexOf(src) !== -1, 'missing script ' + src);
        assert.ok(fs.existsSync(path.join(ROOT, src.replace(/^\//, ''))), src + ' does not exist');
    });
    assert.ok(
        html.indexOf('/utils/theme-preference.js') < html.indexOf('/pages/shared/js/theme-init.js'),
        'theme-preference.js must load before theme-init.js'
    );
});

test('the page is accessible-by-default: lang, viewport, skip link, title', () => {
    assert.ok(html.indexOf('<html lang="en"') !== -1, 'missing lang');
    assert.ok(html.indexOf('name="viewport"') !== -1, 'missing viewport');
    assert.ok(html.indexOf('class="pf-skip-link"') !== -1, 'missing skip link');
    assert.ok(html.indexOf('id="main"') !== -1, 'missing main landmark');
    assert.ok(/<title>[^<]+<\/title>/.test(html), 'missing title');
    assert.ok(html.indexOf('name="description"') !== -1, 'missing meta description');
});

test('every internal link and asset reference resolves to a real file', () => {
    collectLocalRefs(raw).forEach((ref) => {
        const target = path.join(ROOT, ref.replace(/^\//, ''));
        assert.ok(fs.existsSync(target), 'link to missing file: ' + ref);
    });
});

test('nothing links to a page that the single-page rewrite retired', () => {
    Object.keys(SiteNav.LEGACY_PATHS).forEach((legacy) => {
        assert.ok(raw.indexOf(legacy) === -1, 'still links to the retired page ' + legacy);
    });
    assert.ok(!fs.existsSync(path.join(ROOT, 'pages', 'about')), 'pages/about should be gone');
    assert.ok(!fs.existsSync(path.join(ROOT, 'pages', 'contact')), 'pages/contact should be gone');
});

test('the proof section shows every impact metric from the data module', () => {
    Resume.IMPACT_METRICS.forEach((metric) => {
        assert.ok(html.indexOf(metric.value) !== -1, 'missing metric value: ' + metric.value);
    });
});

test('the work section renders every case study, featured ones included', () => {
    Projects.PROJECTS.forEach((project) => {
        assert.ok(html.indexOf(project.name) !== -1, 'missing project ' + project.id);
        assert.ok(
            html.indexOf(project.outcome.replace(/\s+/g, ' ')) !== -1,
            'missing outcome text for ' + project.id
        );
    });
    Projects.getFeaturedProjects().forEach((project) => {
        assert.ok(html.indexOf(project.name) !== -1, 'missing featured project ' + project.name);
    });
    ['Problem', 'Approach', 'Outcome'].forEach((label) => {
        assert.ok(html.indexOf('>' + label + '</span>') !== -1, 'missing ' + label + ' label');
    });
});

test('the page states the r\u00e9sum\u00e9 download and the email address', () => {
    assert.ok(html.indexOf(Resume.PROFILE.resumePath) !== -1);
    assert.ok(html.indexOf(Resume.PROFILE.email) !== -1);
});

test('the timeline renders every role, date range, duration, and highlight', () => {
    Resume.EXPERIENCE.forEach((role) => {
        assert.ok(html.indexOf('id="' + role.id + '"') !== -1, 'missing anchor for ' + role.id);
        assert.ok(html.indexOf(role.company) !== -1, 'missing company ' + role.company);
        assert.ok(html.indexOf(role.team) !== -1, 'missing team ' + role.team);
        assert.ok(
            html.indexOf(Resume.formatDateRange(role.start, role.end)) !== -1,
            'missing date range for ' + role.id
        );
        // The tenure is hand-written next to the dates, so it can contradict them.
        assert.ok(
            html.indexOf(Resume.formatDuration(role.start, role.end) + ' \u00b7 ' + role.location) !== -1,
            role.id + ' should read ' + Resume.formatDuration(role.start, role.end)
        );
        role.highlights.forEach((highlight) => {
            assert.ok(
                html.indexOf(highlight.replace(/\s+/g, ' ')) !== -1,
                role.id + ' is missing a highlight: ' + highlight.slice(0, 48) + '...'
            );
        });
    });
});

test('roles expose the tags their filter needs', () => {
    Resume.EXPERIENCE.forEach((role) => {
        assert.ok(
            html.indexOf('data-role-tags="' + role.tags.join(',') + '"') !== -1,
            role.id + ' has no matching data-role-tags attribute'
        );
    });
});

test('the skills section lists every skill in every group', () => {
    Resume.SKILL_GROUPS.forEach((group) => {
        group.skills.forEach((skill) => {
            assert.ok(html.indexOf(skill) !== -1, 'skills section is missing: ' + skill);
        });
    });
});

test('skill rows filter the timeline in place and still work without JS', () => {
    const rows = raw.match(/<a class="skills-row__name"[^>]*>/g) || [];
    assert.ok(rows.length >= 10, 'expected the skills rows to link into the timeline');
    rows.forEach((row) => {
        assert.ok(row.indexOf('href="#experience"') !== -1, 'row should fall back to a jump: ' + row);
        assert.ok(/data-tech="[^"]+"/.test(row), 'row should name its technology: ' + row);
    });
    ['TypeScript', 'React', 'Java', 'Kotlin'].forEach((tech) => {
        assert.ok(raw.indexOf('data-tech="' + tech + '"') !== -1, 'no skills row for ' + tech);
    });
});

test('the page hosts both filter UIs and their hooks', () => {
    ['data-experience-filter', 'data-project-filter', 'data-role-list', 'data-project-list'].forEach(
        (hook) => {
            assert.ok(html.indexOf(hook) !== -1, 'missing ' + hook);
        }
    );
    const chipHosts = (raw.match(/data-filter-chips/g) || []).length;
    assert.equal(chipHosts, 2, 'the timeline and the work grid each need their own chip host');
});

test('neither filter can capture the other one\u2019s chips', () => {
    // Both sections use the same hook names, so a document-wide querySelector
    // would hand the timeline the work grid's chips (it appears first).
    ['index.js', 'work.js'].forEach((file) => {
        const source = fs.readFileSync(path.join(ROOT, 'pages', 'index', 'js', file), 'utf8');
        assert.ok(
            source.indexOf("container.querySelector('[data-filter-chips]')") !== -1,
            file + ' must scope its chip host to its own container'
        );
        assert.ok(
            source.indexOf("document.querySelector('[data-filter-chips]')") === -1,
            file + ' must not take the document-wide first match'
        );
    });
});

test('the timeline uses home-owned class names, not the retired exp- prefix', () => {
    assert.ok(html.indexOf('home-role') !== -1, 'roles should use home-role');
    assert.ok(!/class="[^"]*\bexp-/.test(raw), 'an exp- class survived the rename');
    ['css/index.css', 'js/index.js'].forEach((file) => {
        const source = fs.readFileSync(path.join(ROOT, 'pages', 'index', file), 'utf8');
        assert.ok(source.indexOf('exp-') === -1, file + ' still references an exp- class');
    });
});

test('the earlier-roles toggle ships hidden so no-JS readers keep every role', () => {
    const button = (raw.match(/<button[^>]*data-role-toggle[^>]*>/) || [])[0];
    assert.ok(button, 'the page should carry the role toggle');
    assert.ok(/\bhidden\b/.test(button), 'the toggle must ship hidden');
    assert.ok(/aria-expanded="true"/.test(button), 'the toggle must ship expanded');
});

test('the contact section exposes email, LinkedIn, and the r\u00e9sum\u00e9', () => {
    assert.ok(html.indexOf('mailto:' + Resume.PROFILE.email) !== -1);
    assert.ok(html.indexOf(Resume.PROFILE.linkedin) !== -1);
    assert.ok(html.indexOf(Resume.PROFILE.resumePath) !== -1);
});

test('LinkedIn is the first and fastest contact channel', () => {
    assert.ok(html.indexOf('LinkedIn \u00b7 fastest') !== -1, 'LinkedIn must be labelled fastest');
    assert.ok(
        html.indexOf('LinkedIn \u00b7 fastest') < html.indexOf('>Email<'),
        'the LinkedIn card must come before the email card'
    );
    assert.ok(html.indexOf('Email \u00b7 fastest') === -1, 'email must no longer claim fastest');
});

test('the location card is gone but the location itself is not lost', () => {
    assert.ok(html.indexOf('>Location<') === -1, 'location card should be removed');
    assert.ok(html.indexOf('Sunnyvale, California') !== -1, 'location should survive as prose');
});

test('external links are safe: target=_blank always pairs with rel=noopener', () => {
    (raw.match(/<a\b[^>]*>/g) || [])
        .filter((tag) => tag.indexOf('target="_blank"') !== -1)
        .forEach((tag) => {
            assert.ok(
                tag.indexOf('rel="noopener"') !== -1,
                'target=_blank without rel=noopener: ' + tag
            );
        });
});

test('the nav carries the brand name and not the subheader that broke phones', () => {
    assert.ok(html.indexOf('pf-brand__role') === -1, 'the nav subheader should stay gone');
    assert.ok(
        html.indexOf('<span class="pf-brand__text">Jamie Tucker</span>') !== -1,
        'the brand name is missing'
    );
});

test('card grids pin two columns and never strand a lone card', () => {
    const css = fs.readFileSync(path.join(ROOT, 'pages', 'shared', 'css', 'layout.css'), 'utf8');
    assert.ok(
        /\.pf-grid--2\s*\{[^}]*grid-template-columns:\s*repeat\(2,/.test(css),
        'pf-grid--2 must pin two columns instead of auto-fit'
    );
    assert.ok(
        /:last-child:nth-child\(odd\)[\s\S]{0,120}grid-column:\s*1 \/ -1/.test(css),
        'an odd trailing card must span the full row'
    );
});

test('every card grid holds at least two cards', () => {
    raw.split('pf-grid--2')
        .slice(1)
        .forEach((block, index) => {
            const body = block.split('</section>')[0];
            const cards = (body.match(/<article\b/g) || []).length;
            assert.ok(cards >= 2, 'grid ' + (index + 1) + ' has only ' + cards + ' card(s)');
        });
});

test('the retired page tour is gone from the markup and the chrome', () => {
    assert.ok(raw.indexOf('data-tour') === -1, 'the tour container should be gone');
    const site = fs.readFileSync(path.join(ROOT, 'pages', 'shared', 'js', 'site.js'), 'utf8');
    assert.ok(site.indexOf('setupTour') === -1, 'site.js should no longer render a tour');
    assert.ok(site.indexOf('setupSectionSpy') !== -1, 'site.js should mark the section in view');
});

finish();
