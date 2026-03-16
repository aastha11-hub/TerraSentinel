import fs from 'node:fs'
import path from 'node:path'

const target = path.resolve(process.cwd(), '.next')

try {
  fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  // eslint-disable-next-line no-console
  console.log('Cleaned .next')
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Failed to clean .next:', err?.message ?? err)
  process.exitCode = 0
}

