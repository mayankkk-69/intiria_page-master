/**
 * brands_loader.js
 * Fetches brand logos via a local PHP proxy (which caches GitHub API results)
 * and populates the 3 auto-scrolling marquee tracks in the brands section.
 */

// PHP proxy — avoids GitHub API rate limits (403)
const BRANDS_PROXY_URL = 'api/github_logos.php';

// Friendly alt names derived from filename
function brandAltFromName(filename) {
    return filename
        .replace(/\.[^.]+$/, '')          // remove extension
        .replace(/[-_]/g, ' ')            // dashes/underscores → spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // title case
}

// Build one logo card HTML
function buildLogoCard(rawUrl, altText) {
    return `<div class="brand-logo-card">
        <img src="${rawUrl}" alt="${altText} logo" loading="lazy"
             onerror="this.parentElement.style.display='none'">
    </div>`;
}

// Build a full track by repeating the logos set N times (for infinite loop)
function buildTrack(logos, repeats = 6) {
    let html = '';
    for (let i = 0; i < repeats; i++) {
        logos.forEach(logo => { html += buildLogoCard(logo.url, logo.alt); });
    }
    return html;
}

async function loadBrandsFromGitHub() {
    const track1 = document.getElementById('brands-track-1');
    const track2 = document.getElementById('brands-track-2');
    const track3 = document.getElementById('brands-track-3');

    if (!track1 && !track2 && !track3) return; // brands section not on this page

    // Resolve proxy URL relative to current page location
    const proxyUrl = window.location.pathname.includes('/intiria_page/')
        ? 'api/github_logos.php'
        : 'intiria_page/api/github_logos.php';

    try {
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
        const json = await res.json();

        if (!json.success || !json.logos?.length) {
            console.warn('[brands_loader] No brand logos returned from proxy');
            return;
        }

        const logos = json.logos.map(l => ({ url: l.url, alt: brandAltFromName(l.name) }));

        // Split logos across 3 rows for visual variety
        const third = Math.ceil(logos.length / 3);
        const row1 = logos.slice(0, third);
        const row2 = logos.slice(third, third * 2);
        const row3 = logos.slice(third * 2);

        if (track1) track1.innerHTML = buildTrack(row1.length ? row1 : logos);
        if (track2) track2.innerHTML = buildTrack(row2.length ? row2 : logos);
        if (track3) track3.innerHTML = buildTrack(row3.length ? row3 : logos);

        console.log(`[brands_loader] Populated 3 marquee tracks with ${logos.length} brand logos.`);

        // Inject animation CSS if not already present
        injectMarqueeCSS();

    } catch (err) {
        console.error('[brands_loader] Failed to load brand logos:', err);
    }
}

function injectMarqueeCSS() {
    // Styles are now in sections/brands/brands.css — nothing to inject
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBrandsFromGitHub);
} else {
    loadBrandsFromGitHub();
}
