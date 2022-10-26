const fs = require('fs');
const path = require('path');
const process = require('process');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filename = path.resolve(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filename, { flags: 'a+' });

let isSIGINT = true;

process.on('beforeExit', () => {
  const message = isSIGINT ? '\n' : '';
  console.log(`${message}Goodbye!`);
});

const question = () => {
  rl.question('Enter your text or "exit": ', text => {
    if ('exit' === text) {
      writeStream.close();
      rl.close();
      isSIGINT = false;
    } else {
      writeStream.write(`\n${text}`);
      return question();
    }
  });
};

question();
