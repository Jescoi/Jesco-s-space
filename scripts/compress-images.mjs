/**
 * Image compression script — converts PNG→WebP, compresses JPG.
 * Run: node scripts/compress-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

async function compressFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const isPng = ext === '.png';
  const isJpg = ext === '.jpg' || ext === '.jpeg';

  if (!isPng && !isJpg) return { filePath, skipped: true };

  const originalSize = (await stat(filePath)).size;

  let pipeline = sharp(filePath).resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' });

  let newPath;
  if (isPng) {
    // PNG → WebP (much smaller)
    newPath = filePath.replace(/\.png$/i, '.webp');
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else {
    // JPG → compressed JPG (keep extension)
    newPath = filePath;
    // Write to temp first, then replace
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  // For JPG in-place replacement, write to temp and rename
  const tmpPath = newPath + '.tmp';
  await pipeline.toFile(isJpg ? tmpPath : newPath);

  if (isJpg) {
    const { rename } = await import('node:fs/promises');
    await rename(tmpPath, newPath);
  }

  const newSize = (await stat(newPath)).size;
  const pct = ((1 - newSize / originalSize) * 100).toFixed(0);

  return {
    filePath,
    newPath,
    originalSize,
    newSize,
    reduction: `${pct}%`,
  };
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function main() {
  console.log('🔍 Scanning images in public/...\n');

  const files = [];
  for await (const f of walk(PUBLIC)) {
    const ext = extname(f).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      files.push(f);
    }
  }

  console.log(`Found ${files.length} images\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let webpCount = 0;

  for (const file of files) {
    const result = await compressFile(file);
    if (result.skipped) continue;

    totalOriginal += result.originalSize;
    totalNew += result.newSize;
    if (result.newPath !== result.filePath) webpCount++;

    const origKB = (result.originalSize / 1024).toFixed(0);
    const newKB = (result.newSize / 1024).toFixed(0);
    console.log(`  ${result.filePath.replace(PUBLIC, '')}`);
    console.log(`    ${origKB} KB → ${newKB} KB  (${result.reduction})`);
  }

  console.log(`\n✅ Done!`);
  console.log(`   Total: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB → ${(totalNew / 1024 / 1024).toFixed(1)} MB (${((1 - totalNew / totalOriginal) * 100).toFixed(0)}% smaller)`);
  if (webpCount > 0) {
    console.log(`   ${webpCount} PNG(s) converted to WebP — remember to update references in code!`);
    console.log(`\n⚠️  Run: node scripts/update-paths.mjs  to update .webp references`);
  }
}

main().catch(console.error);
