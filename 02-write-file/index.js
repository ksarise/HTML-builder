const fs = require('node:fs');
const path = require('node:path');
const relativePath = path.join(__dirname, 'text.txt');
const { stdin: input, stdout: output } = require('node:process');
const readline = require('node:readline');
const rl = readline.createInterface({ input, output });
const rw = fs.createWriteStream(relativePath);
output.write('Welcome! Write your personal input:\n');
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    rw.write(`${input} `);
  }
});
process.on('exit', () => {
  output.write('Thanx for your input. Goodbye');
  rl.close();
});
