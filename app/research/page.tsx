export const metadata = {
  title: 'Research / Technology - TerraSentinel',
}

const cards = [
  {
    title: 'NDWI (Normalized Difference Water Index)',
    body:
      'Water detection method derived from green and NIR bands to help separate water bodies from vegetation and built-up areas.',
  },
  {
    title: 'Radar-based flood detection',
    body:
      'SAR (radar) imaging supports all-weather flood mapping and can be robust under cloud cover common during monsoon events.',
  },
  {
    title: 'AI flood classification model',
    body:
      'A supervised model classifies pixels/tiles into flood vs non-flood classes, fusing multi-source observations into a consistent output.',
  },
]

export default function ResearchPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Research</span> / Technology
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            How TerraSentinel detects floods from satellite data using remote sensing indices and AI.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-cyan-accent">{c.title}</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-accent">Processing pipeline</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            {['Satellite Image', 'Preprocessing', 'AI Model', 'Flood Detection Map'].map((step, idx) => (
              <div key={step} className="border border-white/10 bg-black/20 px-4 py-4 rounded-xl">
                <div className="text-white/55 text-xs">Step {idx + 1}</div>
                <div className="mt-1 text-white">{step}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-white/55 text-sm">
            Satellite Image → Preprocessing → AI Model → Flood Detection Map
          </div>
        </div>
      </div>
    </main>
  )
}

