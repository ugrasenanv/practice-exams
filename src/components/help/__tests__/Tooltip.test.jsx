import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React, { useState, useEffect } from 'react'
import Tooltip from '../Tooltip.jsx'

// Enhanced DOM mocking for precise flickering detection
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})

global.IntersectionObserver = mockIntersectionObserver

// @diagnostic
describe.skip('Tooltip Component - Advanced Flickering Detection', () => {
  let mockGetBoundingClientRect
  let positionCallCount = 0
  let renderCycleCount = 0

  beforeEach(() => {
    positionCallCount = 0
    renderCycleCount = 0
    
    mockGetBoundingClientRect = vi.fn(() => {
      positionCallCount++
      return {
        top: 100 + Math.sin(positionCallCount) * 5, // Simulate natural position variance
        bottom: 200 + Math.sin(positionCallCount) * 5,
        left: 50 + Math.cos(positionCallCount) * 3,
        right: 150 + Math.cos(positionCallCount) * 3,
        width: 100,
        height: 100
      }
    })
    
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect
    
    // Mock RAF with frame counting
    let frameId = 0
    global.requestAnimationFrame = vi.fn((callback) => {
      frameId++
      return setTimeout(() => {
        renderCycleCount++
        callback()
      }, 16)
    })
    
    global.cancelAnimationFrame = vi.fn(clearTimeout)
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.restoreAllMocks()
  })

  describe('Position Calculation Stability Tests', () => {
    it('should not recalculate position on every render', async () => {
      const { rerender } = render(
        <Tooltip content="Test tooltip" position="top">
          <button>Trigger</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      
      // Show tooltip
      fireEvent.mouseEnter(button)
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      const initialCallCount = positionCallCount

      // Force multiple re-renders without changing layout
      for (let i = 0; i < 10; i++) {
        rerender(
          <Tooltip content={`Test tooltip ${i}`} position="top">
            <button>Trigger</button>
          </Tooltip>
        )
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })
      }

      // Position should not be recalculated excessively
      expect(positionCallCount - initialCallCount).toBeLessThan(5)
    })

    it('should debounce position updates during scroll/resize', async () => {
      render(
        <Tooltip content="Scrolling tooltip" position="top">
          <button>Scroll trigger</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      const beforeScrollCount = positionCallCount

      // Simulate rapid scroll events
      for (let i = 0; i < 20; i++) {
        fireEvent.scroll(window)
        fireEvent(window, new Event('resize'))
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 5))
        })
      }

      // Should not recalculate position for every scroll event
      expect(positionCallCount - beforeScrollCount).toBeLessThan(10)
    })
  })

  describe('Event Handling Race Conditions', () => {
    it('should handle rapid hover on/off without flickering', async () => {
      render(
        <Tooltip content="Hover tooltip" trigger="hover">
          <button>Rapid hover</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      let visibilityChanges = []

      // Monitor tooltip appearance/disappearance
      const observer = new MutationObserver(() => {
        const tooltip = document.querySelector('[role="tooltip"]')
        visibilityChanges.push({
          timestamp: Date.now(),
          visible: !!tooltip
        })
      })

      observer.observe(document.body, { childList: true, subtree: true })

      // Rapid hover events
      for (let i = 0; i < 15; i++) {
        fireEvent.mouseEnter(button)
        fireEvent.mouseLeave(button)
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 20))
        })
      }

      observer.disconnect()

      // Analyze visibility pattern for flickering
      const rapidChanges = visibilityChanges.filter((change, index) => {
        if (index === 0) return false
        const timeDiff = change.timestamp - visibilityChanges[index - 1].timestamp
        return timeDiff < 50 // Changes within 50ms are suspect
      })

      expect(rapidChanges.length).toBeLessThan(5)
    })

    it('should prevent tooltip overlap flickering', async () => {
      const { rerender } = render(
        <div>
          <Tooltip content="Tooltip 1" position="top">
            <button style={{ position: 'absolute', left: '100px', top: '100px' }}>
              Button 1
            </button>
          </Tooltip>
          <Tooltip content="Tooltip 2" position="top">
            <button style={{ position: 'absolute', left: '120px', top: '100px' }}>
              Button 2
            </button>
          </Tooltip>
        </div>
      )

      const [button1, button2] = screen.getAllByRole('button')

      // Show both tooltips simultaneously
      fireEvent.mouseEnter(button1)
      fireEvent.mouseEnter(button2)

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      // Should not cause excessive position recalculations
      expect(positionCallCount).toBeLessThan(20)

      // Move buttons to overlapping positions
      rerender(
        <div>
          <Tooltip content="Tooltip 1" position="top">
            <button style={{ position: 'absolute', left: '100px', top: '100px' }}>
              Button 1
            </button>
          </Tooltip>
          <Tooltip content="Tooltip 2" position="top">
            <button style={{ position: 'absolute', left: '105px', top: '100px' }}>
              Button 2
            </button>
          </Tooltip>
        </div>
      )

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      // Should handle overlap gracefully without flickering
      expect(positionCallCount).toBeLessThan(40)
    })
  })

  describe('Performance Under Stress', () => {
    it('should maintain performance with many tooltips', async () => {
      const tooltipCount = 20
      const tooltips = Array.from({ length: tooltipCount }, (_, i) => (
        <Tooltip key={i} content={`Tooltip ${i}`} position={i % 4 === 0 ? 'top' : i % 4 === 1 ? 'right' : i % 4 === 2 ? 'bottom' : 'left'}>
          <button>Button {i}</button>
        </Tooltip>
      ))

      const startTime = performance.now()
      
      render(<div>{tooltips}</div>)
      
      const buttons = screen.getAllByRole('button')

      // Show all tooltips
      for (const button of buttons) {
        fireEvent.mouseEnter(button)
      }

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should complete within reasonable time
      expect(renderTime).toBeLessThan(2000)
      
      // Position calculations should be reasonable
      expect(positionCallCount).toBeLessThan(tooltipCount * 5)
    })

    it('should handle high-frequency position updates efficiently', async () => {
      let updateCount = 0
      
      // Mock a tooltip that updates position frequently
      const DynamicTooltip = () => {
        const [position, setPosition] = React.useState('top')
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            updateCount++
            setPosition(prev => prev === 'top' ? 'bottom' : 'top')
          }, 50)
          
          return () => clearInterval(interval)
        }, [])

        return (
          <Tooltip content="Dynamic tooltip" position={position}>
            <button>Dynamic button</button>
          </Tooltip>
        )
      }

      render(<DynamicTooltip />)
      
      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      // Let it run for a short period
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
      })

      // Should not cause excessive position calculations relative to updates
      const ratio = positionCallCount / Math.max(updateCount, 1)
      expect(ratio).toBeLessThan(3) // At most 3x position calculations per update
    })
  })

  describe('Memory Leak Detection', () => {
    it('should clean up event listeners to prevent flickering from memory pressure', async () => {
      let listenerCount = 0
      
      const originalAddEventListener = EventTarget.prototype.addEventListener
      const originalRemoveEventListener = EventTarget.prototype.removeEventListener
      
      EventTarget.prototype.addEventListener = function(...args) {
        listenerCount++
        return originalAddEventListener.apply(this, args)
      }
      
      EventTarget.prototype.removeEventListener = function(...args) {
        listenerCount--
        return originalRemoveEventListener.apply(this, args)
      }

      const { unmount } = render(
        <Tooltip content="Cleanup test" trigger="click">
          <button>Test cleanup</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      const listenersAfterMount = listenerCount

      unmount()

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      // Should have cleaned up most listeners
      expect(listenerCount).toBeLessThanOrEqual(listenersAfterMount - 2)

      // Restore original methods
      EventTarget.prototype.addEventListener = originalAddEventListener
      EventTarget.prototype.removeEventListener = originalRemoveEventListener
    })
  })

  describe('Accessibility Impact of Flickering', () => {
    it('should not cause screen reader announcement flickering', async () => {
      let announcements = []
      
      // Mock screen reader announcements
      const mockAnnounce = vi.fn((text) => {
        announcements.push({
          text,
          timestamp: Date.now()
        })
      })

      Object.defineProperty(global, 'speechSynthesis', {
        value: {
          speak: mockAnnounce,
          cancel: vi.fn()
        }
      })

      render(
        <Tooltip content="Accessible tooltip" trigger="hover">
          <button aria-label="Accessible button">Test</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Rapid interactions that could cause announcement flickering
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(button)
        fireEvent.mouseLeave(button)
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })
      }

      // Should not have excessive announcements
      expect(announcements.length).toBeLessThan(15)

      // Check for rapid repeated announcements (within 100ms)
      const rapidAnnouncements = announcements.filter((announcement, index) => {
        if (index === 0) return false
        const timeDiff = announcement.timestamp - announcements[index - 1].timestamp
        return timeDiff < 100 && announcement.text === announcements[index - 1].text
      })

      expect(rapidAnnouncements.length).toBe(0)
    })

    it('should maintain proper focus management without flickering', async () => {
      let focusChanges = []
      
      const trackFocus = () => {
        focusChanges.push({
          element: document.activeElement?.tagName || 'BODY',
          timestamp: Date.now()
        })
      }

      document.addEventListener('focusin', trackFocus)
      document.addEventListener('focusout', trackFocus)

      render(
        <Tooltip content="Focus tooltip" trigger="click">
          <button>Focus test</button>
        </Tooltip>
      )

      const button = screen.getByRole('button')

      // Test focus management during tooltip operations
      for (let i = 0; i < 5; i++) {
        button.focus()
        fireEvent.click(button)
        fireEvent.keyDown(button, { key: 'Escape' })
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50))
        })
      }

      document.removeEventListener('focusin', trackFocus)
      document.removeEventListener('focusout', trackFocus)

      // Should not have excessive focus changes
      expect(focusChanges.length).toBeLessThan(20)

      // Check for focus flickering (rapid back-and-forth)
      const flickeringFocus = focusChanges.filter((change, index) => {
        if (index < 2) return false
        const timeDiff = change.timestamp - focusChanges[index - 1].timestamp
        const prevElement = focusChanges[index - 1].element
        const prevPrevElement = focusChanges[index - 2].element
        return timeDiff < 50 && change.element === prevPrevElement && change.element !== prevElement
      })

      expect(flickeringFocus.length).toBe(0)
    })
  })
})