'use client'

import { useEffect } from 'react'

export default function GlowEffect() {
  useEffect(() => {
    const wrappers = document.querySelectorAll('.glow-container')
    if (!wrappers.length) return

    const cleanups: (() => void)[] = []

    wrappers.forEach(el => {
      const borderWrap = document.createElement('div')
      borderWrap.className = 'glowing-effect-container'

      const glowInner = document.createElement('div')
      glowInner.className = 'glowing-effect-inner'

      borderWrap.appendChild(glowInner)
      el.insertBefore(borderWrap, el.firstChild)

      borderWrap.style.setProperty('--start', '0')
      borderWrap.style.setProperty('--active', '0')
      let animationFrame = 0

      const handleMove = (e: PointerEvent) => {
        if (animationFrame) cancelAnimationFrame(animationFrame)

        animationFrame = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect()
          const mouseX = e.clientX
          const mouseY = e.clientY

          const center = [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5]

          const proximity = 150

          const hoverActive =
            mouseX > rect.left - proximity &&
            mouseX < rect.right + proximity &&
            mouseY > rect.top - proximity &&
            mouseY < rect.bottom + proximity

          borderWrap.style.setProperty('--active', hoverActive ? '1' : '0')

          if (hoverActive) {
            let targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90
            borderWrap.style.setProperty('--start', String(targetAngle))
          }
        })
      }

      document.body.addEventListener('pointermove', handleMove as EventListener, { passive: true })

      cleanups.push(() => {
        document.body.removeEventListener('pointermove', handleMove as EventListener)
        if (animationFrame) cancelAnimationFrame(animationFrame)
        borderWrap.remove()
      })
    })

    return () => {
      cleanups.forEach(cleanup => cleanup())
    }
  }, [])

  return null
}
