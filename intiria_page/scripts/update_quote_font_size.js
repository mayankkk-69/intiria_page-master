const fs = require('fs');

const files = [
    'html/basic-quote.html',
    'html/premium-quote.html',
    'html/deluxe-quote.html',
    'html/commercial-startup-quote.html',
    'html/commercial-corporate-quote.html',
    'html/commercial-enterprise-quote.html',
    'html/industrial-standard-quote.html',
    'html/industrial-premium-quote.html',
    'html/industrial-advanced-quote.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Add font-size: 14px to body block
    content = content.replace(/font-family: 'Outfit', sans-serif;\s*}/g, "font-family: 'Outfit', sans-serif;\n    font-size: 13.5px;\n}");
    
    // Also, if there are any specific elements like h1 or h3 that need tweaking, we can add them here.
    // Let's also add a rule for h1 and h3 to be slightly smaller just in case.
    if (!content.includes('h1 {')) {
        content = content.replace('</style>', `
    h1 { font-size: 1.6em; margin-bottom: 10px; margin-top: 5px; }
    h3, h4 { font-size: 1.1em; margin-bottom: 8px; margin-top: 5px; }
    p { font-size: 1em; line-height: 1.4; margin-bottom: 10px; }
    ul { margin-top: 5px; margin-bottom: 10px; }
</style>`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Decreased font size in', file);
});
