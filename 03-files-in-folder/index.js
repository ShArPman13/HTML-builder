// const fs = require('fs');
// const paint = require('chalk');
const {readdir, stat} = require('fs/promises');
const path = require('path');
const BYTES_IN_KB = 1024;
let count = 0;

async function readDir() {
  const way = path.join(__dirname + '/secret-folder');
  const files = await readdir(way, {withFileTypes: true});

  const tableData = await Promise.all(files.map(async (file) => {
    if (file.isDirectory()) return null;

    const filePath = path.join(way, file.name)
    const fileExtension = path.extname(file.name);
    const fileStats = await stat(filePath);

    const fileName = path.basename(file.name, fileExtension) // get file name sans extension
    const fileFormattedExtansion = path.extname(file.name).slice(1) // get file extension sans dot
    const fileSizeKb = `${Math.round(fileStats.size / BYTES_IN_KB)} kb` // getfile size in Kb

    count += 1;

    return {
        fileName,
        extenction: fileFormattedExtansion,
        size: fileSizeKb
    }
  }))
  const existingValues = tableData.filter(Boolean);
  console.table(existingValues);

  if (count === 0) {
    console.log('No files in the directory');
  } else console.log(`There are ${count} files in folder`);
}

readDir();