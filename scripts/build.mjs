// Production build: bundles src/js entry points into classic (IIFE) scripts + compiles Tailwind CSS
import { build } from 'esbuild'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const common = {
  bundle: true,
  format: 'iife',
  target: ['es2019'],
  minify: true,
  sourcemap: false,
  logLevel: 'info',
  legalComments: 'none',
}

const targets = [
  { entryPoints: [join(root, 'src/js/main.js')], outfile: join(root, 'assets/js/main.bundle.js') },
  { entryPoints: [join(root, 'src/js/scenes.js')], outfile: join(root, 'assets/js/scenes.bundle.js') },
  { entryPoints: [join(root, 'src/js/projects.js')], outfile: join(root, 'assets/js/projects.bundle.js') },
]

await Promise.all(targets.map((t) => build({ ...common, ...t })))

// Tailwind CSS
const css = spawnSync('npx', ['tailwindcss', '-i', 'src/input.css', '-o', 'assets/css/styles.css', '--minify'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
if (css.status !== 0) process.exit(css.status ?? 1)
console.log('build done ✔')
