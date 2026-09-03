import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'Inkviz_Postman_Collection.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

function fixUrls(items: any[]) {
  for (const item of items) {
    if (item.request && item.request.url) {
      if (typeof item.request.url === 'object') {
        item.request.url.host = ['localhost:5001'];
        delete item.request.url.port;
      }
    }
    if (item.item && Array.isArray(item.item)) {
      fixUrls(item.item);
    }
  }
}

fixUrls(data.item);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated Inkviz_Postman_Collection.json');
