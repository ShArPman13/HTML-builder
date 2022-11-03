// const fs = require('fs');
// const paint = require('chalk');
const fsProm = require('fs/promises');
const path = require('path');


const wayStyles= path.join(__dirname + '/styles');
const wayBundle = path.join( __dirname + '/project-dist' + '/bundle.css');
let styleArray = [];

async function readDir() { // read DIR with styles
  const files = await fsProm.readdir(wayStyles); // all files in DIR here
  for (let item of files) {
    const st = await fsProm.stat(wayStyles + '/'+ item) // get stats for each file in DIR
      if (st.isFile() && path.extname(item) === '.css') { // check is it .css file?
        await readFile(item);
      }
  }
};

async function readFile(file) {
  const fileContent = await fsProm.readFile(wayStyles + '/' + file, {encoding: 'utf8'});
  styleArray.push(fileContent);
  return fileContent;
}


async function getAllStyles() {
  await readDir(); // read styles DIR and get styleArray for BUNDLE

  fsProm.access(wayBundle)
    .then(async () => {
      await fsProm.unlink(wayBundle); // if BUNDLE already exists - remove it first
      for (let style of styleArray) {
        await writeFile(style);
      }
    })
    .catch(async () => {
      for (let style of styleArray) {
        await writeFile(style);
      }
    });
}


async function writeFile(s) {
  await fsProm.appendFile(wayBundle, s + '\n');
}


getAllStyles()
