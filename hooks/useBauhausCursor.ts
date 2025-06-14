'use client'

import { useCallback } from 'react'

type CursorTheme = 'red' | 'blue' | 'yellow' | 'default' | 'purple' | 'green' | string

interface UseBauhausCursorOptions {
  theme?: CursorTheme
}

// Map of theme names to color codes
const themeColors = {
  red: '#dc2626',
  blue: '#2563eb',
  yellow: '#eab308',
  purple: '#8b5cf6',
  green: '#10b981',
  default: '#2563eb'
}

/**
 * Hook to easily apply a cursor color override to any component
 * 
 * @param options Configuration options for the cursor
 * @returns An object with props to apply to the element
 * 
 * @example
 * ```tsx
 * const { cursorProps } = useBauhausCursor({ theme: 'red' })
 * 
 * return <div {...cursorProps}>This element changes cursor to red on hover</div>
 * ```
 */
export function useBauhausCursor(options: UseBauhausCursorOptions = {}) {
  const { theme = 'default' } = options
  
  // Get the color code for the current theme
  const getColorCode = useCallback(() => {
    if (theme in themeColors) {
      return themeColors[theme as keyof typeof themeColors]
    }
    // If it's a hex value already, use it directly
    if (theme.startsWith('#')) {
      return theme
    }
    return themeColors.default
  }, [theme])
  
  // Return props that can be spread onto any element
  return {
    cursorProps: {
      'data-cursor': getColorCode(),
    }
  }
} 