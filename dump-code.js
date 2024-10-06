import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToInclude = [
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'src/vite-env.d.ts',
  'index.html',
  'package.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.js',
  '.env'
];

async function dumpCode() {
  let output = '';

  for (const file of filesToInclude) {
    output += `\n\n--- ${file} ---\n\n`;
    try {
      const content = await fs.readFile(path.join(__dirname, file), 'utf8');
      output += content;
    } catch (err) {
      output += `Error reading file: ${err.message}`;
    }
  }

  await fs.writeFile('project-code-dump.txt', output);
  console.log('All code has been dumped to project-code-dump.txt');
}

dumpCode();