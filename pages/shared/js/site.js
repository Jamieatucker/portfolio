/*
 * site.js — shared chrome behaviour for the single page, loaded with `defer`.
 * All decision logic lives in the unit-tested modules under /utils; this file
 * only wires that logic to the DOM.
 */
(function () {
    'use strict';

    var SiteNav = window.SiteNav;
    var Sections = window.HomeSections;
    var ThemePreference = window.ThemePreference;
    var MOBILE_QUERY = '(max-width: 800px)';

    /**
     * Mark the section in view in the nav.
     *
     * The nav used to mark the current page; on one page it tracks scroll
     * position instead. Sections are re-measured on every painted frame
     * because the timeline collapse and both filters change their offsets.
     */
    function setupSectionSpy() {
        if (!SiteNav || !Sections) return;

        var links = {};
        Array.prototype.forEach.call(document.querySelectorAll('[data-nav-key]'), function (link) {
            links[link.getAttribute('data-nav-key')] = link;
        });

        var nodes = SiteNav.SECTIONS.map(function (section) {
            return { key: section.key, node: document.getElementById(section.key) };
        }).filter(function (entry) {
            return entry.node;
        });
        if (!nodes.length || !Object.keys(links).length) return;

        var header = document.querySelector('.pf-header');
        var pending = false;

        function paint() {
            pending = false;
            var doc = document.documentElement;
            var scrollTop = window.pageYOffset || doc.scrollTop || 0;
            var atBottom = scrollTop + window.innerHeight >= doc.scrollHeight - 2;
            var measured = nodes.map(function (entry) {
                return {
                    id: entry.key,
                    top: entry.node.getBoundingClientRect().top + scrollTop
                };
            });
            var active = Sections.resolveActiveSection(
                measured,
                scrollTop,
                header ? header.offsetHeight : 0,
                atBottom
            );

            Object.keys(links).forEach(function (key) {
                if (key === active) {
                    links[key].setAttribute('aria-current', 'true');
                } else {
                    links[key].removeAttribute('aria-current');
                }
            });
        }

        function schedule() {
            if (pending) return;
            pending = true;
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(paint);
            } else {
                paint();
            }
        }

        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        schedule();
    }

    function isMobile() {
        return typeof window.matchMedia === 'function'
            ? window.matchMedia(MOBILE_QUERY).matches
            : window.innerWidth <= 800;
    }

    function setupMobileNav() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var list = document.getElementById('pf-nav-list');
        if (!toggle || !list) return;

        function collapse(collapsed) {
            list.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }

        collapse(isMobile());

        toggle.addEventListener('click', function () {
            collapse(list.getAttribute('data-collapsed') !== 'true');
        });

        // Section links no longer load a new page, so the menu has to close
        // itself or it would cover the section the reader just asked for.
        list.addEventListener('click', function (event) {
            if (event.target.closest('a') && isMobile()) collapse(true);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isMobile()) collapse(true);
        });

        // Leaving mobile widths must never leave the menu hidden on desktop.
        window.addEventListener('resize', function () {
            collapse(isMobile());
        });
    }

    function setupThemeToggle() {
        var toggle = document.querySelector('[data-theme-toggle]');
        if (!toggle || !ThemePreference) return;

        function render(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            toggle.setAttribute('aria-label', ThemePreference.describeToggle(theme));
            toggle.setAttribute('title', ThemePreference.describeToggle(theme));
            toggle.textContent = theme === ThemePreference.DARK ? '\u263c' : '\u263e';
        }

        render(document.documentElement.getAttribute('data-theme') || ThemePreference.DEFAULT_THEME);

        toggle.addEventListener('click', function () {
            var next = ThemePreference.nextTheme(
                document.documentElement.getAttribute('data-theme')
            );
            render(next);
            try {
                window.localStorage.setItem(ThemePreference.STORAGE_KEY, next);
            } catch (err) {
                // Storage is optional; the choice still applies for this page view.
            }
        });
    }

    /** Fade sections in on first view, degrading to plain visibility. */
    function setupReveal() {
        var targets = document.querySelectorAll('.pf-reveal');
        if (!targets.length) return;

        var reduceMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion || typeof window.IntersectionObserver !== 'function') {
            Array.prototype.forEach.call(targets, function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new window.IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        );

        Array.prototype.forEach.call(targets, function (el) {
            observer.observe(el);
        });
    }

    function stampYear() {
        var slots = document.querySelectorAll('[data-current-year]');
        Array.prototype.forEach.call(slots, function (slot) {
            slot.textContent = String(new Date().getFullYear());
        });
    }

    setupSectionSpy();
    setupMobileNav();
    setupThemeToggle();
    setupReveal();
    stampYear();
})();
