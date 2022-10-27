const fs = require('fs');
const path = require('path');

/**
 * Config
 */
const config = {
  srcStylesDir: path.resolve(__dirname, 'styles'),
  destStylesFile: path.resolve(__dirname, 'project-dist', 'bundle.css'),
};

/**
 * Get css files from source directory
 *
 * @param {String} srcDir
 * @param {Function} cb
 */
const getCSSFiles = (srcDir, cb) => {
  fs.readdir(srcDir, {}, (err, files) => {
    const cssFiles = files.filter(file => {
      return new RegExp(/\.css$/, 'g').test(file);
    });

    cb(cssFiles);
  });
};

/**
 * Create read stream
 *
 * @param {String} filename
 * @return {fs.ReadStream} readStream
 */
const createReaderStream = filename => {
  return fs.createReadStream(filename, { flags: 'r' });
};

/**
 * Create CSS bundle
 *
 * @param {String[]} files
 */
const createBuildCSSFile = files => {
  const writeStream = fs.createWriteStream(config.destStylesFile, { flags: 'w' });

  files.forEach(file => {
    const filename = path.resolve(config.srcStylesDir, file);

    createReaderStream(filename).pipe(writeStream);
  });

  console.log('Create CSS bundle was completed successfully.');
};

getCSSFiles(config.srcStylesDir, createBuildCSSFile);
