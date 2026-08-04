/*
 * projects.js — technology filter for the case-study grid.
 * Cards are already in the HTML; this is enhancement only, and it reuses the
 * same unit-tested helpers as the experience page filter.
 */
(function () {
    'use strict';

    var Filter = window.ExperienceFilter;
    var Resume = window.ResumeData;
    if (!Filter || !Resume) return;

    var container = document.querySelector('[data-project-filter]');
    var chipHost = document.querySelector('[data-filter-chips]');
    var status = document.querySelector('[data-filter-status]');
    var list = document.querySelector('[data-project-list]');
    if (!container || !chipHost || !list) return;

    var cardNodes = Array.prototype.slice.call(list.querySelectorAll('[data-project-tags]'));
    if (!cardNodes.length) return;

    var cards = cardNodes.map(function (node) {
        return {
            node: node,
            tags: (node.getAttribute('data-project-tags') || '')
                .split(',')
                .map(function (tag) {
                    return tag.trim();
                })
                .filter(Boolean)
        };
    });

    var counts = Filter.countRolesByTag(cards);
    var tags = [Filter.ALL_TAG].concat(Resume.getAllSkillTags(cards));

    function setStatus(tag, visibleCount) {
        if (!status) return;
        var isAll = Filter.normalizeTag(tag) === Filter.normalizeTag(Filter.ALL_TAG);
        status.textContent = isAll
            ? 'Showing all ' + visibleCount + ' case studies.'
            : 'Showing ' + visibleCount + ' of ' + cards.length + ' case studies built with ' + tag + '.';
    }

    function apply(tag) {
        var matched = Filter.filterRolesByTag(cards, tag);
        cards.forEach(function (card) {
            var visible = matched.indexOf(card) !== -1;
            card.node.hidden = !visible;
            card.node.classList.add('is-visible');
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
        chip.className = 'proj-chip';
        chip.setAttribute('data-tag', tag);
        chip.setAttribute('aria-pressed', 'false');
        chip.textContent = count ? tag + ' (' + count + ')' : tag;
        chip.addEventListener('click', function () {
            apply(tag);
        });
        chipHost.appendChild(chip);
    });

    container.hidden = false;
    apply(Filter.ALL_TAG);
})();
