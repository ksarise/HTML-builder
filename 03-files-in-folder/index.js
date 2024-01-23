const fs = require('node:fs');
const path = require('node:path');
const relativePath = path.join(__dirname, '/secret-folder');
const { stdin, stdout } = require('node:process');
// {withFileTypes: true},
fs.readdir(relativePath, (err, files) => {
  files.forEach((file) => {
    // console.log(file);
    const filePath = path.join(relativePath, file);
    // console.log(filePath);
    fs.stat(filePath, (err, stat) => {
      if (stat.isFile()) {
        console.log(path.parse(file).name,'-',path.extname(file).slice(1),'-',stat.size,'Byte');
      }
    });
  });
});