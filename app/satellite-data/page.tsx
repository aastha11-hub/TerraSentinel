const sources = [
  {
    title: 'ISRO (Indian Space Research Organisation)',
    description:
      'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.',
  },
  {
    title: 'Bhuvan Geoportal',
    description:
      'ISRO’s geospatial platform providing map services and thematic layers that can support flood situational awareness.',
  },
  {
    title: 'RISAT',
    description:
      'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.',
  },
  {
    title: 'Resourcesat',
    description:
      'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.',
  },
  {
    title: 'Cartosat',
    description:
      'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.',
  },
]

export const metadata = {
  title: 'Satellite Data - TerraSentinel',
}

export default function SatelliteDataPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Satellite</span> Data Sources
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            TerraSentinel integrates satellite imagery pipelines aligned with Indian Earth observation ecosystems.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((s) => (
            <div key={s.title} className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-cyan-accent">{s.title}</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

