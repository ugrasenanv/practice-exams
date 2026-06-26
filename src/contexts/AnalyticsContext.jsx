import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AnalyticsContext = createContext()

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export const AnalyticsProvider = ({ children }) => {
  const [performanceData, setPerformanceData] = useState({})
  const [learningTrends, setLearningTrends] = useState([])
  const [strongestDomains, setStrongestDomains] = useState([])
  const [weakestDomains, setWeakestDomains] = useState([])
  const [studyRecommendations, setStudyRecommendations] = useState([])
  const [timeAnalytics, setTimeAnalytics] = useState({})
  const [streakData, setStreakData] = useState({ current: 0, longest: 0, lastStudyDate: null })

  // Load existing analytics data
  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = useCallback(() => {
    try {
      // Load session data from localStorage
      const sessions = []
      const timingData = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('personal-practice-exams-sessions')) {
          const data = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(data)) {
            sessions.push(...data)
          }
        } else if (key && key.startsWith('examTiming_')) {
          const data = JSON.parse(localStorage.getItem(key))
          if (data) {
            timingData.push(data)
          }
        }
      }
      
      // Load streak data
      const savedStreak = localStorage.getItem('personal-practice-exams-study-streak')
      if (savedStreak) {
        setStreakData(JSON.parse(savedStreak))
      }
      
      // Process the data
      processAnalyticsData(sessions, timingData)
      
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    }
  }, [])

  const processAnalyticsData = useCallback((sessions, timingData) => {
    if (sessions.length === 0) {
      return
    }

    // Sort sessions by date
    const sortedSessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Calculate overall performance metrics
    const totalSessions = sessions.length
    const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0)
    const totalCorrect = sessions.reduce((sum, session) => sum + session.correctAnswers, 0)
    const averageScore = sessions.reduce((sum, session) => sum + session.score, 0) / totalSessions
    const passingRate = sessions.filter(session => session.score >= 77).length / totalSessions
    
    // Domain analysis
    const domainStats = {}
    sessions.forEach(session => {
      if (session.domainPerformance) {
        Object.entries(session.domainPerformance).forEach(([domain, perf]) => {
          if (!domainStats[domain]) {
            domainStats[domain] = { correct: 0, total: 0, sessions: 0 }
          }
          domainStats[domain].correct += perf.correct
          domainStats[domain].total += perf.total
          domainStats[domain].sessions++
        })
      }
    })

    // Calculate domain strengths and weaknesses
    const domainPercentages = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      percentage: (stats.correct / stats.total) * 100,
      totalQuestions: stats.total,
      sessions: stats.sessions
    })).filter(item => item.totalQuestions >= 5) // Only include domains with sufficient data

    const sorted = domainPercentages.sort((a, b) => b.percentage - a.percentage)
    setStrongestDomains(sorted.slice(0, 3))
    setWeakestDomains(sorted.slice(-3).reverse())

    // Learning trends (last 10 sessions)
    const recentSessions = sortedSessions.slice(0, 10).reverse()
    const trends = recentSessions.map((session, index) => ({
      session: index + 1,
      score: session.score,
      date: session.date,
      examType: session.examType,
      totalQuestions: session.totalQuestions
    }))
    setLearningTrends(trends)

    // Time analytics
    const timeStats = {
      totalStudyTime: sessions.reduce((sum, session) => sum + (session.timeUsed || 0), 0),
      averageSessionTime: sessions.reduce((sum, session) => sum + (session.timeUsed || 0), 0) / totalSessions,
      totalSessions: totalSessions,
      averageQuestionsPerSession: totalQuestions / totalSessions
    }

    // Process per-question timing data
    if (timingData.length > 0) {
      const allQuestionTimings = []
      timingData.forEach(exam => {
        if (exam.questionTimings) {
          Object.entries(exam.questionTimings).forEach(([questionId, time]) => {
            const question = exam.questions?.find(q => q.id.toString() === questionId)
            if (question && time > 0) {
              allQuestionTimings.push({
                time: time / 1000, // Convert to seconds
                domain: question.domain,
                difficulty: question.difficulty
              })
            }
          })
        }
      })

      if (allQuestionTimings.length > 0) {
        timeStats.averageQuestionTime = allQuestionTimings.reduce((sum, q) => sum + q.time, 0) / allQuestionTimings.length
        timeStats.domainTiming = {}
        
        // Group by domain
        allQuestionTimings.forEach(q => {
          if (!timeStats.domainTiming[q.domain]) {
            timeStats.domainTiming[q.domain] = []
          }
          timeStats.domainTiming[q.domain].push(q.time)
        })

        // Calculate average per domain
        Object.keys(timeStats.domainTiming).forEach(domain => {
          const times = timeStats.domainTiming[domain]
          timeStats.domainTiming[domain] = {
            average: times.reduce((sum, time) => sum + time, 0) / times.length,
            count: times.length
          }
        })
      }
    }

    setTimeAnalytics(timeStats)
    
    // Set performance data
    setPerformanceData({
      totalSessions,
      totalQuestions,
      totalCorrect,
      averageScore: Math.round(averageScore),
      passingRate: Math.round(passingRate * 100),
      recentScore: sortedSessions[0]?.score || 0,
      improvement: sortedSessions.length >= 2 ? 
        sortedSessions[0].score - sortedSessions[1].score : 0
    })

    // Generate study recommendations
    generateRecommendations(domainStats, sortedSessions, timeStats)
    
  }, [])

  const generateRecommendations = useCallback((domainStats, sessions, timeStats) => {
    const recommendations = []

    // Analyze weak domains
    const domainPercentages = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      percentage: (stats.correct / stats.total) * 100,
      totalQuestions: stats.total
    })).filter(item => item.totalQuestions >= 3)

    const weakDomains = domainPercentages.filter(d => d.percentage < 70)
    
    if (weakDomains.length > 0) {
      recommendations.push({
        type: 'domain_focus',
        priority: 'high',
        title: `Focus on ${weakDomains[0].domain}`,
        description: `Your performance in ${weakDomains[0].domain} is ${Math.round(weakDomains[0].percentage)}%. Consider reviewing study materials for this domain.`,
        action: 'Review study materials',
        icon: '📚'
      })
    }

    // Recent performance analysis
    if (sessions.length >= 3) {
      const lastThreeScores = sessions.slice(0, 3).map(s => s.score)
      const isImproving = lastThreeScores[0] > lastThreeScores[1] && lastThreeScores[1] > lastThreeScores[2]
      const isDeclining = lastThreeScores[0] < lastThreeScores[1] && lastThreeScores[1] < lastThreeScores[2]
      
      if (isImproving) {
        recommendations.push({
          type: 'encouragement',
          priority: 'medium',
          title: 'Great Progress!',
          description: 'Your scores are improving consistently. Keep up the excellent work!',
          action: 'Continue current study approach',
          icon: '🎯'
        })
      } else if (isDeclining) {
        recommendations.push({
          type: 'study_adjustment',
          priority: 'high',
          title: 'Review Study Strategy',
          description: 'Your recent scores show a declining trend. Consider adjusting your study approach.',
          action: 'Try Smart Review mode',
          icon: '⚠️'
        })
      }
    }

    // Time-based recommendations
    if (timeStats.averageQuestionTime) {
      if (timeStats.averageQuestionTime > 120) { // More than 2 minutes per question
        recommendations.push({
          type: 'time_management',
          priority: 'medium',
          title: 'Improve Time Management',
          description: `You're averaging ${Math.round(timeStats.averageQuestionTime)} seconds per question. Practice with timed exams to improve speed.`,
          action: 'Take shorter timed exams',
          icon: '⏱️'
        })
      }
    }

    // Session frequency recommendations
    const daysSinceLastSession = sessions.length > 0 ? 
      Math.floor((Date.now() - new Date(sessions[0].date).getTime()) / (1000 * 60 * 60 * 24)) : 0
    
    if (daysSinceLastSession > 3) {
      recommendations.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Maintain Study Consistency',
        description: `It's been ${daysSinceLastSession} days since your last practice session. Regular practice improves retention.`,
        action: 'Schedule regular study sessions',
        icon: '📅'
      })
    }

    // Readiness assessment
    const readyForCert = sessions.some(s => s.score >= 85) && 
                        sessions.filter(s => s.score >= 77).length >= Math.max(3, sessions.length * 0.7)
    
    if (readyForCert) {
      recommendations.push({
        type: 'certification',
        priority: 'high',
        title: 'Certification Ready!',
        description: 'Your performance indicates you\'re ready for the certification exam. Consider scheduling it soon.',
        action: 'Schedule certification exam',
        icon: '🏆'
      })
    }

    setStudyRecommendations(recommendations)
  }, [])

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const savedStreak = localStorage.getItem('personal-practice-exams-study-streak')
    let streakInfo = savedStreak ? JSON.parse(savedStreak) : { current: 0, longest: 0, lastStudyDate: null }

    if (streakInfo.lastStudyDate === today) {
      // Already studied today, no update needed
      return streakInfo
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    if (streakInfo.lastStudyDate === yesterday) {
      // Continuing streak
      streakInfo.current++
    } else if (streakInfo.lastStudyDate !== null) {
      // Streak broken, reset
      streakInfo.current = 1
    } else {
      // First study session
      streakInfo.current = 1
    }

    streakInfo.longest = Math.max(streakInfo.longest, streakInfo.current)
    streakInfo.lastStudyDate = today

    localStorage.setItem('personal-practice-exams-study-streak', JSON.stringify(streakInfo))
    setStreakData(streakInfo)
    
    return streakInfo
  }, [])

  const getInsights = useCallback(() => {
    const insights = []

    if (performanceData.totalSessions >= 5) {
      if (performanceData.passingRate >= 80) {
        insights.push({
          type: 'success',
          title: 'Consistent Performance',
          description: `You're passing ${performanceData.passingRate}% of your practice exams. Excellent work!`
        })
      } else if (performanceData.passingRate >= 50) {
        insights.push({
          type: 'warning',
          title: 'Room for Improvement',
          description: `Your pass rate is ${performanceData.passingRate}%. Focus on your weak areas to improve.`
        })
      } else {
        insights.push({
          type: 'info',
          title: 'Building Foundation',
          description: 'Keep practicing! Your understanding is developing with each session.'
        })
      }
    }

    if (performanceData.improvement > 0) {
      insights.push({
        type: 'success',
        title: 'Positive Trend',
        description: `Your score improved by ${performanceData.improvement} points in your last session!`
      })
    }

    if (streakData.current >= 7) {
      insights.push({
        type: 'success',
        title: 'Great Consistency!',
        description: `You're on a ${streakData.current}-day study streak. Keep it up!`
      })
    }

    return insights
  }, [performanceData, streakData])

  const exportAnalytics = useCallback(() => {
    const analyticsExport = {
      exportDate: new Date().toISOString(),
      performance: performanceData,
      trends: learningTrends,
      domains: {
        strongest: strongestDomains,
        weakest: weakestDomains
      },
      timeAnalytics,
      streakData,
      recommendations: studyRecommendations
    }

    const dataStr = JSON.stringify(analyticsExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `personal-practice-exams-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [performanceData, learningTrends, strongestDomains, weakestDomains, timeAnalytics, streakData, studyRecommendations])

  const resetAnalytics = useCallback(() => {
    if (confirm('Are you sure you want to reset all analytics data? This action cannot be undone.')) {
      // Clear analytics-related localStorage items
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('personal-practice-exams-sessions') || 
                   key.startsWith('examTiming_') || 
                   key === 'personal-practice-exams-study-streak')) {
          localStorage.removeItem(key)
        }
      }
      
      // Reset state
      setPerformanceData({})
      setLearningTrends([])
      setStrongestDomains([])
      setWeakestDomains([])
      setStudyRecommendations([])
      setTimeAnalytics({})
      setStreakData({ current: 0, longest: 0, lastStudyDate: null })
    }
  }, [])

  const value = {
    // Data
    performanceData,
    learningTrends,
    strongestDomains,
    weakestDomains,
    studyRecommendations,
    timeAnalytics,
    streakData,
    
    // Methods
    loadAnalyticsData,
    updateStreak,
    getInsights,
    exportAnalytics,
    resetAnalytics
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsProvider
