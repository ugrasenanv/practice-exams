import { describe, it, expect, beforeEach, afterEach, vi, beforeAll, afterAll } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import HelpSystem, { NavigationHelp, ProgressHelp, MultiSelectHelp } from '../HelpSystem.jsx'

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock DOM APIs that could cause flickering
const mockGetBoundingClientRect = vi.fn(() => ({
  top: 100,
  bottom: 200,
  left: 50,
  right: 150,
  width: 100,
  height: 100
}))

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
    this.elements = new Set()
  }
  
  observe(element) {
    this.elements.add(element)
    // Simulate immediate intersection
    setTimeout(() => {
      this.callback([{
        target: element,
        isIntersecting: true,
        intersectionRatio: 1
      }])
    }, 0)
  }
  
  unobserve(element) {
    this.elements.delete(element)
  }
  
  disconnect() {
    this.elements.clear()
  }
}

global.IntersectionObserver = MockIntersectionObserver

describe('HelpSystem - Flickering Detection Tests', () => {
  let user
  let renderCount = 0
  let stateChanges = []
  let rafCallbacks = []

  beforeAll(() => {
    // Mock requestAnimationFrame to detect rapid re-renders
    global.requestAnimationFrame = vi.fn((callback) => {
      rafCallbacks.push(callback)
      return setTimeout(callback, 16) // 60fps
    })
    global.cancelAnimationFrame = vi.fn(clearTimeout)
    
    // Mock getBoundingClientRect globally
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect
  })

  beforeEach(() => {
    user = userEvent.setup()
    mockLocalStorage.clear()
    renderCount = 0
    stateChanges = []
    rafCallbacks = []
    mockGetBoundingClientRect.mockClear()
    
    // Track render cycles
    const originalLog = console.log
    console.log = (...args) => {
      if (args[0]?.includes?.('render')) {
        renderCount++
      }
      originalLog(...args)
    }
    
    // Mock console.warn to catch React warnings about rapid re-renders
    console.warn = vi.fn()
  })

  afterEach(() => {
    vi.clearAllTimers()
    console.log = console.log
    console.warn = vi.fn()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('Tour State Management - Flickering Tests', () => {
    it('should not flicker when tour is first displayed', async () => {
      const { rerender } = render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      // Track visibility changes
      const tourElement = screen.queryByText('Quick Help Tour')
      let visibilityChanges = 0
      
      if (tourElement) {
        const observer = new MutationObserver(() => {
          visibilityChanges++
        })
        observer.observe(tourElement.parentElement, { 
          attributes: true, 
          childList: true, 
          subtree: true 
        })
      }

      // Force multiple re-renders quickly to simulate potential flickering conditions
      for (let i = 0; i < 10; i++) {
        rerender(<HelpSystem isEnabled={true} examContext="exam" />)
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 1))
        })
      }

      // Should not have excessive visibility changes
      expect(visibilityChanges).toBeLessThan(5)
    })

    it('should not cause flickering when localStorage operations occur', async () => {
      let storageOperations = 0
      const originalSetItem = mockLocalStorage.setItem
      mockLocalStorage.setItem = vi.fn((...args) => {
        storageOperations++
        return originalSetItem(...args)
      })

      render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      const tourButton = screen.getByText('Show Help Panel')
      
      // Rapid clicks to test localStorage race conditions
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          fireEvent.click(tourButton)
          await new Promise(resolve => setTimeout(resolve, 10))
        })
      }

      // Should not cause excessive localStorage operations
      expect(storageOperations).toBeLessThan(10)
    })

    it('should handle rapid state changes without flickering', async () => {
      const { rerender } = render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      let rerenderCount = 0
      const maxRerenders = 20
      
      // Simulate rapid prop changes that could cause flickering
      for (let i = 0; i < maxRerenders; i++) {
        rerender(<HelpSystem 
          isEnabled={i % 2 === 0} 
          examContext={i % 3 === 0 ? "exam" : "general"} 
        />)
        rerenderCount++
        
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 1))
        })
      }

      // Should handle all re-renders gracefully
      expect(rerenderCount).toBe(maxRerenders)
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('Warning: Cannot update a component')
      )
    })

    it('should prevent memory leaks that could cause flickering', async () => {
      const { unmount } = render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      // Open tour and help panel to create timers/listeners
      const showHelpButton = screen.queryByText('Show Help Panel')
      if (showHelpButton) {
        fireEvent.click(showHelpButton)
      }

      // Track active timers/intervals
      const initialTimers = vi.getTimerCount()
      
      // Unmount component
      unmount()
      
      // Wait for cleanup
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      // Should clean up timers
      expect(vi.getTimerCount()).toBeLessThanOrEqual(initialTimers)
    })
  })

  describe('DOM Position Calculations - Flickering Tests', () => {
    it('should not cause flickering during position calculations', async () => {
      let positionCallCount = 0
      mockGetBoundingClientRect.mockImplementation(() => {
        positionCallCount++
        return {
          top: 100 + Math.random() * 10, // Simulate slight position changes
          bottom: 200 + Math.random() * 10,
          left: 50 + Math.random() * 10,
          right: 150 + Math.random() * 10,
          width: 100,
          height: 100
        }
      })

      render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      // Show help panel to trigger position calculations
      const showHelpButton = screen.queryByText('Show Help Panel')
      if (showHelpButton) {
        fireEvent.click(showHelpButton)
        
        // Simulate viewport changes that would trigger recalculation
        for (let i = 0; i < 5; i++) {
          fireEvent(window, new Event('resize'))
          fireEvent(window, new Event('scroll'))
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 20))
          })
        }
      }

      // Should not call position calculation excessively
      expect(positionCallCount).toBeLessThan(50)
    })

    it('should throttle position updates to prevent flickering', async () => {
      render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      const showHelpButton = screen.queryByText('Show Help Panel')
      if (showHelpButton) {
        fireEvent.click(showHelpButton)
        
        let positionUpdateCount = 0
        const originalRAF = global.requestAnimationFrame
        global.requestAnimationFrame = vi.fn((callback) => {
          positionUpdateCount++
          return originalRAF(callback)
        })

        // Rapid viewport changes
        for (let i = 0; i < 20; i++) {
          fireEvent(window, new Event('resize'))
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1))
          })
        }

        // Should throttle position updates
        expect(positionUpdateCount).toBeLessThan(25)
      }
    })
  })

  describe('Event Handling Race Conditions', () => {
    it('should handle overlapping events without flickering', async () => {
      render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      const helpToggle = screen.queryByLabelText('Toggle help panel')
      if (helpToggle) {
        // Simulate rapid clicking that could cause race conditions
        const clickPromises = []
        for (let i = 0; i < 10; i++) {
          clickPromises.push(
            act(async () => {
              fireEvent.click(helpToggle)
              await new Promise(resolve => setTimeout(resolve, Math.random() * 10))
            })
          )
        }
        
        await Promise.all(clickPromises)
        
        // Should not show React warnings about state updates
        expect(console.warn).not.toHaveBeenCalledWith(
          expect.stringContaining('state update')
        )
      }
    })

    it('should handle concurrent visibility changes gracefully', async () => {
      const { rerender } = render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      // Start tour
      const showHelpButton = screen.queryByText('Show Help Panel')
      if (showHelpButton) {
        fireEvent.click(showHelpButton)
        
        // Simulate concurrent operations that affect visibility
        const operations = [
          () => fireEvent.click(screen.getByLabelText('Toggle help panel')),
          () => rerender(<HelpSystem isEnabled={false} examContext="exam" />),
          () => rerender(<HelpSystem isEnabled={true} examContext="general" />),
          () => fireEvent.keyDown(document, { key: 'Escape' })
        ]

        // Execute operations concurrently
        const promises = operations.map(op => 
          act(async () => {
            op()
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20))
          })
        )

        await Promise.all(promises)
        
        // Should not cause unhandled errors
        expect(console.warn).not.toHaveBeenCalledWith(
          expect.stringContaining('Warning')
        )
      }
    })
  })

  describe('Performance Regression Tests', () => {
    it('should not cause excessive re-renders during normal operation', async () => {
      let renderCount = 0
      const TestComponent = () => {
        renderCount++
        return <HelpSystem isEnabled={true} examContext="exam" />
      }

      render(<TestComponent />)
      
      // Normal user interactions
      const showHelpButton = screen.queryByText('Show Help Panel')
      if (showHelpButton) {
        await user.click(showHelpButton)
        
        // Navigate through help sections
        const helpToggle = screen.queryByLabelText('Toggle help panel')
        if (helpToggle) {
          await user.click(helpToggle)
          await user.click(helpToggle)
        }
      }

      // Should have reasonable render count
      expect(renderCount).toBeLessThan(15)
    })

    it('should handle high-frequency events without performance degradation', async () => {
      render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      const startTime = performance.now()
      
      // Simulate high-frequency mouse events
      const helpToggle = screen.queryByLabelText('Toggle help panel')
      if (helpToggle) {
        for (let i = 0; i < 100; i++) {
          fireEvent.mouseMove(helpToggle, { clientX: i, clientY: i })
          if (i % 10 === 0) {
            await act(async () => {
              await new Promise(resolve => setTimeout(resolve, 1))
            })
          }
        }
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Tooltip Component Flickering Tests', () => {
    it('should not flicker during position changes', async () => {
      let positionCalculations = 0
      const originalRect = mockGetBoundingClientRect
      mockGetBoundingClientRect.mockImplementation(() => {
        positionCalculations++
        return originalRect()
      })

      render(
        <ProgressHelp position="top" />
      )

      const helpButton = screen.getByRole('button')
      
      // Trigger tooltip multiple times rapidly
      for (let i = 0; i < 5; i++) {
        fireEvent.mouseEnter(helpButton)
        fireEvent.mouseLeave(helpButton)
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })
      }

      // Should not calculate positions excessively
      expect(positionCalculations).toBeLessThan(20)
    })

    it('should handle rapid hover events without flickering', async () => {
      render(<MultiSelectHelp position="bottom" />)
      
      const helpIcon = screen.getByText('❓')
      let visibilityStates = []
      
      // Monitor tooltip visibility changes
      const observer = new MutationObserver(() => {
        const tooltip = document.querySelector('[role="tooltip"]')
        visibilityStates.push(!!tooltip)
      })
      
      observer.observe(document.body, { childList: true, subtree: true })

      // Rapid hover on/off events
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(helpIcon)
        fireEvent.mouseLeave(helpIcon)
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 5))
        })
      }

      observer.disconnect()

      // Should not have excessive visibility changes
      const visibilityChangeCount = visibilityStates.filter((state, index) => 
        index > 0 && state !== visibilityStates[index - 1]
      ).length

      expect(visibilityChangeCount).toBeLessThan(25)
    })
  })

  describe('Integration Tests for Flickering', () => {
    it('should handle complex scenarios without flickering', async () => {
      const { rerender } = render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      // Complex scenario: tour -> help panel -> tooltips -> context changes
      const showHelpButton = screen.queryByText('Show Help Panel')
      if (showHelpButton) {
        // Start tour
        fireEvent.click(showHelpButton)
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)) })
        
        // Change context while panel is open
        rerender(<HelpSystem isEnabled={true} examContext="general" />)
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)) })
        
        // Toggle panel
        const helpToggle = screen.queryByLabelText('Toggle help panel')
        if (helpToggle) {
          fireEvent.click(helpToggle)
          await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)) })
        }
        
        // Disable and re-enable
        rerender(<HelpSystem isEnabled={false} examContext="exam" />)
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)) })
        rerender(<HelpSystem isEnabled={true} examContext="exam" />)
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)) })
      }

      // Should complete without warnings
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('Warning')
      )
    })

    it('should maintain performance under stress conditions', async () => {
      const startMemory = performance.memory?.usedJSHeapSize || 0
      
      render(<HelpSystem isEnabled={true} examContext="exam" />)
      
      // Stress test: rapid operations
      for (let cycle = 0; cycle < 5; cycle++) {
        const showHelpButton = screen.queryByText('Show Help Panel')
        if (showHelpButton) {
          fireEvent.click(showHelpButton)
        }
        
        const helpToggle = screen.queryByLabelText('Toggle help panel')
        if (helpToggle) {
          for (let i = 0; i < 10; i++) {
            fireEvent.click(helpToggle)
            await act(async () => {
              await new Promise(resolve => setTimeout(resolve, 1))
            })
          }
        }
      }

      // Check memory usage (if available)
      const endMemory = performance.memory?.usedJSHeapSize || 0
      const memoryIncrease = endMemory - startMemory

      // Memory increase should be reasonable (< 10MB)
      if (performance.memory) {
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
      }
    })
  })
})

