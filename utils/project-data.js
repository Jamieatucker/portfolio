(function (root, factory) {
    var api = factory(
        typeof module === 'object' && module.exports
            ? require('./resume-data.js')
            : root.ResumeData
    );
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.ProjectData = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (ResumeData) {
    'use strict';

    /**
     * Case studies shown on the projects page. `roleId` links a project back to
     * the EXPERIENCE entry it shipped under (null for personal work) so the
     * projects page can render provenance without duplicating job metadata.
     * `featured: true` promotes the project to the home page.
     */
    var PROJECTS = [
        {
            id: 'playables-client-architecture',
            name: 'Playables Game Creation',
            roleId: 'youtube-playables',
            category: 'Client Architecture',
            featured: true,
            problem:
                'A flagship generative AI game creation product had no client foundation, ' +
                'and multiple teams needed to ship into it at once.',
            approach:
                'Designed a multi-page client architecture from scratch with clear module ' +
                'boundaries, then layered client-side state management for dynamic game ' +
                'assets and generated code files.',
            outcome:
                'Shipped creation tools to 1,000+ creators, cut initial load times, lowered ' +
                'memory overhead, and accelerated cross-functional feature delivery.',
            tags: ['TypeScript', 'React', 'SASS', 'Gemini', 'RESTful APIs']
        },
        {
            id: 'creator-verification-flow',
            name: 'Creator Verification Flow',
            roleId: 'google-search-intelligence',
            category: 'Front-End Product',
            featured: true,
            problem:
                'Creators linking social accounts to Search dropped out of a confusing, ' +
                'multi-step onboarding flow.',
            approach:
                'Engineered an intuitive front-end verification flow and overhauled its ' +
                'usability and accessibility with UX research from 10,000+ creators.',
            outcome:
                'Streamlined account linking for 1M+ creators and improved onboarding ' +
                'conversion and engagement.',
            tags: ['TypeScript', 'React', 'HTML/CSS', 'Kotlin']
        },
        {
            id: 'verification-design-system',
            name: 'Verification Component Library',
            roleId: 'google-search-intelligence',
            category: 'Design Systems',
            featured: true,
            problem:
                'Verification surfaces were rebuilt per team, producing inconsistent UI and ' +
                'duplicated code.',
            approach:
                'Authored a reusable UI component library of 30+ elements with shared ' +
                'accessibility and styling contracts.',
            outcome:
                'Consistent verification flows across surfaces and a measurably more ' +
                'maintainable codebase with less redundancy.',
            tags: ['TypeScript', 'React', 'SASS', 'HTML/CSS']
        },
        {
            id: 'discover-notes',
            name: 'Google Discover \u2018Notes\u2019',
            roleId: 'google-modern-creators',
            category: 'Consumer Launch',
            featured: true,
            problem:
                'Discover readers had no way to react to articles in real time, and drafts ' +
                'were published without a preview of the final render.',
            approach:
                'Built a pre-publish client state validation layer for live content previews ' +
                'and a dynamic grid layout architecture that aggregates real-time note clusters.',
            outcome:
                'Supported a launch engaging 1M+ users across the US and India, with higher ' +
                'post completion rates and improved feed quality.',
            tags: ['Java', 'Kotlin', 'JavaScript', 'HTML/CSS']
        },
        {
            id: 'trending-search-badges',
            name: 'Trending Search Badge Labels',
            roleId: 'google-search-intelligence',
            category: 'Search Experience',
            featured: false,
            problem:
                'Strong results below the fold went unnoticed because nothing signalled ' +
                'that they were trending.',
            approach:
                'Developed horizontal search badge labels that surface trending results ' +
                'inline within the results page.',
            outcome:
                'Boosted lower-page visibility and increased click-through rates for 3M+ ' +
                'US users.',
            tags: ['TypeScript', 'Java', 'HTML/CSS']
        },
        {
            id: 'dining-experiment',
            name: 'Top-Rated Dining Live Experiment',
            roleId: 'google-search-intelligence',
            category: 'Data & Experimentation',
            featured: false,
            problem:
                'Identifying genuinely top-rated restaurants at national scale required ' +
                'evidence, not intuition.',
            approach:
                'Led a live experiment analysing signals from 1,000+ restaurants across ' +
                'the United States.',
            outcome:
                'Produced a ranked view of top-rated dining establishments that informed ' +
                'the surface\u2019s recommendations.',
            tags: ['SQL', 'Java']
        },
        {
            id: 'notes-visual-regression',
            name: 'User-Generated Visual Validation',
            roleId: 'google-modern-creators',
            category: 'Quality Engineering',
            featured: false,
            problem:
                'User-uploaded imagery could render incorrectly across markets with no ' +
                'automated safety net.',
            approach:
                'Conducted automated image comparison tests over user visuals as part of ' +
                'the release process.',
            outcome:
                'Reached 95%+ accuracy validating user-generated content display before ' +
                'launch.',
            tags: ['Java', 'Git']
        },
        {
            id: 'portfolio-site',
            name: 'This Portfolio Site',
            roleId: null,
            category: 'Personal',
            featured: false,
            problem:
                'My work lived in a PDF, which cannot show how I structure a front end.',
            approach:
                'Built a dependency-free single-page static site where all content comes from ' +
                'one UMD data module shared by the browser and Node unit tests.',
            outcome:
                'Zero-build, zero-runtime-dependency site with unit-tested navigation, ' +
                'filtering, and theming logic.',
            tags: ['JavaScript', 'HTML/CSS', 'Git']
        }
    ];

    function getFeaturedProjects(projects) {
        var list = Array.isArray(projects) ? projects : PROJECTS;
        return list.filter(function (project) {
            return project && project.featured === true;
        });
    }

    function getProjectsByRoleId(roleId, projects) {
        var list = Array.isArray(projects) ? projects : PROJECTS;
        return list.filter(function (project) {
            return project && project.roleId === roleId;
        });
    }

    /** Company/team label for a project's originating role, or 'Personal project'. */
    function describeProvenance(project, roles) {
        var list = Array.isArray(roles) ? roles : (ResumeData ? ResumeData.EXPERIENCE : []);
        if (!project || !project.roleId) return 'Personal project';
        for (var i = 0; i < list.length; i += 1) {
            if (list[i].id === project.roleId) {
                return list[i].company + ' \u00b7 ' + list[i].team;
            }
        }
        return 'Personal project';
    }

    /**
     * Referential integrity guard: every non-personal project must point at a
     * real role id. Returns the list of offending project ids (empty = valid).
     */
    function findOrphanProjects(projects, roles) {
        var projectList = Array.isArray(projects) ? projects : PROJECTS;
        var roleList = Array.isArray(roles) ? roles : (ResumeData ? ResumeData.EXPERIENCE : []);
        var roleIds = roleList.map(function (role) {
            return role.id;
        });
        return projectList
            .filter(function (project) {
                return project.roleId !== null && roleIds.indexOf(project.roleId) === -1;
            })
            .map(function (project) {
                return project.id;
            });
    }

    return {
        PROJECTS: PROJECTS,
        getFeaturedProjects: getFeaturedProjects,
        getProjectsByRoleId: getProjectsByRoleId,
        describeProvenance: describeProvenance,
        findOrphanProjects: findOrphanProjects
    };
});
