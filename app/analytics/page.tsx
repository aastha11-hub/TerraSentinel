import AnalyticsClient from './analytics-client'

export const metadata = {
  title: 'Flood Analytics - TerraSentinel OFIS',
}

export default function AnalyticsPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Operational</span> Flood Intelligence
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Real-time satellite-based flood monitoring and prediction system. Live data from Sentinel-1/2, GPM, and ERA5 sources.
          </p>
        </header>

        <AnalyticsClient />
      </div>
    </main>
  )
}