describe('Specific Flickering Bug Reproduction', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  it('reproduces and tests the localStorage race condition bug', async () => {
    // This test specifically targets the flickering caused by localStorage operations
    let storageReadCount = 0
    let storageWriteCount = 0
    
    const originalGetItem = mockLocalStorage.getItem
    const originalSetItem = mockLocalStorage.setItem
    
    mockLocalStorage.getItem = vi.fn((key) => {
      storageReadCount++
      return originalGetItem(key)
    })
    
    mockLocalStorage.setItem = vi.fn((key, value) => {
      storageWriteCount++
      return originalSetItem(key, value)
    })

    const { rerender } = render(<HelpSystem isEnabled={true} examContext="exam" />)
    
    // Simulate the exact conditions that cause flickering:
    // 1. Component mounts and reads localStorage
    // 2. User interacts rapidly with tour
    // 3. Multiple state updates happen simultaneously
    
    const showHelpButton = screen.queryByText('Show Help Panel')
    if (showHelpButton) {
      // Rapid interactions that trigger localStorage operations
      const interactions = [
        () => fireEvent.click(showHelpButton),
        () => fireEvent.click(screen.getByText('Skip Tour')),
        () => rerender(<HelpSystem isEnabled={true} examContext="general" />),
        () => rerender(<HelpSystem isEnabled={true} examContext="exam" />)
      ]

      // Execute all interactions rapidly
      await Promise.all(
        interactions.map(interaction => 
          act(async () => {
            interaction()
            await new Promise(resolve => setTimeout(resolve, Math.random() * 10))
          })
        )
      )
    }

    // Verify localStorage operations are reasonable
    expect(storageReadCount).toBeLessThan(20)
    expect(storageWriteCount).toBeLessThan(10)
    
    // Verify no React warnings about concurrent updates
    expect(console.warn).not.toHaveBeenCalledWith(
      expect.stringMatching(/concurrent|batch|update/)
    )
  })

  it('tests the useEffect dependency flickering pattern', async () => {
    // Track effect executions
    let effectExecutions = 0
    
    const TestWrapper = ({ context }) => {
      effectExecutions++
      return <HelpSystem isEnabled={true} examContext={context} />
    }

    const { rerender } = render(<TestWrapper context="exam" />)
    
    // Rapidly change props that trigger useEffects
    const contexts = ['exam', 'general', 'exam', 'general', 'exam']
    
    for (const context of contexts) {
      rerender(<TestWrapper context={context} />)
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5))
      })
    }

    // Should not cause excessive effect executions
    expect(effectExecutions).toBeLessThan(15)
  })
})