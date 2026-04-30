import ApiClient from './api-client'

export const metadata = {
  title: 'API / Data Access - TerraSentinel',
}

export default function ApiPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">API</span> / Data Access
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Professional space agency-grade API endpoints for accessing real-time flood intelligence, satellite data, and climate analytics.
          </p>
        </header>

        <ApiClient />
      </div>
    </main>
  )
}

