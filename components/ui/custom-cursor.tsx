'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// Bauhaus color palette
const COLORS = ['#dc2626', '#2563eb', '#eab308', '#8b5cf6', '#10b981'] // red, blue, yellow, purple, green

// Linear interpolation for smooth movement
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

export function CustomCursor() {
  // Refs and State - MUST be declared before any conditional returns
  const cursorRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState<string>('')
  const [isClicking, setIsClicking] = useState(false)
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default')
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname()
  
  // Use refs for values to avoid re-renders
  const targetPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 }) // Target position (mouse position)
  const currentPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 }) // Current position (interpolated)
  const lastValidPositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 }) // Last known valid position
  const requestRef = useRef<number | null>(null)
  const currentColorRef = useRef<string>('')
  const isClickingRef = useRef<boolean>(false)
  const cursorTypeRef = useRef<'default' | 'pointer' | 'text'>('default')
  const isInitializedRef = useRef<boolean>(false)
  const isVisibleRef = useRef<boolean>(true)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Effect to check for mobile size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();

    // Add resize listener only in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
    }

    // Clean up resize listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    }
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Main effect for cursor logic - only runs if not mobile
  useEffect(() => {
    // If on mobile, ensure default cursor is restored and exit effect
    if (isMobile) {
      if (typeof document !== 'undefined') {
        document.documentElement.style.cursor = '';
      }
      // Stop animation frame if it's running
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
      // Clear auto-hide timeout if set
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      isInitializedRef.current = false; // Reset initialization for next desktop view
      return; // Exit effect early
    }

    // Hide default cursor globally on desktop when component is active
    if (typeof document !== 'undefined') {
      document.documentElement.style.cursor = 'none'
    }

    // Randomize color on each page load/navigation (only when not mobile)
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setColor(randomColor)
    currentColorRef.current = randomColor
    isClickingRef.current = isClicking
    cursorTypeRef.current = cursorType

    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Initialize cursor position on first movement (only on desktop)
      if (!isInitializedRef.current) {
        currentPositionRef.current = { x: e.clientX, y: e.clientY }
        isInitializedRef.current = true
      }
      
      // Always update lastValidPosition with current mouse position
      lastValidPositionRef.current = { x: e.clientX, y: e.clientY }
      
      // Update target position (actual mouse position)
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
      
      // Show cursor and reset auto-hide timer
      showCursor();
      
      // If element has custom color override via data-cursor, use it
      const override = target.dataset.cursor || 
                      target.closest('[data-cursor]')?.getAttribute('data-cursor')
      
      // Priority: Element override > Random
      if (override && cursorRef.current) {
        cursorRef.current.style.borderColor = override
        currentColorRef.current = override
      } else if (currentColorRef.current !== randomColor && cursorRef.current) {
        cursorRef.current.style.borderColor = randomColor
        currentColorRef.current = randomColor
      }
      
      // Change cursor type based on element
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.hasAttribute('role') && target.getAttribute('role') === 'button' ||
        target.closest('button, a, [role="button"]') !== null ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.closest('[style*="cursor: pointer"]') !== null
      
      const isInput = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.hasAttribute('contenteditable') ||
        target.closest('input, textarea, [contenteditable]') !== null
      
      if (isClickable && cursorTypeRef.current !== 'pointer') {
        setCursorType('pointer')
        cursorTypeRef.current = 'pointer'
      } else if (isInput && cursorTypeRef.current !== 'text') {
        setCursorType('text')
        cursorTypeRef.current = 'text'
      } else if (!isClickable && !isInput && cursorTypeRef.current !== 'default') {
        setCursorType('default')
        cursorTypeRef.current = 'default'
      }
    }
    
    // Function to show cursor and reset auto-hide timer
    const showCursor = () => {
      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      
      // Show cursor only if not mobile and is visible
      if (!isMobile && isVisibleRef.current && cursorRef.current) {
        cursorRef.current.style.opacity = '1'
      }
      
      // Set timeout to hide cursor after inactivity (5 seconds)
      hideTimeoutRef.current = setTimeout(() => {
        // Only hide if not clicking and is visible
        if (cursorRef.current && !isClickingRef.current && isVisibleRef.current) {
          cursorRef.current.style.opacity = '0'
        }
      }, 5000)
    }
    
    // Animation loop for smooth cursor movement using lerp
    const animateCursor = () => {
      // If cursor isn't initialized, don't animate yet
      if (!isInitializedRef.current) {
        requestRef.current = requestAnimationFrame(animateCursor)
        return
      }
      
      // Smooth interpolation between current and target position
      // Lower factor = smoother but more lag, higher = more responsive but potential jitter
      const smoothFactor = 0.15
      
      // Calculate new position with lerp
      currentPositionRef.current.x = lerp(
        currentPositionRef.current.x, 
        targetPositionRef.current.x, 
        smoothFactor
      )
      
      currentPositionRef.current.y = lerp(
        currentPositionRef.current.y, 
        targetPositionRef.current.y, 
        smoothFactor
      )
      
      if (cursorRef.current) {
        // Apply different transform based on cursor type
        if (cursorTypeRef.current === 'pointer') {
          cursorRef.current.style.transform = `translate3d(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px, 0) translate3d(-50%, -50%, 0) rotate(-45deg) ${
            isClickingRef.current ? 'scale(0.75)' : 'scale(1)'
          }`
        } else if (cursorTypeRef.current === 'text') {
          cursorRef.current.style.transform = `translate3d(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px, 0) translate3d(-50%, -50%, 0) ${
            isClickingRef.current ? 'scaleY(0.75)' : 'scaleY(1)'
          }`
        } else {
          cursorRef.current.style.transform = `translate3d(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px, 0) translate3d(-50%, -50%, 0) ${
            isClickingRef.current ? 'scale(0.75)' : 'scale(1)'
          }`
        }
      }
      
      requestRef.current = requestAnimationFrame(animateCursor)
    }
    
    // Handle mousedown - only update clicking state, don't change position
    const handleMouseDown = () => {
      setIsClicking(true)
      isClickingRef.current = true
      showCursor(); // Show cursor on interaction
    }
    
    // Handle mouseup - only update clicking state, don't change position
    const handleMouseUp = () => {
      setIsClicking(false)
      isClickingRef.current = false
      showCursor(); // Show cursor on interaction
    }
    
    // Handle focus/visibility issues
    const handleBlur = () => {
      // Don't change cursor position on blur
      // Hide cursor on blur
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        isVisibleRef.current = false;
      }
    }
    
    // Keep cursor visible during click actions
    const handleMouseLeave = () => {
      // Don't change cursor position when mouse leaves window
      // Hide cursor when mouse leaves window
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        isVisibleRef.current = false;
      }
    }
    
    // When window focuses again, ensure cursor is visible
    const handleFocus = () => {
      showCursor(); // Show cursor when window regains focus
      isVisibleRef.current = true;
    }
    
    // Use pointerup event which captures more interactions
    const handlePointerUp = () => {
      // Don't change cursor position on pointer up
      setIsClicking(false)
      isClickingRef.current = false
      showCursor(); // Show cursor on interaction
    }
    
    // Keep track of cursor during iframe interactions
    const handleIframeMouseEnter = () => {
      // Hide cursor when entering iframe to prevent issues
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        isVisibleRef.current = false;
      }
    }
    
    const handleIframeMouseLeave = () => {
      // Show cursor when leaving iframe
      showCursor();
      isVisibleRef.current = true;
    }
    
    // Add iframe listeners
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      iframe.addEventListener('mouseenter', handleIframeMouseEnter)
      iframe.addEventListener('mouseleave', handleIframeMouseLeave)
    })

    // Add event listeners with passive flag for better performance
    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('pointerup', handlePointerUp, { passive: true })
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animateCursor)
    
    // Initial auto-hide setup
    showCursor();
    
    return () => {
      // Restore default cursor when component unmounts OR isMobile becomes true
      if (typeof document !== 'undefined') {
        document.documentElement.style.cursor = '';
      }
      
      // Clean up event listeners and animation frame
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('pointerup', handlePointerUp)
      
      // Remove iframe listeners
      iframes.forEach(iframe => {
        iframe.removeEventListener('mouseenter', handleIframeMouseEnter)
        iframe.removeEventListener('mouseleave', handleIframeMouseLeave)
      })
      
      // Clear any existing timeouts
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      
      // Cancel animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
    }
  }, [pathname, isClicking, cursorType, isMobile]) // Re-run effect if dependencies change

  // Conditional rendering AFTER all hooks
  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`fixed w-6 h-6 rounded-full border-4 z-[9999] pointer-events-none mix-blend-difference will-change-transform ${
        cursorType === 'pointer' ? 'cursor-pointer-custom' : 
        cursorType === 'text' ? 'cursor-text-custom' : 
        'cursor-default-custom'
      }`}
      style={{
        borderColor: color,
        // Hardware acceleration
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: '1000',
        WebkitTransform: 'translate3d(0,0,0)',
        transition: 'opacity 0.2s ease, transform 0.15s ease', // Added transform to transition
      }}
    />
  )
}