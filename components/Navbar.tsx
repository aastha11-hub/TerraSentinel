'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Live Flood Map', href: '/live-map' },
    { name: 'Satellite Data', href: '/satellite-data' },
    { name: 'Flood Analytics', href: '/analytics' },
    { name: 'Research / Technology', href: '/research' },
    { name: 'API / Data Access', href: '/api' },
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
            
            {/* User Authentication Section */}
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                >
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-white/80">{user.name}</span>
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-space-navy/95 backdrop-blur-sm border border-cyan-accent/20 rounded-lg shadow-xl"
                  >
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium glow-border glow-border-hover bg-space-navy/50 backdrop-blur-sm text-cyan-accent rounded-lg"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
