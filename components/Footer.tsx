'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'GitHub', href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-cyan-accent mb-4">TerraSentinel</h3>
            <p className="text-white/60 text-sm">
              AI-powered satellite intelligence for flood monitoring across India.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/research-technology" className="text-white/60 hover:text-cyan-accent text-sm transition-colors">
                  Research / Technology
                </Link>
              </li>
              <li>
                <Link href="/api-data-access" className="text-white/60 hover:text-cyan-accent text-sm transition-colors">
                  API / Data Access
                </Link>
              </li>
              <li>
                <Link href="/satellite-data" className="text-white/60 hover:text-cyan-accent text-sm transition-colors">
                  Satellite Data
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-cyan-accent transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">{link.name}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-white/60 text-sm text-center">
            © {new Date().getFullYear()} TerraSentinel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
