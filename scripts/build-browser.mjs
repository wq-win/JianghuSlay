import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await stat(resolve(root, 'web/local/session.js'));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: ['web/public/app.js'],
  outfile: 'dist/app.js',
  bundle: true,
  minify: true,
  sourcemap: false,
  format: 'esm',
  target: ['es2022'],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof',
  metafile: true,
  logLevel: 'info',
});
for (const file of ['index.html', 'styles.css', 'card-art.css', 'layout.css', 'skill-ui.css', 'portraits', 'portraits-expansion', 'portraits-yxs', 'portraits-yxs-next', 'portraits-yxs-third', 'portraits-yxs-fourth', 'portraits-yxs-fifth', 'portraits-yxs-sixth', 'portraits-yxs-seventh', 'portraits-yxs-eighth', 'portraits-yxs-ninth', 'portraits-sgs-base-next', 'portraits-sgs-following', 'portraits-sgs-wind', 'portraits-sgs-next-identity', 'portraits-sgs-fire', 'portraits-sgs-forest', 'portraits-sgs-mountain', 'portraits-sgs-yijiang', 'portraits-sgs-yijiang-following', 'portraits-sgs-yijiang-next', 'portraits-sgs-yijiang-later', 'portraits-sgs-yijiang-more', 'portraits-sgs-yijiang-further','portraits-sgs-followup','portraits-sgs-identity-next','portraits-sgs-future-identity','portraits-sgs-obligation-identity','portraits-sgs-confirmed-support','portraits-yxs-modern', 'skill-icons']) {
  await cp(resolve(root, 'web/public', file), resolve(output, file), { recursive: true, filter: async path => (await stat(path)).isDirectory() || /\.(?:html|css|svg|png|jpe?g|webp|woff2?)$/i.test(path) });
}
const html = await readFile(resolve(output, 'index.html'), 'utf8');
if (/(?:src|href)=["'](?:https?:|\/static)/.test(html)) {
  throw new Error('Static entry page unexpectedly depends on an external asset.');
}
console.log('Browser game ready in dist/. Serve it at / or any nested path, including /game/jianghu-slay/.');
