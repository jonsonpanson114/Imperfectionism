import { createCanvas, loadImage } from '@napi-rs/canvas';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function generateIcon(size: number, outputPath: string) {
  const svg = await readFile(join(process.cwd(), 'public/icon.svg'), 'utf-8');

  // SVGをCanvasに描画してPNGに変換
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // SVGをDataURLに変換してImageとして読み込み
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  const img = await loadImage(dataUrl);

  ctx.drawImage(img, 0, 0, size, size);

  const png = canvas.toBuffer('image/png');
  await writeFile(outputPath, png);
  console.log(`✓ Generated ${outputPath}`);
}

async function main() {
  const publicDir = join(process.cwd(), 'public');

  await Promise.all([
    generateIcon(192, join(publicDir, 'icon-192.png')),
    generateIcon(512, join(publicDir, 'icon-512.png')),
    generateIcon(180, join(publicDir, 'apple-touch-icon.png')),
  ]);

  console.log('\nAll icons generated successfully!');
}

main().catch(console.error);
