const fs = require('fs');

const files = [
    'html/basic-quote.html',
    'html/premium-quote.html',
    'html/deluxe-quote.html',
    'html/commercial-startup-quote.html',
    'html/commercial-corporate-quote.html',
    'html/commercial-enterprise-quote.html',
    'html/industrial-standard-quote.html',
    'html/industrial-premium-quote.html',
    'html/industrial-advanced-quote.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the rules we want to add already exist to prevent duplicates
    if (content.includes('/* Sync Sizes */')) {
        // Remove previous injection if present so we can update it
        content = content.replace(/\/\* Sync Sizes \*\/[\s\S]*?(?=<\/style>)/, '');
    }

    const cssToInject = `
    /* Sync Sizes */
    .total-price {
        font-size: 18px !important;
        margin-bottom: 8px;
    }
    .site-visits {
        font-size: 16px !important;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .slider-container h3 {
        font-size: 16px !important;
        margin: 10px 0 6px 0 !important;
    }
    .checkbox-container h3 span {
        font-size: 16px !important;
    }
    .checkbox-container label {
        font-size: 14px !important;
    }
    .button-container button {
        font-size: 14px !important;
        padding: 8px 16px !important;
    }
`;

    content = content.replace('</style>', cssToInject + '\n</style>');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Synced pricing section sizes in', file);
});
