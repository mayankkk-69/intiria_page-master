/**
 * ib-admin-benefits — benefits-editor.js
 * Dynamic benefit item add and restore
 */
(function () {
    const addBtn = document.getElementById('ib-ben-add');
    const list   = document.getElementById('ib-ben-list');

    if (addBtn && list) {
        addBtn.addEventListener('click', function () {
            const div = document.createElement('div');
            div.className = 'ib-list-item';
            div.innerHTML = `
                <span class="ib-list-item__drag"><i class="fas fa-grip-vertical"></i></span>
                <input type="text" placeholder="fa-icon-class" style="max-width:160px;">
                <input type="text" placeholder="Benefit title">
                <span class="ib-list-item__del"><i class="fas fa-times"></i></span>`;
            list.appendChild(div);
            div.querySelector('input').focus();
        });
    }

    if (typeof window.ibRestoreSection === 'function') window.ibRestoreSection('benefits');
})();
