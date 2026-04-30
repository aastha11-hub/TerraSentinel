import ResearchClient from './research-client'

export const metadata = {
  title: 'Research / Technology - TerraSentinel',
}

export default function ResearchPage() {
  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <ResearchClient />
      </div>
    </main>
  )
}

