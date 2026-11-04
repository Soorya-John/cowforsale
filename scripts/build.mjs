import {mkdir, copyFile, cp} from 'node:fs/promises';
await mkdir('dist', {recursive:true});
for(const file of ['index.html','styles.css','app.js','content.json','.nojekyll']) await copyFile(file, `dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Built dist/ — ready for any static host or GitHub Pages repository subdirectory.');
