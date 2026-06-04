// header specific logic

// ─── Active nav link based on current page ───────────────────────────────────
(function setActiveNavLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    const pageMap = {
        'index.html':    'nav-home',
        '':              'nav-home',
        'projects.html': 'nav-projects',
        'services.html': 'nav-services',
    };

    const activeId = pageMap[page];
    if (activeId) {
        const link = document.getElementById(activeId);
        if (link) link.classList.add('active');
    }
})();

// ─── Hamburger / mobile menu ──────────────────────────────────────────────────
(function initMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger');
    const mobileMenuEl = document.querySelector('.mobile-menu');
    const overlayEl    = document.querySelector('.mobile-menu-overlay');
    const closeBtn     = document.querySelector('.close-menu');

    function openMenu()  { mobileMenuEl?.classList.add('open');    overlayEl?.classList.add('open'); }
    function closeMenu() { mobileMenuEl?.classList.remove('open'); overlayEl?.classList.remove('open'); }

    hamburgerBtn?.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    overlayEl?.addEventListener('click', closeMenu);
})();
