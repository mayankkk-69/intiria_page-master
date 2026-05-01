const fs = require('fs');
const path = require('path');

const sections = ['header', 'hero', 'kpi', 'benefits', 'pricing', 'studio', 'contact', 'footer'];

// Create CSS and JS files for each section
sections.forEach(sec => {
    const cssPath = path.join('sections', sec, `${sec}.css`);
    const jsPath = path.join('sections', sec, `${sec}.js`);
    
    if(!fs.existsSync(cssPath)) {
        fs.writeFileSync(cssPath, `/* ${sec} specific styles */\n`);
    }
    if(!fs.existsSync(jsPath)) {
        fs.writeFileSync(jsPath, `// ${sec} specific logic\n`);
    }
});

// Now, rewrite index.html to be a modular shell
const newIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="INTIRIA by ArchitectsHive offers premium interior design packages.">
    <title>INTIRIA | Modular Architecture</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" sizes="32x32" href="photos/Hive Tag line 11 (1).png">
    
    <!-- Global CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="css/desktop.css">
    <link rel="stylesheet" href="css/mobile.css">
    
    <!-- Component CSS -->
    ${sections.map(s => `<link rel="stylesheet" href="sections/${s}/${s}.css">`).join('\n    ')}
</head>
<body>
    <div id="header-root"></div>
    <main id="top">
        <div id="hero-root"></div>
        <div id="kpi-root"></div>
        <div id="benefits-root"></div>
        <div id="pricing-root"></div>
        <div id="studio-root"></div>
        <div id="contact-root"></div>
    </main>
    <div id="footer-root"></div>

    <!-- Component Loader -->
    <script>
        async function loadModularSections() {
            const sectionsToLoad = [
                { id: 'header-root', url: 'sections/header/header.html' },
                { id: 'hero-root', url: 'sections/hero/hero.html' },
                { id: 'kpi-root', url: 'sections/kpi/kpi.html' },
                { id: 'benefits-root', url: 'sections/benefits/benefits.html' },
                { id: 'pricing-root', url: 'sections/pricing/pricing.html' },
                { id: 'studio-root', url: 'sections/studio/studio.html' },
                { id: 'contact-root', url: 'sections/contact/contact.html' },
                { id: 'footer-root', url: 'sections/footer/footer.html' }
            ];

            const promises = sectionsToLoad.map(sec => 
                fetch(sec.url)
                    .then(res => res.text())
                    .then(html => {
                        document.getElementById(sec.id).innerHTML = html;
                    })
            );

            await Promise.all(promises);
            console.log("All modular DOM sections loaded.");
            
            // Re-initialize global JS (sliders, observers, etc) after DOM is built
            const script = document.createElement('script');
            script.src = 'js/main.js';
            document.body.appendChild(script);
            
            // Load component specific JS
            const componentScripts = [
                ${sections.map(s => `'sections/${s}/${s}.js'`).join(', ')}
            ];
            componentScripts.forEach(src => {
                const s = document.createElement('script');
                s.src = src;
                document.body.appendChild(s);
            });
        }
        
        // Execute loader
        loadModularSections();
    </script>
</body>
</html>`;

fs.writeFileSync('index.html', newIndexHtml);
console.log('Modular index.html applied.');
