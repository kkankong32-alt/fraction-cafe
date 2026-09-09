import { readFile, writeFile, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const builtHtmlPath = resolve(root, 'dist', 'index.html');
let html = await readFile(builtHtmlPath, 'utf8');
const cssMatch = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
const jsMatch = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
if (!cssMatch || !jsMatch) throw new Error('Built CSS or JavaScript entry was not found.');
const fromDist = (href) => resolve(root, 'dist', href.replace(/^\.\//, ''));
let css = await readFile(fromDist(cssMatch[1]), 'utf8');
let js = await readFile(fromDist(jsMatch[1]), 'utf8');
css = css.replaceAll('url(../A01.png)', 'url(./image/A01.png)');
css = css.replaceAll('</style', '<\\/style');
js = js.replaceAll('</script', '<\\/script');
html = html
  .replace(cssMatch[0], () => `<style>${css}</style>`)
  .replace(jsMatch[0], () => `<script type="module">${js}</script>`);
html = html.replace('<html lang="ko">','<html lang="ko" data-standalone="true">');
html = html.replace('</head>', '<!-- 더블클릭으로 실행 가능한 독립 실행 파일입니다. --></head>');
await writeFile(resolve(root, 'index.html'), html, 'utf8');
await cp(resolve(root,'audio'),resolve(root,'dist/audio'),{recursive:true});
