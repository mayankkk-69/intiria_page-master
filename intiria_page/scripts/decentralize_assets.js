const fs = require('fs');
const path = require('path');

const sections = [
    { name: 'commercial', dir: 'sections/commercial-quote' },
    { name: 'industrial', dir: 'sections/industrial-quote' },
    { name: 'residential', dir: 'sections/residential-quote' }
];

const basePath = 'c:/xampp/htdocs/intiria_page-master/intiria_page';
const sourceCss = fs.readFileSync(path.join(basePath, 'css/quote-calculator.css'), 'utf8');
const sourceJs = fs.readFileSync(path.join(basePath, 'js/quote_connector.js'), 'utf8');

sections.forEach(sec => {
    const fullDir = path.join(basePath, sec.dir);
    if (!fs.existsSync(fullDir)) return;

    // 1. Create separate CSS and JS files in the folder
    const cssFileName = `${sec.name}.css`;
    const jsFileName = `${sec.name}.js`;
    fs.writeFileSync(path.join(fullDir, cssFileName), sourceCss, 'utf8');
    fs.writeFileSync(path.join(fullDir, jsFileName), sourceJs, 'utf8');
    console.log(`Created ${cssFileName} and ${jsFileName} in ${sec.dir}`);

    // 2. Update HTML files to point to local files
    const files = fs.readdirSync(fullDir);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            let updated = false;

            // Replace CSS link
            if (content.includes('../../css/quote-calculator.css')) {
                content = content.replace(/\.\.\/\.\.\/css\/quote-calculator\.css/g, cssFileName);
                updated = true;
            } else if (content.includes('../css/quote-calculator.css')) { // fallback
                content = content.replace(/\.\.\/css\/quote-calculator\.css/g, cssFileName);
                updated = true;
            }

            // Replace JS link
            if (content.includes('../../js/quote_connector.js')) {
                content = content.replace(/\.\.\/\.\.\/js\/quote_connector\.js/g, jsFileName);
                updated = true;
            } else if (content.includes('../js/quote_connector.js')) { // fallback
                content = content.replace(/\.\.\/js\/quote_connector\.js/g, jsFileName);
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated links in ${file}`);
            }
        }
    });
});
