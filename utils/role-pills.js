/*
 * role-pills.js — Experience section pill-box model (Milestone 6).
 *
 * One pill per employer team: problem → approach → outcome. roleId must match
 * an EXPERIENCE entry. Pure helpers are unit-tested; the HTML mirrors this data.
 */
(function (root, factory) {
    var api = factory(
        typeof module === 'object' && module.exports
            ? require('./resume-data.js')
            : root.ResumeData
    );
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.RolePills = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (ResumeData) {
    'use strict';

    /**
     * Document order matches EXPERIENCE (newest first). Titles are the team
     * names recruiters recognise from the résumé.
     */
    var ROLE_PILLS = [
        {
            id: 'pill-youtube-playables',
            roleId: 'youtube-playables',
            title: 'YouTube Playables Game Creation',
            problem:
                'A flagship generative AI game creation product had no client foundation, ' +
                'and multiple teams needed to ship into it at once.',
            approach:
                'Designed a multi-page client architecture from scratch with clear module ' +
                'boundaries, then layered client-side state management for dynamic game ' +
                'assets and generated code files. Refined the UI from 30+ UX research sessions.',
            outcome:
                'Shipped creation tools to 1,000+ creators, cut load times and memory overhead, ' +
                'accelerated cross-team delivery, and hit 90%+ telemetry reliability.'
        },
        {
            id: 'pill-google-search-intelligence',
            roleId: 'google-search-intelligence',
            title: 'Google Search Intelligence',
            problem:
                'Creators dropped out of confusing verification flows, surfaces were rebuilt ' +
                'per team, and strong Search results below the fold went unnoticed.',
            approach:
                'Engineered an accessible verification flow informed by 10,000+ creators, ' +
                'authored a 30+ component library for consistent UI, and shipped trending ' +
                'badge labels inline in results.',
            outcome:
                'Streamlined account linking for 1M+ creators, reduced UI redundancy across ' +
                'surfaces, and boosted click-through for 3M+ US users.'
        },
        {
            id: 'pill-google-modern-creators',
            roleId: 'google-modern-creators',
            title: 'Google Modern Creators and Formats',
            problem:
                'Discover readers had no real-time way to react to articles, and drafts ' +
                'published without a preview of the final render.',
            approach:
                'Built a pre-publish client state validation layer for live previews and a ' +
                'dynamic grid that aggregates real-time note clusters, plus automated image ' +
                'comparison tests for user visuals.',
            outcome:
                'Supported a launch engaging 1M+ users across the US and India, with higher ' +
                'post completion, improved feed quality, and 95%+ visual validation accuracy.'
        }
    ];

    function getRolePillIds(pills) {
        var list = Array.isArray(pills) ? pills : ROLE_PILLS;
        return list.map(function (pill) {
            return pill && pill.id;
        }).filter(Boolean);
    }

    function getPillByRoleId(roleId, pills) {
        var list = Array.isArray(pills) ? pills : ROLE_PILLS;
        if (typeof roleId !== 'string' || !roleId) return null;
        var found = null;
        list.forEach(function (pill) {
            if (pill && pill.roleId === roleId) found = pill;
        });
        return found;
    }

    /**
     * Every pill must point at a real EXPERIENCE id. Returns offending pill ids.
     */
    function findOrphanRolePills(pills, roles) {
        var pillList = Array.isArray(pills) ? pills : ROLE_PILLS;
        var roleList = Array.isArray(roles)
            ? roles
            : ResumeData && Array.isArray(ResumeData.EXPERIENCE)
              ? ResumeData.EXPERIENCE
              : [];
        var roleIds = roleList.map(function (role) {
            return role.id;
        });
        return pillList
            .filter(function (pill) {
                return !pill || !pill.roleId || roleIds.indexOf(pill.roleId) === -1;
            })
            .map(function (pill) {
                return pill && pill.id ? pill.id : '(missing id)';
            });
    }

    /**
     * EXPERIENCE roles that have no pill — useful when a new job is added but
     * the Experience section markup/data was not updated.
     */
    function findRolesMissingPills(pills, roles) {
        var pillList = Array.isArray(pills) ? pills : ROLE_PILLS;
        var roleList = Array.isArray(roles)
            ? roles
            : ResumeData && Array.isArray(ResumeData.EXPERIENCE)
              ? ResumeData.EXPERIENCE
              : [];
        var covered = Object.create(null);
        pillList.forEach(function (pill) {
            if (pill && pill.roleId) covered[pill.roleId] = true;
        });
        return roleList
            .filter(function (role) {
                return role && role.id && !covered[role.id];
            })
            .map(function (role) {
                return role.id;
            });
    }

    /** Required fields for a valid pill record (empty string = missing). */
    function validatePillShape(pill) {
        if (!pill || typeof pill !== 'object') {
            return ['pill must be an object'];
        }
        var required = ['id', 'roleId', 'title', 'problem', 'approach', 'outcome'];
        var missing = [];
        required.forEach(function (key) {
            if (typeof pill[key] !== 'string' || !pill[key].trim()) {
                missing.push(key);
            }
        });
        return missing;
    }

    return {
        ROLE_PILLS: ROLE_PILLS,
        getRolePillIds: getRolePillIds,
        getPillByRoleId: getPillByRoleId,
        findOrphanRolePills: findOrphanRolePills,
        findRolesMissingPills: findRolesMissingPills,
        validatePillShape: validatePillShape
    };
});
