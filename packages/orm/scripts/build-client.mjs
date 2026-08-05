import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const compiledClient = 'dist/prisma/generated/client'
const publishedClient = 'dist/generated/client'

if (!existsSync(compiledClient)) {
  console.error(
    `Expected compiled client at ${compiledClient}. Run \`tsc\` first.`,
  )
  process.exit(1)
}

await rm(publishedClient, { recursive: true, force: true })
await mkdir(publishedClient, { recursive: true })
await cp(compiledClient, publishedClient, { recursive: true })

await writeFile(
  `${publishedClient}/index.js`,
  "module.exports = require('./client')\n",
)
await writeFile(`${publishedClient}/index.d.ts`, "export * from './client'\n")

console.log(`Built published client at ${publishedClient}`)
