import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')

if (!fs.existsSync(envPath)) {
  if (!fs.existsSync(examplePath)) {
    console.error('Missing .env and .env.example. Create a .env file with DATABASE_URL.')
    process.exit(1)
  }
  fs.copyFileSync(examplePath, envPath)
  console.log('Created .env from .env.example')
}

const envContents = fs.readFileSync(envPath, 'utf8')
const match = envContents.match(/^DATABASE_URL=(.+)$/m)

if (!match?.[1]?.trim()) {
  console.error('DATABASE_URL is missing in .env')
  console.error('Add a PostgreSQL connection string, for example:')
  console.error('DATABASE_URL=postgresql://user:password@host:5432/terrasentinel?schema=public')
  process.exit(1)
}

const value = match[1].trim()
if (
  value.includes('user:password@localhost') ||
  value.includes('your_') ||
  value === 'postgresql://user:password@localhost:5432/terrasentinel?schema=public'
) {
  console.warn('Warning: DATABASE_URL still uses placeholder values in .env')
  console.warn('Use a real database URL from local PostgreSQL, Neon, Supabase, or Vercel Postgres.')
}
