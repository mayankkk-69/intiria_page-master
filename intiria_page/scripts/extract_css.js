const fs = require('fs');
const path = require('path');

const basePath = 'c:/xampp/htdocs/intiria_page-master/intiria_page';
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

// Read basic-quote.html to extract CSS
const basicContent = fs.readFileSync(path.join(basePath, 'html/basic-quote.html'), 'utf8');
const styleMatch = basicContent.match(/<style>([\s\S]*?)<\/style>/i);

if (styleMatch) {
    const cssContent = styleMatch[1].trim();
    
    // Ensure CSS directory exists
    const cssDir = path.join(basePath, 'css');
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir);
    }
    
    // Write CSS to file
    fs.writeFileSync(path.join(cssDir, 'quote-calculator.css'), cssContent, 'utf8');
    console.log('Created quote-calculator.css');

    // Replace in all files
    files.forEach(f => {
        const fullPath = path.join(basePath, f);
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/<style>[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="../css/quote-calculator.css">');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated ' + f);
    });
} else {
    console.log('No style block found in basic-quote.html');
}
