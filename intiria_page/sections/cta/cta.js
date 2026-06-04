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
        eqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = eqForm.querySelector('.btn-enquiry');
            const originalText = submitBtn ? submitBtn.textContent : 'ENQUIRE NOW';
            
            if (submitBtn) {
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;
            }

            try {
                const formData = new FormData(eqForm);
                const res = await fetch('api/save_hero_enquiry.php', {
                    method: 'POST',
                    body: formData
                });
                
                let data;
                try {
                    data = await res.json();
                } catch(err) {
                    data = { success: false, message: 'Server error' };
                }
                
                if (data.success) {
                    if (submitBtn) {
                        submitBtn.textContent = 'HEARING FROM US SOON';
                        submitBtn.style.background = 'rgba(255,255,255,0.1)';
                        submitBtn.style.color = '#fff';
                        submitBtn.style.borderColor = 'transparent';
                    }
                    setTimeout(() => {
                        eqForm.reset();
                        if (submitBtn) {
                            submitBtn.textContent = originalText;
                            submitBtn.style = '';
                            submitBtn.disabled = false;
                        }
                    }, 3000);
                } else {
                    alert('Error: ' + (data.message || 'Unknown error occurred.'));
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    /* ── 3. WhatsApp Form Handler ── */
    const waForm = document.getElementById('whatsappLocationForm');
    if (waForm) {
        waForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('wa-name');
            const phoneInput = document.getElementById('wa-phone');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            const message = `Hello INTIRIA Team, my name is ${name}. I am planning a studio visit. Please send the location directly to my WhatsApp number: ${phone}. Thanks.`;
            const whatsappUrl = `https://wa.me/917503468992?text=${encodeURIComponent(message)}`;

            const submitBtn = waForm.querySelector('.btn-wa');
            const originalText = submitBtn ? submitBtn.textContent : 'SEND TO WHATSAPP';
            
            if (submitBtn) {
                submitBtn.textContent = 'OPENING WA...';
                submitBtn.disabled = true;
            }

            try {
                const formData = new FormData(waForm);
                // Do not await this fetch, so window.open executes synchronously!
                fetch('api/save_whatsapp_lead.php', {
                    method: 'POST',
                    body: formData
                }).catch(err => console.error("Failed to save WA lead:", err));
            } catch (err) {
                console.error("Failed to setup WA lead save:", err);
            }

            window.open(whatsappUrl, '_blank');
            waForm.reset();
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
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
