const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');
const relativePath = path.join(__dirname, '/styles');
const templatePath = path.join(__dirname, 'template.html');
const componentPath = path.join(__dirname, '/components');
const assetsPath = path.join(__dirname, '/assets')
const distPath = path.join(__dirname, 'project-dist');
const distAssetsPath = path.join(distPath, '/assets');
const htmlPath = path.join(distPath, '/index.html');
const bundlePath = path.join(distPath, '/style.css');

//create bundle css
const rw = fs.createWriteStream(bundlePath);
fs.readdir(relativePath, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(relativePath, file);
    fs.stat(filePath, (err, stat) => {
      if (stat.isFile() && path.extname(file) === '.css') {
        let rr = fs.createReadStream(filePath).setEncoding('utf8');
        rr.on('data', (chunk) => {
          rw.write(chunk);
        });
      }
    });
  });
});

//copy directory
(async () => {
  try {
    await fsPromises.mkdir(distPath, { recursive: true }, (err) => {
      if (err) {
        console.log("Error Found:", err);
      }         
    });

    await fsPromises.mkdir(distAssetsPath, { recursive: true },{ force: true }, (err) => {
      if (err) {
        console.log("Error Found:", err);
      }         
    });
    await fsPromises.rm(distAssetsPath, { recursive: true }, { force: true });

    const assetsFiles = await fsPromises.readdir(assetsPath, { recursive: true }, (err) => {
      if (err) {
        console.log("Error Found:", err);
      }
    });
    
    for (let i = 0; i < assetsFiles.length; i += 1) {
      const stats = await fsPromises.stat(path.join(assetsPath, assetsFiles[i]))
      const dirPath2 = path.join(distAssetsPath, assetsFiles[i]);
      const dirPath = path.join(assetsPath, assetsFiles[i]);
      
      if (stats.isDirectory()) {
        await fsPromises.mkdir(dirPath2, { recursive: true });
      } else if (stats.isFile()){
        await fsPromises.copyFile(path.join(dirPath), path.join(dirPath2));
      }
    };
    
  }
  catch (err) {
    console.error(err.message);
  }
})();

//create html from template
(async () => {
  try {
    let template = await fsPromises.readFile(templatePath,'utf8');
    const templateTags = template.match(/{{(...*?)}}/g);
    for (let i = 0; i < templateTags.length; i += 1) {
      const tagsHtml = templateTags[i].slice(2, -2);
      const componentTagsPath = path.join(componentPath, `/${tagsHtml}.html`);
      const components =  await fsPromises.readFile(componentTagsPath,'utf8');
      template = template.replace(templateTags[i], components);
    };
    await fsPromises.writeFile(htmlPath, template);
  }
  catch (err) {
    console.error(err.message);
  }
})();