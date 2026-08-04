/*
 * site-nav.js — the section model for the single-page site.
 *
 * The site used to be six pages; it is now one page whose nav jumps between
 * sections. This module is the single source of truth for what those sections
 * are, in what order, and which fragment identifies each one. The header nav,
 * the footer, the scroll-spy in site.js, and the markup tests all read it, so
 * adding a section here is the only place a key or a label is written down.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.SiteNav = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    /** The hero sits above the first section; the brand link returns here. */
    var TOP_HASH = '#top';

    /**
     * Document order. `label` is the nav label and stays short enough for one
     * line of header; the section's own heading can be longer.
     */
    var SECTIONS = [
        { key: 'proof', label: 'Proof', hash: '#proof' },
        { key: 'approach', label: 'What I do', hash: '#approach' },
        { key: 'about', label: 'About', hash: '#about' },
        { key: 'work', label: 'Work', hash: '#work' },
        { key: 'experience', label: 'Experience', hash: '#experience' },
        { key: 'skills', label: 'Skills', hash: '#skills' },
        { key: 'contact', label: 'Contact', hash: '#contact' }
    ];

    /**
     * Where each retired page's content ended up. Nothing reads this at
     * runtime; the markup test uses it to prove no link still points at a page
     * that no longer exists.
     */
    var LEGACY_PATHS = {
        '/pages/about/html/about.html': '#about',
        '/pages/experience/html/experience.html': '#experience',
        '/pages/projects/html/projects.html': '#work',
        '/pages/skills/html/skills.html': '#skills',
        '/pages/contact/html/contact.html': '#contact'
    };

    /**
     * Reduce anything that might identify a section — a bare key, a fragment,
     * a full URL with a query string — to a `#key` fragment.
     *
     * @param {string} value
     * @returns {string|null} `#key` form, or null if nothing usable is left
     */
    function normalizeHash(value) {
        if (typeof value !== 'string') return null;
        var text = value.trim();
        if (!text) return null;

        // Drop everything before the fragment, then the query and any trailing
        // slash: '/index.html?tech=React#about' -> 'about'.
        var hashIndex = text.indexOf('#');
        if (hashIndex !== -1) text = text.slice(hashIndex + 1);
        text = text.split('?')[0].split('/').join('').trim().toLowerCase();

        return text ? '#' + text : null;
    }

    function getSection(key) {
        var hash = normalizeHash(key);
        if (!hash) return null;
        var found = null;
        SECTIONS.forEach(function (section) {
            if (section.hash === hash) found = section;
        });
        return found;
    }

    /**
     * @param {string} value any hash-ish string
     * @returns {string|null} the section key, or null when it names no section
     */
    function resolveSectionKey(value) {
        var section = getSection(value);
        return section ? section.key : null;
    }

    function getSectionKeys() {
        return SECTIONS.map(function (section) {
            return section.key;
        });
    }

    /** Neighbours in document order, for any prev/next affordance. */
    function getAdjacentSections(key) {
        var index = getSectionKeys().indexOf(resolveSectionKey(key));
        if (index === -1) return { previous: null, next: null };
        return {
            previous: index > 0 ? SECTIONS[index - 1] : null,
            next: index < SECTIONS.length - 1 ? SECTIONS[index + 1] : null
        };
    }

    /** Where a retired page's content lives now, if it was ever a page. */
    function resolveLegacyPath(path) {
        if (typeof path !== 'string') return null;
        var clean = path.split('?')[0].split('#')[0];
        return Object.prototype.hasOwnProperty.call(LEGACY_PATHS, clean)
            ? LEGACY_PATHS[clean]
            : null;
    }

    return {
        TOP_HASH: TOP_HASH,
        SECTIONS: SECTIONS,
        LEGACY_PATHS: LEGACY_PATHS,
        normalizeHash: normalizeHash,
        getSection: getSection,
        resolveSectionKey: resolveSectionKey,
        getSectionKeys: getSectionKeys,
        getAdjacentSections: getAdjacentSections,
        resolveLegacyPath: resolveLegacyPath
    };
});
