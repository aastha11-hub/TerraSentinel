import AnalyticsClient from './analytics-client'

export const metadata = {
  title: 'Flood Analytics - TerraSentinel',
}

export default function AnalyticsPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Flood</span> Analytics Dashboard
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Trends by state, affected districts, rainfall correlation, and historical flood patterns (demo dashboard).
          </p>
        </header>

        <AnalyticsClient />
      </div>
    </main>
  )
}

