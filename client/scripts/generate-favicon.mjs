import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
mkdirSync(publicDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="52" fill="#3B82C4"/>
  <text x="128" y="142" font-family="Arial, Helvetica, sans-serif" font-size="158" font-weight="700" fill="#FFFFFF" text-anchor="middle">L</text>
</svg>`;

const svgBuffer = Buffer.from(svg);
const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();

writeFileSync(join(publicDir, 'favicon.png'), png32);
writeFileSync(join(publicDir, 'favicon.ico'), await pngToIco([png16, png32]));

console.log('Generated favicon.png and favicon.ico in client/public');
