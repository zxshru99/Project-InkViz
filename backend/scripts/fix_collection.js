const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Inkviz_Postman_Collection.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

function fixItem(item) {
  if (item.request) {
    // 1. Fix URL host to localhost:5001
    if (item.request.url && typeof item.request.url === 'object') {
      item.request.url.host = ['localhost:5001'];
      delete item.request.url.port;
    }
    
    // 2. Fix Body options to JSON language
    if (item.request.body && item.request.body.mode === 'raw') {
      item.request.body.options = {
        raw: {
          language: 'json'
        }
      };
      
      // Ensure Content-Type application/json header is set
      if (!item.request.header) {
        item.request.header = [];
      }
      const hasContentType = item.request.header.some(h => h.key.toLowerCase() === 'content-type');
      if (!hasContentType) {
        item.request.header.push({
          key: 'Content-Type',
          value: 'application/json'
        });
      }
    }
  }

  if (item.item && Array.isArray(item.item)) {
    for (const child of item.item) {
      fixItem(child);
    }
  }
}

for (const folder of data.item) {
  fixItem(folder);
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully formatted collection with JSON language options & host: localhost:5001');
