const fs = require('fs');
const cssPaths = ['css/desktop.css', 'css/mobile.css'];

const newClass = `
/* Typography Utility Classes */
.font-display {
    font-family: var(--font-display) !important;
}

.font-body {
    font-family: var(--font-body) !important;
}

.unique-font {
    font-family: 'Inter', sans-serif !important; /* Or customize this to whatever font you prefer */
}
`;

cssPaths.forEach(cssPath => {
    if (fs.existsSync(cssPath)) {
        let content = fs.readFileSync(cssPath, 'utf8');
        if (!content.includes('.font-display')) {
            fs.appendFileSync(cssPath, newClass);
            console.log('Appended typography classes to', cssPath);
        } else {
            console.log('Classes already exist in', cssPath);
        }
    }
});
