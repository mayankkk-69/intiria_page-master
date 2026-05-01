/**
 * ib-admin-hero — hero-editor.js
 * Syncs video path preview label on input change
 */
(function () {
    const videoPathInput = document.getElementById('ib-hero-video-path');
    const videoPreview   = document.getElementById('ib-hero-video-preview');

    if (videoPathInput && videoPreview) {
        videoPathInput.addEventListener('input', function () {
            videoPreview.textContent = 'Current: ' + (this.value || '—');
        });
    }

    // Restore saved data
    if (typeof window.ibRestoreSection === 'function') window.ibRestoreSection('hero');
})();
