/**
 * INTIRIA BACKEND — admin-core.js
 * Core utilities: toast, card accordion, save/reset dispatchers
 */

// ─── Toast Notification ───────────────────────────────────
function ibShowToast(msg = 'Changes saved!', type = 'success') {
    const toast = document.getElementById('ibAdminToast');
    const msgEl = document.getElementById('ibAdminToastMsg');
    if (!toast) return;
    msgEl.textContent = msg;
    toast.style.borderColor = type === 'error' ? 'var(--ib-red)' : 'var(--ib-success)';
    toast.style.color       = type === 'error' ? 'var(--ib-red)' : 'var(--ib-success)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Card Accordion ──────────────────────────────────────
document.addEventListener('click', function (e) {
    const head = e.target.closest('[data-card]');
    if (!head) return;
    const cardId = head.dataset.card;
    const card   = document.getElementById(cardId);
    if (card) card.classList.toggle('is-open');
});

// Add small contextual icons to form labels and group headings.
window.ibDecorateAdminIcons = function (root = document) {
    const iconRules = [
        { terms: ['phone', 'mobile', 'call', 'whatsapp'], icon: 'fa-phone' },
        { terms: ['email', 'mail'], icon: 'fa-envelope' },
        { terms: ['url', 'link', 'anchor'], icon: 'fa-link' },
        { terms: ['video'], icon: 'fa-video' },
        { terms: ['image', 'photo', 'logo', 'gallery', 'background'], icon: 'fa-image' },
        { terms: ['path', 'file'], icon: 'fa-folder-open' },
        { terms: ['title', 'headline', 'heading', 'brand name'], icon: 'fa-heading' },
        { terms: ['description', 'subtitle', 'paragraph', 'summary', 'note', 'tagline', 'text', 'content'], icon: 'fa-align-left' },
        { terms: ['cta', 'button'], icon: 'fa-arrow-pointer' },
        { terms: ['icon'], icon: 'fa-icons' },
        { terms: ['price', 'pricing', 'plan', 'package', 'chip', 'cost', 'amount'], icon: 'fa-tag' },
        { terms: ['feature', 'benefit', 'item', 'list'], icon: 'fa-list-check' },
        { terms: ['count', 'number', 'value', 'kpi', 'stat'], icon: 'fa-hashtag' },
        { terms: ['color'], icon: 'fa-palette' },
        { terms: ['copyright'], icon: 'fa-copyright' },
        { terms: ['address', 'location'], icon: 'fa-location-dot' },
        { terms: ['section header', 'header'], icon: 'fa-layer-group' },
        { terms: ['contact'], icon: 'fa-address-book' },
        { terms: ['kicker'], icon: 'fa-bullhorn' },
    ];

    const getIcon = (text, fallback = 'fa-pen') => {
        const normalized = text.toLowerCase();
        const rule = iconRules.find(item => item.terms.some(term => normalized.includes(term)));
        return rule ? rule.icon : fallback;
    };

    const makeIcon = (className, icon) => {
        const span = document.createElement('span');
        span.className = className;
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = `<i class="fas ${icon}"></i>`;
        return span;
    };

    root.querySelectorAll('.ib-form-label').forEach(label => {
        if (label.querySelector('.ib-label-icon')) return;
        const labelFor = label.getAttribute('for') || '';
        const icon = getIcon(`${label.textContent} ${labelFor}`);
        label.prepend(makeIcon('ib-label-icon', icon));
    });

    root.querySelectorAll('.ib-row-label').forEach(label => {
        if (label.querySelector('.ib-row-label__icon')) return;
        const icon = getIcon(label.textContent, 'fa-layer-group');
        label.classList.add('has-icon');
        label.prepend(makeIcon('ib-row-label__icon', icon));
    });
};

// ─── Save dispatcher ─────────────────────────────────────
window.ibSaveSection = async function (section) {
    // Collect all inputs inside that section's editor card
    const card = document.getElementById(`ib-${section}-editor-card`);
    if (!card) return;

    const data = {};
    card.querySelectorAll('[id]').forEach(el => {
        if (el.id && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
            data[el.id] = el.type === 'checkbox' ? el.checked : el.value;
        }
    });

    try {
        const response = await fetch('api/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section: section, data: data })
        });
        
        const result = await response.json();
        
        if (result.success) {
            ibShowToast(`${section.charAt(0).toUpperCase() + section.slice(1)} section saved!`);
            console.log(`[INTIRIA Admin] Saved section: ${section}`, data);
        } else {
            ibShowToast('Error saving data: ' + result.message, 'error');
        }
    } catch (err) {
        console.error(err);
        ibShowToast('Failed to connect to server', 'error');
    }
};

