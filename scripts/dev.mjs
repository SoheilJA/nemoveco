// Dev mode: watch JS bundles (esbuild) + Tailwind CSS simultaneously
import { context } from 'esbuild'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const common = {
  bundle: true,
  format: 'iife',
  target: ['es2019'],
  minify: false,
  sourcemap: true,
  logLevel: 'info',
}

const targets = [
  { entryPoints: [join(root, 'src/js/main.js')], outfile: join(root, 'assets/js/main.bundle.js') },
  { entryPoints: [join(root, 'src/js/scenes.js')], outfile: join(root, 'assets/js/scenes.bundle.js') },
  { entryPoints: [join(root, 'src/js/projects.js')], outfile: join(root, 'assets/js/projects.bundle.js') },
]

const ctxs = await Promise.all(targets.map((t) => context({ ...common, ...t })))
await Promise.all(ctxs.map((c) => c.watch()))

const css = spawn('npx', ['tailwindcss', '-i', 'src/input.css', '-o', 'assets/css/styles.css', '--watch'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
css.on('close', () => process.exit(0))
console.log('dev watchers ready — editing src/ will rebuild assets/')
