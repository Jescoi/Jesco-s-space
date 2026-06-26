import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', 'public');

const MOBILE_MAX = 600;
const QUALITY = 65;

const dirs = ['images/works', 'gallery'];

let totalBefore = 0;
let totalAfter = 0;

for (const dir of dirs) {
  const srcDir = join(root, dir);
  if (!existsSync(srcDir)) continue;

  const files = readdirSync(srcDir).filter(f => {
    const ext = extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.webp'].includes(ext) && !f.includes('_mobile');
  });

  console.log(`\n📁 ${dir} (${files.length} files)`);

  for (const file of files) {
    const src = join(srcDir, file);
    const beforeSize = statSync(src).size;
    totalBefore += beforeSize;

    const ext = extname(file);
    const base = file.slice(0, -ext.length);
    // mobile suffix: add _mobile before extension
    const outName = `${base}_mobile.webp`;
    const dest = join(srcDir, outName);

    if (existsSync(dest)) {
      const afterSize = statSync(dest).size;
      totalAfter += afterSize;
      console.log(`  ⏭  ${file} → ${outName} (exists, ${(afterSize/1024).toFixed(0)}KB)`);
      continue;
    }

    try {
      await sharp(src)
        .resize({ width: MOBILE_MAX, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(dest);

      const afterSize = statSync(dest).size;
      totalAfter += afterSize;
      const pct = ((1 - afterSize / beforeSize) * 100).toFixed(0);
      console.log(`  ✅ ${file} → ${outName}  ${(beforeSize/1024).toFixed(0)}KB → ${(afterSize/1024).toFixed(0)}KB (${pct}%↓)`);
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
    }
  }
}

const totalMB_before = (totalBefore / 1024 / 1024).toFixed(2);
const totalMB_after  = (totalAfter / 1024 / 1024).toFixed(2);
const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

console.log(`\n─────────────────────────────────`);
console.log(`📊  Desktop total: ${totalMB_before} MB`);
console.log(`📊  Mobile total:  ${totalMB_after} MB  (${totalReduction}% smaller)`);
console.log(`─────────────────────────────────`);
