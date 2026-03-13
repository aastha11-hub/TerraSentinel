'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AIAnalysisSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 px-6 sm:px-8 lg:px-12 bg-space-navy/50 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-white">Analysis Engine</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Advanced machine learning models process satellite imagery in real-time, extracting
            actionable insights from petabytes of Earth observation data.
          </p>
        </motion.div>

        {/* Waveform Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 h-32 flex items-end justify-center gap-1"
        >
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-cyan-accent"
              initial={{ height: 10 }}
              animate={{
                height: [
                  Math.random() * 60 + 20,
                  Math.random() * 80 + 30,
                  Math.random() * 60 + 20,
                ],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>

        {/* Model Metadata UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glow-border bg-space-navy/70 backdrop-blur-sm p-8">
            <h3 className="text-xl font-semibold text-cyan-accent mb-6">Processing Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Model</span>
                <span className="text-white font-mono">FloodNet-v1</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Data Source</span>
                <span className="text-white font-mono">Sentinel-2</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/70">Processing Time</span>
                <motion.span
                  className="text-cyan-accent font-mono text-lg"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  2.8s
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
