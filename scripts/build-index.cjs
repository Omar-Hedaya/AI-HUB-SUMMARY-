const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content');
const categories = [];
const documents = [];

if (fs.existsSync(contentDir)) {
  const folders = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  folders.forEach(folder => {
    categories.push(folder);
    const folderPath = path.join(contentDir, folder);
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
      if (file.toLowerCase().endsWith('.html')) {
        const filePath = `content/${folder}/${file}`;
        const title = file.replace(/\.html$/i, '');
        documents.push({
          name: file,
          title: title,
          category: folder,
          path: filePath
        });
      }
    });
  });
}

const catalog = { categories, documents };
const jsonOutput = JSON.stringify(catalog, null, 2);

fs.writeFileSync(path.join(process.cwd(), 'index.json'), jsonOutput);

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'index.json'), jsonOutput);

console.log('✅ Generated index.json successfully with', documents.length, 'documents.');
