/*
 * site-nav.js — the section model for the single-page site.
 *
 * Three major sections (About, Experience, Contact). Retired fragments and
 * page paths soft-alias onto those sections so old links keep working.
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

    /** Brand / skip-home target — the About section opens the page. */
    var TOP_HASH = '#about';

    /**
     * Document order. `label` is the nav label and stays short enough for one
     * line of header; the section's own heading can be longer.
     */
    var SECTIONS = [
        { key: 'about', label: 'About', hash: '#about' },
        { key: 'experience', label: 'Experience', hash: '#experience' },
        { key: 'contact', label: 'Contact', hash: '#contact' }
    ];

    /**
     * Retired fragments from the seven-section layout. resolveHashAlias maps
     * these onto a live section so bookmarks and external links do not break.
     */
    var HASH_ALIASES = {
        '#top': '#about',
        '#proof': '#about',
        '#approach': '#about',
        '#work': '#experience',
        '#skills': '#experience'
    };

    /**
     * Where each retired page's content ended up. Keys are historical URL
     * pathnames (`location.pathname` is always `/…`), not asset hrefs. Nothing
     * reads this at runtime; the markup test uses it to prove no link still
     * points at a page that no longer exists.
     */
    var LEGACY_PATHS = {
        '/pages/about/html/about.html': '#about',
        '/pages/experience/html/experience.html': '#experience',
        '/pages/projects/html/projects.html': '#experience',
        '/pages/skills/html/skills.html': '#experience',
        '/pages/contact/html/contact.html': '#contact'
    };

    /**
     * Reduce anything that might identify a section — a bare key, a fragment,
     * a full URL with a query string — to a `#key` fragment (before aliasing).
     *
     * @param {string} value
     * @returns {string|null} `#key` form, or null if nothing usable is left
     */
    function normalizeHash(value) {
        if (typeof value !== 'string') return null;
        var text = value.trim();
        if (!text) return null;

        var hashIndex = text.indexOf('#');
        if (hashIndex !== -1) text = text.slice(hashIndex + 1);
        text = text.split('?')[0].split('/').join('').trim().toLowerCase();

        return text ? '#' + text : null;
    }

    /**
     * Map a retired fragment onto a live section hash. Live hashes and unknown
     * values pass through unchanged (unknown still returns the normalized form
     * so callers can decide).
     *
     * @param {string} value
     * @returns {string|null}
     */
    function resolveHashAlias(value) {
        var hash = normalizeHash(value);
        if (!hash) return null;
        if (Object.prototype.hasOwnProperty.call(HASH_ALIASES, hash)) {
            return HASH_ALIASES[hash];
        }
        return hash;
    }

    /**
     * Canonical live section hash, or null when the value names nothing real
     * (after soft-aliasing).
     *
     * @param {string} value
     * @returns {string|null}
     */
    function canonicalizeHash(value) {
        var aliased = resolveHashAlias(value);
        if (!aliased) return null;
        var found = null;
        SECTIONS.forEach(function (section) {
            if (section.hash === aliased) found = section.hash;
        });
        return found;
    }

    function getSection(key) {
        var hash = canonicalizeHash(key);
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
        HASH_ALIASES: HASH_ALIASES,
        LEGACY_PATHS: LEGACY_PATHS,
        normalizeHash: normalizeHash,
        resolveHashAlias: resolveHashAlias,
        canonicalizeHash: canonicalizeHash,
        getSection: getSection,
        resolveSectionKey: resolveSectionKey,
        getSectionKeys: getSectionKeys,
        getAdjacentSections: getAdjacentSections,
        resolveLegacyPath: resolveLegacyPath
    };
});
