const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');
const relativePath = path.join(__dirname, '/styles');
const bundlePath = path.join(__dirname, 'project-dist/style.css');
const templatePath = path.join(__dirname, 'template.html');
const htmlPath = path.join(__dirname, 'project-dist/index.html');
const componentPath = path.join(__dirname, '/components');
const distPath = path.join(__dirname, '/project-dist');
const assetsPath = path.join(__dirname, '/assets')
const distAssetsPath = path.join(__dirname, '/project-dist/assets');
// const { stdin, stdout } = require('node:process');

fs.mkdir(distPath, (err) => {});
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
fs.mkdir(distAssetsPath,{ recursive: true }, (err) => {
  // console.log('Dir coppied');
  fs.readdir(assetsPath, { recursive: true },  (err, files) => {
    // console.log(files);
    files.forEach((file) => {
      // console.log(file);
      const dirPath2 = path.join(distAssetsPath, file);
      const dirPath = path.join(assetsPath, file)
      fs.stat(dirPath, (err, stat) => {
        if (stat.isDirectory()) {
            // console.log(path.parse(file).name,'-',path.extname(file).slice(1),'-',stat.size,'Byte');
          // console.log(path.parse(file).name, dirPath2);
          fs.mkdir(dirPath2,{ recursive: true }, (err) => {});
        } else if (stat.isFile()) {
          // console.log(file, dirPath);
          fs.copyFile(path.join(dirPath), path.join(dirPath2), (err) => {});
        }
        });
    });
  });
});
(async () => {
  try {
    let template = await fsPromises.readFile(templatePath,'utf8');
    
    // console.log(template);
    const templateTags = template.match(/{{(...*?)}}/g);
    // console.log(templateTags.length);
    // templateTags.forEach(async (tag) => {
    for (let i = 0; i < templateTags.length; i += 1) {
      const tagsHtml = templateTags[i].slice(2, -2);
      // console.log(tagsHtml);
      const componentTagsPath = path.join(componentPath, `/${tagsHtml}.html`);
      // console.log(componentTagsPath);
      const components =  await fsPromises.readFile(componentTagsPath,'utf8');
        // componentsStream.on('data', (comp) => {

      template = template.replace(templateTags[i], components);
          // console.log(template);
        // });
    };
    // console.log(template);
    await fsPromises.writeFile(htmlPath, template);
  }
  catch (err) {
    console.error(err.message);
  }
})();