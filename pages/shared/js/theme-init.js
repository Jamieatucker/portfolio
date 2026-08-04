/*
 * Runs synchronously in <head>, before first paint, so the saved theme is
 * applied without a flash of the wrong colours. Keep this file tiny and
 * dependency-free apart from theme-preference.js.
 */
(function () {
    'use strict';

    var api = window.ThemePreference;
    if (!api) return;

    var stored = null;
    try {
        stored = window.localStorage.getItem(api.STORAGE_KEY);
    } catch (err) {
        // Private browsing or blocked storage: fall back to the OS preference.
        stored = null;
    }

    var prefersDark;
    if (typeof window.matchMedia === 'function') {
        prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    document.documentElement.setAttribute('data-theme', api.resolveTheme(stored, prefersDark));
    document.documentElement.classList.add('pf-js');
})();
