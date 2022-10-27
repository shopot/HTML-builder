const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, 'secret-folder');

const getStat = (path, callback) => {
  fs.stat(path, (err, stats) => {
    if (err) throw err;
    callback(stats);
  });
};

fs.readdir(dir, {}, (err, files) => {
  files.forEach(file => {
    const filePath = path.resolve(dir, file);

    getStat(filePath, stats => {
      if (stats.isFile()) {
        console.log(
          `${path.parse(filePath).name} - ${path.parse(filePath).ext.replace(/^\./, '')} - ${stats.size / 1000}kb`,
        );
      }
    });
  });
});
