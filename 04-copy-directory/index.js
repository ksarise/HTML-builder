const path = require('node:path');
const relativePath = path.join(__dirname, '/files');
const copyRelativePath = path.join(__dirname, '/files-copy');
const fsPromises = require('node:fs/promises');

(async () => {
  try {
    await fsPromises.mkdir(copyRelativePath, { recursive: true }, (err) => {
      if (err) {
        console.log("Error Found:", err);
      }         
    });
    const copyFiles = await fsPromises.readdir(copyRelativePath, (err) => {
      if (err) {
        console.log("Error Found:", err);
      } 
    });
    for (let i = 0; i < copyFiles.length; i += 1) {
      await fsPromises.rm(path.join(copyRelativePath, copyFiles[i]),{ recursive: true }, { force: true }, (err) => {
        if (err) {
          console.log("Error Found:", err);
        } 
      });
    }

    
    const files = await fsPromises.readdir(relativePath, (err) => {
      if (err) {
        console.log("Error Found:", err);
      } 
    });
    for (let i = 0; i < files.length; i += 1) {
      await fsPromises.copyFile(path.join(relativePath, files[i]),path.join(copyRelativePath, files[i]));
    }
  }
  catch (err) {
    console.error(err.message);
  }
})();