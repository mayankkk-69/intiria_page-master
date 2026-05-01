/**
 * ib-admin-kpi — kpi-editor.js
 * Validates numeric inputs and restores saved data
 */
(function () {
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`ib-kpi-num-${i}`);
        if (input) {
            input.addEventListener('input', function () {
                if (this.value < 0) this.value = 0;
            });
        }
    }
    if (typeof window.ibRestoreSection === 'function') window.ibRestoreSection('kpi');
})();
