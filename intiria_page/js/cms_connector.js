/**
 * INTIRIA CMS CONNECTOR
 * Fetches data from the backend API and dynamically updates the frontend DOM.
 */
async function loadCMSData() {
    try {
        // Dynamically find the backend API depending on where index.html is located
        const basePath = window.location.pathname.includes('/intiria_page/') 
            ? '../intiria_page/api/fetch_db.php' 
            : 'api/fetch_db.php';
            
        const response = await fetch(basePath);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        
        if (!json.success || !json.data) {
            console.error("CMS load failed:", json.message);
            return;
        }

        const db = json.data;
        window.intiria_db = db; // Expose to child iframes
        console.log("Fetched CMS DB:", db);

        // Helper to safely update HTML
        const updateHtml = (selector, content) => {
            const el = document.querySelector(selector);
            if (el && content) el.innerHTML = content;
        };
        // Helper to safely update text
        const updateText = (selector, content) => {
            const el = document.querySelector(selector);
            if (el && content) el.textContent = content;
        };

        // --- 1. HERO SECTION ---
        /* 
        if (db.hero) {
            const h = db.hero;
            updateText('.hero-kicker', h['ib-hero-kicker']);
            updateHtml('.hero-tagline', h['ib-hero-tagline']);
            updateText('.hero-subtitle', h['ib-hero-subtitle']);
            updateText('.hero-actions-new .btn', h['ib-hero-cta-text']);
            
            // Typewriter phrases
            const phrases = document.querySelectorAll('.typewriter-phrase');
            if (phrases.length >= 2) {
                if (h['ib-hero-phrase-1']) phrases[0].innerHTML = h['ib-hero-phrase-1'];
                if (h['ib-hero-phrase-2']) phrases[1].innerHTML = h['ib-hero-phrase-2'];
            }

            // Video source
            if (h['ib-hero-video-path']) {
                const videoSource = document.querySelector('.hero-bg-media source');
                const videoElement = document.querySelector('.hero-bg-media');
                if (videoSource && videoSource.getAttribute('src') !== h['ib-hero-video-path']) {
                    videoSource.setAttribute('src', h['ib-hero-video-path']);
                    if (videoElement) videoElement.load();
                }
            }

            // Enquiry Form
            updateText('#hero-enquiry h2', h['ib-hero-form-title']);
            updateText('#hero-enquiry .form-header p', h['ib-hero-form-desc']);

            // Bottom Benefits Bar
            const benItems = document.querySelectorAll('.bottom-benefits .benefit-item');
            if (benItems.length >= 3) {
                if (h['ib-hero-ben1-accent'] || h['ib-hero-ben1-text']) {
                    benItems[0].querySelector('.benefit-text').innerHTML = `<span class="accent text-red">${h['ib-hero-ben1-accent'] || ''}</span><br>${h['ib-hero-ben1-text'] || ''}`;
                }
                if (h['ib-hero-ben2-accent'] || h['ib-hero-ben2-text']) {
                    benItems[1].querySelector('.benefit-text').innerHTML = `<span class="accent text-red">${h['ib-hero-ben2-accent'] || ''}</span><br>${h['ib-hero-ben2-text'] || ''}`;
                }
                if (h['ib-hero-ben3-accent'] || h['ib-hero-ben3-text']) {
                    benItems[2].querySelector('.benefit-text').innerHTML = `<span class="accent text-red">${h['ib-hero-ben3-accent'] || ''}</span><br>${h['ib-hero-ben3-text'] || ''}`;
                }
                
                if (h['ib-hero-ben1-icon']) benItems[0].querySelector('.ben-icon i').className = `fas ${h['ib-hero-ben1-icon']}`;
                if (h['ib-hero-ben2-icon']) benItems[1].querySelector('.ben-icon i').className = `fas ${h['ib-hero-ben2-icon']}`;
                if (h['ib-hero-ben3-icon']) benItems[2].querySelector('.ben-icon i').className = `fas ${h['ib-hero-ben3-icon']}`;
            }
        }
        */

        // --- 2. KPI SECTION ---
        if (db.kpi) {
            const k = db.kpi;
            const cards = document.querySelectorAll('.kpi-grid .kpi-card');
            if (cards.length >= 5) {
                // Card 1
                if (k['ib-kpi-num-1']) cards[0].querySelector('.kpi-number').setAttribute('data-target', k['ib-kpi-num-1']);
                if (k['ib-kpi-label-1']) cards[0].querySelector('span').textContent = k['ib-kpi-label-1'];
                // Card 2
                if (k['ib-kpi-num-2']) cards[1].querySelector('.kpi-number').setAttribute('data-target', k['ib-kpi-num-2']);
                if (k['ib-kpi-label-2']) cards[1].querySelector('span').textContent = k['ib-kpi-label-2'];
                // Card 3
                if (k['ib-kpi-num-3']) cards[2].querySelector('.kpi-number').setAttribute('data-target', k['ib-kpi-num-3']);
                if (k['ib-kpi-label-3']) cards[2].querySelector('span').textContent = k['ib-kpi-label-3'];
                // Card 4
                if (k['ib-kpi-num-4']) cards[3].querySelector('.kpi-number').setAttribute('data-target', k['ib-kpi-num-4']);
                if (k['ib-kpi-label-4']) cards[3].querySelector('span').textContent = k['ib-kpi-label-4'];
                // Card 5
                if (k['ib-kpi-num-5']) cards[4].querySelector('.kpi-number').setAttribute('data-target', k['ib-kpi-num-5']);
                if (k['ib-kpi-label-5']) cards[4].querySelector('span').textContent = k['ib-kpi-label-5'];
            }
        }

        // --- 3. PRICING SECTION ---
        if (db.pricing) {
            const p = db.pricing;
            updateText('.pricing-intro .eyebrow', p['ib-pricing-eyebrow']);
            updateText('.pricing-intro .section-title', p['ib-pricing-title']);
            updateText('.pricing-intro .section-description', p['ib-pricing-desc']);
            updateText('.pricing-note', p['ib-pricing-note']);
            
            if (p['ib-pricing-bg']) {
                const band = document.querySelector('.pricing-band');
                if (band) band.style.backgroundImage = `url('${p['ib-pricing-bg']}')`;
            }

            const plans = document.querySelectorAll('.pricing-grid .pricing-plan');
            if (plans.length >= 3) {
                // Plan 1
                if (p['ib-plan1-chip']) plans[0].querySelector('.plan-chip').textContent = p['ib-plan1-chip'];
                if (p['ib-plan1-title']) plans[0].querySelector('h3').textContent = p['ib-plan1-title'];
                if (p['ib-plan1-summary']) plans[0].querySelector('.plan-summary').textContent = p['ib-plan1-summary'];
                // Plan 2
                if (p['ib-plan2-chip']) plans[1].querySelector('.plan-chip').textContent = p['ib-plan2-chip'];
                if (p['ib-plan2-title']) plans[1].querySelector('h3').textContent = p['ib-plan2-title'];
                if (p['ib-plan2-summary']) plans[1].querySelector('.plan-summary').textContent = p['ib-plan2-summary'];
                // Plan 3
                if (p['ib-plan3-chip']) plans[2].querySelector('.plan-chip').textContent = p['ib-plan3-chip'];
                if (p['ib-plan3-title']) plans[2].querySelector('h3').textContent = p['ib-plan3-title'];
                if (p['ib-plan3-summary']) plans[2].querySelector('.plan-summary').textContent = p['ib-plan3-summary'];
            }
        }

        // --- 4. CTA SECTION ---
        if (db.cta) {
            const c = db.cta;
            const eyebrowEl = document.querySelector('.cta-eyebrow');
            if (eyebrowEl && c['ib-cta-eyebrow']) eyebrowEl.innerHTML = `<span class="cta-line"></span> ${c['ib-cta-eyebrow']} <span class="cta-line"></span>`;
            
            // Note: the title usually has HTML like <br> so we use updateHtml
            updateHtml('.cta-title', c['ib-cta-title']);
            
            updateText('#enquiryForm .btn-enquiry', c['ib-cta-btn-text']);
            updateHtml('.intake-card:first-child .intake-title', `<i class="fas fa-paper-plane"></i> ` + (c['ib-cta-form-title'] || 'Submit Details'));
            
            updateHtml('.wa-title', `<i class="fab fa-whatsapp"></i> ` + (c['ib-cta-wa-title'] || 'Get Studio Location'));
            updateText('#whatsappLocationForm .btn-wa', c['ib-cta-wa-btn']);
        }
        
        // --- 5. HEADER SECTION ---
        if (db.header) {
            const head = db.header;
            if (head['ib-header-logo-path']) {
                const logo = document.querySelector('.brand-mark img');
                if (logo) logo.src = head['ib-header-logo-path'];
            }
            if (head['ib-header-brand-name']) {
                // The brand name has HTML: <strong>Architects<span>Hive</span></strong>
                // We'll just set it as text if they changed it, or we could leave it. 
                // For safety, let's just use textContent if it's a simple string.
                updateHtml('.brand-copy strong', head['ib-header-brand-name']);
            }
            if (head['ib-header-brand-tagline']) {
                updateHtml('.brand-copy small', head['ib-header-brand-tagline']);
            }
            if (head['ib-header-phone']) {
                const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
                phoneLinks.forEach(link => {
                    link.href = 'tel:' + head['ib-header-phone'];
                    // If the link text is the phone number, update it
                    if (link.textContent.includes('+')) {
                        link.textContent = head['ib-header-phone'];
                    }
                });
            }
            if (head['ib-header-cta-link']) {
                const ctas = document.querySelectorAll('.header-cta, .mobile-menu .btn-primary[href]');
                ctas.forEach(cta => cta.href = head['ib-header-cta-link']);
            }
            if (head['ib-header-cta-text']) {
                const ctas = document.querySelectorAll('.header-cta, .mobile-menu .btn-primary[href]');
                ctas.forEach(cta => cta.textContent = head['ib-header-cta-text']);
            }
        }

        // --- 6. FOOTER SECTION ---
        if (db.footer) {
            const f = db.footer;
            updateHtml('.footer-brand .eyebrow', f['ib-footer-eyebrow']);
            updateHtml('.footer-brand h2', f['ib-footer-title']);
            updateHtml('.footer-brand p', f['ib-footer-desc']);
            
            if (f['ib-footer-contact-address']) {
                updateHtml('.footer-contact-clean ul li:nth-child(1) span', f['ib-footer-contact-address']);
            }
            if (f['ib-footer-contact-phone1']) {
                updateHtml('.footer-contact-clean ul li:nth-child(2) span', f['ib-footer-contact-phone1']);
            }
            if (f['ib-footer-contact-phone2']) {
                updateHtml('.footer-contact-clean ul li:nth-child(3) span', f['ib-footer-contact-phone2']);
            }
            if (f['ib-footer-contact-email']) {
                updateHtml('.footer-contact-clean ul li:nth-child(4) span', `<a href="mailto:${f['ib-footer-contact-email']}">${f['ib-footer-contact-email']}</a>`);
            }
            
            // Social Media Links
            if (f['ib-footer-social-fb']) {
                const fbLink = document.querySelector('.social-media-icons-inline a[aria-label="Facebook"]');
                if (fbLink) fbLink.href = f['ib-footer-social-fb'];
            }
            if (f['ib-footer-social-tw']) {
                const twLink = document.querySelector('.social-media-icons-inline a[aria-label="Twitter"]');
                if (twLink) twLink.href = f['ib-footer-social-tw'];
            }
            if (f['ib-footer-social-ig']) {
                const igLink = document.querySelector('.social-media-icons-inline a[aria-label="Instagram"]');
                if (igLink) igLink.href = f['ib-footer-social-ig'];
            }
            if (f['ib-footer-social-li']) {
                const liLink = document.querySelector('.social-media-icons-inline a[aria-label="LinkedIn"]');
                if (liLink) liLink.href = f['ib-footer-social-li'];
            }
            if (f['ib-footer-social-map']) {
                const mapLink = document.querySelector('.social-media-icons-inline a[aria-label="Google Maps"]');
                if (mapLink) mapLink.href = f['ib-footer-social-map'];
            }
            if (f['ib-footer-social-wa']) {
                const waLink = document.querySelector('.social-media-icons-inline a[aria-label="WhatsApp"]');
                if (waLink) waLink.href = f['ib-footer-social-wa'];
            }
        }

        // --- 7. STUDIO SECTION ---
        if (db.studio) {
            const s = db.studio;
            updateText('.studio-eyebrow-wrap .eyebrow', s['ib-studio-eyebrow']);
            updateHtml('.studio-main-title', s['ib-studio-title']);
            updateHtml('.studio-main-desc', s['ib-studio-desc']);
            updateHtml('.studio-kicker', s['ib-studio-kicker']);
        }

        // --- 8. INDUSTRIAL SECTION ---
        if (db.industrial) {
            const ind = db.industrial;
            updateText('.industrial-eyebrow-wrap .eyebrow', ind['ib-industrial-eyebrow']);
            updateHtml('.industrial-main-title', ind['ib-industrial-title']);
            updateHtml('.industrial-main-desc', ind['ib-industrial-desc']);
            updateHtml('.industrial-kicker', ind['ib-industrial-kicker']);
        }

        // --- 9. QUOTES SECTION ---
        if (db.quotes) {
            const q = db.quotes;
            
            // Residential
            updateText('#residential-quote-section .section-title', q['ib-quotes-res-title']);
            updateText('#residential-quote-section .section-description', q['ib-quotes-res-desc']);
            if (q['ib-quotes-res-tab1']) updateText('#residential-quote-section .iq-tabs button:nth-child(1)', q['ib-quotes-res-tab1']);
            if (q['ib-quotes-res-tab2']) updateHtml('#residential-quote-section .iq-tabs button:nth-child(2)', `${q['ib-quotes-res-tab2']} <span class="iq-popular">Most Popular</span>`);
            if (q['ib-quotes-res-tab3']) updateText('#residential-quote-section .iq-tabs button:nth-child(3)', q['ib-quotes-res-tab3']);

            // Commercial
            updateText('#commercial-quote-section .section-title', q['ib-quotes-com-title']);
            updateText('#commercial-quote-section .section-description', q['ib-quotes-com-desc']);
            if (q['ib-quotes-com-tab1']) updateText('#commercial-quote-section .iq-tabs button:nth-child(1)', q['ib-quotes-com-tab1']);
            if (q['ib-quotes-com-tab2']) updateHtml('#commercial-quote-section .iq-tabs button:nth-child(2)', `${q['ib-quotes-com-tab2']} <span class="iq-popular">Most Popular</span>`);
            if (q['ib-quotes-com-tab3']) updateText('#commercial-quote-section .iq-tabs button:nth-child(3)', q['ib-quotes-com-tab3']);

            // Industrial
            updateText('#construction-quote-section .section-title', q['ib-quotes-ind-title']);
            updateText('#construction-quote-section .section-description', q['ib-quotes-ind-desc']);
            if (q['ib-quotes-ind-tab1']) updateText('#construction-quote-section .iq-tabs button:nth-child(1)', q['ib-quotes-ind-tab1']);
            if (q['ib-quotes-ind-tab2']) updateHtml('#construction-quote-section .iq-tabs button:nth-child(2)', `${q['ib-quotes-ind-tab2']} <span class="iq-popular">Most Popular</span>`);
            if (q['ib-quotes-ind-tab3']) updateText('#construction-quote-section .iq-tabs button:nth-child(3)', q['ib-quotes-ind-tab3']);
        }
        
        // --- 10. BRANDS SECTION ---
        if (db.brands && db.brands.brands_list) {
            const allBrands = db.brands.brands_list;
            const third = Math.ceil(allBrands.length / 3);
            const row1 = allBrands.slice(0, third);
            const row2 = allBrands.slice(third, third * 2);
            const row3 = allBrands.slice(third * 2);

            function buildTrack(brands) {
                let html = '';
                [brands, brands, brands, brands, brands, brands, brands, brands].forEach((set, idx) => {
                    set.forEach(brand => {
                        const ariaHidden = idx > 0 ? ' aria-hidden="true"' : '';
                        const alt = idx === 0 ? (brand.name || '') : '';
                        const src = brand.logo || '';
                        if (src && src.trim() !== '') {
                            html += `<div class="brand-logo-card"${ariaHidden}><img src="${src}" alt="${alt}" loading="eager" onerror="this.parentElement.style.display='none'"></div>`;
                        }
                    });
                });
                return html;
            }

            const track1 = document.getElementById('brands-track-1');
            const track2 = document.getElementById('brands-track-2');
            const track3 = document.getElementById('brands-track-3');

            if (track1) track1.innerHTML = buildTrack(row1);
            if (track2) track2.innerHTML = buildTrack(row2);
            if (track3) track3.innerHTML = buildTrack(row3);
        }

        console.log("CMS Data loaded and applied to frontend!");
        
    } catch (err) {
        console.error("CMS Connection Error:", err);
    }
}

// Ensure it runs after sections are loaded
// Since this script is dynamically added by loadModularSections AFTER the DOM is injected,
// we can execute it immediately without waiting for window.onload.
setTimeout(loadCMSData, 300);
