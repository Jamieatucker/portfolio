(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.SiteNav = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    /**
     * Single source of truth for the primary navigation. The order here is the
     * order rendered in every page header and in the footer sitemap.
     * `href` values are root-absolute so any page can link to any other page.
     */
    var NAV_LINKS = [
        { key: 'home', label: 'Home', href: '/index.html' },
        { key: 'about', label: 'About', href: '/pages/about/html/about.html' },
        { key: 'experience', label: 'Experience', href: '/pages/experience/html/experience.html' },
        { key: 'projects', label: 'Projects', href: '/pages/projects/html/projects.html' },
        { key: 'skills', label: 'Skills', href: '/pages/skills/html/skills.html' },
        { key: 'contact', label: 'Contact', href: '/pages/contact/html/contact.html' }
    ];

    var HOME_KEY = 'home';

    /**
     * Strip query strings, hashes, and a trailing slash so that `/about/`,
     * `/about?utm=x`, and `/about#top` all normalise to the same path.
     * Returns '/' for empty or non-string input.
     */
    function normalizePath(pathname) {
        if (typeof pathname !== 'string') return '/';
        var path = pathname.split('#')[0].split('?')[0].trim();
        if (!path) return '/';
        if (path.charAt(0) !== '/') path = '/' + path;
        path = path.replace(/\/{2,}/g, '/');
        if (path.length > 1 && path.charAt(path.length - 1) === '/') {
            path = path.slice(0, -1);
        }
        return path.toLowerCase();
    }

    /**
     * Map a browser pathname to a nav key. Directory-style URLs served by a
     * static host ('/', '/pages/about/html/') resolve the same as explicit
     * '.html' URLs. Unknown paths return null so no link is falsely activated.
     */
    function resolveActiveNavKey(pathname) {
        var path = normalizePath(pathname);
        if (path === '/' || path === '/index' || path === '/index.html') {
            return HOME_KEY;
        }
        for (var i = 0; i < NAV_LINKS.length; i += 1) {
            var link = NAV_LINKS[i];
            if (link.key === HOME_KEY) continue;
            var linkPath = normalizePath(link.href);
            var directory = linkPath.replace(/\/[^/]+\.html$/, '');
            if (path === linkPath || path === directory || path === linkPath.replace(/\.html$/, '')) {
                return link.key;
            }
        }
        return null;
    }

    function getNavLink(key) {
        for (var i = 0; i < NAV_LINKS.length; i += 1) {
            if (NAV_LINKS[i].key === key) return NAV_LINKS[i];
        }
        return null;
    }

    /**
     * Previous/next links for the "keep reading" footer control, letting a
     * recruiter walk the whole site without returning to the nav.
     * Home is excluded from the tour; ends of the tour return null.
     */
    function getAdjacentLinks(key) {
        var tour = NAV_LINKS.filter(function (link) {
            return link.key !== HOME_KEY;
        });
        var index = -1;
        tour.forEach(function (link, i) {
            if (link.key === key) index = i;
        });
        if (index === -1) return { previous: null, next: null };
        return {
            previous: index > 0 ? tour[index - 1] : null,
            next: index < tour.length - 1 ? tour[index + 1] : null
        };
    }

    return {
        NAV_LINKS: NAV_LINKS,
        HOME_KEY: HOME_KEY,
        normalizePath: normalizePath,
        resolveActiveNavKey: resolveActiveNavKey,
        getNavLink: getNavLink,
        getAdjacentLinks: getAdjacentLinks
    };
});
