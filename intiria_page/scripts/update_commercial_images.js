const fs = require('fs');

const files = [
    'html/commercial-startup-quote.html',
    'html/commercial-corporate-quote.html',
    'html/commercial-enterprise-quote.html'
];

const newHtmlBlock = `<div class="scrollable-images" id="scrollableImages">
                <img src="/intiria_page-master/intiria_page/photos/commercial/1.JPEG" alt="Commercial Interior 1" onclick="openLightbox(0)">
                <img src="/intiria_page-master/intiria_page/photos/commercial/2.jpg" alt="Commercial Interior 2" onclick="openLightbox(1)">
                <img src="/intiria_page-master/intiria_page/photos/commercial/3.webp" alt="Commercial Interior 3" onclick="openLightbox(2)">
                <img src="/intiria_page-master/intiria_page/photos/commercial/4.webp" alt="Commercial Interior 4" onclick="openLightbox(3)">
                <img src="/intiria_page-master/intiria_page/photos/commercial/5.webp" alt="Commercial Interior 5" onclick="openLightbox(4)">
                <img src="/intiria_page-master/intiria_page/photos/commercial/6.jpeg" alt="Commercial Interior 6" onclick="openLightbox(5)">
            </div>`;

const newJsBlock = `const carouselImgs = [
    '/intiria_page-master/intiria_page/photos/commercial/1.JPEG',
    '/intiria_page-master/intiria_page/photos/commercial/2.jpg',
    '/intiria_page-master/intiria_page/photos/commercial/3.webp',
    '/intiria_page-master/intiria_page/photos/commercial/4.webp',
    '/intiria_page-master/intiria_page/photos/commercial/5.webp',
    '/intiria_page-master/intiria_page/photos/commercial/6.jpeg'
];`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace HTML block
    content = content.replace(/<div class="scrollable-images" id="scrollableImages">[\s\S]*?<\/div>/, newHtmlBlock);
    
    // Replace JS block
    content = content.replace(/const carouselImgs = \[[\s\S]*?\];/, newJsBlock);
    
    fs.writeFileSync(file, content);
    console.log('Updated', file);
});
