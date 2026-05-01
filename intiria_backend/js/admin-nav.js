/**
 * INTIRIA BACKEND — admin-nav.js
 * Sidebar nav item click → scroll to section + highlight active
 */
(function () {
    const navItems = document.querySelectorAll('#ibSidebarNav .ib-sidebar-nav__item[data-target]');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active from all
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');

            // Scroll to target section
            const targetId = this.dataset.target;
            const target   = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Auto-open the card if collapsed
                const card = target.querySelector('.ib-editor-card');
                if (card && !card.classList.contains('is-open')) {
                    card.classList.add('is-open');
                }
            }

            // Close mobile sidebar after click
            if (window.innerWidth <= 900) {
                const sidebar = document.getElementById('ibAdminSidebar');
                const overlay = document.getElementById('ibSidebarOverlay');
                sidebar && sidebar.classList.remove('mobile-open');
                overlay && overlay.classList.remove('active');
            }
        });
    });

    // ─── Restore all saved section data after sections are loaded ───
    const sections = ['hero','header','kpi','benefits','pricing','studio','industrial','quotes','quote_content_res','quote_content_com','quote_content_ind','cta','footer'];
    sections.forEach(s => {
        if (typeof window.ibRestoreSection === 'function') {
            window.ibRestoreSection(s);
        }
    });
})();
