/* eslint-disable no-console */

const fs = require(`fs`);
const path = require(`path`);

module.exports = {
  prompts: {
    name: {
      type: `string`,
      required: true,
      message: `Project name`
    },
    description: {
      type: `string`,
      required: false,
      message: `Project description`,
      default: `A vue-builder project`
    },
    author: {
      type: `string`,
      required: false,
      message: `Author`
    }
  },
  skipInterpolation: [`.*`, `.*/**`],
  complete(data) {
    const destDir = path.join(process.cwd(), data.destDirName);
    const filesToCopy = [`.editorconfig`, `.eslintrc`, `jsconfig.json`, `.nvmrc`, `.gitignore`, `config/app.conf.js`];

    filesToCopy.forEach(file => {
      fs.copyFileSync(path.join(__dirname, file), path.join(destDir, file));
    });

    console.log(`\nTo get started:\n`);
    console.log(`  cd ${data.destDirName}`);
    console.log(`  nvm use`);
    console.log(`  yarn`);
    console.log(`  npm run dev\n`);
  }
};
