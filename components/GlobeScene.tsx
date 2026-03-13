'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function RotatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00F5FF" />
      
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a4d7a"
          emissive="#00F5FF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      <Sphere args={[2.1, 64, 64]}>
        <meshStandardMaterial
          color="#00F5FF"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      <Stars radius={300} depth={60} count={2000} factor={4} fade speed={0.5} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </>
  )
}

export default function GlobeScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <RotatingGlobe />
      </Canvas>
    </div>
  )
}
