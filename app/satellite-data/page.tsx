import SatelliteClient from './satellite-client'

export const metadata = {
  title: 'Satellite Data - TerraSentinel OFIS',
}

export default function SatelliteDataPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Satellite</span> Data
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Integrated satellite imagery acquisition and AI-powered flood detection. Connected to Flood Analytics for complete intelligence.
          </p>
        </header>

        <SatelliteClient />
      </div>
    </main>
  )
}

