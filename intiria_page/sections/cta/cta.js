/* ══════════════════════════════════════════════════════
   CTA SECTION — JavaScript (Minimalist Horizontal)
 ══════════════════════════════════════════════════════ */

(function ctaInit() {
    'use strict';

    /* ── 1. Scroll reveal ── */
    const ctaHorizontal = document.getElementById('ctaHorizontal');

    if (ctaHorizontal) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        ctaHorizontal.classList.add('in');
                        observer.unobserve(ctaHorizontal);
                    }
                });
            },
            { threshold: 0.15 }
        );
        observer.observe(ctaHorizontal);
    }

    /* ── 2. Enquiry Form Handler ── */
    const eqForm = document.getElementById('enquiryForm');
    if (eqForm) {
        eqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = eqForm.querySelector('.btn-enquiry');
            if (submitBtn) {
                submitBtn.textContent = 'HEARING FROM US SOON';
                submitBtn.style.background = 'rgba(255,255,255,0.1)';
                submitBtn.style.color = '#fff';
                submitBtn.style.borderColor = 'transparent';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                eqForm.reset();
                if (submitBtn) {
                    submitBtn.textContent = 'ENQUIRE NOW';
                    submitBtn.style = '';
                    submitBtn.disabled = false;
                }
            }, 3000);
        });
    }

    /* ── 3. WhatsApp Form Handler ── */
    const waForm = document.getElementById('whatsappLocationForm');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('wa-name');
            const phoneInput = document.getElementById('wa-phone');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            const message = `Hello INTIRIA Team, my name is ${name}. I am planning a studio visit. Please send the location directly to my WhatsApp number: ${phone}. Thanks.`;
            const whatsappUrl = `https://wa.me/917503468992?text=${encodeURIComponent(message)}`;

            const submitBtn = waForm.querySelector('.btn-wa');
            if (submitBtn) {
                submitBtn.textContent = 'OPENING WA...';
            }

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                waForm.reset();
                if (submitBtn) {
                    submitBtn.textContent = 'SEND TO WHATSAPP';
                }
            }, 600);
        });
    }

    /* ── 4. Phone Input Validation (Numbers Only & 10 Digits) ── */
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Immediately strip out any character that is not a number
            this.value = this.value.replace(/\D/g, '');
        });
    });

})();
