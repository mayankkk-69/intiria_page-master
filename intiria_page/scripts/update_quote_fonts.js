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

const fontLink = '    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n';

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Inject font link if not present
    if (!content.includes('fonts.googleapis.com/css2?family=Outfit')) {
        content = content.replace('</title>', '</title>\n' + fontLink);
    }
    
    // Update font-family
    content = content.replace(/font-family:\s*[^;]+;/g, "font-family: 'Outfit', sans-serif;");
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated font to Outfit in', file);
});
