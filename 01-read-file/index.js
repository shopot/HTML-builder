const fs = require('fs');
const path = require('path');

function read(filename) {
  const readableStream = fs.createReadStream(filename);

  readableStream.on('data', (chunk) => {
    console.log(chunk.toString());
  });
}

read(path.resolve(__dirname, 'text.txt'));
