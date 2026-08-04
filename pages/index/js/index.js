/*
 * experience.js — progressive enhancement for the work-history timeline.
 * The roles are already in the HTML; this only adds the technology filter,
 * so the page is complete with JavaScript disabled.
 * Filtering rules live in /utils/experience-filter.js and are unit tested.
 */
(function () {
    'use strict';

    var Filter = window.ExperienceFilter;
    var Resume = window.ResumeData;
    if (!Filter || !Resume) return;

    var container = document.querySelector('[data-experience-filter]');
    var chipHost = document.querySelector('[data-filter-chips]');
    var status = document.querySelector('[data-filter-status]');
    var list = document.querySelector('[data-role-list]');
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

    function setStatus(tag, visibleCount) {
        if (!status) return;
        var isAll = Filter.normalizeTag(tag) === Filter.normalizeTag(Filter.ALL_TAG);
        status.textContent = isAll
            ? 'Showing all ' + visibleCount + ' roles.'
            : 'Showing ' + visibleCount + ' of ' + roles.length + ' roles that used ' + tag + '.';
    }

    function apply(tag) {
        var matched = Filter.filterRolesByTag(roles, tag);
        roles.forEach(function (role) {
            var visible = matched.indexOf(role) !== -1;
            role.node.hidden = !visible;
            role.node.classList.add('is-visible');
        });

        Array.prototype.forEach.call(chipHost.querySelectorAll('[data-tag]'), function (chip) {
            var isActive = chip.getAttribute('data-tag') === tag;
            chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            chip.classList.toggle('is-active', isActive);
        });

        setStatus(tag, matched.length);
    }

    tags.forEach(function (tag) {
        var chip = document.createElement('button');
        var count = counts[Filter.normalizeTag(tag)];
        chip.type = 'button';
        chip.className = 'exp-chip';
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

    if (requested && Filter.isKnownTag(roles, requested)) {
        var canonical = Resume.getAllSkillTags(roles).filter(function (tag) {
            return Filter.normalizeTag(tag) === Filter.normalizeTag(requested);
        })[0];
        apply(canonical || Filter.ALL_TAG);
    } else {
        apply(Filter.ALL_TAG);
    }
})();
