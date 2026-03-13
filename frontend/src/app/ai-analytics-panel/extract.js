const fs = require('fs');

const svgCode = fs.readFileSync('f:/mejor_project/frontend/src/app/ai-analytics-panel/india.svg', 'utf8');

const regex = /<path\s+id="([^"]+)"\s+name="([^"]+)"\s+d="([^"]+)"/g;
let match;
const statePaths = [];

while ((match = regex.exec(svgCode)) !== null) {
  const id = `IN-${match[1].toUpperCase()}`;
  const name = match[2];
  let d = match[3].replace(/\n/g, ' ').replace(/\t/g, '').replace(/\s+/g, ' ').trim();
  
  statePaths.push({
    id,
    name,
    d
  });
}

const tsCode = `export const INDIA_STATE_PATHS = ${JSON.stringify(statePaths, null, 2)};\n`;

fs.writeFileSync('f:/mejor_project/frontend/src/app/ai-analytics-panel/india-map-data.ts', tsCode);
console.log('Extracted ' + statePaths.length + ' state paths to india-map-data.ts');
