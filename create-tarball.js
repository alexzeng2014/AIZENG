const fs = require('fs');
const path = require('path');
const tar = require('tar');

const directoriesToExclude = ['node_modules', 'dist'];
const fileExtensionsToInclude = ['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.md', '.env'];

function shouldInclude(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  if (directoriesToExclude.some(dir => relativePath.startsWith(dir))) {
    return false;
  }
  const ext = path.extname(filePath);
  return fileExtensionsToInclude.includes(ext) || path.basename(filePath).startsWith('.');
}

tar.c(
  {
    gzip: true,
    filter: (path, stat) => shouldInclude(path),
  },
  ['.']
).pipe(fs.createWriteStream('deepseek-kids-chat.tar.gz'));

console.log('Project packaged as deepseek-kids-chat.tar.gz');