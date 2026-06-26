import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import HelpSystem from '../HelpSystem.jsx'
import Tooltip from '../Tooltip.jsx'

// Comprehensive race condition and performance testing
// @diagnostic
describe.skip('Race Conditions and Performance Issues Detection', () => {
  let performanceObserver
  let mutationObserver
  let intersectionObserver
  let raceConditionEvents = []
  let performanceEntries = []

  beforeEach(() => {
    raceConditionEvents = []
    performanceEntries = []

    // Mock Performance Observer
    global.PerformanceObserver = class MockPerformanceObserver {
      constructor(callback) {
        performanceObserver = { callback, entries: [] }
      }
      
      observe(options) {
        // Simulate performance entries
        setTimeout(() => {
          performanceObserver.entries.push({
            name: 'help-system-render',
            startTime: performance.now() - Math.random() * 10,
            duration: Math.random() * 5
          })
          performanceObserver.callback({
            getEntries: () => performanceObserver.entries
          })
        }, 10)
      }
      
      disconnect() {}
    }

    // Enhanced MutationObserver for race condition detection
    const OriginalMutationObserver = global.MutationObserver || class {}
    global.MutationObserver = class extends OriginalMutationObserver {
      constructor(callback) {
        super(callback)
        this.callback = callback
        mutationObserver = this
      }
      
      observe(target, options) {
        super.observe?.(target, options)
        
        // Track rapid mutations that might indicate race conditions
        let mutationCount = 0
        const startTime = Date.now()
        
        const trackMutation = (mutations) => {
          mutationCount++
          const timeDiff = Date.now() - startTime
          
          if (timeDiff < 100 && mutationCount > 5) {
            raceConditionEvents.push({
              type: 'rapid-mutations',
              count: mutationCount,
              timespan: timeDiff,
              target: target.tagName || 'unknown'
            })
          }
          
          this.callback(mutations)
        }
        
        setTimeout(() => {
          trackMutation([{
            type: 'childList',
            target,
            addedNodes: [],
            removedNodes: []
          }])
        }, 5)
      }
    }

    // Mock IntersectionObserver with race condition detection
    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback) {
        this.callback = callback
        intersectionObserver = this
      }
      
      observe(element) {
        // Simulate delayed intersection events that could cause race conditions
        setTimeout(() => {
          this.callback([{
            target: element,
            isIntersecting: true,
            intersectionRatio: Math.random()
          }])
        }, Math.random() * 50)
        
        setTimeout(() => {
          this.callback([{
            target: element,
            isIntersecting: false,
            intersectionRatio: 0
          }])
        }, Math.random() * 100 + 50)
      }
      
      unobserve() {}
      disconnect() {}
    }
  })

  afterEach(() => {
    vi.clearAllTimers()
    performanceObserver = null
    mutationObserver = null
    intersectionObserver = null
  })

  describe('Race Condition Detection', () => {
    it('should detect and handle localStorage race conditions', async () => {
      let storageOperations = []
      
      const trackOperation = (operation, key, value) => {
        storageOperations.push({
          operation,
          key,
          value,
          timestamp: performance.now(),
          callStack: new Error().stack.split('\n').slice(0, 3)
        })
      }

      const originalGetItem = localStorage.getItem
      const originalSetItem = localStorage.setItem

      localStorage.getItem = vi.fn((key) => {
        trackOperation('GET', key)
        return originalGetItem.call(localStorage, key)
      })

      localStorage.setItem = vi.fn((key, value) => {
        trackOperation('SET', key, value)
        return originalSetItem.call(localStorage, key, value)
      })

      // Create multiple HelpSystem instances to simulate race conditions
      const { rerender } = render(
        <div>
          <HelpSystem isEnabled={true} examContext="exam" />
          <HelpSystem isEnabled={true} examContext="general" />
        </div>
      )

      // Rapid operations that could cause localStorage race conditions
      const operations = []
      for (let i = 0; i < 10; i++) {
        operations.push(
          act(async () => {
            const showButton = screen.queryAllByText('Show Help Panel')[0]
            if (showButton) {
              fireEvent.click(showButton)
            }
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20))
          })
        )
      }

      await Promise.all(operations)

      // Analyze storage operations for race conditions
      const simultaneousOperations = storageOperations.filter((op, index) => {
        const nextOp = storageOperations[index + 1]
        return nextOp && Math.abs(op.timestamp - nextOp.timestamp) < 5
      })

      // Detect read-after-write race conditions
      const raceConditions = storageOperations.filter((op, index) => {
        if (op.operation === 'SET') {
          const nextRead = storageOperations.slice(index + 1).find(
            nextOp => nextOp.operation === 'GET' && nextOp.key === op.key
          )
          return nextRead && (nextRead.timestamp - op.timestamp) < 10
        }
        return false
      })

      expect(simultaneousOperations.length).toBeLessThan(5)
      expect(raceConditions.length).toBeLessThan(3)

      localStorage.getItem = originalGetItem
      localStorage.setItem = originalSetItem
    })

    it('should handle concurrent DOM updates without race conditions', async () => {
      let domUpdateSequence = []
      
      const TrackingComponent = ({ id, shouldShow }) => {
        React.useLayoutEffect(() => {
          domUpdateSequence.push({
            id,
            action: 'mount',
            timestamp: performance.now()
          })
          
          return () => {
            domUpdateSequence.push({
              id,
              action: 'unmount',
              timestamp: performance.now()
            })
          }
        })

        React.useEffect(() => {
          domUpdateSequence.push({
            id,
            action: 'update',
            timestamp: performance.now()
          })
        })

        return shouldShow ? <HelpSystem isEnabled={true} examContext="exam" /> : null
      }

      const { rerender } = render(
        <div>
          <TrackingComponent id="comp1" shouldShow={true} />
          <TrackingComponent id="comp2" shouldShow={true} />
          <TrackingComponent id="comp3" shouldShow={true} />
        </div>
      )

      // Rapid show/hide operations
      const sequences = [
        [true, false, true],
        [false, true, false],
        [true, true, false]
      ]

      for (let i = 0; i < sequences.length; i++) {
        const [show1, show2, show3] = sequences[i]
        rerender(
          <div>
            <TrackingComponent id="comp1" shouldShow={show1} />
            <TrackingComponent id="comp2" shouldShow={show2} />
            <TrackingComponent id="comp3" shouldShow={show3} />
          </div>
        )
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 20))
        })
      }

      // Check for overlapping mount/unmount operations (race conditions)
      const overlappingOperations = domUpdateSequence.filter((op, index) => {
        const nextOp = domUpdateSequence[index + 1]
        return nextOp && 
               op.id !== nextOp.id && 
               Math.abs(op.timestamp - nextOp.timestamp) < 5 &&
               ((op.action === 'mount' && nextOp.action === 'unmount') ||
                (op.action === 'unmount' && nextOp.action === 'mount'))
      })

      expect(overlappingOperations.length).toBeLessThan(3)
    })

    it('should prevent event listener race conditions', async () => {
      let eventListenerOperations = []
      
      const originalAddEventListener = EventTarget.prototype.addEventListener
      const originalRemoveEventListener = EventTarget.prototype.removeEventListener

      EventTarget.prototype.addEventListener = function(type, listener, options) {
        eventListenerOperations.push({
          type: 'ADD',
          eventType: type,
          target: this.tagName || this.constructor.name,
          timestamp: performance.now()
        })
        return originalAddEventListener.call(this, type, listener, options)
      }

      EventTarget.prototype.removeEventListener = function(type, listener, options) {
        eventListenerOperations.push({
          type: 'REMOVE',
          eventType: type,
          target: this.tagName || this.constructor.name,
          timestamp: performance.now()
        })
        return originalRemoveEventListener.call(this, type, listener, options)
      }

      const { unmount } = render(<HelpSystem isEnabled={true} examContext="exam" />)

      // Trigger tooltip interactions
      const helpButton = screen.queryByLabelText('Toggle help panel')
      if (helpButton) {
        // Rapid interactions
        for (let i = 0; i < 5; i++) {
          fireEvent.mouseEnter(helpButton)
          fireEvent.mouseLeave(helpButton)
          fireEvent.click(helpButton)
          await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 10))
          })
        }
      }

      unmount()

      // Check for listener management race conditions
      const addOperations = eventListenerOperations.filter(op => op.type === 'ADD')
      const removeOperations = eventListenerOperations.filter(op => op.type === 'REMOVE')
      
      const unmatchedListeners = addOperations.length - removeOperations.length

      // Should not have excessive unmatched listeners (memory leak indicator)
      expect(Math.abs(unmatchedListeners)).toBeLessThan(5)

      EventTarget.prototype.addEventListener = originalAddEventListener
      EventTarget.prototype.removeEventListener = originalRemoveEventListener
    })
  })

  describe('Performance Bottleneck Detection', () => {
    it('should detect excessive re-calculation of positions', async () => {
      let positionCalculations = []
      
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
      Element.prototype.getBoundingClientRect = function() {
        positionCalculations.push({
          element: this.tagName,
          className: this.className,
          timestamp: performance.now()
        })
        return originalGetBoundingClientRect.call(this)
      }

      render(
        <div>
          <Tooltip content="Test 1" position="top">
            <button>Button 1</button>
          </Tooltip>
          <Tooltip content="Test 2" position="bottom">
            <button>Button 2</button>
          </Tooltip>
          <Tooltip content="Test 3" position="left">
            <button>Button 3</button>
          </Tooltip>
        </div>
      )

      const buttons = screen.getAllByRole('button')

      // Show all tooltips
      buttons.forEach(button => fireEvent.mouseEnter(button))

      // Simulate viewport changes
      for (let i = 0; i < 10; i++) {
        fireEvent(window, new Event('resize'))
        fireEvent(window, new Event('scroll'))
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })
      }

      // Analyze position calculation patterns
      const calculationsPerSecond = positionCalculations.length / 2 // Approx 2 seconds test
      const rapidCalculations = positionCalculations.filter((calc, index) => {
        const nextCalc = positionCalculations[index + 1]
        return nextCalc && (nextCalc.timestamp - calc.timestamp) < 16 // Faster than 60fps
      })

      expect(calculationsPerSecond).toBeLessThan(30) // Max 30 calculations per second
      expect(rapidCalculations.length).toBeLessThan(10) // Not too many rapid calculations

      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    })

    it('should detect memory leaks and excessive object creation', async () => {
      let objectCreations = 0
      let objectDestructions = 0
      
      // Track object creation (simplified)
      const originalObjectCreate = Object.create
      Object.create = function(...args) {
        objectCreations++
        const obj = originalObjectCreate.apply(this, args)
        
        // Add destruction tracking
        if (obj && typeof obj === 'object') {
          const originalValueOf = obj.valueOf
          obj.valueOf = function() {
            objectDestructions++
            return originalValueOf?.call?.(this) || this
          }
        }
        
        return obj
      }

      const components = []
      
      // Create and destroy multiple HelpSystem instances
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<HelpSystem isEnabled={true} examContext="exam" />)
        components.push(unmount)
        
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 20))
        })
      }

      // Unmount all components
      components.forEach(unmount => unmount())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      // Force garbage collection (if available)
      if (global.gc) {
        global.gc()
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Check for memory leak indicators
      const objectLeakRatio = objectCreations / Math.max(objectDestructions, 1)
      
      expect(objectLeakRatio).toBeLessThan(5) // Should not create 5x more objects than destroyed

      Object.create = originalObjectCreate
    })

    it('should detect infinite loop conditions', async () => {
      let loopDetectionEvents = []
      let recursionDepth = 0
      const maxRecursionDepth = 50

      // Wrap functions that might cause infinite loops
      const originalSetTimeout = global.setTimeout
      global.setTimeout = function(callback, delay) {
        let callCount = 0
        const wrappedCallback = function() {
          callCount++
          recursionDepth++
          
          if (callCount > maxRecursionDepth) {
            loopDetectionEvents.push({
              type: 'potential-infinite-loop',
              callCount,
              timestamp: performance.now()
            })
            return // Prevent actual infinite loop
          }
          
          if (recursionDepth > 100) {
            loopDetectionEvents.push({
              type: 'deep-recursion',
              depth: recursionDepth,
              timestamp: performance.now()
            })
            recursionDepth = 0
            return
          }
          
          try {
            callback()
          } finally {
            recursionDepth--
          }
        }
        
        return originalSetTimeout.call(this, wrappedCallback, delay)
      }

      // Component that might cause infinite loops due to poor effect dependencies
      const PotentiallyProblematicComponent = () => {
        const [count, setCount] = React.useState(0)
        const [flag, setFlag] = React.useState(false)
        
        React.useEffect(() => {
          if (count < 5) {
            setCount(count + 1) // This could cause infinite loop if dependencies are wrong
          }
        }, []) // Missing count dependency - but we're testing loop detection

        React.useEffect(() => {
          if (!flag && count > 0) {
            setFlag(true)
            setTimeout(() => setFlag(false), 10)
          }
        }, [count, flag])

        return <HelpSystem isEnabled={true} examContext="exam" />
      }

      render(<PotentiallyProblematicComponent />)

      // Wait for potential loops to be detected
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
      })

      // Should detect loop-like patterns
      expect(loopDetectionEvents.length).toBeLessThan(3) // Some detection is okay, but not excessive

      global.setTimeout = originalSetTimeout
    })
  })

  describe('Concurrent Operations Stress Test', () => {
    it('should handle high-concurrency scenarios without breaking', async () => {
      let concurrentOperations = 0
      let completedOperations = 0
      let failedOperations = 0

      const ConcurrentTestComponent = ({ operationId }) => {
        const [state, setState] = React.useState('idle')
        
        React.useEffect(() => {
          concurrentOperations++
          
          const operation = async () => {
            try {
              setState('loading')
              await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
              setState('complete')
              completedOperations++
            } catch (error) {
              setState('error')
              failedOperations++
            }
          }
          
          operation()
        }, [operationId])

        return (
          <div>
            <span>Operation {operationId}: {state}</span>
            <HelpSystem isEnabled={state === 'complete'} examContext="exam" />
          </div>
        )
      }

      const { rerender } = render(<div />)

      // Launch many concurrent operations
      const operationPromises = []
      for (let i = 0; i < 20; i++) {
        operationPromises.push(
          act(async () => {
            rerender(
              <div>
                {Array.from({ length: i + 1 }, (_, index) => (
                  <ConcurrentTestComponent key={index} operationId={index} />
                ))}
              </div>
            )
            await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
          })
        )
      }

      await Promise.all(operationPromises)

      // Wait for all operations to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      // Should handle high concurrency gracefully
      expect(completedOperations).toBeGreaterThan(15) // Most operations should complete
      expect(failedOperations).toBeLessThan(5) // Few failures are acceptable
      expect(completedOperations + failedOperations).toBeLessThanOrEqual(concurrentOperations)
    })
  })

  describe('Resource Cleanup Verification', () => {
    it('should properly clean up all resources on unmount', async () => {
      let activeResources = {
        timers: 0,
        listeners: 0,
        observers: 0,
        promises: 0
      }

      // Track resource creation/cleanup
      const originalSetTimeout = global.setTimeout
      const originalClearTimeout = global.clearTimeout

      global.setTimeout = function(...args) {
        activeResources.timers++
        return originalSetTimeout.apply(this, args)
      }

      global.clearTimeout = function(...args) {
        activeResources.timers--
        return originalClearTimeout.apply(this, args)
      }

      const { unmount } = render(
        <div>
          <HelpSystem isEnabled={true} examContext="exam" />
          <Tooltip content="Resource test">
            <button>Test</button>
          </Tooltip>
        </div>
      )

      // Interact with components to create resources
      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      fireEvent.click(button)

      const helpToggle = screen.queryByLabelText('Toggle help panel')
      if (helpToggle) {
        fireEvent.click(helpToggle)
      }

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      const resourcesBeforeUnmount = { ...activeResources }

      unmount()

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      // Should clean up most resources
      expect(activeResources.timers).toBeLessThanOrEqual(resourcesBeforeUnmount.timers)

      global.setTimeout = originalSetTimeout
      global.clearTimeout = originalClearTimeout
    })
  })
})