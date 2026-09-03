const fs = require('fs');
const path = require('path');

const colPath = path.join(__dirname, '..', 'Inkviz_Postman_Collection.json');
const col = JSON.parse(fs.readFileSync(colPath, 'utf8'));

// Ensure tempEmail variable exists
if (!col.variable.find(v => v.key === 'tempEmail')) {
  col.variable.push({ key: 'tempEmail', value: 'alex.mercer@example.com', type: 'string' });
}

// Polish each request for Postman interactive workflow
col.item.forEach(folder => {
  folder.item.forEach(req => {
    if (req.name === 'Refresh Access Token') {
      req.event = [{
        listen: 'test',
        script: {
          exec: [
            'const res = pm.response.json();',
            'if (res.success && res.data && res.data.accessToken) {',
            "    pm.collectionVariables.set('accessToken', res.data.accessToken);",
            '}'
          ],
          type: 'text/javascript'
        }
      }];
    }
    if (req.name === 'Register User') {
      req.request.body.raw = JSON.stringify({
        name: 'Alex Mercer',
        email: '{{tempEmail}}',
        password: 'Password123!'
      }, null, 2);
    }
    if (req.name === 'Login User') {
      req.request.body.raw = JSON.stringify({
        email: '{{tempEmail}}',
        password: 'Password123!'
      }, null, 2);
    }
    if (req.name === 'Forgot Password') {
      req.request.body.raw = JSON.stringify({
        email: '{{tempEmail}}'
      }, null, 2);
    }
  });
});

fs.writeFileSync(colPath, JSON.stringify(col, null, 2), 'utf8');
console.log('Successfully polished Inkviz_Postman_Collection.json for Postman interactive testing');
