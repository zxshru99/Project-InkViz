const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Inkviz_Postman_Collection.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

let allValid = true;
let totalEndpoints = 0;

function auditItem(item, folderName) {
  if (item.request) {
    totalEndpoints++;
    const name = `${folderName} -> ${item.name}`;
    const req = item.request;

    // Check URL
    if (!req.url || typeof req.url !== 'object') {
      console.error(`[FAIL] ${name}: URL is not an object`);
      allValid = false;
    } else {
      if (!req.url.raw || !req.url.raw.startsWith('http://localhost:5001')) {
        console.error(`[FAIL] ${name}: URL raw (${req.url.raw}) does not start with http://localhost:5001`);
        allValid = false;
      }
      if (!req.url.host || req.url.host[0] !== 'localhost:5001') {
        console.error(`[FAIL] ${name}: URL host (${JSON.stringify(req.url.host)}) is not ['localhost:5001']`);
        allValid = false;
      }
    }

    // Check Body if present
    if (req.body && req.body.mode === 'raw') {
      if (!req.body.options || !req.body.options.raw || req.body.options.raw.language !== 'json') {
        console.error(`[FAIL] ${name}: Body options.raw.language is not 'json'`);
        allValid = false;
      }
      const hasContentType = req.header && req.header.some(h => h.key.toLowerCase() === 'content-type' && h.value === 'application/json');
      if (!hasContentType) {
        console.error(`[FAIL] ${name}: Missing Content-Type application/json header`);
        allValid = false;
      }
      // Validate JSON syntax of raw body
      try {
        JSON.parse(req.body.raw);
      } catch (e) {
        console.error(`[FAIL] ${name}: Raw body is not valid JSON: ${e.message}`);
        allValid = false;
      }
    }

    console.log(`[PASS] ${name} [${req.method} ${req.url.raw}]`);
  }

  if (item.item && Array.isArray(item.item)) {
    for (const child of item.item) {
      auditItem(child, item.name || folderName);
    }
  }
}

console.log('--- AUDITING INKVIZ POSTMAN COLLECTION ---');
for (const folder of data.item) {
  auditItem(folder, '');
}
console.log('-------------------------------------------');
console.log(`Total Endpoints Checked: ${totalEndpoints}`);
console.log(`Final Collection Audit Status: ${allValid ? 'ALL 100% VALID & CONSISTENT' : 'FOUND ERRORS'}`);
