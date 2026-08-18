(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.ResumeData = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var MONTHS = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    var PROFILE = {
        name: 'Jamie Tucker',
        title: 'Full-Stack Software Engineer',
        location: 'Sunnyvale, CA',
        email: 'jamieatucker4@gmail.com',
        linkedin: 'https://linkedin.com/in/jamieatucker',
        resumePath: './media/docs/jamie-tucker-resume.pdf',
        photoPath: './media/images/pro_headshot.jpeg',
        headline: 'I build the interfaces behind products used by millions.',
        summary:
            'Full-stack engineer with three years at Google and YouTube shipping ' +
            'client architecture for flagship products, including a generative AI ' +
            'game creation suite and search experiences serving millions of users.',
        availability: 'Open to full-stack and front-end engineering roles.'
    };

    /**
     * Matt Farley–style triad on About. Titles match the former "What I do"
     * cards. `metrics` are IMPACT_METRICS values nested as bullet proof points.
     */
    var APPROACH_TRIAD = [
        {
            id: 'triad-architecture',
            title: 'Stand up client architecture',
            summary:
                'I have twice designed a multi-page client from scratch — once for a ' +
                'flagship generative AI product — choosing module boundaries that let ' +
                'several teams ship in parallel.',
            metrics: [{ value: '30+', label: 'components in a design system I authored' }]
        },
        {
            id: 'triad-performance',
            title: 'Make big surfaces fast',
            summary:
                'State management for dynamic assets and generated code, grid layouts that ' +
                'aggregate real-time clusters, and rendering paths tuned for global scale.',
            metrics: [{ value: '3M+', label: 'users reached by shipped Search features' }]
        },
        {
            id: 'triad-research',
            title: 'Turn research into UI',
            summary:
                'UX research sessions and creator feedback translated into component ' +
                'libraries, accessibility fixes, and telemetry that proves the journey works.',
            metrics: [
                { value: '1M+', label: 'creators served by front-end flows I built' },
                { value: '90%+', label: 'telemetry logging reliability delivered' }
            ]
        }
    ];

    var EDUCATION = [
        {
            school: 'The Ohio State University',
            degree: 'B.S. Computer Science and Engineering',
            location: 'Columbus, OH',
            start: { year: 2019, month: 8 },
            end: { year: 2023, month: 5 },
            activities: [
                'National Society of Black Engineers',
                'Lambda Psi Engineering Honorary',
                'Morrill Scholars Program'
            ]
        }
    ];

    /**
     * Roles are stored newest-first with structured start/end months so that
     * durations and date labels are derived rather than hand-written.
     * `tags` drive the experience page filter and must match SKILLS entries.
     */
    var EXPERIENCE = [
        {
            id: 'youtube-playables',
            company: 'YouTube',
            team: 'Playables Game Creation',
            role: 'Full-Stack Software Engineer',
            location: 'Mountain View, CA',
            start: { year: 2025, month: 10 },
            end: { year: 2026, month: 7 },
            summary:
                'Owned end-to-end client infrastructure for a flagship generative AI ' +
                'game creation product used by creators across the US.',
            highlights: [
                'Established end-to-end client infrastructure for a flagship generative AI product, driving robust game creation tools for over 1,000 creators across the US.',
                'Designed a multi-page client architecture from scratch, increasing code modularity and accelerating cross-functional feature delivery speed.',
                'Engineered client-side state management for dynamic game assets and code files, reducing initial load times and minimizing memory overhead.',
                'Synthesized user feedback from 30+ UX research sessions and design reviews to refine core principles, driving the UI architecture for the flagship product.',
                'Implemented telemetry flows across critical user journeys, achieving 90%+ logging reliability for key UI elements.'
            ],
            tags: ['Gemini', 'TypeScript', 'React', 'SASS', 'RESTful APIs', 'C++', 'SQL']
        },
        {
            id: 'google-search-intelligence',
            company: 'Google',
            team: 'Search Intelligence',
            role: 'Full-Stack Software Engineer',
            location: 'Mountain View, CA',
            start: { year: 2024, month: 7 },
            end: { year: 2025, month: 10 },
            summary:
                'Built verification and discovery surfaces in Search for creators and ' +
                'millions of daily users.',
            highlights: [
                'Engineered an intuitive front-end verification flow, streamlining social account linking for 1M+ creators and improving onboarding conversion.',
                'Collaborated with UX researchers and designers to overhaul the UI architecture\u2019s usability and accessibility using feedback from 10,000+ creators, increasing user engagement.',
                'Developed a reusable UI component library with 30+ elements to create consistent verification flows, improving maintainability by reducing redundancy.',
                'Led a live experiment analyzing data from 1,000+ restaurants across the United States to identify top-rated dining establishments.',
                'Developed horizontal search badge labels to highlight trending results, boosting lower-page visibility and increasing click-through rates for 3M+ US users.'
            ],
            tags: ['TypeScript', 'React', 'Kotlin', 'Java', 'HTML/CSS']
        },
        {
            id: 'google-modern-creators',
            company: 'Google',
            team: 'Modern Creators and Formats',
            role: 'Front-End Software Engineer',
            location: 'Mountain View, CA',
            start: { year: 2023, month: 10 },
            end: { year: 2024, month: 7 },
            summary:
                'Helped launch Google Discover \u2018Notes\u2019, a real-time article feedback ' +
                'surface for readers in the US and India.',
            highlights: [
                'Supported the release of the Google Discover \u2018Notes\u2019 feature, engaging 1M+ users in the US and India with real-time article feedback.',
                'Developed a pre-publish client state validation layer on Discover to render live content previews, driving higher post completion rates and improving feed quality.',
                'Engineered dynamic grid layout architecture to aggregate real-time \u2018Notes\u2019 clusters, optimizing client-side rendering for 1M+ active users across global markets.',
                'Conducted image comparison tests on user visuals using automated testing tools, achieving 95%+ accuracy in validating user-generated content display.'
            ],
            tags: ['Java', 'Kotlin', 'HTML/CSS', 'JavaScript', 'Git']
        }
    ];

    var SKILL_GROUPS = [
        {
            id: 'languages',
            label: 'Languages',
            skills: ['TypeScript', 'Java', 'HTML/CSS', 'JavaScript', 'Kotlin', 'SQL', 'C++', 'Python']
        },
        {
            id: 'frameworks',
            label: 'Frameworks & Libraries',
            skills: ['React', 'SASS', 'Tailwind CSS', 'RESTful APIs', 'Next.js']
        },
        {
            id: 'ai',
            label: 'AI & Emerging Tech',
            skills: ['Gemini', 'Artificial Intelligence (AI)', 'Prompt Engineering', 'Generative AI']
        },
        {
            id: 'craft',
            label: 'Engineering Craft',
            skills: [
                'Client Architecture',
                'State Management',
                'Design Systems',
                'Accessibility',
                'CI/CD Pipelines',
                'Telemetry & Logging',
                'Version Control',
                'Git'
            ]
        }
    ];

    /**
     * Headline numbers for the home page hook. Every figure traces back to a
     * bullet in EXPERIENCE so the site never overstates the resume.
     */
    var IMPACT_METRICS = [
        { value: '3M+', label: 'users reached by shipped Search features' },
        { value: '1M+', label: 'creators served by front-end flows I built' },
        { value: '30+', label: 'components in a design system I authored' },
        { value: '90%+', label: 'telemetry logging reliability delivered' }
    ];

    function isValidMonthPart(part) {
        return (
            part &&
            typeof part === 'object' &&
            typeof part.year === 'number' &&
            typeof part.month === 'number' &&
            part.month >= 1 &&
            part.month <= 12
        );
    }

    /** Convert a {year, month} pair into absolute months for date math. */
    function toAbsoluteMonths(part) {
        if (!isValidMonthPart(part)) {
            throw new Error('Expected a {year, month} object with month in 1-12');
        }
        return part.year * 12 + (part.month - 1);
    }

    function formatMonthYear(part) {
        if (!isValidMonthPart(part)) {
            throw new Error('Expected a {year, month} object with month in 1-12');
        }
        return MONTHS[part.month - 1] + ' ' + part.year;
    }

    /** `end: null` renders as "Present" so current roles need no maintenance. */
    function formatDateRange(start, end) {
        return formatMonthYear(start) + ' \u2013 ' + (end ? formatMonthYear(end) : 'Present');
    }

    function monthsBetween(start, end) {
        var span = toAbsoluteMonths(end) - toAbsoluteMonths(start);
        return span < 0 ? 0 : span;
    }

    function formatDuration(start, end) {
        var months = monthsBetween(start, end);
        var years = Math.floor(months / 12);
        var remainder = months % 12;
        var parts = [];
        if (years > 0) parts.push(years + (years === 1 ? ' yr' : ' yrs'));
        if (remainder > 0) parts.push(remainder + ' mo');
        return parts.length ? parts.join(' ') : '0 mo';
    }

    /**
     * Total professional experience across all roles, rounded down to the
     * nearest half year so the site never inflates tenure.
     */
    function getTotalYearsExperience(roles, referenceDate) {
        var list = Array.isArray(roles) ? roles : EXPERIENCE;
        var ref = referenceDate instanceof Date ? referenceDate : new Date();
        var refPart = { year: ref.getFullYear(), month: ref.getMonth() + 1 };
        var months = list.reduce(function (total, role) {
            return total + monthsBetween(role.start, role.end || refPart);
        }, 0);
        return Math.floor((months / 12) * 2) / 2;
    }

    /** De-duplicated, alphabetised tag list used to build filter controls. */
    function getAllSkillTags(roles) {
        var list = Array.isArray(roles) ? roles : EXPERIENCE;
        var seen = Object.create(null);
        var tags = [];
        list.forEach(function (role) {
            (role.tags || []).forEach(function (tag) {
                var key = String(tag).toLowerCase();
                if (!seen[key]) {
                    seen[key] = true;
                    tags.push(tag);
                }
            });
        });
        return tags.sort(function (a, b) {
            return a.localeCompare(b);
        });
    }

    return {
        MONTHS: MONTHS,
        PROFILE: PROFILE,
        EDUCATION: EDUCATION,
        EXPERIENCE: EXPERIENCE,
        SKILL_GROUPS: SKILL_GROUPS,
        IMPACT_METRICS: IMPACT_METRICS,
        APPROACH_TRIAD: APPROACH_TRIAD,
        formatMonthYear: formatMonthYear,
        formatDateRange: formatDateRange,
        monthsBetween: monthsBetween,
        formatDuration: formatDuration,
        getTotalYearsExperience: getTotalYearsExperience,
        getAllSkillTags: getAllSkillTags
    };
});
