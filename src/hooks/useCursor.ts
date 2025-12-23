import { useEffect } from 'react'
import gsap from 'gsap'

export function useCursor() {
  useEffect(() => {
    // Only enable on desktop
    if (window.innerWidth <= 768) return

    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    cursor.style.cssText = `
      width: 20px;
      height: 20px;
      border: 2px solid #DC2626;
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.15s ease;
      display: none;
    `
    document.body.appendChild(cursor)

    const cursorFollower = document.createElement('div')
    cursorFollower.className = 'cursor-follower'
    cursorFollower.style.cssText = `
      width: 8px;
      height: 8px;
      background: #DC2626;
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.3s ease;
      display: none;
    `
    document.body.appendChild(cursorFollower)

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.display = 'block'
      cursorFollower.style.display = 'block'
    }

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1

      gsap.set(cursor, {
        x: mouseX - 10,
        y: mouseY - 10,
      })

      gsap.set(cursorFollower, {
        x: followerX - 4,
        y: followerY - 4,
      })

      requestAnimationFrame(animateCursor)
    }

    document.addEventListener('mousemove', updateCursor)
    animateCursor()

    // Scale on hover
    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3 })
      gsap.to(cursorFollower, { scale: 1.5, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 })
      gsap.to(cursorFollower, { scale: 1, duration: 0.3 })
    }

    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      cursor.remove()
      cursorFollower.remove()
    }
  }, [])
}

