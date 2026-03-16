'use client'

import { motion } from 'framer-motion'
import CDNGlobe from '../CDNGlobe'

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_10%,rgba(0,245,255,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(0,245,255,0.10),transparent_35%)]" />
        {[...Array(28)].map((_, i) => {
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          const randomOpacity = Math.random() * 0.5 + 0.15
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-accent rounded-full"
              initial={{
                x: `${randomX}%`,
                y: `${randomY}%`,
                opacity: randomOpacity,
              }}
              animate={{
                y: [`${randomY}%`, `${(randomY + Math.random() * 18) % 100}%`],
                opacity: [randomOpacity, randomOpacity * 0.5, randomOpacity],
              }}
              transition={{
                duration: Math.random() * 10 + 12,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-gradient">TerraSentinel</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-white/80 max-w-xl">
              AI-Powered Remote Sensing Intelligence
            </p>
            <p className="mt-4 text-base sm:text-lg text-white/65 max-w-xl leading-relaxed">
              Real-time satellite intelligence for flood monitoring across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/live-map"
                className="px-6 py-3 text-sm sm:text-base font-semibold glow-border glow-border-hover bg-space-navy/50 backdrop-blur-sm text-cyan-accent"
              >
                View Live Flood Map
              </a>
              <a
                href="/analytics"
                className="px-6 py-3 text-sm sm:text-base font-semibold border border-white/15 hover:border-cyan-accent/40 text-white/85 hover:text-cyan-accent transition-colors bg-white/5"
              >
                Explore Analytics
              </a>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="glow-border bg-space-navy/30 backdrop-blur-sm rounded-2xl p-4">
              <CDNGlobe
                containerId="globe-container"
                className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[500px] lg:h-[500px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
