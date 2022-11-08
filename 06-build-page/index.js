const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');

const wayTemplate = path.join( __dirname + '/template.html');
const wayComponents = path.join( __dirname + '/components');
const wayDist = path.join(__dirname + '/project-dist')
const wayNewIndex = path.join(__dirname + '/project-dist/index.html')

const wayStyles = path.join(__dirname + '/styles');
const wayAllStyles = path.join( __dirname + '/project-dist/style.css');

const wayAssetsNew = path.join(__dirname + '/project-dist/assets');
const wayAssetsOld = path.join(__dirname + '/assets');


async function readTemplate(obj) {
  const fileContent = await fsProm.readFile(wayTemplate, {encoding: 'utf8'});
  let template = fileContent;
  let start;
  for (let i = 0; i < template.length - 1; i += 1) {
    if (template[i] && template[i + 1] === '{') {
      start = i;
    } else if (template[i] && template[i + 1] === '}') {
        let end = i + 2;
        for (let el in obj) {
          if (template.slice(start, end) === el) {
            template = template.substring(0, start) + obj[el] + template.substring(end, template.length);
          }
        }
      }
  }
  return template;
}

async function findAllComponents() {
  let compObject = {};
  const components = await fsProm.readdir(wayComponents);
  for (let item of components) {
    const st = await fsProm.stat(wayComponents + '/'+ item);
      if (st.isFile() && path.extname(item) === '.html') {
        let key =  path.basename(item, path.extname(item));
        compObject[`{{${key}}}`] =  await readFile(item);
      }
  }
  return compObject;
}

async function readFile(file) {
  const fileContent = await fsProm.readFile(wayComponents + '/' + file, {encoding: 'utf8'});
  return fileContent;
}

async function checkDistDirectory() {
  try {
    await fsProm.access(wayDist);
    await fsProm.rm(wayDist, { recursive: true, force: true });
    await fsProm.mkdir(wayDist, {recursive: true});
  }
  catch {
    await fsProm.mkdir(wayDist, {recursive: true});
  }
}

async function makeHTML() {
  const objectAllComp = await findAllComponents();
  const fullTemplate = await readTemplate(objectAllComp);
  await fsProm.appendFile(wayNewIndex, fullTemplate + '\n');
}

async function readStylesDir() { // read DIR with styles
  let styleArray = [];
  const files = await fsProm.readdir(wayStyles); // all files in DIR here
  for (let item of files) {
    const st = await fsProm.stat(wayStyles + '/'+ item) // get stats for each file in DIR
      if (st.isFile() && path.extname(item) === '.css') { // check is it .css file?
        const fileContent = await fsProm.readFile(wayStyles + '/' + item, {encoding: 'utf8'});
        styleArray.push(fileContent);
      }
  }
  return styleArray;
};

async function getAllStyles() {
  const allStyles = await readStylesDir(); // read styles DIR and get styleArray for BUNDLE
  for await (let style of allStyles) {
    await fsProm.appendFile(wayAllStyles, style + '\n');
  }
}

async function copyAssets(wayOld, wayNew) {
  await fsProm.mkdir(wayAssetsNew, {recursive: true});
  const files = await fsProm.readdir(wayOld);
  for (let item of files) {
    const st = await fsProm.stat(wayOld + '/'+ item)
      if (st.isFile()) {
        await fsProm.copyFile(wayOld + '/' + item, wayNew + '/' + item)
      } else if  (st.isDirectory()) {
              await fsProm.mkdir(wayNew + '/' + item, {recursive: true});
              copyAssets(wayAssetsOld + '/' + item, wayAssetsNew + '/' + item)
        }
  }
}

async function getProjectDist() {
  await checkDistDirectory();
  await makeHTML();
  await getAllStyles();
  await copyAssets(wayAssetsOld, wayAssetsNew)
}
getProjectDist();

