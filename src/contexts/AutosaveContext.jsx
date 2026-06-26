import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AutosaveContext = createContext()

export const useAutosave = () => {
  const context = useContext(AutosaveContext)
  if (!context) {
    throw new Error('useAutosave must be used within an AutosaveProvider')
  }
  return context
}

export const AutosaveProvider = ({ children }) => {
  const [autosaveStatus, setAutosaveStatus] = useState('idle') // 'idle', 'saving', 'saved', 'error'
  const [lastSavedTime, setLastSavedTime] = useState(null)
  const [isEnabled, setIsEnabled] = useState(true)

  // Autosave configuration
  const AUTOSAVE_INTERVAL = 30000 // 30 seconds
  const DEBOUNCE_DELAY = 2000 // 2 seconds
  
  // Get storage key for exam session
  const getStorageKey = (examType, sessionId) => 
    `personal-practice-exams-autosave-${examType}-${sessionId}`

  // Save exam state to localStorage
  const saveExamState = useCallback((examType, sessionId, examState) => {
    if (!isEnabled) return

    try {
      setAutosaveStatus('saving')
      
      const saveData = {
        ...examState,
        lastSaved: Date.now(),
        version: '1.0'
      }
      
      const storageKey = getStorageKey(examType, sessionId)
      localStorage.setItem(storageKey, JSON.stringify(saveData))
      
      setAutosaveStatus('saved')
      setLastSavedTime(Date.now())
      
      // Reset to idle after showing "saved" status briefly
      setTimeout(() => setAutosaveStatus('idle'), 2000)
      
    } catch (error) {
      console.error('Autosave failed:', error)
      setAutosaveStatus('error')
      setTimeout(() => setAutosaveStatus('idle'), 3000)
    }
  }, [isEnabled])

  // Load exam state from localStorage
  const loadExamState = useCallback((examType, sessionId) => {
    try {
      const storageKey = getStorageKey(examType, sessionId)
      const savedData = localStorage.getItem(storageKey)
      
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        
        // Check if data is recent (within 24 hours)
        const dataAge = Date.now() - parsedData.lastSaved
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours
        
        if (dataAge < maxAge) {
          setLastSavedTime(parsedData.lastSaved)
          return parsedData
        } else {
          // Clean up old data
          localStorage.removeItem(storageKey)
        }
      }
      
      return null
    } catch (error) {
      console.error('Failed to load autosaved data:', error)
      return null
    }
  }, [])

  // Clear exam state (after submission or cancellation)
  const clearExamState = useCallback((examType, sessionId) => {
    try {
      const storageKey = getStorageKey(examType, sessionId)
      localStorage.removeItem(storageKey)
      setLastSavedTime(null)
      setAutosaveStatus('idle')
    } catch (error) {
      console.error('Failed to clear autosaved data:', error)
    }
  }, [])

  // Get all autosaved sessions
  const getAutosavedSessions = useCallback(() => {
    try {
      const sessions = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('personal-practice-exams-autosave-')) {
          const data = JSON.parse(localStorage.getItem(key))
          const keyParts = key.replace('personal-practice-exams-autosave-', '').split('-')
          
          sessions.push({
            examType: keyParts[0],
            sessionId: keyParts.slice(1).join('-'),
            lastSaved: data.lastSaved,
            progress: data.currentQuestion || 0,
            totalQuestions: data.totalQuestions || 0,
            answeredCount: Object.keys(data.selectedAnswers || {}).length
          })
        }
      }
      
      return sessions.sort((a, b) => b.lastSaved - a.lastSaved)
    } catch (error) {
      console.error('Failed to get autosaved sessions:', error)
      return []
    }
  }, [])

  // Clean up old autosave data (older than 7 days)
  const cleanupOldData = useCallback(() => {
    try {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith('personal-practice-exams-autosave-')) {
          const data = JSON.parse(localStorage.getItem(key))
          if (data.lastSaved < sevenDaysAgo) {
            localStorage.removeItem(key)
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old autosave data:', error)
    }
  }, [])

  // Cleanup old data on mount
  useEffect(() => {
    cleanupOldData()
  }, [cleanupOldData])

  // Format time for display
  const formatSaveTime = useCallback((timestamp) => {
    if (!timestamp) return ''
    
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now'
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      return new Date(timestamp).toLocaleDateString()
    }
  }, [])

  const value = {
    // State
    autosaveStatus,
    lastSavedTime,
    isEnabled,
    
    // Actions
    saveExamState,
    loadExamState,
    clearExamState,
    getAutosavedSessions,
    setIsEnabled,
    
    // Utilities
    formatSaveTime,
    
    // Configuration
    AUTOSAVE_INTERVAL,
    DEBOUNCE_DELAY
  }

  return (
    <AutosaveContext.Provider value={value}>
      {children}
    </AutosaveContext.Provider>
  )
}

export default AutosaveProvider
