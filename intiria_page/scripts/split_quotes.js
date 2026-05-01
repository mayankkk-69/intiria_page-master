const fs = require('fs');
const path = require('path');

const pricingHtmlPath = 'sections/pricing/pricing.html';
const indexHtmlPath = 'index.html';

let html = fs.readFileSync(pricingHtmlPath, 'utf8');

// The 4 sections:
const pricingMatch = html.match(/<section class="pricing-section[^>]*>[\s\S]*?<\/section>/i);
const resQuoteMatch = html.match(/<!-- ══ RESIDENTIAL INTERIOR QUOTE FORMS ══ -->[\s\S]*?<section class="inline-quote-section" id="residential-quote-section">[\s\S]*?<\/section>/i);
const comQuoteMatch = html.match(/<!-- ══ COMMERCIAL QUOTE FORMS ══ -->[\s\S]*?<section class="inline-quote-section" id="commercial-quote-section">[\s\S]*?<\/section>/i);
const indQuoteMatch = html.match(/<!-- ══ INDUSTRIAL \/ CONSTRUCTION QUOTE FORMS ══ -->[\s\S]*?<section class="inline-quote-section" id="construction-quote-section">[\s\S]*?<\/section>/i);

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);

if (!pricingMatch || !resQuoteMatch || !comQuoteMatch || !indQuoteMatch || !styleMatch) {
    console.log('Failed to match all sections.');
    process.exit(1);
}

// Write the CSS
const cssContent = styleMatch[1].trim();
fs.writeFileSync('sections/pricing/pricing.css', cssContent);

// Create directories
['residential-quote', 'commercial-quote', 'construction-quote'].forEach(dir => {
    const dirPath = path.join('sections', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
});

// Write HTML files
fs.writeFileSync(pricingHtmlPath, pricingMatch[0] + '\n');
fs.writeFileSync('sections/residential-quote/residential-quote.html', resQuoteMatch[0] + '\n');
fs.writeFileSync('sections/commercial-quote/commercial-quote.html', comQuoteMatch[0] + '\n');
fs.writeFileSync('sections/construction-quote/construction-quote.html', indQuoteMatch[0] + '\n');

// Update index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

indexHtml = indexHtml.replace('<div id="pricing-root"></div>', '<div id="pricing-root"></div>\n        <div id="residential-quote-root"></div>\n        <div id="commercial-quote-root"></div>\n        <div id="construction-quote-root"></div>');

const oldPricingLoad = "{ id: 'pricing-root', url: 'sections/pricing/pricing.html' },";
const newPricingLoad = "{ id: 'pricing-root', url: 'sections/pricing/pricing.html' },\n                { id: 'residential-quote-root', url: 'sections/residential-quote/residential-quote.html' },\n                { id: 'commercial-quote-root', url: 'sections/commercial-quote/commercial-quote.html' },\n                { id: 'construction-quote-root', url: 'sections/construction-quote/construction-quote.html' },";

indexHtml = indexHtml.replace(oldPricingLoad, newPricingLoad);

fs.writeFileSync(indexHtmlPath, indexHtml);

console.log('Successfully split pricing.html and updated index.html.');
