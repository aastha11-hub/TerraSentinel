'use client'

import { useEffect, useId, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    THREE?: any
  }
}

type Props = {
  containerId?: string
  className?: string
}

export default function CDNGlobe({ containerId = 'globe-container', className }: Props) {
  const instanceId = useId().replace(/:/g, '_')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    let renderer: any
    let scene: any
    let camera: any
    let globe: any

    const cleanup = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      try {
        renderer?.dispose?.()
      } catch {}
      try {
        if (renderer?.domElement?.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement)
        }
      } catch {}
      renderer = null
      scene = null
      camera = null
      globe = null
    }

    const init = () => {
      const THREE = window.THREE
      if (!THREE) return

      cleanup()

      const { clientWidth, clientHeight } = container
      scene = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000)
      camera.position.set(0, 0, 3.2)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(clientWidth, clientHeight)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.setAttribute('data-globe-instance', instanceId)
      container.appendChild(renderer.domElement)

      const ambient = new THREE.AmbientLight(0xffffff, 0.7)
      scene.add(ambient)

      const key = new THREE.DirectionalLight(0xffffff, 1.2)
      key.position.set(5, 2, 5)
      scene.add(key)

      const rim = new THREE.DirectionalLight(0x00f5ff, 0.8)
      rim.position.set(-5, -2, -5)
      scene.add(rim)

      const geometry = new THREE.SphereGeometry(1.1, 64, 64)
      const textureLoader = new THREE.TextureLoader()
      const earthTextureUrl = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'

      const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(earthTextureUrl, () => {
          renderer?.render?.(scene, camera)
        }),
        roughness: 1,
        metalness: 0,
      })

      globe = new THREE.Mesh(geometry, material)
      scene.add(globe)

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.13, 64, 64),
        new THREE.MeshStandardMaterial({
          color: 0x00f5ff,
          transparent: true,
          opacity: 0.08,
        }),
      )
      scene.add(atmosphere)

      const animate = () => {
        if (globe) globe.rotation.y += 0.002
        renderer.render(scene, camera)
        rafRef.current = requestAnimationFrame(animate)
      }

      animate()
    }

    const handleResize = () => {
      if (!renderer || !camera) return
      const { clientWidth, clientHeight } = container
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    }

    const existing = container.querySelector<HTMLCanvasElement>('canvas[data-globe-instance]')
    if (existing) existing.remove()

    const startWhenReady = () => {
      if (window.THREE) init()
    }
    startWhenReady()

    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      cleanup()
    }
  }, [containerId, instanceId])

  return (
    <>
      <Script
        src="https://unpkg.com/three@0.168.0/build/three.min.js"
        strategy="afterInteractive"
      />
      <div id={containerId} className={className} />
    </>
  )
}

