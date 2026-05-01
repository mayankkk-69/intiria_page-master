/**
 * ib-admin-header — header-editor.js
 * Adds new nav item rows dynamically
 */
(function () {
    const addNavBtn = document.getElementById('ib-header-add-nav');
    const navList   = document.getElementById('ib-header-nav-list');

    if (addNavBtn && navList) {
        addNavBtn.addEventListener('click', function () {
            const div = document.createElement('div');
            div.className = 'ib-list-item';
            div.innerHTML = `
                <span class="ib-list-item__drag"><i class="fas fa-grip-vertical"></i></span>
                <input type="text" placeholder="Label">
                <input type="text" placeholder="URL / anchor" style="width:220px;max-width:45%;">
                <span class="ib-list-item__del"><i class="fas fa-times"></i></span>`;
            navList.appendChild(div);
            div.querySelector('input').focus();
        });
    }

    if (typeof window.ibRestoreSection === 'function') window.ibRestoreSection('header');
})();
