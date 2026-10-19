const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content');
const categories = [];
const documents = [];

function scanDir(dir, currentCategory, relPath) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.gitkeep' || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    const entryRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      scanDir(fullPath, currentCategory, entryRelPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      const docPath = `content/${entryRelPath}`;
      const title = entry.name.replace(/\.html$/i, '');
      documents.push({
        name: entry.name,
        title: title,
        category: currentCategory,
        path: docPath
      });
    }
  }
}

if (fs.existsSync(contentDir)) {
  const topEntries = fs.readdirSync(contentDir, { withFileTypes: true });
  for (const entry of topEntries) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      categories.push(entry.name);
      scanDir(path.join(contentDir, entry.name), entry.name, entry.name);
    }
  }
}

const catalog = { categories, documents };
const jsonOutput = JSON.stringify(catalog, null, 2);

fs.writeFileSync(path.join(process.cwd(), 'index.json'), jsonOutput);

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'index.json'), jsonOutput);

// Sync content directory to public/content so Vite production build bundles all document files
const publicContentDir = path.join(publicDir, 'content');
if (fs.existsSync(contentDir)) {
  fs.cpSync(contentDir, publicContentDir, { recursive: true });
}

console.log('✅ Generated index.json successfully with', documents.length, 'documents across', categories.length, 'categories and synced content.');
