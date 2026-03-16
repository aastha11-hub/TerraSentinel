export const metadata = {
  title: 'API / Data Access - TerraSentinel',
}

const endpoints = ['GET /api/flood/india', 'GET /api/flood/state/gujarat']

export default function ApiPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">API</span> / Data Access
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Developer-friendly endpoints for querying flood intelligence (example endpoints).
          </p>
        </header>

        <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-accent mb-4">Example endpoints</h2>
          <div className="space-y-3">
            {endpoints.map((e) => (
              <pre
                key={e}
                className="border border-white/10 bg-black/40 rounded-xl p-4 overflow-x-auto text-sm"
              >
                <code className="text-white/85 font-mono">{e}</code>
              </pre>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

