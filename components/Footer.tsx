import Link from 'next/link'

const intelligenceLinks = [
  { label: 'Live Flood Monitoring', href: '/live-map' },
  { label: 'Satellite Telemetry', href: '/satellite-data' },
  { label: 'AI Flood Detection', href: '/analytics' },
  { label: 'Geospatial Analytics', href: '/analytics' },
  { label: 'Disaster Mapping', href: '/live-map' },
]

const researchLinks = [
  { label: 'Earth Observation', href: '/satellite-data' },
  { label: 'Climate Intelligence', href: '/research' },
  { label: 'Hydrological Analytics', href: '/analytics' },
  { label: 'Remote Sensing', href: '/satellite-data' },
  { label: 'Predictive Flood Models', href: '/analytics' },
]

const utilityLinks = [
  { label: 'Sitemap', href: '/' },
  { label: 'API / Data Access', href: '/api' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Research Documentation', href: '/research' },
  { label: 'Emergency Response Network', href: '/live-map' },
  { label: 'Contact', href: 'mailto:terra.sentinel@isro.gov.in' },
]

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: (
      <path
        fill="currentColor"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
      />
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: (
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
  {
    name: 'Email',
    href: 'mailto:terra.sentinel@isro.gov.in',
    icon: (
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      />
    ),
  },
]

function FooterColumn({
  title,
  links,
  id,
}: {
  title: string
  links: { label: string; href: string }[]
  id: string
}) {
  return (
    <nav aria-labelledby={id}>
      <h3
        id={id}
        className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90"
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] text-white/55 transition-colors duration-200 hover:text-cyan-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-accent/20 bg-space-navy/95 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-overlay bg-grid opacity-[0.28]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/45 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section 1 — main grid */}
        <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 lg:py-9 xl:gap-8">
          {/* Left — brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-cyan-accent/45 bg-cyan-accent/5 shadow-[0_0_14px_rgba(0,245,255,0.2)] transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-full bg-cyan-accent shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
                <span className="absolute inset-0 scale-[1.35] rounded-full border border-cyan-accent/25" />
              </span>
              <span className="text-xl font-bold tracking-wide text-gradient">
                TerraSentinel
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/55">
              AI-powered satellite intelligence platform for real-time flood monitoring,
              disaster analytics, and geospatial awareness across India.
            </p>
            <Link
              href="/live-map"
              className="mt-4 inline-flex items-center gap-2 rounded border border-cyan-accent/30 bg-cyan-accent/[0.06] px-3 py-1.5 transition-colors duration-200 hover:border-cyan-accent/50 hover:bg-cyan-accent/10"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-accent shadow-[0_0_6px_rgba(0,245,255,0.9)]"
                aria-hidden
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-accent/90">
                Monitoring Earth Systems in Real Time
              </span>
            </Link>
          </div>

          {/* Center columns */}
          <div className="lg:col-span-2">
            <FooterColumn
              id="footer-intelligence"
              title="Intelligence Network"
              links={intelligenceLinks}
            />
          </div>
          <div className="lg:col-span-3">
            <FooterColumn
              id="footer-research"
              title="Research & Systems"
              links={researchLinks}
            />
          </div>

          {/* Right — connect */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3
              id="footer-connect"
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90"
            >
              Connect
            </h3>
            <div className="flex flex-wrap gap-2.5" aria-labelledby="footer-connect">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.name === 'Email' ? undefined : '_blank'}
                  rel={link.name === 'Email' ? undefined : 'noopener noreferrer'}
                  aria-label={link.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-all duration-300 hover:border-cyan-accent/45 hover:bg-cyan-accent/10 hover:text-cyan-accent hover:shadow-[0_0_14px_rgba(0,245,255,0.35)]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden>
                    {link.icon}
                  </svg>
                </a>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-snug text-white/40">
              24/7 Monitoring Infrastructure
            </p>
          </div>
        </div>

        {/* Section 2 — divider */}
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-cyan-accent/25 to-transparent"
          role="separator"
          aria-hidden
        />

        {/* Section 3 — bottom utility bar */}
        <div className="py-4 lg:py-5">
          <nav
            aria-label="Footer utility links"
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
          >
            {utilityLinks.map((link, index) => (
              <span key={link.label} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 hidden text-white/20 sm:inline" aria-hidden>
                    |
                  </span>
                )}
                {link.href.startsWith('mailto:') ? (
                  <a
                    href={link.href}
                    className="px-1 text-[11px] text-white/50 transition-colors duration-200 hover:text-cyan-accent sm:text-xs"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="px-1 text-[11px] text-white/50 transition-colors duration-200 hover:text-cyan-accent sm:text-xs"
                  >
                    {link.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <p className="mt-3 text-center text-[10px] tracking-wide text-white/35 sm:text-[11px]">
            © 2026 TerraSentinel — Earth Observation &amp; Flood Intelligence Network
          </p>
        </div>
      </div>
    </footer>
  )
}
