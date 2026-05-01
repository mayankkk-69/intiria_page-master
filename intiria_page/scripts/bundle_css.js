const fs = require('fs');
const path = require('path');

function bundleCss(baseDir, sectionsDir, outputFileName, indexFile, startTag, endTag) {
    const sectionsPath = path.join(baseDir, sectionsDir);
    let combinedCss = '';
    const cssLinks = [];

    // Find all CSS files in section subdirectories
    const sections = fs.readdirSync(sectionsPath);
    sections.forEach(section => {
        const sectionPath = path.join(sectionsPath, section);
        if (fs.statSync(sectionPath).isDirectory()) {
            const files = fs.readdirSync(sectionPath);
            files.forEach(file => {
                if (file.endsWith('.css')) {
                    const cssFilePath = path.join(sectionPath, file);
                    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
                    combinedCss += `/* --- ${file} --- */\n${cssContent}\n\n`;
                    cssLinks.push(`sections/${section}/${file}`);
                    
                    // delete the individual css file to clean up the mess
                    fs.unlinkSync(cssFilePath);
                }
            });
        }
    });

    if (combinedCss.trim() !== '') {
        const outputPath = path.join(baseDir, 'css', outputFileName);
        fs.writeFileSync(outputPath, combinedCss, 'utf8');
        console.log(`Bundled CSS saved to ${outputPath}`);

        // Update index.html
        const indexPath = path.join(baseDir, indexFile);
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Use a regex to remove all the individual css links
        // We will look for links containing "sections/" and ".css"
        const regex = /<link rel="stylesheet" href="sections\/.*\.css">\s*/g;
        indexContent = indexContent.replace(regex, '');
        
        // Add the new bundled css link
        const bundleLink = `<link rel="stylesheet" href="css/${outputFileName}">\n`;
        indexContent = indexContent.replace('<!-- Component CSS -->\n', `<!-- Component CSS -->\n    ${bundleLink}`);
        
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log(`Updated ${indexPath}`);
    } else {
        console.log(`No CSS found to bundle for ${baseDir}`);
    }
}

// Bundle frontend section CSS
bundleCss('c:/xampp/htdocs/intiria_page-master/intiria_page', 'sections', 'sections.css', 'index.html');

// Bundle backend section CSS
bundleCss('c:/xampp/htdocs/intiria_page-master/intiria_backend', 'sections', 'admin-sections.css', 'index.html');

console.log('CSS bundling complete.');
