const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if(!file.includes('.git')) {
                results = results.concat(walkDir(file));
            }
        } else { 
            if (file.endsWith('.html') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('c:\\xampp\\htdocs\\intiria_page-master');
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('/intiria_page-master/intiria_page/photos/')) {
        let newContent = content.split('/intiria_page-master/intiria_page/photos/').join('/intiria_page-master/intiria_page/photos/');
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated: ' + file);
        updatedCount++;
    }
});

console.log('Total files updated: ' + updatedCount);
