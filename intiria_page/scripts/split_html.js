const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

function extract(startStr, endStr) {
    const startIndex = indexHtml.indexOf(startStr);
    if(startIndex === -1) return '';
    const endIndex = indexHtml.indexOf(endStr, startIndex);
    if(endIndex === -1) return '';
    return indexHtml.substring(startIndex, endIndex + endStr.length);
}

const sectionsMap = {
    'kpi': { start: '<section class="kpi-strip page-section page-section-2"', end: '</section>' },
    'benefits': { start: '<section class="benefits-strip page-section page-section-3"', end: '</section>' },
    'pricing': { start: '<section class="pricing-section page-section page-section-4"', end: '</section>' },
    'studio': { start: '<section class="section-shell studio-section page-section page-section-5"', end: '</section>' },
    'contact': { start: '<section class="section-shell contact-sheet page-section page-section-6"', end: '</section>' },
    'footer': { start: '<footer>', end: '</footer>' }
};

for (const [key, markers] of Object.entries(sectionsMap)) {
    const html = extract(markers.start, markers.end);
    if(html) {
        fs.writeFileSync(path.join('sections', key, `${key}.html`), html);
        console.log(`Extracted ${key}.html`);
    } else {
        console.log(`Failed to extract ${key}`);
    }
}

// Special case for contact overlay which is after <main> and before <footer>
const overlayHtml = extract('<div class="form-overlay" id="contact-overlay">', '</div>\n    </div>');
if(overlayHtml){
    fs.appendFileSync(path.join('sections', 'contact', 'contact.html'), '\n\n' + overlayHtml);
    console.log(`Extracted contact-overlay`);
}
