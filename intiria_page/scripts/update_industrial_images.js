const fs = require('fs');

const files = [
    'html/industrial-standard-quote.html',
    'html/industrial-premium-quote.html',
    'html/industrial-advanced-quote.html'
];

const newHtmlBlock = `<div class="scrollable-images" id="scrollableImages">
                <img src="/intiria_page-master/intiria_page/photos/industrial/1.webp" alt="Industrial Interior 1" onclick="openLightbox(0)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/2.png" alt="Industrial Interior 2" onclick="openLightbox(1)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/3.webp" alt="Industrial Interior 3" onclick="openLightbox(2)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/4.webp" alt="Industrial Interior 4" onclick="openLightbox(3)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/5.webp" alt="Industrial Interior 5" onclick="openLightbox(4)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/6.webp" alt="Industrial Interior 6" onclick="openLightbox(5)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/7.webp" alt="Industrial Interior 7" onclick="openLightbox(6)">
                <img src="/intiria_page-master/intiria_page/photos/industrial/8.webp" alt="Industrial Interior 8" onclick="openLightbox(7)">
            </div>`;

const newJsBlock = `const carouselImgs = [
    '/intiria_page-master/intiria_page/photos/industrial/1.webp',
    '/intiria_page-master/intiria_page/photos/industrial/2.png',
    '/intiria_page-master/intiria_page/photos/industrial/3.webp',
    '/intiria_page-master/intiria_page/photos/industrial/4.webp',
    '/intiria_page-master/intiria_page/photos/industrial/5.webp',
    '/intiria_page-master/intiria_page/photos/industrial/6.webp',
    '/intiria_page-master/intiria_page/photos/industrial/7.webp',
    '/intiria_page-master/intiria_page/photos/industrial/8.webp'
];`;

files.forEach(file => {
    let content = fs.readFileSync(file);
    let str = content.toString('utf16le');
    let encoding = 'utf16le';
    if (str.indexOf('DOCTYPE') === -1 && str.indexOf('<html') === -1) {
        str = content.toString('utf8');
        encoding = 'utf8';
    }

    // Replace HTML block
    str = str.replace(/<div class="scrollable-images" id="scrollableImages">[\s\S]*?<\/div>/, newHtmlBlock);
    
    // Replace JS block
    str = str.replace(/const carouselImgs = \[[\s\S]*?\];/, newJsBlock);
    
    // Ensure we write it back in the same encoding or convert to UTF-8
    // Actually, writing it all as UTF-8 is cleaner and prevents future issues.
    fs.writeFileSync(file, str, 'utf8');
    console.log('Updated', file, 'from', encoding, 'to utf8');
});
