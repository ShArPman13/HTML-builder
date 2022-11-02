const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const paint = require('chalk');

const wayNew = path.join(__dirname + '/files-copy');
const wayOld = path.join(__dirname + '/files');


fs.access(wayNew, async (err) => { // is folder exist?
  if (err && err.code === 'ENOENT') {
    await fsProm.mkdir(wayNew, {recursive: true});
    copyDir()
  } else {
      await deleteDir();
      copyDir();
  }
})

async function copyDir() {
  const files = await fsProm.readdir(wayOld);
  for (let item of files) {
    await fsProm.copyFile(wayOld + '/' + item, wayNew + '/' + item)
  }
  console.log(`${paint.green(files.length)} file(s) copied succesfully`)
}

async function deleteDir() {
  await fsProm.rm(wayNew, { recursive: true, force: true });
  fsProm.mkdir(wayNew, {recursive: true});
}