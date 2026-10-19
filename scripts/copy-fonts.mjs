// Copy Vazirmatn variable woff2 subsets from node_modules into assets/fonts (shipped locally)
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', '@fontsource-variable', 'vazirmatn', 'files')
const dest = join(root, 'assets', 'fonts')

mkdirSync(dest, { recursive: true })

const files = [
  ['vazirmatn-arabic-wght-normal.woff2', 'vazirmatn-arabic.woff2'],
  ['vazirmatn-latin-wght-normal.woff2', 'vazirmatn-latin.woff2'],
]

for (const [from, to] of files) {
  const fromPath = join(src, from)
  if (existsSync(fromPath)) {
    copyFileSync(fromPath, join(dest, to))
    console.log('copied', to)
  } else {
    console.warn('missing font file:', from)
  }
}
