'use client'

import { useEffect, useRef } from 'react'

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx!.scale(dpr, dpr)
    }
    resize()

    const count = Math.floor((width * height) / 9000)
    const particles = Array.from({ length: count }, () => {
      const cx = width / 2
      const cy = height * 0.42
      const maxR = Math.min(width, height) * 0.62
      const r = Math.sqrt(Math.random()) * maxR
      const angle = Math.random() * Math.PI * 2
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r * 1.15,
        baseR: r,
        angle,
        speed: (Math.random() - 0.5) * 0.0003,
        size: Math.random() * 1.3 + 0.3,
        twinkleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.15,
      }
    })

    let frame = 0
    let raf: number

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      frame += 1

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.angle += p.speed
          p.x = width / 2 + Math.cos(p.angle) * p.baseR
          p.y = height * 0.42 + Math.sin(p.angle) * p.baseR * 1.15
        }
        const twinkle = prefersReducedMotion
          ? p.opacity
          : p.opacity * (0.6 + 0.4 * Math.sin(frame * 0.02 + p.twinkleOffset))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,138,107,${twinkle})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    function handleResize() {
      resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-80"
    />
  )
}
