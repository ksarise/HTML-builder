const fs = require('node:fs');
const path = require('node:path');
const relativePath = path.join(__dirname, 'text.txt');
const rr = fs.createReadStream(relativePath).setEncoding('utf8');
// rr.on('readable', () => {
//   console.log(`readable: ${rr.read()}`);
// });
rr.on('data', (chunk) => {
  console.log(chunk);
});
