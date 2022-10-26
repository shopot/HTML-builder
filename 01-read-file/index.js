const fs = require('fs');
const path = require('path');

const filename = path.resolve(__dirname, 'text.txt');

fs.readFile(filename, 'utf8', function (err, data) {
  console.log(data);
});
