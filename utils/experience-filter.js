(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.ExperienceFilter = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var ALL_TAG = 'All';

    function isRole(value) {
        return value && typeof value === 'object' && Array.isArray(value.tags);
    }

    function normalizeTag(tag) {
        return typeof tag === 'string' ? tag.trim().toLowerCase() : '';
    }

    function matchesTag(role, tag) {
        if (!isRole(role)) return false;
        var wanted = normalizeTag(tag);
        if (!wanted) return false;
        return role.tags.some(function (roleTag) {
            return normalizeTag(roleTag) === wanted;
        });
    }

    /**
     * Filter roles by technology tag. `All` (any casing) and empty/invalid tags
     * return every role, because the experience page must never render blank
     * when the URL or a stale control supplies an unknown value.
     */
    function filterRolesByTag(roles, tag) {
        var list = Array.isArray(roles) ? roles.filter(isRole) : [];
        var wanted = normalizeTag(tag);
        if (!wanted || wanted === normalizeTag(ALL_TAG)) return list;
        var matched = list.filter(function (role) {
            return matchesTag(role, wanted);
        });
        return matched.length ? matched : list;
    }

    /** True only when a tag actually narrows the result set. */
    function isKnownTag(roles, tag) {
        var list = Array.isArray(roles) ? roles.filter(isRole) : [];
        return list.some(function (role) {
            return matchesTag(role, tag);
        });
    }

    /** Newest role first, using start date; ties keep their original order. */
    function sortRolesByRecency(roles) {
        var list = Array.isArray(roles) ? roles.filter(isRole) : [];
        return list
            .map(function (role, index) {
                return { role: role, index: index };
            })
            .sort(function (a, b) {
                var aStart = a.role.start || { year: 0, month: 1 };
                var bStart = b.role.start || { year: 0, month: 1 };
                var delta =
                    bStart.year * 12 + bStart.month - (aStart.year * 12 + aStart.month);
                return delta !== 0 ? delta : a.index - b.index;
            })
            .map(function (entry) {
                return entry.role;
            });
    }

    /** Counts per tag, used to label filter chips like "React (2)". */
    function countRolesByTag(roles) {
        var list = Array.isArray(roles) ? roles.filter(isRole) : [];
        var counts = Object.create(null);
        list.forEach(function (role) {
            var seenInRole = Object.create(null);
            role.tags.forEach(function (tag) {
                var key = normalizeTag(tag);
                if (!key || seenInRole[key]) return;
                seenInRole[key] = true;
                counts[key] = (counts[key] || 0) + 1;
            });
        });
        return counts;
    }

    return {
        ALL_TAG: ALL_TAG,
        normalizeTag: normalizeTag,
        matchesTag: matchesTag,
        filterRolesByTag: filterRolesByTag,
        isKnownTag: isKnownTag,
        sortRolesByRecency: sortRolesByRecency,
        countRolesByTag: countRolesByTag
    };
});
