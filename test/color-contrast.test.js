'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CC = require(path.join(ROOT, 'utils', 'color-contrast.js'));
const { createSuite } = require(path.join(__dirname, 'lib', 'test-runner.js'));

const { test, finish } = createSuite('color-contrast');

const THEME_CSS = fs.readFileSync(path.join(ROOT, 'pages', 'shared', 'css', 'theme.css'), 'utf8');

test('brand tokens hold the official Ohio State values', () => {
    assert.equal(CC.BRAND.scarlet, '#ba0c2f');
    assert.equal(CC.BRAND.gray, '#a7b1b7');
    assert.equal(CC.BRAND.white, '#ffffff');
});

test('theme.css declares each brand colour as a token', () => {
    [
        ['--pf-scarlet', '#ba0c2f'],
        ['--pf-gray', '#a7b1b7'],
        ['--pf-white', '#ffffff']
    ].forEach(([token, value]) => {
        assert.ok(
            THEME_CSS.indexOf(token + ': ' + value + ';') !== -1,
            'theme.css must declare ' + token + ': ' + value
        );
    });
});

test('normalizeHex accepts shorthand and rejects nonsense', () => {
    assert.equal(CC.normalizeHex('#FFF'), '#ffffff');
    assert.equal(CC.normalizeHex('BA0C2F'), '#ba0c2f');
    assert.equal(CC.normalizeHex('  #ba0c2f  '), '#ba0c2f');
    assert.throws(() => CC.normalizeHex('#12345'), /Invalid hex/);
    assert.throws(() => CC.normalizeHex('#gggggg'), /Invalid hex/);
    assert.throws(() => CC.normalizeHex(null), /hex colour string/);
});

test('relativeLuminance anchors at black and white', () => {
    assert.equal(CC.relativeLuminance('#000000'), 0);
    assert.equal(CC.relativeLuminance('#ffffff'), 1);
});

test('relativeLuminance uses the linear ramp below the sRGB threshold', () => {
    // 10/255 = 0.0392 is under 0.03928, so the linear branch applies.
    const expected = (10 / 255 / 12.92) * (0.2126 + 0.7152 + 0.0722);
    assert.ok(Math.abs(CC.relativeLuminance('#0a0a0a') - expected) < 1e-12);
});

test('contrastRatio hits the documented bounds', () => {
    assert.equal(CC.contrastRatio('#ffffff', '#000000'), 21);
    assert.equal(CC.contrastRatio('#ba0c2f', '#ba0c2f'), 1);
});

test('contrastRatio is symmetric: swapping colours changes nothing', () => {
    const forward = CC.contrastRatio('#ba0c2f', '#ffffff');
    const reverse = CC.contrastRatio('#ffffff', '#ba0c2f');
    assert.equal(forward, reverse);
});

test('scarlet on white clears AA for normal text', () => {
    const ratio = CC.roundRatio(CC.contrastRatio(CC.BRAND.scarlet, CC.BRAND.white));
    assert.ok(ratio >= CC.AA_NORMAL, 'expected >= 4.5, got ' + ratio);
});

test('plain scarlet on dark ink fails, which is why dark mode uses a tint', () => {
    assert.ok(CC.contrastRatio(CC.BRAND.scarlet, CC.BRAND.ink) < CC.AA_NORMAL);
    assert.ok(CC.meetsRequirement(CC.BRAND.scarletLight, CC.BRAND.ink, 'AA'));
});

test('ratios are truncated, never rounded up to a passing grade', () => {
    // #777777 on white is 4.47:1 — WCAG says that does not pass.
    assert.equal(CC.meetsRequirement('#777777', '#ffffff', 'AA'), false);
    assert.equal(CC.roundRatio(4.499), 4.49);
});

test('large text and non-text use the 3:1 threshold', () => {
    assert.equal(CC.requiredRatio('AA'), 4.5);
    assert.equal(CC.requiredRatio('AA-large'), 3);
    assert.equal(CC.requiredRatio('AA-non-text'), 3);
    assert.equal(CC.requiredRatio('AAA'), 7);
    assert.equal(CC.requiredRatio('nonsense'), 4.5, 'unknown levels fall back to strictest AA text');
});

test('blend composites translucent overlays against their backdrop', () => {
    assert.equal(CC.blend('#ffffff', '#000000', 1), '#ffffff');
    assert.equal(CC.blend('#ffffff', '#000000', 0), '#000000');
    assert.equal(CC.blend('#ffffff', '#000000', 0.5), '#808080');
});

test('blend clamps out-of-range alpha instead of producing invalid colour', () => {
    assert.equal(CC.blend('#ffffff', '#000000', 2), '#ffffff');
    assert.equal(CC.blend('#ffffff', '#000000', -1), '#000000');
});

test('both themes define every token the contracts reference', () => {
    ['dark', 'light'].forEach((name) => {
        const tokens = CC.THEMES[name];
        CC.CONTRACTS.forEach((contract) => {
            assert.ok(tokens[contract.fg], name + ' theme is missing token ' + contract.fg);
            assert.ok(tokens[contract.bg], name + ' theme is missing token ' + contract.bg);
        });
    });
});

test('every dark theme pair meets its WCAG 2.1 AA requirement', () => {
    CC.auditTheme('dark').forEach((row) => {
        assert.ok(
            row.passes,
            'dark ' + row.describe + ': ' + row.foreground + ' on ' + row.background +
                ' is ' + row.ratio + ':1, needs ' + row.required + ':1'
        );
    });
});

test('every light theme pair meets its WCAG 2.1 AA requirement', () => {
    CC.auditTheme('light').forEach((row) => {
        assert.ok(
            row.passes,
            'light ' + row.describe + ': ' + row.foreground + ' on ' + row.background +
                ' is ' + row.ratio + ':1, needs ' + row.required + ':1'
        );
    });
});

test('auditing an unknown theme throws instead of silently passing', () => {
    assert.throws(() => CC.auditTheme('sepia'), /Unknown theme/);
});

test('the audit covers both themes and every contract', () => {
    assert.equal(CC.auditAllThemes().length, CC.CONTRACTS.length * 2);
});

test('body text clears AAA in both themes, not just AA', () => {
    ['dark', 'light'].forEach((name) => {
        const tokens = CC.THEMES[name];
        assert.ok(
            CC.meetsRequirement(tokens.text, tokens.bg, 'AAA'),
            name + ' body text should be comfortably readable'
        );
    });
});

test('filled scarlet controls always pair with white, never the theme accent', () => {
    ['dark', 'light'].forEach((name) => {
        const tokens = CC.THEMES[name];
        assert.equal(tokens.accentSolid, CC.BRAND.scarlet);
        assert.equal(tokens.accentContrast, CC.BRAND.white);
        assert.ok(CC.meetsRequirement(tokens.accentContrast, tokens.accentSolid, 'AA'));
    });
});

test('the palette is scarlet, gray, and white only', () => {
    const allowed = Object.keys(CC.BRAND).map((key) => CC.BRAND[key]);
    ['dark', 'light'].forEach((name) => {
        const tokens = CC.THEMES[name];
        ['text', 'textMuted', 'textSubtle', 'accent', 'accentStrong', 'accentSolid', 'highlight']
            .forEach((token) => {
                assert.ok(
                    allowed.indexOf(tokens[token]) !== -1,
                    name + '.' + token + ' (' + tokens[token] + ') is not a brand colour'
                );
            });
    });
});

finish();
