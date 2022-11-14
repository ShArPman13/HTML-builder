// const fs = require('fs');
// // const fsProm = require('fs/promises');
// const path = require('path');

// const wayNew = path.join(__dirname + '/files-copy');
// const wayOld = path.join(__dirname + '/files');

// const copyDir = async () => {
//   fs.rm(wayNew, {recursive: true}, (err) => {

//     if (err) {console.error(err.message);}

//     fs.mkdir(wayNew, {recursive: true}, async ()=> {

//       const files = fs.readdir(wayOld);
//       for (let item of files) {
//         fs.copyFile(wayOld + '/' + item, wayNew + '/' + item);
//       }
//       console.log(`${files.length} file(s) copied succesfully`);
//     });
//   });

// };

// copyDir();


const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');

const wayNew = path.join(__dirname + '/files-copy');
const wayOld = path.join(__dirname + '/files');


fs.access(wayNew, async (err) => { // is folder exist?
  if (err) {
    await fsProm.mkdir(wayNew, {recursive: true});
    copyDir();
  } else {
    await fsProm.rm(wayNew, { recursive: true, force: true });
    await fsProm.mkdir(wayNew, {recursive: true});
    copyDir()
  }

  })

async function copyDir() {
  const files = await fsProm.readdir(wayOld);
  for (let item of files) {
    await fsProm.copyFile(wayOld + '/' + item, wayNew + '/' + item)
  }
  console.log(`${files.length} file(s) copied succesfully`)
}