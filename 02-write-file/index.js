const process = require('process');
const { stdin, stdout } = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const p = path.join( __dirname, 'text.txt');

fs.open(p, 'w', (err) => {
  if(err) throw err;
});

fs.access(p, (err) => { // проверка есть ли файл?
  if (err) {
    writeText(`New file has been created. Please write text below: \n`)
  } else {
    writeText(`File is already exist and cleared. Please write text below: \n`)
  }
});

function checkExit(text) { // проверка вводит ли пользователь exit?
  if (text.indexOf('exit') !== -1) {
    console.log('See you later!');
    process.exit();
}
}
  process.on('beforeExit', (code) => {
    console.log('See you later!');
  });

  function writeText (caption) {
    stdout.write(caption);
    readline.on('line', (text) => {
      checkExit(text);
      fs.appendFile(p, text + '\n', (err) => {
        if (err) return;
        // console.log('Saved!');
      });
    });
  }

