const nodeFS = require('fs');
const nodePath = require('path');

const PROJECT_DIST = 'project-dist';

const config = {
  dist: nodePath.resolve(__dirname, PROJECT_DIST),
  entry: {
    assets: nodePath.resolve(__dirname, 'assets'),
    styles: nodePath.resolve(__dirname, 'styles'),
    components: nodePath.resolve(__dirname, 'components'),
    template: nodePath.resolve(__dirname, 'template.html'),
  },
  output: nodePath.join(nodePath.resolve(__dirname, PROJECT_DIST), 'index.html'),
};

/**
 * Check is a file or directory exists
 *
 * @param {String} file
 * @returns Promise
 */
const checkFileExists = async file => {
  try {
    await nodeFS.promises.access(file, nodeFS.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

/**
 * Recursive remove file or directory
 *
 * @param {String} dest
 * @returns {boolean}
 */
const clean = async dest => {
  await nodeFS.promises.rm(dest, { recursive: true, force: true });
  console.log('Clean target directory was completed successfully.');
  return true;
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
 * Copy files from source to destination
 *
 * @param {string} srcDir
 * @param {string} destDir
 */
const copyDir = async (srcDir, destDir) => {
  //  Check exists source directory
  if (!(await checkFileExists(srcDir))) {
    return false;
  }

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

/**
 * Create html bundle file.
 *
 * @param {String} srcDir
 * @param {String} srcTemplateFile
 * @param {String} destBundleFile
 */
const createHTMLBundle = async (srcDir, srcTemplateFile, destBundleFile) => {
  // ... and
  const files = await getFiles(srcDir, 'html');

  let content = await nodeFS.promises.readFile(srcTemplateFile, { encoding: 'utf8' });

  for (const file of files) {
    const html = await nodeFS.promises.readFile(nodePath.resolve(srcDir, file), { encoding: 'utf8' });

    const pattern = nodePath.basename(file).replace(/\.html$/g, '');

    content = content.replace(`{{${pattern}}}`, html);
  }

  await nodeFS.promises.writeFile(destBundleFile, content);

  console.log('Create HTML bundle was completed successfully.');
};

/**
 * Main job application function
 *
 * @returns void
 */
const main = async () => {
  // Clean dist directory
  await clean(config.dist);

  // Create dist dir
  await nodeFS.promises.mkdir(config.dist, { recursive: true });

  // Cerate copy assets files
  const destDirAssets = nodePath.resolve(config.dist, nodePath.basename(config.entry.assets));
  await copyDir(config.entry.assets, destDirAssets);

  // Create CSS bundle file
  await createCSSBundle(config.entry.styles);

  // Create HTML bundle file
  await createHTMLBundle(config.entry.components, config.entry.template, config.output);

  return true;
};

// Start job
main().then(res => {
  console.log('Job was completed successfully.');
});
