const nodeFS = require('fs');
const nodePath = require('path');

/**
 * Copy files from source to destination
 *
 * @param {string} srcDir
 * @param {string} destDir
 * @returns {void}
 */
const copyDir = async (srcDir, destDir) => {
  // Create directory if it doesn't exist'
  await nodeFS.promises.mkdir(destDir, { recursive: true });

  // Gte files and directories
  const files = await nodeFS.promises.readdir(srcDir, { withFileTypes: true });

  for (let i = 0; i < files.length; i++) {
    const src = nodePath.resolve(srcDir, files[i].name);
    const dest = nodePath.resolve(destDir, files[i].name);

    if (files[i].isDirectory()) {
      await copyDir(src, dest);
    } else {
      await nodeFS.promises.copyFile(src, dest);
    }
  }
};

/**
 * Main application function
 *
 * @returns {void}
 */
const main = async () => {
  const srcDir = nodePath.resolve(__dirname, 'files');
  const destDir = nodePath.join(__dirname, 'files-copy');

  await copyDir(srcDir, destDir);

  console.log('Job was completed successfully.');
};

main();
