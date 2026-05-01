const fs = require('fs');
const path = require('path');

const directories = [
    'sections/commercial-quote',
    'sections/industrial-quote',
    'sections/residential-quote'
];

directories.forEach(dir => {
    const fullDir = path.join('c:/xampp/htdocs/intiria_page-master/intiria_page', dir);
    if (!fs.existsSync(fullDir)) return;

    const files = fs.readdirSync(fullDir);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Check if we need to update
            if (content.includes('../css/') || content.includes('../js/')) {
                console.log(`Updating ${filePath}`);
                content = content.replace(/\.\.\/css\//g, '../../css/');
                content = content.replace(/\.\.\/js\//g, '../../js/');
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    });
});
