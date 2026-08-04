(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.ThemePreference = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var STORAGE_KEY = 'portfolio-theme';
    var DARK = 'dark';
    var LIGHT = 'light';
    var DEFAULT_THEME = DARK;

    function isValidTheme(value) {
        return value === DARK || value === LIGHT;
    }

    /**
     * Resolution order: an explicit saved choice wins, then the OS preference,
     * then the dark default. Corrupt localStorage values are ignored rather
     * than thrown so a bad key can never blank the page.
     */
    function resolveTheme(storedValue, prefersDark) {
        if (isValidTheme(storedValue)) return storedValue;
        if (prefersDark === true) return DARK;
        if (prefersDark === false) return LIGHT;
        return DEFAULT_THEME;
    }

    function nextTheme(current) {
        return resolveTheme(current, undefined) === DARK ? LIGHT : DARK;
    }

    /** Label describing the action the toggle performs, for aria-label. */
    function describeToggle(current) {
        return nextTheme(current) === DARK
            ? 'Switch to dark theme'
            : 'Switch to light theme';
    }

    return {
        STORAGE_KEY: STORAGE_KEY,
        DARK: DARK,
        LIGHT: LIGHT,
        DEFAULT_THEME: DEFAULT_THEME,
        isValidTheme: isValidTheme,
        resolveTheme: resolveTheme,
        nextTheme: nextTheme,
        describeToggle: describeToggle
    };
});
