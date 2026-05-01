/**
 * INTIRIA backend - sidebar toggle and mobile overlay.
 * Uses delegated events because the sidebar markup is loaded dynamically.
 */
(function () {
    document.addEventListener('click', function (event) {
        const toggleBtn = event.target.closest('#ibSidebarToggle');
        if (toggleBtn) {
            const sidebar = document.getElementById('ibAdminSidebar');
            const mainPanel = document.getElementById('ib-admin-main');
            const overlay = document.getElementById('ibSidebarOverlay');

            if (!sidebar) return;

            if (window.innerWidth <= 900) {
                sidebar.classList.toggle('mobile-open');
                overlay && overlay.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
                mainPanel && mainPanel.classList.toggle('sidebar-collapsed');
            }
            return;
        }

        const overlay = event.target.closest('#ibSidebarOverlay');
        if (overlay) {
            const sidebar = document.getElementById('ibAdminSidebar');
            sidebar && sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    });
})();
