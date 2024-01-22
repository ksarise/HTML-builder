const fs = require('node:fs');
const path = require('node:path');
const relativePath = path.join(__dirname, '/files');
const copyRelativePath = path.join(__dirname, '/files-copy');
const { stdin, stdout } = require('node:process');
fs.mkdir(copyRelativePath, (err) => {
  console.log('Dir coppied');
  fs.readdir(relativePath, (err, files) => {
    files.forEach((file) => {
      // console.log(file);
      fs.copyFile(path.join(relativePath, file), path.join(copyRelativePath, file), (err) => {
        if (err) {
          console.log("Error Found:", err);
        } else {
          console.log('File coppied',file);
        }
      });
    });
  });
});
// fs.readdir(copyRelativePath, (err, filesCopy) => {
//   console.log(copyRelativePath, filesCopy);
// });
