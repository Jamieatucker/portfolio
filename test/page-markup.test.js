'use strict';

/**
 * Static-site integration checks for the three-section recruiter page.
 */

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SiteNav = require(path.join(ROOT, 'utils', 'site-nav.js'));
const Resume = require(path.join(ROOT, 'utils', 'resume-data.js'));
const RolePills = require(path.join(ROOT, 'utils', 'role-pills.js'));
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

test('the page has exactly one h1, and it lives in About', () => {
    const headings = raw.match(/<h1\b/g) || [];
    assert.equal(headings.length, 1, 'a single page takes a single h1');
    assert.ok(raw.indexOf('about-hero__title') !== -1, 'the h1 belongs to the About hero');
});

test('every id on the page is unique', () => {
    const ids = (raw.match(/\sid="([^"]+)"/g) || []).map((raw_id) =>
        raw_id.replace(/.*id="([^"]+)"/, '$1')
    );
    const seen = {};
    ids.forEach((id) => {
        assert.ok(!seen[id], 'duplicate id: ' + id);
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

test('the brand returns to About (merged hero home)', () => {
    assert.ok(raw.indexOf('class="pf-brand" href="#about"') !== -1, 'brand should return to About');
    assert.ok(raw.indexOf('id="about"') !== -1, 'About needs the #about anchor');
});

test('the page loads shared chrome and the section stylesheets in use', () => {
    ['/pages/shared/css/theme.css', '/pages/shared/css/layout.css'].forEach((href) => {
        assert.ok(html.indexOf(href) !== -1, 'missing ' + href);
    });
    ['index', 'about', 'contact'].forEach((name) => {
        const href = '/pages/index/css/' + name + '.css';
        assert.ok(html.indexOf(href) !== -1, 'missing ' + href);
        assert.ok(fs.existsSync(path.join(ROOT, href.replace(/^\//, ''))), href + ' does not exist');
    });
    assert.ok(html.indexOf('/pages/index/css/work.css') === -1, 'work.css should not load');
    assert.ok(html.indexOf('/pages/index/css/skills.css') === -1, 'skills.css should not load');
});

test('the page boots theme before paint and behaviour after, without filter scripts', () => {
    const scripts = [
        '/utils/theme-preference.js',
        '/pages/shared/js/theme-init.js',
        '/utils/site-nav.js',
        '/utils/home-sections.js',
        '/pages/shared/js/site.js',
        '/pages/index/js/contact.js'
    ];
    scripts.forEach((src) => {
        assert.ok(html.indexOf(src) !== -1, 'missing script ' + src);
        assert.ok(fs.existsSync(path.join(ROOT, src.replace(/^\//, ''))), src + ' does not exist');
    });
    assert.ok(html.indexOf('/pages/index/js/index.js') === -1, 'timeline filter script should be gone');
    assert.ok(html.indexOf('/pages/index/js/work.js') === -1, 'work filter script should be gone');
    assert.ok(html.indexOf('/utils/experience-filter.js') === -1, 'experience-filter should not load');
    assert.ok(
        html.indexOf('/utils/theme-preference.js') < html.indexOf('/pages/shared/js/theme-init.js'),
        'theme-preference.js must load before theme-init.js'
    );
});

test('site.js soft-aliases retired hashes', () => {
    const site = fs.readFileSync(path.join(ROOT, 'pages', 'shared', 'js', 'site.js'), 'utf8');
    assert.ok(site.indexOf('setupHashAliases') !== -1, 'site.js should soft-alias hashes');
    assert.ok(site.indexOf('canonicalizeHash') !== -1, 'site.js should use canonicalizeHash');
});

test('the page is accessible-by-default: lang, viewport, skip link, title', () => {
    assert.ok(html.indexOf('<html lang="en"') !== -1, 'missing lang');
    assert.ok(html.indexOf('name="viewport"') !== -1, 'missing viewport');
    assert.ok(html.indexOf('class="pf-skip-link"') !== -1, 'missing skip link');
    assert.ok(html.indexOf('id="main"') !== -1, 'missing main landmark');
    assert.ok(/<title>[^<]+<\/title>/.test(html), 'missing title');
    assert.ok(html.indexOf('name="description"') !== -1, 'missing meta description');
});

test('the skip link is centered on the header when focused', () => {
    const layout = fs.readFileSync(
        path.join(ROOT, 'pages', 'shared', 'css', 'layout.css'),
        'utf8'
    );
    const skipBlock = layout.match(/\.pf-skip-link\s*\{[\s\S]*?\}/);
    const focusBlock = layout.match(/\.pf-skip-link:focus\s*\{[\s\S]*?\}/);
    assert.ok(skipBlock, 'missing .pf-skip-link rule');
    assert.ok(focusBlock, 'missing .pf-skip-link:focus rule');
    assert.ok(/left:\s*50%/.test(skipBlock[0]), 'skip link should be horizontally centered');
    assert.ok(
        /top:\s*calc\(\s*var\(--pf-header-h\)\s*\/\s*2\s*\)/.test(skipBlock[0]),
        'skip link should sit on the header midline'
    );
    assert.ok(
        /transform:\s*translate\(\s*-50%\s*,\s*-50%\s*\)/.test(focusBlock[0]),
        'focused skip link should stay centered on the nav bar'
    );
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
});

test('About uses the professional headshot, not the college profile photo', () => {
    assert.equal(Resume.PROFILE.photoPath, '/media/images/pro_headshot.jpeg');
    assert.ok(html.indexOf('/media/images/pro_headshot.jpeg') !== -1, 'missing pro headshot');
    assert.ok(html.indexOf('/media/images/profile.jpeg') === -1, 'old profile photo must leave markup');
});

test('proof metrics appear as triad bullets, and triad titles match What I do', () => {
    Resume.IMPACT_METRICS.forEach((metric) => {
        assert.ok(html.indexOf(metric.value) !== -1, 'missing metric value: ' + metric.value);
    });
    Resume.APPROACH_TRIAD.forEach((column) => {
        assert.ok(html.indexOf(column.title) !== -1, 'missing triad title: ' + column.title);
        column.metrics.forEach((metric) => {
            assert.ok(html.indexOf(metric.value) !== -1, 'missing triad metric ' + metric.value);
        });
    });
    assert.ok(html.indexOf('Engineer first') === -1, 'Engineer first intro must be removed');
});

test('Experience renders every role pill with problem, approach, and outcome', () => {
    assert.deepEqual(RolePills.findOrphanRolePills(), []);
    assert.deepEqual(RolePills.findRolesMissingPills(), []);
    RolePills.ROLE_PILLS.forEach((pill) => {
        assert.ok(html.indexOf('data-role-pill="' + pill.id + '"') !== -1, 'missing pill ' + pill.id);
        assert.ok(html.indexOf(pill.title) !== -1, 'missing title ' + pill.title);
        assert.ok(
            html.indexOf(pill.problem.replace(/\s+/g, ' ')) !== -1,
            'missing problem for ' + pill.id
        );
        assert.ok(
            html.indexOf(pill.approach.replace(/\s+/g, ' ')) !== -1,
            'missing approach for ' + pill.id
        );
        assert.ok(
            html.indexOf(pill.outcome.replace(/\s+/g, ' ')) !== -1,
            'missing outcome for ' + pill.id
        );
    });
    ['Problem', 'Approach', 'Outcome'].forEach((label) => {
        assert.ok(html.indexOf('>' + label + '</span>') !== -1, 'missing ' + label + ' label');
    });
});

test('each role pill keeps its EXPERIENCE id and accurate tenure', () => {
    Resume.EXPERIENCE.forEach((role) => {
        assert.ok(html.indexOf('id="' + role.id + '"') !== -1, 'missing anchor for ' + role.id);
        assert.ok(
            html.indexOf(Resume.formatDateRange(role.start, role.end)) !== -1,
            'missing date range for ' + role.id
        );
        assert.ok(
            html.indexOf(Resume.formatDuration(role.start, role.end) + ' \u00b7 ' + role.location) !== -1,
            role.id + ' should read ' + Resume.formatDuration(role.start, role.end)
        );
    });
});

test('Experience role pills show company logos on the right', () => {
    assert.ok(
        html.indexOf('/media/images/youtube_logo.svg') !== -1 ||
            html.indexOf('/media/images/youtube_logo_white.svg') !== -1,
        'YouTube logo missing'
    );
    assert.equal(
        (raw.match(/\/media\/images\/google_logo\.svg/g) || []).length,
        2,
        'both Google roles should show the Google logo'
    );
    assert.ok(html.indexOf('pf-pill-box__logo') !== -1, 'role logo chrome missing');
    assert.ok(html.indexOf('pf-pill-box__layout') !== -1, 'role logo layout missing');
});

test('Education shows the OSU logo above the degree block', () => {
    assert.ok(html.indexOf('/media/images/osu_vertical.svg') !== -1, 'OSU logo missing');
    const education = raw.slice(raw.indexOf('id="education-heading"'), raw.indexOf('id="experience"'));
    assert.ok(
        education.indexOf('osu_vertical.svg') < education.indexOf('B.S. Computer Science'),
        'OSU logo should appear before the degree copy'
    );
    assert.ok(
        education.indexOf('osu_vertical.svg') < education.indexOf('National Society of Black Engineers'),
        'OSU logo should appear before the activities list'
    );
    assert.ok(
        education.indexOf('about-education__degree') !== -1,
        'degree block should be a grid sibling so the activities list can align with it'
    );
    assert.ok(
        education.indexOf('about-education__primary') === -1,
        'primary wrapper should be gone so logo/degree/list can share one grid'
    );
});

test('compact skills list every skill group without filter deep links', () => {
    Resume.SKILL_GROUPS.forEach((group) => {
        assert.ok(html.indexOf(group.label) !== -1, 'missing skill group ' + group.label);
        group.skills.forEach((skill) => {
            assert.ok(html.indexOf(skill) !== -1, 'skills section is missing: ' + skill);
        });
    });
    assert.ok(raw.indexOf('data-tech=') === -1, 'technology filter hooks should be gone');
    assert.ok(raw.indexOf('data-filter-chips') === -1, 'filter chips should be gone');
    assert.ok(raw.indexOf('data-experience-filter') === -1, 'experience filter UI should be gone');
    assert.ok(raw.indexOf('data-project-filter') === -1, 'project filter UI should be gone');
});

test('Away from the keyboard is optional and never carries résumé CTAs when present', () => {
    const offlineStart = raw.indexOf('id="offline-heading"');
    if (offlineStart === -1) return;
    const offlineBlock = raw.slice(offlineStart, raw.indexOf('id="contact"'));
    assert.ok(offlineBlock.indexOf('jamie-tucker-resume.pdf') === -1, 'resume CTA must leave interests');
    assert.ok(offlineBlock.indexOf('See the work history') === -1, 'work-history CTA must leave interests');
});

test('the page states the résumé download in About and the email address', () => {
    assert.ok(html.indexOf(Resume.PROFILE.resumePath) !== -1);
    assert.ok(html.indexOf(Resume.PROFILE.email) !== -1);
    const aboutEnd = raw.indexOf('id="experience"');
    const about = raw.slice(0, aboutEnd);
    assert.ok(about.indexOf(Resume.PROFILE.resumePath) !== -1, 'résumé CTA belongs in About');
});

test('Contact is LinkedIn + Email only — no résumé channel', () => {
    const contactStart = raw.indexOf('id="contact"');
    const contactEnd = raw.indexOf('</main>');
    const contact = raw.slice(contactStart, contactEnd);
    assert.ok(contact.indexOf('linkedin.com/in/jamieatucker') !== -1, 'LinkedIn URL missing');
    assert.ok(contact.indexOf('fastest') !== -1, 'fastest channel should be labelled');
    assert.ok(contact.indexOf('>Email<') !== -1 || contact.indexOf('Email</p>') !== -1);
    assert.ok(contact.indexOf('jamie-tucker-resume.pdf') === -1, 'Contact must not repeat the résumé card');
    assert.equal((contact.match(/<article\b/g) || []).length, 2, 'Contact should have exactly two pills');
});

test('LinkedIn is the first and fastest contact channel', () => {
    const contactStart = raw.indexOf('id="contact"');
    const contactEnd = raw.indexOf('</main>');
    const contact = decodeEntities(raw.slice(contactStart, contactEnd)).replace(/\s+/g, ' ');
    const fastestAt = contact.indexOf('fastest');
    const emailMetaAt = contact.indexOf('>Email<') !== -1 ? contact.indexOf('>Email<') : contact.indexOf('Email</p>');
    assert.ok(fastestAt !== -1, 'a channel must be labelled fastest');
    assert.ok(emailMetaAt !== -1, 'Email channel missing');
    assert.ok(fastestAt < emailMetaAt, 'the fastest channel must come before Email');
    assert.ok(
        contact.indexOf('linkedin.com/in/jamieatucker') < emailMetaAt,
        'the LinkedIn card must come before the email card'
    );
});

test('location survives as prose without a Location card', () => {
    assert.ok(html.indexOf('>Location<') === -1, 'location card should be removed');
    assert.ok(
        html.indexOf('Sunnyvale') !== -1,
        'location should survive somewhere on the page (copy or structured data)'
    );
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

test('pill boxes use a strong border for control-like chrome', () => {
    const css = fs.readFileSync(path.join(ROOT, 'pages', 'shared', 'css', 'layout.css'), 'utf8');
    assert.ok(
        /\.pf-pill-box\s*\{[\s\S]*?border:\s*1px solid var\(--pf-border-strong\)/.test(css),
        'pill boxes must use --pf-border-strong for identifiable edges'
    );
    assert.ok(html.indexOf('pf-pill-box') !== -1, 'page should render pill boxes');
});

test('every two-column card grid holds at least two cards', () => {
    raw.split('pf-grid--2')
        .slice(1)
        .forEach((block, index) => {
            const body = block.split('</section>')[0];
            const cards = (body.match(/<article\b/g) || []).length;
            assert.ok(cards >= 2, 'grid ' + (index + 1) + ' has only ' + cards + ' card(s)');
        });
});

test('the retired page tour is gone; section spy remains', () => {
    assert.ok(raw.indexOf('data-tour') === -1, 'the tour container should be gone');
    const site = fs.readFileSync(path.join(ROOT, 'pages', 'shared', 'js', 'site.js'), 'utf8');
    assert.ok(site.indexOf('setupTour') === -1, 'site.js should no longer render a tour');
    assert.ok(site.indexOf('setupSectionSpy') !== -1, 'site.js should mark the section in view');
});

finish();
