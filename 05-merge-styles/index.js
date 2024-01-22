const fs = require('node:fs');
const path = require('node:path');
const relativePath = path.join(__dirname, '/styles');
const bundlePath = path.join(__dirname, '/project-dist/bundle.css');
const { stdin, stdout } = require('node:process');
// const rr = fs.createReadStream(relativePath).setEncoding('utf8');
const rw = fs.createWriteStream(bundlePath);
fs.readdir(relativePath, (err, files) => {
  files.forEach((file) => {
    // console.log(file);
    const filePath = path.join(relativePath, file);
    // console.log(filePath);
    fs.stat(filePath, (err, stat) => {
      if (stat.isFile() && path.extname(file) === '.css') {
        // console.log(path.parse(file).name,'-',path.extname(file).slice(1));
        let rr = fs.createReadStream(filePath).setEncoding('utf8');
        rr.on('data', (chunk) => {
          rw.write(chunk);
        });
      }
    });
  });
});