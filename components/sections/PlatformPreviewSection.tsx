'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function PlatformPreviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="demo" className="py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-gradient">Interactive</span>
            <br />
            <span className="text-white">Platform Preview</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore Earth observation data with our intuitive interface. Select dates, toggle
            spectral bands, and run advanced analysis with a single click.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Map Container */}
          <div className="glow-border bg-space-navy/50 backdrop-blur-sm h-[500px] md:h-[600px] relative overflow-hidden">
            {/* Placeholder map content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-cyan-accent/30 mx-auto mb-4 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-cyan-accent/50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-cyan-accent/20 rounded-full" />
                  </div>
                </div>
                <p className="text-white/50 text-sm">Interactive Map View</p>
              </div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>

          {/* Floating Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-4 right-4 md:top-8 md:right-8 glow-border bg-space-navy/90 backdrop-blur-md p-4 md:p-6 w-full max-w-[280px] md:w-64"
          >
            <h3 className="text-lg font-semibold text-cyan-accent mb-4">Controls</h3>
            <div className="space-y-4">
              {/* Date Selector */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Date Selector</label>
                <div className="border border-white/10 p-2 bg-space-navy/50">
                  <span className="text-white text-sm font-mono">2024-03-15</span>
                </div>
              </div>

              {/* Spectral Band Toggle */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Spectral Band</label>
                <div className="flex gap-2">
                  {['RGB', 'NIR', 'SWIR'].map((band) => (
                    <button
                      key={band}
                      className="flex-1 py-2 border border-white/10 hover:border-cyan-accent/50 transition-colors text-sm text-white"
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </div>

              {/* NDVI Switch */}
              <div>
                <label className="text-sm text-white/70 mb-2 flex items-center justify-between">
                  <span>NDVI</span>
                  <motion.div
                    className="w-10 h-5 bg-white/10 border border-white/20 relative cursor-pointer"
                    whileHover={{ borderColor: 'rgba(0, 245, 255, 0.5)' }}
                  >
                    <motion.div
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-cyan-accent"
                      initial={false}
                      animate={{ x: 20 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </label>
              </div>

              {/* Run Analysis Button */}
              <motion.button
                className="w-full py-3 border border-cyan-accent bg-cyan-accent/10 text-cyan-accent font-semibold text-sm glow-border-hover"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Run Analysis
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
