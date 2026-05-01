/**
 * INTIRIA QUOTE CONNECTOR
 * Fetches content for the individual iframe quote calculators from the parent's CMS db.
 */

function loadQuoteContent(planId) {
    // We check if the parent has loaded the database
    if (!window.parent || !window.parent.intiria_db) {
        // If not loaded yet, retry in 100ms
        setTimeout(() => loadQuoteContent(planId), 100);
        return;
    }

    const db = window.parent.intiria_db;
    
    let qc = null;
    if (planId.startsWith('res-')) qc = db.quote_content_res;
    else if (planId.startsWith('com-')) qc = db.quote_content_com;
    else if (planId.startsWith('ind-')) qc = db.quote_content_ind;

    if (qc) {
        // 1. Update Title (Usually h1)
        const titleKey = `ib-qc-${planId}-title`;
        if (qc[titleKey] && document.querySelector('h1')) {
            document.querySelector('h1').textContent = qc[titleKey];
        }

        // 2. Update Description (Usually first p after h3 or just the first paragraph below h1)
        const descKey = `ib-qc-${planId}-desc`;
        if (qc[descKey]) {
            // Find the <p> that follows the <h3>Brief Detail</h3>
            const paragraphs = document.querySelectorAll('p');
            // Usually it's the first paragraph that isn't inside a dropdown
            let targetP = null;
            for (let p of paragraphs) {
                if (!p.closest('.dropdown')) {
                    targetP = p;
                    break;
                }
            }
            if (targetP) {
                targetP.textContent = qc[descKey];
            }
        }

        // 3. Update Images in Carousel
        const imgKey = `ib-qc-${planId}-imgs`;
        if (qc[imgKey]) {
            const urls = qc[imgKey].split(',').map(s => s.trim()).filter(s => s.length > 0);
            if (urls.length > 0) {
                // Update global array used by the calculator's lightbox script
                if (typeof window.carouselImgs !== 'undefined') {
                    // Empty and refill
                    window.carouselImgs.length = 0;
                    urls.forEach(u => window.carouselImgs.push(u));
                }

                // Update the DOM image elements
                const scrollable = document.getElementById('scrollableImages');
                if (scrollable) {
                    scrollable.innerHTML = ''; // Clear existing
                    urls.forEach((url, i) => {
                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = `Gallery Image ${i + 1}`;
                        // Hook up lightbox click
                        img.onclick = () => { if(typeof window.openLightbox === 'function') window.openLightbox(i); };
                        scrollable.appendChild(img);
                    });
                }

                // Rebuild the navigation dots
                if (typeof window.buildDots === 'function') {
                    window.buildDots();
                }
            }
        }
    }
}
