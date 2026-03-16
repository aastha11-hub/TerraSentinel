'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Live Flood Map', href: '/live-map' },
    { name: 'Satellite Data', href: '/satellite-data' },
    { name: 'Flood Analytics', href: '/analytics' },
    { name: 'Research / Technology', href: '/research' },
    { name: 'API / Data Access', href: '/api' },
    { name: 'Login / Signup', href: '/login' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-space-navy/80 backdrop-blur-md border-b border-cyan-accent/20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="inline-flex items-center gap-2">
            <motion.div
              className="text-2xl font-bold text-cyan-accent tracking-wide"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              TerraSentinel
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="relative group">
                <span className="text-sm text-white/80 group-hover:text-cyan-accent transition-colors">
                  {link.name}
                </span>
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-cyan-accent/80 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
