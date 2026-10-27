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

    /* Toast ------------------------------------------------------------- */
    const toastEl = document.getElementById('toast-el');
    const toastBody = document.getElementById('toast-body');
    const toastClose = document.getElementById('toast-close');
    let toastTimer;

    function hideToast() {
        if (!toastEl) {
            return;
        }

        toastEl.classList.remove('is-visible', 'is-loading');
        toastEl.setAttribute('aria-busy', 'false');
    }

    /**
     * @param {string} message
     * @param {'error'|'success'|'info'} tone
     * @param {{ duration?: number, loading?: boolean }} options
     */
    function showToast(message, tone = 'error', options = {}) {
        if (!toastEl || !toastBody) {
            return;
        }

        const duration = options.duration ?? 4500;

        toastBody.textContent = message;
        toastEl.classList.remove('is-success', 'is-info', 'is-loading');
        toastEl.classList.toggle('is-success', tone === 'success');
        toastEl.classList.toggle('is-info', tone === 'info');
        toastEl.classList.toggle('is-loading', Boolean(options.loading));
        toastEl.classList.add('is-visible');
        toastEl.setAttribute('aria-busy', options.loading ? 'true' : 'false');

        clearTimeout(toastTimer);

        if (duration > 0) {
            toastTimer = setTimeout(hideToast, duration);
        }
    }

    window.showToast = showToast;

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            clearTimeout(toastTimer);
            hideToast();
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

    /* Contact form ------------------------------------------------------ */
    const contactForm = document.querySelector('[data-contact-form]');

    if (contactForm) {
        const submitButton = contactForm.querySelector('[type="submit"]');
        const submitLabel = contactForm.querySelector('[data-contact-submit-label]');

        function setSubmitting(isSubmitting) {
            if (submitButton) {
                submitButton.disabled = isSubmitting;
                submitButton.classList.toggle('is-loading', isSubmitting);
                submitButton.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
            }

            if (submitLabel) {
                submitLabel.textContent = isSubmitting ? 'Sending…' : 'Send message';
            }
        }

        function clearFieldErrors() {
            contactForm.querySelectorAll('.is-invalid').forEach((field) => {
                field.classList.remove('is-invalid');
            });

            contactForm.querySelectorAll('.invalid-feedback').forEach((feedback) => {
                feedback.remove();
            });
        }

        function showFieldErrors(errors) {
            let firstInvalidField = null;

            Object.entries(errors || {}).forEach(([name, messages]) => {
                const field = contactForm.elements.namedItem(name);

                if (!field) {
                    return;
                }

                field.classList.add('is-invalid');

                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = Array.isArray(messages) ? messages[0] : String(messages);
                field.insertAdjacentElement('afterend', feedback);

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            });

            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }

        function clearSessionAlerts() {
            const card = contactForm.closest('.contact-form-card');

            if (!card) {
                return;
            }

            card.querySelectorAll('.site-alert').forEach((alert) => {
                alert.remove();
            });
        }

        function waitForLoadingToast(startedAt) {
            const minimumVisibleTime = 600;
            const remaining = minimumVisibleTime - (Date.now() - startedAt);

            return remaining > 0
                ? new Promise((resolve) => setTimeout(resolve, remaining))
                : Promise.resolve();
        }

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (submitButton && submitButton.disabled) {
                return;
            }

            setSubmitting(true);
            clearFieldErrors();
            showToast('Sending your message…', 'info', { loading: true, duration: 0 });

            const startedAt = Date.now();
            const tokenField = contactForm.elements.namedItem('_token');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': tokenField ? tokenField.value : '',
                    },
                    body: new FormData(contactForm),
                    credentials: 'same-origin',
                });

                const data = await response.json().catch(() => ({}));

                await waitForLoadingToast(startedAt);

                if (response.ok) {
                    contactForm.reset();
                    clearFieldErrors();
                    clearSessionAlerts();
                    showToast(data.message || 'Thanks! Your message has been sent.', 'success', { duration: 6000 });

                    return;
                }

                if (response.status === 422) {
                    const errors = data.errors || {};
                    const firstError = Object.values(errors)[0];

                    showFieldErrors(errors);
                    showToast(
                        Array.isArray(firstError) ? firstError[0] : 'Please check the highlighted fields and try again.',
                        'error',
                        { duration: 6000 }
                    );

                    return;
                }

                if (response.status === 419) {
                    showToast('Your session expired. Please refresh the page and try again.', 'error', { duration: 7000 });

                    return;
                }

                showToast(
                    data.message || 'Sorry, your message could not be sent. Please try again in a few minutes.',
                    'error',
                    { duration: 7000 }
                );
            } catch (error) {
                await waitForLoadingToast(startedAt);
                showToast('Network error. Please check your connection and try again.', 'error', { duration: 7000 });
            } finally {
                setSubmitting(false);
            }
        });
    }
})();
