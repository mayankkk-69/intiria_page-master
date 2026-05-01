const fs = require('fs');
const files = [
  { path: 'intiria_page/html/premium-quote.html', key: 'res-premium' },
  { path: 'intiria_page/html/deluxe-quote.html', key: 'res-deluxe' },
  { path: 'intiria_page/html/commercial-corporate-quote.html', key: 'com-corporate' },
  { path: 'intiria_page/html/commercial-enterprise-quote.html', key: 'com-enterprise' },
  { path: 'intiria_page/html/industrial-premium-quote.html', key: 'ind-prem' },
  { path: 'intiria_page/html/industrial-advanced-quote.html', key: 'ind-adv' }
];

files.forEach(f => {
    const fullPath = 'c:/xampp/htdocs/intiria_page-master/' + f.path;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('quote_connector.js')) {
        const inject = `    <script src="../js/quote_connector.js"></script>\r\n    <script>\r\n        loadQuoteContent('${f.key}');\r\n    </script>\r\n</body>`;
        content = content.replace('</body>', inject);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated ' + f.path);
    }
});
