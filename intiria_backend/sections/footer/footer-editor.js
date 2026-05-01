/**
 * ib-admin-footer — footer-editor.js
 * Dynamic footer link adding and restore
 */
(function () {
    const addBtn = document.getElementById('ib-footer-add-link');
    const list   = document.getElementById('ib-footer-links-list');

    if (addBtn && list) {
        addBtn.addEventListener('click', function () {
            const div = document.createElement('div');
            div.className = 'ib-list-item';
            div.innerHTML = `
                <span class="ib-list-item__drag"><i class="fas fa-grip-vertical"></i></span>
                <input type="text" placeholder="Label">
                <input type="text" placeholder="URL" style="width:260px;max-width:50%;">
                <span class="ib-list-item__del"><i class="fas fa-times"></i></span>`;
            list.appendChild(div);
            div.querySelector('input').focus();
        });
    }

    if (typeof window.ibRestoreSection === 'function') window.ibRestoreSection('footer');
})();
