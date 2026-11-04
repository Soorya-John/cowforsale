import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const content=JSON.parse(await readFile('content.json','utf8'));
assert.equal(content.opening,'You’re older, and I’m one year closer to world peace.');
const photos=[content.hero,...content.evidence,...content.memories,content.letterPhoto];
for(const p of photos){assert.ok(p.alt && p.caption);if(p.src){assert.ok(!p.src.startsWith('/'),'Photo URLs must work in a repository subdirectory');await access(p.src);}}
for(const m of content.memories)assert.equal(typeof m.sample,'boolean');
const html=await readFile('index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate element IDs');
for(const [,id]of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(id),`Missing anchor ${id}`);
for(const [,url]of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))await access(url);
console.log(`Passed: exact headline, ${photos.length} photo references, sample labels, unique IDs, all anchors and local assets.`);
