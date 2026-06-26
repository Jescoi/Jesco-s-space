/**
 * Update image references from .png → .webp in all source files.
 * Run AFTER compress-images.mjs.
 * Run: node scripts/update-paths.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src');

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function main() {
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.css'];
  let changed = 0;

  for await (const file of walk(SRC)) {
    if (!extensions.includes(extname(file))) continue;

    let content = await readFile(file, 'utf-8');
    const original = content;

    // Replace .png → .webp in image paths (only for files in public/images/ and public/gallery/)
    content = content.replace(
      /(['"])(images\/[^'"]+\.png|gallery\/[^'"]+\.png)(['"])/gi,
      (match, q1, path, q3) => `${q1}${path.replace(/\.png$/i, '.webp')}${q3}`
    );

    if (content !== original) {
      await writeFile(file, content, 'utf-8');
      console.log(`  Updated: ${file.replace(SRC, 'src')}`);
      changed++;
    }
  }

  console.log(`\n✅ Updated ${changed} file(s).`);
}

main().catch(console.error);
