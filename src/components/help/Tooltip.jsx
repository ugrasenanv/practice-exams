import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styles from './Tooltip.module.css'

const Tooltip = ({ 
  content, 
  position = 'top', 
  trigger = 'hover',
  disabled = false,
  className = '',
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)
  const positionTimeoutRef = useRef(null)
  const visibilityTimeoutRef = useRef(null)

  // Throttled position calculation to prevent flickering
  const calculatePosition = useCallback(() => {
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current)
    }

    positionTimeoutRef.current = setTimeout(() => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let optimalPosition = position

      // Check if tooltip would overflow and adjust position
      if (position === 'top' && triggerRect.top < tooltipRect.height + 10) {
        optimalPosition = 'bottom'
      } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height + 10 > viewport.height) {
        optimalPosition = 'top'
      } else if (position === 'left' && triggerRect.left < tooltipRect.width + 10) {
        optimalPosition = 'right'
      } else if (position === 'right' && triggerRect.right + tooltipRect.width + 10 > viewport.width) {
        optimalPosition = 'left'
      }

      setActualPosition(optimalPosition)

      // Clamp horizontal position to keep tooltip fully visible
      const tooltipEl = tooltipRef.current
      if (tooltipEl) {
        // Reset any previous style first
        tooltipEl.style.left = ''
        tooltipEl.style.right = ''
        tooltipEl.style.transform = tooltipEl.style.transform || ''

        const rect = tooltipEl.getBoundingClientRect()
        let translateXAdjustment = 0
        const padding = 8
        if (rect.left < padding) {
          translateXAdjustment = padding - rect.left
        } else if (rect.right > viewport.width - padding) {
          translateXAdjustment = (viewport.width - padding) - rect.right
        }
        if (translateXAdjustment !== 0) {
          // Append translation preserving existing translate
          tooltipEl.style.transform = `${tooltipEl.style.transform} translateX(${translateXAdjustment}px)`
          tooltipEl.dataset.clamped = 'true'
        } else if (tooltipEl.dataset.clamped) {
          // Remove clamped flag if not needed
          delete tooltipEl.dataset.clamped
        }
      }
    }, 16) // 60fps throttle
  }, [position])

  // Debounced visibility functions to prevent flickering
  const showTooltip = useCallback(() => {
    if (disabled) return
    
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current)
    }
    
    visibilityTimeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, trigger === 'hover' ? 150 : 0) // Slight delay for hover to prevent accidental triggers
  }, [disabled, trigger])

  const hideTooltip = useCallback(() => {
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current)
    }
    
    visibilityTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, trigger === 'hover' ? 100 : 0) // Slight delay for hover to allow moving to tooltip
  }, [trigger])

  const toggleTooltip = useCallback(() => {
    if (disabled) return
    setIsVisible(prev => !prev)
  }, [disabled])

  // Handle keyboard accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      hideTooltip()
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (trigger === 'click') {
        event.preventDefault()
        toggleTooltip()
      }
    }
  }

  // Calculate position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition()
    }
  }, [isVisible, calculatePosition])

  // Recalculate on window resize & scroll to keep tooltip in view
  useEffect(() => {
    if (!isVisible) return
    const handler = () => calculatePosition()
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler, true)
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('scroll', handler, true)
    }
  }, [isVisible, calculatePosition])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (positionTimeoutRef.current) clearTimeout(positionTimeoutRef.current)
      if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current)
    }
  }, [])

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (trigger === 'click' && 
          tooltipRef.current && 
          triggerRef.current &&
          !tooltipRef.current.contains(event.target) &&
          !triggerRef.current.contains(event.target)) {
        hideTooltip()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, trigger])

  // Memoized class calculations to prevent re-computation
  const tooltipClass = useMemo(() => {
    let classes = styles.tooltip
    if (isVisible) classes += ` ${styles.visible}`
    classes += ` ${styles[actualPosition]}`
    if (className) classes += ` ${className}`
    return classes
  }, [isVisible, actualPosition, className, styles])

  const arrowClass = useMemo(() => {
    return `${styles.arrow} ${styles[`arrow${actualPosition.charAt(0).toUpperCase() + actualPosition.slice(1)}`]}`
  }, [actualPosition, styles])

  if (!content) return children

  // Memoized trigger props to prevent unnecessary re-renders
  const triggerProps = useMemo(() => ({
    ref: triggerRef,
    onKeyDown: handleKeyDown,
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip
    }),
    ...(trigger === 'click' && {
      onClick: toggleTooltip,
      'aria-expanded': isVisible
    }),
    'aria-describedby': isVisible ? 'tooltip' : undefined,
    tabIndex: trigger === 'click' ? 0 : undefined
  }), [trigger, handleKeyDown, showTooltip, hideTooltip, toggleTooltip, isVisible])

  return (
    <div className={styles.tooltipContainer}>
      <div {...triggerProps}>
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          className={tooltipClass}
          role="tooltip"
          aria-live="polite"
        >
          <div className={styles.content}>
            {typeof content === 'string' ? (
              <span>{content}</span>
            ) : (
              content
            )}
          </div>
          <div className={arrowClass}></div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Tooltip)