import LiveMapClient from './live-map-client'

export const metadata = {
  title: 'Live Flood Map - TerraSentinel',
}

export default function LiveMapPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Live</span> Flood Monitoring Map
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Interactive India map with flood overlays, satellite layer toggle, search, and latest imagery timestamp.
          </p>
        </header>

        <LiveMapClient />
      </div>
    </main>
  )
}

