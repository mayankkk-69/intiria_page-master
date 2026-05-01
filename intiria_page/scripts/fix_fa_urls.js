const fs = require('fs');
const path = require('path');

const directories = [
    'sections/commercial-quote',
    'sections/industrial-quote',
    'sections/residential-quote'
];

const basePath = 'c:/xampp/htdocs/intiria_page-master/intiria_page';

directories.forEach(dir => {
    const fullDir = path.join(basePath, dir);
    if (!fs.existsSync(fullDir)) return;

    const files = fs.readdirSync(fullDir);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Fix the corrupted Font Awesome URL
            const corruptedUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/../../css/all.min.css';
            const fixedUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            
            if (content.includes(corruptedUrl)) {
                console.log(`Fixing Font Awesome link in ${filePath}`);
                content = content.split(corruptedUrl).join(fixedUrl);
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    });
});
