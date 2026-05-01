(function () {
    /* ── 1. Apply saved theme ASAP to avoid flash ── */
    var root = document.documentElement;
    var saved = localStorage.getItem('mia-theme') || 'light';
    root.setAttribute('data-theme', saved);

    /* ── 2. Preloader ── */
    function initPreloader() {
        var pl = document.getElementById('pl');
        if (!pl) return;
        setTimeout(function () { pl.classList.add('fade-out'); }, 900);
        setTimeout(function () { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 1650);
    }

    /* ── 3. Theme toggle button ── */
    function initToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        var current = root.getAttribute('data-theme') || 'light';
        btn.setAttribute('data-label', current === 'dark' ? 'Mode clair' : 'Mode sombre');
        btn.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');

        btn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('mia-theme', next);
            btn.setAttribute('data-label', next === 'dark' ? 'Mode clair' : 'Mode sombre');
            btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        });
    }

    /* ── 4. Navbar active link ── */
    function initNavActive() {
        var links = document.querySelectorAll('nav a[href]');
        var path = window.location.pathname;
        links.forEach(function (a) {
            try {
                var url = new URL(a.href);
                if (url.pathname === path || (path !== '/' && url.pathname !== '/' && path.startsWith(url.pathname))) {
                    a.classList.add('nav-active');
                }
            } catch (e) { /* ignore */ }
        });
    }

    /* ── 5. Reveal on scroll (global fallback if page script didn't init) ── */
    function initReveal() {
        if (!window.IntersectionObserver) return;
        var items = document.querySelectorAll('.reveal:not([data-observed])');
        if (!items.length) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });
        items.forEach(function (el) {
            el.setAttribute('data-observed', '1');
            obs.observe(el);
        });
    }

    /* ── Bootstrap on DOMContentLoaded ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initToggle();
            initNavActive();
            initReveal();
            initPreloader();
        });
    } else {
        initToggle();
        initNavActive();
        initReveal();
        initPreloader();
    }
})();
