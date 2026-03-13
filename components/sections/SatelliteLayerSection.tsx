'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SatelliteLayerSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const layers = [
    { name: 'Sentinel-2', active: true },
    { name: 'Landsat-8', active: false },
    { name: 'MODIS', active: false },
    { name: 'VIIRS', active: false },
  ]

  return (
    <section id="technology" className="py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text Block */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-gradient">Multi-Source</span>
              <br />
              <span className="text-white">Satellite Intelligence</span>
            </h2>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Access real-time data from multiple satellite constellations. Our platform aggregates
              and processes imagery from Sentinel-2, Landsat-8, MODIS, and VIIRS to provide
              comprehensive Earth observation insights.
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              Switch between satellite layers seamlessly. Each source provides unique spectral
              capabilities optimized for different analysis types.
            </p>
          </motion.div>

          {/* Right: Animated UI Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glow-border bg-space-navy/50 backdrop-blur-sm p-8 min-h-[400px]">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-accent mb-4">Satellite Layers</h3>
                <div className="space-y-2">
                  {layers.map((layer, index) => (
                    <motion.div
                      key={layer.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`p-4 border transition-all ${
                        layer.active
                          ? 'border-cyan-accent bg-cyan-accent/10'
                          : 'border-white/10 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{layer.name}</span>
                        {layer.active && (
                          <motion.div
                            className="w-2 h-2 bg-cyan-accent rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Placeholder map area */}
              <div className="mt-8 h-64 bg-space-navy border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-2 border-cyan-accent/30 mx-auto mb-4 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-cyan-accent/50 rounded-full" />
                    </div>
                    <p className="text-white/50 text-sm">Satellite View</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
