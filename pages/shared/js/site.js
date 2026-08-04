/*
 * site.js — shared page chrome behaviour, loaded with `defer` on every page.
 * All decision logic lives in the unit-tested modules under /utils; this file
 * only wires that logic to the DOM.
 */
(function () {
    'use strict';

    var SiteNav = window.SiteNav;
    var ThemePreference = window.ThemePreference;
    var MOBILE_QUERY = '(max-width: 800px)';

    /** Mark the current page in the nav and expose it for per-page scripts. */
    function markActiveNavLink() {
        if (!SiteNav) return null;
        var key = SiteNav.resolveActiveNavKey(window.location.pathname);
        var links = document.querySelectorAll('[data-nav-key]');
        Array.prototype.forEach.call(links, function (link) {
            if (link.getAttribute('data-nav-key') === key) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        return key;
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

    /** Render the prev/next tour control from the nav order. */
    function setupTour(activeKey) {
        var container = document.querySelector('[data-tour]');
        if (!container || !SiteNav || !activeKey) return;

        var adjacent = SiteNav.getAdjacentLinks(activeKey);
        var html = '';
        if (adjacent.previous) {
            html +=
                '<a class="pf-tour__link pf-tour__link--previous" href="' +
                adjacent.previous.href +
                '"><span class="pf-tour__hint">Previous</span><span>' +
                adjacent.previous.label +
                '</span></a>';
        }
        if (adjacent.next) {
            html +=
                '<a class="pf-tour__link pf-tour__link--next" href="' +
                adjacent.next.href +
                '"><span class="pf-tour__hint">Next</span><span>' +
                adjacent.next.label +
                '</span></a>';
        }
        container.innerHTML = html;
    }

    function stampYear() {
        var slots = document.querySelectorAll('[data-current-year]');
        Array.prototype.forEach.call(slots, function (slot) {
            slot.textContent = String(new Date().getFullYear());
        });
    }

    var activeKey = markActiveNavLink();
    setupMobileNav();
    setupThemeToggle();
    setupReveal();
    setupTour(activeKey);
    stampYear();
})();
