const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const paint = require('chalk');

const way = path.join(__dirname + '/secret-folder');

async function readDir() {

  let count = 0;
  const files = await fsProm.readdir(way);
  for await (let item of files) {
    const st = await fsProm.stat(way + '/'+ item)
      if (st.isFile()) {
        console.log(
          path.basename(item, path.extname(item)) // get file name sans extension
          + ' - ' + (path.extname(item)).slice(1) // get extension sans dot
          + ' - ' + (st.size / 1024).toFixed(3) + 'kb' // get size in Kb
          );
        count += 1;
      }
  }
  if (count === 0) {
    console.log(paint.yellow('No files in the directory'));
  } else console.log(paint.yellow(`There are ${count} files in folder`));
};

readDir();





  // for (let item of files) {
  //   const st = fs.stat(way + '/'+ item, (err, stats) => {
  //     if(err) return console.log(err);

  //     if (stats.isFile()) {
  //       console.log(
  //         path.basename(item, path.extname(item)) // get file name sans extension
  //         + ' - ' + (path.extname(item)).slice(1) // get extension sans dot
  //         + ' - ' + (stats.size / 1024).toFixed(3) + 'kb' // get size in Kb
  //         );
  //         count += 1;
  //     }
  //   })
  // }
