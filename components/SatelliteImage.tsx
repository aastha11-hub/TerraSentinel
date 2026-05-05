'use client'

import { useState, useEffect } from 'react'

interface SatelliteImageProps {
  apiSrc?: string
  localSrc: string
  alt: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export default function SatelliteImage({ 
  apiSrc, 
  localSrc, 
  alt, 
  className = '', 
  onLoad,
  onError 
}: SatelliteImageProps) {
  const [hasError, setHasError] = useState(false)

  // Direct image loading
  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${localSrc}`)
    setHasError(false)
    onLoad?.()
  }

  const handleImageError = (e: any) => {
    console.error(`Image load error: ${localSrc}`, e)
    setHasError(true)
    onError?.()
  }

  // Always render the image immediately
  return (
    <div className={`relative ${className}`}>
      <img
        src={localSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent animate-pulse" />
      </div>
    </div>
  )
}
