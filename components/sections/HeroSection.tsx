'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import CDNGlobe from '../CDNGlobe'
import { useAuth } from '@/contexts/AuthContext'

export default function HeroSection() {
  const { user } = useAuth();
  const [selectedState, setSelectedState] = React.useState<any>(null);

  return (
    <section className="relative min-h-[calc(100vh-5rem)] pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-cyan-accent/20 via-transparent to-blue-accent/10" />
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
            <div className="mb-4">
              {user ? (
                <div className="flex items-center gap-3 text-cyan-accent/80 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Welcome back, {user.name}!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Sign in to access your dashboard
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-gradient">TerraSentinel</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-white/80 max-w-xl">
              AI-Powered Remote Sensing Intelligence
            </p>
            <p className="mt-4 text-base sm:text-lg text-white/65 max-w-xl leading-relaxed">
              {user 
                ? `Monitor real-time flood data and satellite imagery across India. Your last login was ${new Date(user.loginTime).toLocaleDateString()}.`
                : 'Real-time satellite intelligence for flood monitoring across India. Get instant access to live data and analytics.'
              }
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 text-sm sm:text-base font-semibold glow-border glow-border-hover bg-space-navy/50 backdrop-blur-sm text-cyan-accent"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/satellite-data"
                    className="px-6 py-3 text-sm sm:text-base font-semibold border border-white/15 hover:border-cyan-accent/40 text-white/85 hover:text-cyan-accent transition-colors bg-white/5"
                  >
                    View Satellite Data
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/live-map"
                    className="px-6 py-3 text-sm sm:text-base font-semibold glow-border glow-border-hover bg-space-navy/50 backdrop-blur-sm text-cyan-accent"
                  >
                    View Live Flood Map
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 text-sm sm:text-base font-semibold border border-white/15 hover:border-cyan-accent/40 text-white/85 hover:text-cyan-accent transition-colors bg-white/5"
                  >
                    Sign In for Full Access
                  </Link>
                </>
              )}
            </div>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-accent">24/7</div>
                <div className="text-xs text-white/60 mt-1">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-accent">15+</div>
                <div className="text-xs text-white/60 mt-1">Satellites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-accent">Real-time</div>
                <div className="text-xs text-white/60 mt-1">Data</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - Enhanced Earth Globe */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="glow-border bg-space-navy/30 backdrop-blur-sm rounded-2xl p-4 relative">

            {/* LIVE Indicator */}
             <div className="absolute top-4 right-4 z-20">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">
                  LIVE AI MONITORING
                </span>
              </div>
             </div>
          
            {/* Image Container */}
              <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[500px] lg:h-[500px] rounded-2xl overflow-hidden">
          
              {/* Satellite Image */}
              <img
                src="/India.jpg.avif"
                alt="India Satellite"
                className="w-full h-full object-cover"
              />
          
              {/* Dark Overlay */}
               <div className="absolute inset-0 bg-black/40"></div>

              {/* AI Scan Line */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-full h-[2px] bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)] animate-scan"></div>
              </div>

              {/* Gujarat */}
              <div
                onClick={() => 
                  setSelectedState({
                    name: 'Gujarat',
                    risk: 'High',
                    water: '18 km²',
                    rainfall: '42%',
                    updated: '2 minutes ago',
                  })
                }
                className="absolute top-[38%] left-[20%] w-16 h-12 border border-green-400 rounded-sm animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)] hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="absolute -top-5 left-0 bg-black/80 px-1 py-[2px] rounded text-[9px] text-green-400 border border-green-400/30 whitespace-nowrap">
                 Gujarat • 87%
                </div>

            </div>
              

            

            {/* Assam */}
            <div
              onClick={() =>
                setSelectedState({
                  name: 'Assam',
                  risk: 'Critical',
                  water: '31 km²',
                  rainfall: '68%',
                  updated: '1 min ago',
                })
              }
             className="absolute top-[28%] right-[9%] w-14 h-10 border border-green-400 rounded-sm animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)] hover:scale-105 transition-transform duration-300">

            <div className="absolute -top-5 left-0 bg-black/80 px-1 py-[2px] rounded text-[9px] text-green-400 border border-green-400/30 whitespace-nowrap">
             Assam • 91%
            </div>

            </div>

            {/* Maharashtra */}
            <div
              onClick={() =>
                setSelectedState({
                 name: 'Maharashtra',
                 risk: 'Moderate',
                 water: '12 km²',
                 rainfall: '33%',
                 updated: '5 mins ago',
                })
              }
             className="absolute bottom-[43%] left-[30%] w-16 h-12 border border-green-400 rounded-sm animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)] hover:scale-105 transition-transform duration-300">

            <div className="absolute -top-5 left-0 bg-black/80 px-1 py-[2px] rounded text-[9px] text-green-400 border border-green-400/30 whitespace-nowrap">
             Maharashtra • 82%
            </div>

            </div>

            {/* Kerala */}
            <div
              onClick={() =>
               setSelectedState({
                 name: 'Kerala',
                 risk: 'High',
                 water: '22 km²',
                 rainfall: '51%',
                 updated: '3 mins ago',
                })
              }
             className="absolute top-[80%] left-[43%] w-8 h-14 border border-green-400 rounded-sm animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)] hover:scale-105 transition-transform duration-300">

            <div className="absolute -top-5 left-0 bg-black/80 px-1 py-[2px] rounded text-[9px] text-green-400 border border-green-400/30 whitespace-nowrap">
             Kerala • 76%
            </div>
          </div>
           </div>
            {/* AI Flood Heat Zones */}

{/* Gujarat Heat */}
<div className="absolute top-[34%] left-[16%] w-28 h-28 bg-green-500/50 blur-xl rounded-full animate-pulse pointer-events-none"></div>

{/* Assam Heat */}
<div className="absolute top-[22%] right-[6%] w-36 h-36 bg-red-500/60 blur-xl rounded-full animate-pulse pointer-events-none"></div>

{/* Maharashtra Heat */}
<div className="absolute bottom-[26%] left-[26%] w-28 h-28 bg-yellow-500/50 blur-xl rounded-full animate-pulse pointer-events-none"></div>

{/* Kerala Heat */}
<div className="absolute bottom-[4%] left-[38%] w-20 h-20 bg-green-400/50 blur-xl rounded-full animate-pulse pointer-events-none"></div>


{/* Radar Sweep */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">

  <div className="w-[140%] h-[140%] border border-green-400/10 rounded-full animate-radar"></div>

</div>

            {/* AI Info Panel */}
            {selectedState && (
            <div className="absolute bottom-6 left-6 z-30 w-64 bg-black/80 backdrop-blur-md border border-cyan-400/40 rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            
            <div className="relative mb-3">
             <h3 className="text-cyan-400 font-semibold text-sm">
              AI Region Analysis
             </h3>

             <button
               onClick={() => setSelectedState(null)}
               className="absolute top-0 right-0 text-white/50 hover:text-red-400 transition"
              >
                 ✕
              </button>
            </div>

             <div className="space-y-2 text-xs text-white/80">
             <p>
             <span className="text-white/50">State:</span> {selectedState.name}
             </p>

             <p>
             <span className="text-white/50">Flood Risk:</span> {selectedState.risk}
             </p>

             <p>
             <span className="text-white/50">Water Spread:</span> {selectedState.water}
             </p>

             <p>
             <span className="text-white/50">Rainfall Increase:</span> {selectedState.rainfall}
             </p>

             <p>
             <span className="text-white/50">Updated:</span> {selectedState.updated}
             </p>
            </div>

            </div>
          )}   
           

            {/* Bottom Text */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-xs text-white/50">
                AI analyzing satellite flood regions across India
              </p>
            </div>
          
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
