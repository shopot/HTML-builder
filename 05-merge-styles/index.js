const nodeFS = require('fs');
const nodePath = require('path');

/**
 * Config
 */
const config = {
  srcStylesDir: nodePath.resolve(__dirname, 'styles'),
  destStylesFile: nodePath.resolve(__dirname, 'project-dist', 'bundle.css'),
};

/**
 * Get file name from src directory
 *
 * @param {String} srcDir
 * @param {String} ext
 * @returns {String[]}
 */
const getFiles = async (srcDir, ext = 'css') => {
  // Get files from srcDir
  let files = await nodeFS.promises.readdir(srcDir, { withFileTypes: true });

  return files
    .filter(file => {
      if (new RegExp(`\.${ext.replace(/^\./, '')}\$`, 'g').test(file.name) && file.isFile()) {
        return true;
      }
    })
    .map(file => file.name);
};

/**
 * Create CSS bundle
 *
 * @param {String} srcDir source directory with CSS files
 * @param {String} destBundleFile target bundle file
 */
const createCSSBundle = async (srcDir, destBundleFile) => {
  // Set destBundleFile
  destBundleFile = destBundleFile || nodePath.resolve(config.dist, 'style.css');

  // Get css files from srcDir
  const files = await getFiles(srcDir, 'css');

  const styles = [];

  // Fill array with styles
  for (const file of files) {
    console.log('Processing file: ' + file);

    const filename = nodePath.resolve(srcDir, file);

    const data = await nodeFS.promises.readFile(filename, { encoding: 'utf8' });

    styles.push(data);
  }

  // Add styles to CSS bundle file
  await nodeFS.promises.writeFile(destBundleFile, styles.join('\n'), { encoding: 'utf8', flag: 'w' });

  console.log('Create CSS bundle was completed successfully.');
};

const main = async () => {
  createCSSBundle(config.srcStylesDir, config.destStylesFile);
};

main();
