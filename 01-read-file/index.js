const fs = require('fs');
const path = require('path');

const p = path.join( __dirname, 'text.txt');
const stream = new fs.ReadStream(p, {encoding: 'utf8'});

stream.on('readable', () => {
    const data = stream.read();
    if (data) {
    console.log(data);
    }
});