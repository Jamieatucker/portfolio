/*
 * index.js — progressive enhancement for the home page.
 *
 * Everything here is optional: the roles, their bullets, and the section links
 * are all in the HTML, so the page is complete with JavaScript disabled. This
 * adds three things — the technology filter, a collapse that hides older roles
 * until asked for, and a sub-nav that marks the section in view.
 *
 * Filtering rules live in /utils/experience-filter.js; the collapse and
 * scroll-spy arithmetic lives in /utils/home-sections.js. Both are unit tested.
 */
(function () {
    'use strict';

    var Filter = window.ExperienceFilter;
    var Resume = window.ResumeData;
    var Sections = window.HomeSections;
    if (!Filter || !Resume || !Sections) return;

    var container = document.querySelector('[data-experience-filter]');
    // The work section runs the same kind of filter, so scope these lookups to
    // the timeline's own container instead of taking the document's first match.
    var chipHost = container ? container.querySelector('[data-filter-chips]') : null;
    var status = container ? container.querySelector('[data-filter-status]') : null;
    var list = document.querySelector('[data-role-list]');
    var toggle = document.querySelector('[data-role-toggle]');
    if (!container || !chipHost || !list) return;

    var roleNodes = Array.prototype.slice.call(list.querySelectorAll('[data-role-tags]'));
    if (!roleNodes.length) return;

    /** Read tags straight off the DOM so markup stays the source of truth. */
    function readTags(node) {
        return (node.getAttribute('data-role-tags') || '')
            .split(',')
            .map(function (tag) {
                return tag.trim();
            })
            .filter(Boolean);
    }

    var roles = roleNodes.map(function (node) {
        return { node: node, tags: readTags(node) };
    });

    var counts = Filter.countRolesByTag(roles);
    var tags = [Filter.ALL_TAG].concat(Resume.getAllSkillTags(roles));

    // Older roles start collapsed so the page opens at a readable length.
    var collapsed = roles.length > Sections.COLLAPSED_ROLE_COUNT;
    var activeTag = Filter.ALL_TAG;

    function setStatus(tag, matchedCount, shownCount) {
        if (!status) return;
        var isAll = Filter.normalizeTag(tag) === Filter.normalizeTag(Filter.ALL_TAG);
        if (!isAll) {
            status.textContent =
                'Showing ' + matchedCount + ' of ' + roles.length + ' roles that used ' + tag + '.';
        } else if (shownCount < matchedCount) {
            var hiddenCount = matchedCount - shownCount;
            status.textContent =
                'Showing the ' + (shownCount === 1 ? 'newest role' : shownCount + ' newest roles') +
                '. ' + hiddenCount + ' earlier ' + (hiddenCount === 1 ? 'role is' : 'roles are') +
                ' hidden.';
        } else {
            status.textContent = 'Showing all ' + matchedCount + ' roles.';
        }
    }

    function apply(tag) {
        activeTag = tag;
        var filtered = Filter.normalizeTag(tag) !== Filter.normalizeTag(Filter.ALL_TAG);
        var matched = Filter.filterRolesByTag(roles, tag);
        var shown = Sections.limitRoles(matched, collapsed, filtered);

        roles.forEach(function (role) {
            var visible = shown.indexOf(role) !== -1;
            role.node.hidden = !visible;
            role.node.classList.add('is-visible');
        });

        Array.prototype.forEach.call(chipHost.querySelectorAll('[data-tag]'), function (chip) {
            var isActive = chip.getAttribute('data-tag') === tag;
            chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            chip.classList.toggle('is-active', isActive);
        });

        if (toggle) {
            var state = Sections.describeRoleToggle(matched.length, collapsed, filtered);
            toggle.hidden = state.hidden;
            toggle.setAttribute('aria-expanded', state.expanded ? 'true' : 'false');
            if (state.label) toggle.textContent = state.label;
        }

        setStatus(tag, matched.length, shown.length);
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            collapsed = !collapsed;
            apply(activeTag);
            // Expanding inserts roles above the button, pushing it down the page.
            // Keep focus on it and follow it, but only if it left the viewport.
            toggle.focus();
            if (toggle.scrollIntoView) {
                toggle.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    tags.forEach(function (tag) {
        var chip = document.createElement('button');
        var count = counts[Filter.normalizeTag(tag)];
        chip.type = 'button';
        chip.className = 'home-chip';
        chip.setAttribute('data-tag', tag);
        chip.setAttribute('aria-pressed', 'false');
        chip.textContent = count ? tag + ' (' + count + ')' : tag;
        chip.addEventListener('click', function () {
            apply(tag);
        });
        chipHost.appendChild(chip);
    });

    container.hidden = false;

    /** Deep links such as ?tech=React let me point a recruiter at one stack. */
    var requested = null;
    if (typeof window.URLSearchParams === 'function') {
        requested = new window.URLSearchParams(window.location.search).get('tech');
    }

    /** Resolve a requested tag to the exact casing the chips use. */
    function canonicalTag(requestedTag) {
        return Resume.getAllSkillTags(roles).filter(function (tag) {
            return Filter.normalizeTag(tag) === Filter.normalizeTag(requestedTag);
        })[0];
    }

    function showTimeline(tag) {
        apply(tag);
        // The timeline sits far below the skills rows and the hero, so a filter
        // that arrives from elsewhere on the page has to bring it into view.
        if (container.scrollIntoView) {
            container.scrollIntoView({ block: 'start' });
        }
    }

    if (requested && Filter.isKnownTag(roles, requested)) {
        showTimeline(canonicalTag(requested) || Filter.ALL_TAG);
    } else {
        apply(Filter.ALL_TAG);
    }

    /*
     * Skills rows filter the timeline in place. Each row is a real link to
     * #experience, so it still works if this listener never runs; the handler
     * only saves the reader from scrolling back up to pick a chip.
     */
    Array.prototype.forEach.call(document.querySelectorAll('[data-tech]'), function (link) {
        link.addEventListener('click', function (event) {
            var tag = link.getAttribute('data-tech');
            if (!Filter.isKnownTag(roles, tag)) return;
            event.preventDefault();
            showTimeline(canonicalTag(tag) || Filter.ALL_TAG);
        });
    });

})();
