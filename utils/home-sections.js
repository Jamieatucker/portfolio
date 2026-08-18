/*
 * home-sections.js — pure logic for the home page's length controls.
 *
 * The home page carries the whole work history, so it is long. Two devices keep
 * it navigable: a sticky sub-nav that tracks the section in view, and a collapse
 * that shows only the newest role until the visitor asks for the rest. Both
 * decisions are arithmetic, so they live here where Node can test them.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.HomeSections = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    /** How many roles stay visible while the timeline is collapsed. */
    var COLLAPSED_ROLE_COUNT = 1;

    /**
     * Pick the section the reader is looking at.
     *
     * A section counts as active once its top edge passes the sticky chrome, so
     * the offset is the combined height of the header and sub-nav. The first
     * section wins before any has been passed, and the last section wins once
     * the page is scrolled to the bottom — otherwise a short trailing section
     * can never be reached, because its top never clears the offset.
     *
     * @param {Array<{id: string, top: number}>} sections document order
     * @param {number} scrollTop current scroll position
     * @param {number} offset height of the sticky chrome
     * @param {boolean} [atBottom] the page cannot scroll any further
     * @returns {string|null} the active section id
     */
    function resolveActiveSection(sections, scrollTop, offset, atBottom) {
        if (!Array.isArray(sections) || !sections.length) return null;
        if (atBottom) return sections[sections.length - 1].id;

        var active = sections[0].id;
        var threshold = Number(scrollTop) + Number(offset || 0);
        sections.forEach(function (section) {
            if (section && Number(section.top) <= threshold) {
                active = section.id;
            }
        });
        return active;
    }

    /**
     * Decide which matched roles to render.
     *
     * Filtering wins over collapsing: someone who filters by a technology asked
     * to see every role that used it, so a filtered timeline is never collapsed.
     *
     * @param {Array} matched roles that passed the tag filter, newest first
     * @param {boolean} collapsed whether the reader has expanded the timeline
     * @param {boolean} filtered whether a technology filter is active
     * @returns {Array} the roles to show
     */
    function limitRoles(matched, collapsed, filtered) {
        if (!Array.isArray(matched)) return [];
        if (!collapsed || filtered) return matched.slice();
        return matched.slice(0, COLLAPSED_ROLE_COUNT);
    }

    /**
     * Label and state for the expand/collapse control.
     *
     * @param {number} totalRoles roles currently matching the filter
     * @param {boolean} collapsed current state
     * @param {boolean} filtered whether a technology filter is active
     * @returns {{label: string, expanded: boolean, hidden: boolean}}
     */
    function describeRoleToggle(totalRoles, collapsed, filtered) {
        var total = Math.max(0, Number(totalRoles) || 0);
        var hiddenCount = Math.max(0, total - COLLAPSED_ROLE_COUNT);
        var expanded = !collapsed || Boolean(filtered);

        // Nothing to reveal: one role, or a filter that already shows them all.
        if (hiddenCount === 0 || filtered) {
            return { label: '', expanded: true, hidden: true };
        }

        return {
            label: expanded
                ? 'Hide earlier roles'
                : 'Show ' + hiddenCount + ' earlier ' + (hiddenCount === 1 ? 'role' : 'roles'),
            expanded: expanded,
            hidden: false
        };
    }

    return {
        COLLAPSED_ROLE_COUNT: COLLAPSED_ROLE_COUNT,
        resolveActiveSection: resolveActiveSection,
        limitRoles: limitRoles,
        describeRoleToggle: describeRoleToggle
    };
});
