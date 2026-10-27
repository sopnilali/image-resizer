(function () {
    'use strict';

    const THEME_KEY = 'image-resizer-theme';
    const root = document.documentElement;

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = String(new Date().getFullYear());
    }

    if (window.AOS) {
        AOS.init({
            duration: 650,
            once: true,
            easing: 'ease-out-cubic',
            offset: 48,
            delay: 0
        });
    }

    /* Theme ------------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        const nextTheme = theme === 'light' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);

        if (!themeToggle) {
            return;
        }

        const isDark = nextTheme === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
        themeToggle.innerHTML = isDark
            ? '<i class="bx bx-sun" aria-hidden="true"></i>'
            : '<i class="bx bx-moon" aria-hidden="true"></i>';
    }

    applyTheme(root.getAttribute('data-theme'));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'dark' ? 'light' : 'dark';

            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (error) {
                /* Storage can be unavailable in private mode. */
            }

            applyTheme(next);
        });
    }

    /* Header ------------------------------------------------------------ */
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('site-nav-toggle');
    const mobileNav = document.getElementById('site-mobile-nav');

    function syncHeaderState() {
        if (!header) {
            return;
        }

        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });

    function closeMobileNav() {
        if (!navToggle || !mobileNav) {
            return;
        }

        mobileNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navToggle.innerHTML = '<i class="bx bx-menu" aria-hidden="true"></i>';
    }

    function openMobileNav() {
        if (!navToggle || !mobileNav) {
            return;
        }

        mobileNav.classList.add('is-open');
        navToggle.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close menu');
        navToggle.innerHTML = '<i class="bx bx-x" aria-hidden="true"></i>';
    }

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            if (mobileNav.classList.contains('is-open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        mobileNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileNav);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileNav();
            }
        });

        document.addEventListener('click', (event) => {
            if (!header || !header.contains(event.target)) {
                closeMobileNav();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 991.98) {
                closeMobileNav();
            }
        });
    }
})();
