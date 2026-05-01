const fs = require('fs');

const files = [
    'html/basic-quote.html',
    'html/premium-quote.html',
    'html/deluxe-quote.html'
];

const oldHtmlBlock = `<div class="scrollable-images" id="scrollableImages">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture104.webp" alt="Residential Interior 1" onclick="openLightbox(0)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture106.webp" alt="Residential Interior 2" onclick="openLightbox(1)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture137.webp" alt="Residential Interior 3" onclick="openLightbox(2)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture20.webp" alt="Residential Interior 4" onclick="openLightbox(3)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture24.webp" alt="Residential Interior 5" onclick="openLightbox(4)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture26.webp" alt="Residential Interior 6" onclick="openLightbox(5)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture54.webp" alt="Residential Interior 7" onclick="openLightbox(6)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture55.webp" alt="Residential Interior 8" onclick="openLightbox(7)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture56.webp" alt="Residential Interior 9" onclick="openLightbox(8)">
                <img src="/intiria_page-master/intiria_page/photos/residential/Picture57.webp" alt="Residential Interior 10" onclick="openLightbox(9)">
            </div>`;

const newHtmlBlock = `<div class="scrollable-images" id="scrollableImages">
                <img src="/intiria_page-master/intiria_page/photos/residential/1.jpeg" alt="Residential Interior 1" onclick="openLightbox(0)">
                <img src="/intiria_page-master/intiria_page/photos/residential/2.jpeg" alt="Residential Interior 2" onclick="openLightbox(1)">
                <img src="/intiria_page-master/intiria_page/photos/residential/3.jpeg" alt="Residential Interior 3" onclick="openLightbox(2)">
                <img src="/intiria_page-master/intiria_page/photos/residential/4.jpeg" alt="Residential Interior 4" onclick="openLightbox(3)">
                <img src="/intiria_page-master/intiria_page/photos/residential/5.jpeg" alt="Residential Interior 5" onclick="openLightbox(4)">
                <img src="/intiria_page-master/intiria_page/photos/residential/6.jpeg" alt="Residential Interior 6" onclick="openLightbox(5)">
                <img src="/intiria_page-master/intiria_page/photos/residential/7.jpeg" alt="Residential Interior 7" onclick="openLightbox(6)">
                <img src="/intiria_page-master/intiria_page/photos/residential/8.jpeg" alt="Residential Interior 8" onclick="openLightbox(7)">
            </div>`;

const oldJsBlock = `const carouselImgs = [
    '/intiria_page-master/intiria_page/photos/residential/Picture104.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture106.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture137.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture20.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture24.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture26.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture54.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture55.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture56.webp',
    '/intiria_page-master/intiria_page/photos/residential/Picture57.webp'
];`;

const newJsBlock = `const carouselImgs = [
    '/intiria_page-master/intiria_page/photos/residential/1.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/2.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/3.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/4.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/5.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/6.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/7.jpeg',
    '/intiria_page-master/intiria_page/photos/residential/8.jpeg'
];`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fallback: replace using regex if strict string match fails due to line endings
    content = content.replace(/<div class="scrollable-images" id="scrollableImages">[\s\S]*?<\/div>/, newHtmlBlock);
    content = content.replace(/const carouselImgs = \[[\s\S]*?\];/, newJsBlock);
    
    fs.writeFileSync(file, content);
    console.log('Updated', file);
});
