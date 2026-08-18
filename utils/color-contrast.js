(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.ColorContrast = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    /**
     * WCAG 2.1 contrast maths plus the Ohio State brand palette that
     * pages/shared/css/theme.css is built from. Keeping the resolved token
     * values here lets the test suite prove every text pair meets AA instead
     * of trusting a designer's eye.
     * Palette source: https://bux.osu.edu/color/primary-colors/
     */

    var AA_NORMAL = 4.5;
    var AA_LARGE = 3;
    var AA_NON_TEXT = 3;
    var AAA_NORMAL = 7;

    // Official Ohio State primary colours, shades, and tints.
    var BRAND = {
        scarlet: '#ba0c2f',
        scarletDark40: '#70071c',
        scarletDark60: '#4a0513',
        gray: '#a7b1b7',
        grayLight20: '#bfc6cb',
        grayLight40: '#cfd4d8',
        grayLight60: '#dfe3e5',
        grayLight80: '#eff1f2',
        grayLight90: '#f6f7f8',
        grayDark20: '#868e92',
        grayDark40: '#646a6e',
        grayDark60: '#3f4443',
        grayDark80: '#212325',
        white: '#ffffff',
        // Scarlet is too dark to read as text on a dark background (2.4:1),
        // so dark mode uses these tints for links and accent text only.
        scarletLight: '#ff8a9c',
        scarletLightStrong: '#ffb3bf',
        // Derived neutrals for dark-mode surfaces, one step below grayDark80.
        ink: '#17191b',
        inkElevated: '#212325'
    };

    function normalizeHex(hex) {
        if (typeof hex !== 'string') {
            throw new Error('Expected a hex colour string');
        }
        var value = hex.trim().replace(/^#/, '');
        if (value.length === 3) {
            value = value
                .split('')
                .map(function (char) {
                    return char + char;
                })
                .join('');
        }
        if (!/^[0-9a-fA-F]{6}$/.test(value)) {
            throw new Error('Invalid hex colour: ' + hex);
        }
        return '#' + value.toLowerCase();
    }

    function hexToRgb(hex) {
        var value = normalizeHex(hex).slice(1);
        return {
            r: parseInt(value.slice(0, 2), 16),
            g: parseInt(value.slice(2, 4), 16),
            b: parseInt(value.slice(4, 6), 16)
        };
    }

    function channelLuminance(value) {
        var channel = value / 255;
        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    }

    /** WCAG relative luminance: 0 for black, 1 for white. */
    function relativeLuminance(hex) {
        var rgb = hexToRgb(hex);
        return (
            0.2126 * channelLuminance(rgb.r) +
            0.7152 * channelLuminance(rgb.g) +
            0.0722 * channelLuminance(rgb.b)
        );
    }

    /** Contrast ratio between two colours, from 1:1 to 21:1. */
    function contrastRatio(foreground, background) {
        var a = relativeLuminance(foreground);
        var b = relativeLuminance(background);
        var lighter = Math.max(a, b);
        var darker = Math.min(a, b);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /** Ratios are truncated, never rounded up: 4.49 must not pass as 4.5. */
    function roundRatio(ratio) {
        return Math.floor(ratio * 100) / 100;
    }

    /**
     * `level` is 'AA', 'AA-large', 'AA-non-text', or 'AAA'.
     * Large text means 24px, or 18.66px when bold.
     */
    function requiredRatio(level) {
        if (level === 'AA-large') return AA_LARGE;
        if (level === 'AA-non-text') return AA_NON_TEXT;
        if (level === 'AAA') return AAA_NORMAL;
        return AA_NORMAL;
    }

    function meetsRequirement(foreground, background, level) {
        return roundRatio(contrastRatio(foreground, background)) >= requiredRatio(level);
    }

    /**
     * Flatten a translucent overlay against its backdrop. Token values such as
     * --pf-surface are rgba, and WCAG measures the composited result.
     */
    function blend(foreground, background, alpha) {
        var a = typeof alpha === 'number' ? Math.min(1, Math.max(0, alpha)) : 1;
        var fg = hexToRgb(foreground);
        var bg = hexToRgb(background);
        function mix(f, b) {
            var value = Math.round(f * a + b * (1 - a));
            var hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return '#' + mix(fg.r, bg.r) + mix(fg.g, bg.g) + mix(fg.b, bg.b);
    }

    // Resolved token values per theme, mirroring theme.css exactly.
    var THEMES = {
        dark: {
            bg: BRAND.ink,
            bgElevated: BRAND.inkElevated,
            surface: blend(BRAND.white, BRAND.ink, 0.05),
            surfaceStrong: blend(BRAND.white, BRAND.ink, 0.09),
            text: BRAND.white,
            textMuted: BRAND.grayLight40,
            textSubtle: BRAND.gray,
            accent: BRAND.scarletLight,
            accentStrong: BRAND.scarletLightStrong,
            accentSolid: BRAND.scarlet,
            accentContrast: BRAND.white,
            accentSoft: blend(BRAND.scarlet, BRAND.ink, 0.28),
            highlight: BRAND.gray,
            border: blend(BRAND.white, BRAND.ink, 0.16),
            borderStrong: BRAND.grayDark20,
            // Solid scarlet is only 2.7:1 on dark ink, so dark-mode primary
            // buttons carry a scarlet-tint border to stay identifiable.
            accentSolidBorder: BRAND.scarletLight
        },
        light: {
            bg: BRAND.grayLight90,
            bgElevated: BRAND.white,
            surface: blend(BRAND.grayDark80, BRAND.grayLight90, 0.04),
            surfaceStrong: blend(BRAND.grayDark80, BRAND.grayLight90, 0.08),
            text: BRAND.grayDark80,
            textMuted: BRAND.grayDark60,
            textSubtle: BRAND.grayDark40,
            accent: BRAND.scarlet,
            accentStrong: BRAND.scarletDark40,
            accentSolid: BRAND.scarlet,
            accentContrast: BRAND.white,
            accentSoft: blend(BRAND.scarlet, BRAND.grayLight90, 0.12),
            highlight: BRAND.grayDark40,
            border: blend(BRAND.grayDark80, BRAND.grayLight90, 0.16),
            // grayDark20 is 2.89:1 on the light card surface, so controls step
            // one shade darker to clear 1.4.11 everywhere they appear.
            borderStrong: BRAND.grayDark40,
            accentSolidBorder: BRAND.scarlet
        }
    };

    /**
     * Every foreground/background pair the site actually renders, with the
     * WCAG level it has to clear. `describe` is used in test failure output.
     */
    var CONTRACTS = [
        { describe: 'body text on page background', fg: 'text', bg: 'bg', level: 'AA' },
        { describe: 'body text on elevated surface', fg: 'text', bg: 'bgElevated', level: 'AA' },
        { describe: 'body text on card surface', fg: 'text', bg: 'surface', level: 'AA' },
        { describe: 'muted text on page background', fg: 'textMuted', bg: 'bg', level: 'AA' },
        { describe: 'muted text on card surface', fg: 'textMuted', bg: 'surface', level: 'AA' },
        { describe: 'subtle text on page background', fg: 'textSubtle', bg: 'bg', level: 'AA' },
        { describe: 'subtle text on card surface', fg: 'textSubtle', bg: 'surface', level: 'AA' },
        { describe: 'link and accent text on page background', fg: 'accent', bg: 'bg', level: 'AA' },
        { describe: 'link and accent text on card surface', fg: 'accent', bg: 'surface', level: 'AA' },
        { describe: 'hovered link on page background', fg: 'accentStrong', bg: 'bg', level: 'AA' },
        { describe: 'button label on solid scarlet', fg: 'accentContrast', bg: 'accentSolid', level: 'AA' },
        { describe: 'body text on soft scarlet chip', fg: 'text', bg: 'accentSoft', level: 'AA' },
        { describe: 'highlight text on page background', fg: 'highlight', bg: 'bg', level: 'AA' },
        // 1.4.11 applies to boundaries that identify a control, not to the
        // decorative hairlines between sections, which are exempt.
        { describe: 'interactive control border', fg: 'borderStrong', bg: 'bg', level: 'AA-non-text' },
        { describe: 'interactive control border on surface', fg: 'borderStrong', bg: 'surface', level: 'AA-non-text' },
        { describe: 'primary button boundary', fg: 'accentSolidBorder', bg: 'bg', level: 'AA-non-text' }
    ];

    /** Evaluate every contract for one theme. Returns rows with pass/fail. */
    function auditTheme(themeName) {
        var tokens = THEMES[themeName];
        if (!tokens) throw new Error('Unknown theme: ' + themeName);
        return CONTRACTS.map(function (contract) {
            var ratio = roundRatio(contrastRatio(tokens[contract.fg], tokens[contract.bg]));
            return {
                theme: themeName,
                describe: contract.describe,
                foreground: tokens[contract.fg],
                background: tokens[contract.bg],
                level: contract.level,
                required: requiredRatio(contract.level),
                ratio: ratio,
                passes: ratio >= requiredRatio(contract.level)
            };
        });
    }

    function auditAllThemes() {
        return Object.keys(THEMES).reduce(function (rows, name) {
            return rows.concat(auditTheme(name));
        }, []);
    }

    return {
        AA_NORMAL: AA_NORMAL,
        AA_LARGE: AA_LARGE,
        AA_NON_TEXT: AA_NON_TEXT,
        AAA_NORMAL: AAA_NORMAL,
        BRAND: BRAND,
        THEMES: THEMES,
        CONTRACTS: CONTRACTS,
        normalizeHex: normalizeHex,
        hexToRgb: hexToRgb,
        relativeLuminance: relativeLuminance,
        contrastRatio: contrastRatio,
        roundRatio: roundRatio,
        requiredRatio: requiredRatio,
        meetsRequirement: meetsRequirement,
        blend: blend,
        auditTheme: auditTheme,
        auditAllThemes: auditAllThemes
    };
});
