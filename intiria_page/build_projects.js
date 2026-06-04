const fs = require('fs');

const contentFile = `C:\\Users\\mayan\\.gemini\\antigravity-ide\\brain\\1b51f9c1-51e2-4f59-8025-272dfbcf3952\\.system_generated\\steps\\612\\content.md`;
const content = fs.readFileSync(contentFile, 'utf8');

// Find the JSON part
const jsonStart = content.indexOf('{');
if (jsonStart === -1) {
    console.error("JSON not found in content file.");
    process.exit(1);
}

const rawJson = content.substring(jsonStart);
const data = JSON.parse(rawJson);

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const PROJECT_META = {
  'M3M Solitude, sector -89, gurugram': { type: 'Residential' },
  'Govindpuram': { type: 'Residential' },
  'Jasola': { type: 'Residential' },
  'ramprastha green Ghaziabad': { type: 'Residential' },
  'Zirakpur': { type: 'Residential' },
  'Sonu Yadav': { type: 'Residential' },
  'aashish bhola': { type: 'Residential' },
  'Sec 91 faridabad': { type: 'Residential' },
  'Tronica city( Green city)': { type: 'Residential' },
  'Dr. Surmayee dental Clinic': { type: 'Commercial' },
  'Hospital in Loni Design': { type: 'Commercial' },
  'commercial': { type: 'Commercial' },
  'ingress Office 3D': { type: 'Commercial' },
  'interior of cafe': { type: 'Commercial' },
  'Afzalpur resort 3D': { type: 'Hospitality' },
  'industrial': { type: 'Industrial' },
  'residential': { type: 'Residential' }
};

const output = [];

for (const folder of Object.keys(PROJECT_META)) {
    // find all images in this folder
    const images = data.tree
        .filter(item => {
            if (item.type !== 'blob') return false;
            if (!item.path.startsWith(folder + '/')) return false;
            const ext = item.path.substring(item.path.lastIndexOf('.')).toLowerCase();
            return IMAGE_EXTS.includes(ext);
        })
        .map(item => {
            const encodedPath = item.path.split('/').map(segment => encodeURIComponent(segment)).join('/');
            return {
                url: `https://raw.githubusercontent.com/infoarchitectshive-pixel/intiria/main/${encodedPath}`,
                name: item.path.split('/').pop()
            };
        });
    
    output.push({
        folderName: folder,
        images: images
    });
}

fs.writeFileSync('projects_data.json', JSON.stringify(output, null, 2));
console.log("Successfully wrote projects_data.json!");
