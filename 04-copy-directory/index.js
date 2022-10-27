const fs = require('fs');
const path = require('path');

/**
 * Copy files from source to destination
 *
 * @param {string} srcDir
 * @param {string} destDir
 */
const copyDir = (srcDir, destDir) => {
  fs.stat(destDir, (err, stats) => {
    if (err) {
      fs.mkdir(destDir, { recursive: true }, err => {
        if (err) throw err;
      });
    }
  });

  fs.readdir(srcDir, {}, (err, files) => {
    files.forEach(file => {
      const filename = path.resolve(srcDir, file);
      const filenameNew = path.resolve(destDir, file);
      fs.copyFile(filename, filenameNew, err => {
        if (err) throw err;
        console.log(`${file} was copied to destination directory`);
      });
    });
  });
};

const srcDir = path.resolve(__dirname, 'files');
const destDir = path.resolve(__dirname, 'files-copy');

copyDir(srcDir, destDir);