// ─── Reset dispatcher ────────────────────────────────────
window.ibResetSection = function (section) {
    if (!confirm(`Reset all changes to the ${section} section? This cannot be undone.`)) return;
    // For now just clear localStorage fallback, the server-side reset would require a DELETE API
    localStorage.removeItem(`ib_section_${section}`);
    ibShowToast(`${section} section reset.`, 'success');
    location.reload();
};

// ─── Restore saved values on load ────────────────────────
// We load all data once globally to avoid 9 separate fetch calls
let ibGlobalDataCache = null;

window.ibRestoreSection = async function (section) {
    try {
        if (!ibGlobalDataCache) {
            const response = await fetch('api/save.php');
            if (response.ok) {
                ibGlobalDataCache = await response.json();
            } else {
                ibGlobalDataCache = {};
            }
        }
        
        const data = ibGlobalDataCache[section];
        if (!data) return;

        Object.entries(data).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (el.type === 'checkbox') el.checked = val;
            else el.value = val;
        });
    } catch (err) {
        console.warn('[INTIRIA Admin] Failed to restore section:', section, err);
    }
};

// ─── Dynamic List Item helpers ────────────────────────────
document.addEventListener('click', function (e) {
    // Delete list item
    const del = e.target.closest('.ib-list-item__del');
    if (del) {
        const item = del.closest('.ib-list-item');
        if (item) item.remove();
        return;
    }

    // Add list item via data-list button
    const addBtn = e.target.closest('.ib-list-add-btn[data-list]');
    if (addBtn) {
        const listId = addBtn.dataset.list;
        const list   = document.getElementById(listId);
        if (list) {
            const div = document.createElement('div');
            div.className = 'ib-list-item';
            div.innerHTML = `<span class="ib-list-item__drag"><i class="fas fa-grip-vertical"></i></span><input type="text" placeholder="New item..."><span class="ib-list-item__del"><i class="fas fa-times"></i></span>`;
            list.appendChild(div);
            div.querySelector('input').focus();
        }
        return;
    }
});

// ─── Upload Box — file preview ────────────────────────────
document.addEventListener('change', function (e) {
    const fileInput = e.target;
    if (fileInput.type !== 'file') return;
    const previewId = fileInput.id.replace('-file', '-preview').replace('-main', '-main-preview').replace('-secondary', '-secondary-preview');
    const preview   = document.getElementById(previewId);
    if (!preview) return;

    preview.innerHTML = '';
    Array.from(fileInput.files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const thumb = document.createElement('div');
            thumb.className = 'ib-preview-thumb';
            thumb.innerHTML = `<img src="${ev.target.result}" alt="Preview"><span class="ib-preview-thumb__remove" title="Remove"><i class="fas fa-times"></i></span>`;
            thumb.querySelector('.ib-preview-thumb__remove').addEventListener('click', () => thumb.remove());
            preview.appendChild(thumb);
        };
        reader.readAsDataURL(file);
    });
});

// ─── Upload Box drag-over styling ────────────────────────
document.addEventListener('dragover', function (e) {
    const box = e.target.closest('.ib-upload-box');
    if (box) { e.preventDefault(); box.classList.add('drag-over'); }
});
document.addEventListener('dragleave', function (e) {
    const box = e.target.closest('.ib-upload-box');
    if (box) box.classList.remove('drag-over');
});
document.addEventListener('drop', function (e) {
    const box = e.target.closest('.ib-upload-box');
    if (box) box.classList.remove('drag-over');
});
