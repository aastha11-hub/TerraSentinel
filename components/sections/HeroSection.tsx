'use client'

import { motion } from 'framer-motion'
import GlobeScene from '../GlobeScene'

export default function HeroSection() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => {
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          const randomOpacity = Math.random() * 0.5 + 0.2
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
                y: [`${randomY}%`, `${(randomY + Math.random() * 20) % 100}%`],
                opacity: [randomOpacity, randomOpacity * 0.5, randomOpacity],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )
        })}
      </div>

      {/* 3D Globe */}
      <div className="absolute inset-0 z-0">
        <GlobeScene />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-white">Remote Sensing</span>
            <br />
            <span className="text-white">Intelligence</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Real-time satellite data. Advanced Earth insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="px-8 py-4 text-lg font-semibold glow-border glow-border-hover bg-space-navy/50 backdrop-blur-sm text-cyan-accent relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore Platform</span>
              <motion.div
                className="absolute inset-0 bg-cyan-accent/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, repeat: Infinity, duration: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-cyan-accent/50 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-cyan-accent rounded-full mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
