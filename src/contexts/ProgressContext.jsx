import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  // Core progress data
  const [sessionHistory, setSessionHistory] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null
  });
  const [achievements, setAchievements] = useState([]);
  const [questionPerformance, setQuestionPerformance] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('personal-practice-exams-session-history');
    const savedStreaks = localStorage.getItem('personal-practice-exams-streaks');
    const savedAchievements = localStorage.getItem('personal-practice-exams-achievements');
    const savedQuestionPerf = localStorage.getItem('personal-practice-exams-question-performance');

    if (savedHistory) {
      try {
        setSessionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.warn('Failed to parse session history');
      }
    }

    if (savedStreaks) {
      try {
        setStreakData(JSON.parse(savedStreaks));
      } catch (e) {
        console.warn('Failed to parse streak data');
      }
    }

    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.warn('Failed to parse achievements');
      }
    }

    if (savedQuestionPerf) {
      try {
        setQuestionPerformance(JSON.parse(savedQuestionPerf));
      } catch (e) {
        console.warn('Failed to parse question performance');
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('personal-practice-exams-session-history', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  useEffect(() => {
    localStorage.setItem('personal-practice-exams-streaks', JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    localStorage.setItem('personal-practice-exams-achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('personal-practice-exams-question-performance', JSON.stringify(questionPerformance));
  }, [questionPerformance]);

  // Record a completed exam session
  const recordSession = (sessionData) => {
    const session = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      examType: sessionData.examType,
      totalQuestions: sessionData.totalQuestions,
      correctAnswers: sessionData.correctAnswers,
      score: Math.round((sessionData.correctAnswers / sessionData.totalQuestions) * 100),
      timeUsed: sessionData.timeUsed,
      domainScores: sessionData.domainScores || {},
      questionResults: sessionData.questionResults || []
    };

    setSessionHistory(prev => {
      const newHistory = [session, ...prev].slice(0, 100); // Keep last 100 sessions
      
      // Track total session count for PWA install prompt
      localStorage.setItem('personal-practice-exams-sessions-count', newHistory.length.toString());
      
      return newHistory;
    });
    
    updateStreaks();
    updateQuestionPerformance(session.questionResults, session.examType);
    checkAchievements(session);
  };

  // Update study streaks
  const updateStreaks = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    setStreakData(prev => {
      const lastStudyDate = prev.lastStudyDate;
      
      if (lastStudyDate === today) {
        // Already studied today, no change
        return prev;
      } else if (lastStudyDate === yesterday || prev.currentStreak === 0) {
        // Continuing streak or starting new streak
        const newStreak = prev.currentStreak + 1;
        return {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, prev.longestStreak),
          lastStudyDate: today
        };
      } else {
        // Streak broken, start new
        return {
          currentStreak: 1,
          longestStreak: prev.longestStreak,
          lastStudyDate: today
        };
      }
    });
  };

  // Update individual question performance tracking
  const updateQuestionPerformance = (questionResults, examType) => {
    if (!questionResults || questionResults.length === 0) return;

    setQuestionPerformance(prev => {
      const updated = { ...prev };
      
      questionResults.forEach(result => {
        const key = `${examType}-${result.questionId}`;
        if (!updated[key]) {
          updated[key] = {
            attempts: 0,
            correct: 0,
            lastAttempt: null,
            domain: result.domain || 'General',
            difficulty: result.difficulty || 'intermediate'
          };
        }
        
        updated[key].attempts++;
        if (result.isCorrect) {
          updated[key].correct++;
        }
        updated[key].lastAttempt = new Date().toISOString();
      });
      
      return updated;
    });
  };

  // Check and award achievements
  const checkAchievements = (session) => {
    const newAchievements = [];
    const totalSessions = sessionHistory.length + 1;
    const totalQuestions = sessionHistory.reduce((sum, s) => sum + s.totalQuestions, 0) + session.totalQuestions;

    // Score-based achievements
    if (session.score >= 90 && !achievements.find(a => a.id === 'perfectionist')) {
      newAchievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Scored 90% or higher on an exam',
        icon: '🎯',
        unlockedAt: new Date().toISOString()
      });
    }

    // Volume achievements
    if (totalQuestions >= 100 && !achievements.find(a => a.id === 'century')) {
      newAchievements.push({
        id: 'century',
        title: 'Century Club',
        description: 'Answered 100+ questions',
        icon: '💯',
        unlockedAt: new Date().toISOString()
      });
    }

    if (totalQuestions >= 500 && !achievements.find(a => a.id === 'scholar')) {
      newAchievements.push({
        id: 'scholar',
        title: 'Scholar',
        description: 'Answered 500+ questions',
        icon: '📚',
        unlockedAt: new Date().toISOString()
      });
    }

    // Streak achievements
    if (streakData.currentStreak >= 3 && !achievements.find(a => a.id === 'consistent')) {
      newAchievements.push({
        id: 'consistent',
        title: 'Consistent Learner',
        description: '3-day study streak',
        icon: '🔥',
        unlockedAt: new Date().toISOString()
      });
    }

    if (streakData.currentStreak >= 7 && !achievements.find(a => a.id === 'dedicated')) {
      newAchievements.push({
        id: 'dedicated',
        title: 'Dedicated Student',
        description: '7-day study streak',
        icon: '⭐',
        unlockedAt: new Date().toISOString()
      });
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Get performance analytics
  const getAnalytics = () => {
    if (sessionHistory.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        domainPerformance: {},
        recentTrend: 'neutral',
        weakestDomains: [],
        strongestDomains: []
      };
    }

    const totalSessions = sessionHistory.length;
    const totalQuestions = sessionHistory.reduce((sum, s) => sum + s.totalQuestions, 0);
    const correctAnswers = sessionHistory.reduce((sum, s) => sum + s.correctAnswers, 0);
    const averageScore = Math.round((correctAnswers / totalQuestions) * 100);

    // Domain performance analysis
    const domainStats = {};
    sessionHistory.forEach(session => {
      Object.entries(session.domainScores || {}).forEach(([domain, score]) => {
        if (!domainStats[domain]) {
          domainStats[domain] = { total: 0, count: 0 };
        }
        domainStats[domain].total += score;
        domainStats[domain].count += 1;
      });
    });

    const domainPerformance = Object.entries(domainStats).reduce((acc, [domain, stats]) => {
      acc[domain] = Math.round(stats.total / stats.count);
      return acc;
    }, {});

    // Get trend from recent sessions
    const recentSessions = sessionHistory.slice(0, 5);
    const recentAvg = recentSessions.length > 0 
      ? recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length 
      : averageScore;
    
    const recentTrend = recentAvg > averageScore + 5 ? 'improving' : 
                      recentAvg < averageScore - 5 ? 'declining' : 'stable';

    // Find weakest and strongest domains
    const sortedDomains = Object.entries(domainPerformance).sort((a, b) => a[1] - b[1]);
    const weakestDomains = sortedDomains.slice(0, 3).map(([domain, score]) => ({ domain, score }));
    const strongestDomains = sortedDomains.slice(-3).reverse().map(([domain, score]) => ({ domain, score }));

    return {
      totalSessions,
      averageScore,
      totalQuestions,
      correctAnswers,
      domainPerformance,
      recentTrend,
      weakestDomains,
      strongestDomains
    };
  };

  // Get questions for review modes
  const getReviewQuestions = (mode, examType) => {
    const examKey = examType.toLowerCase().replace(/\s+/g, '-');
    
    switch (mode) {
      case 'incorrect':
        // Return questions that were answered incorrectly
        return Object.entries(questionPerformance)
          .filter(([key, perf]) => key.startsWith(examKey) && perf.correct < perf.attempts)
          .map(([key, perf]) => ({
            questionId: key.split('-').slice(1).join('-'),
            accuracy: perf.correct / perf.attempts,
            attempts: perf.attempts,
            domain: perf.domain
          }));
          
      case 'weak-domains':
        // Return questions from domains where user scores < 70%
        const analytics = getAnalytics();
        const weakDomains = Object.entries(analytics.domainPerformance)
          .filter(([domain, score]) => score < 70)
          .map(([domain]) => domain);
          
        return Object.entries(questionPerformance)
          .filter(([key, perf]) => key.startsWith(examKey) && weakDomains.includes(perf.domain))
          .map(([key, perf]) => ({
            questionId: key.split('-').slice(1).join('-'),
            accuracy: perf.correct / perf.attempts,
            attempts: perf.attempts,
            domain: perf.domain
          }));
          
      default:
        return [];
    }
  };

  // Get new achievements (returns empty array for now, could be expanded)
  const getNewAchievements = () => {
    // This would track newly unlocked achievements between renders
    // For now, return empty array as achievements are processed in recordSession
    return [];
  };

  // Get progress toward a specific achievement
  const getAchievementProgress = (achievementId) => {
    switch (achievementId) {
      case 'streak_3':
      case 'streak_7':
      case 'streak_14':
      case 'streak_30':
      case 'streak_100':
        return streakData.currentStreak;
      case 'sessions_10':
      case 'sessions_25':
      case 'sessions_50':
      case 'sessions_100':
      case 'sessions_250':
        return sessionHistory.length;
      case 'score_70':
      case 'score_80':
      case 'score_90':
      case 'score_95':
      case 'perfect_score':
        return sessionHistory.length > 0 ? Math.max(...sessionHistory.map(s => s.score)) : 0;
      case 'improvement_10':
      case 'improvement_20':
      case 'improvement_30':
      case 'improvement_50':
        if (sessionHistory.length < 2) return 0;
        const firstScore = sessionHistory[0].score;
        const bestScore = Math.max(...sessionHistory.map(s => s.score));
        return bestScore - firstScore;
      case 'multi_exam':
        const uniqueExams = [...new Set(sessionHistory.map(s => s.examType))];
        return uniqueExams.length;
      case 'exam_completionist':
        const uniqueExams2 = [...new Set(sessionHistory.map(s => s.examType))];
        return uniqueExams2.length;
      case 'question_bank':
        return sessionHistory.reduce((total, session) => total + session.totalQuestions, 0);
      default:
        return 0;
    }
  };

  const value = {
    // Data
    sessionHistory,
    streakData,
    achievements,
    questionPerformance,
    
    // Functions
    recordSession,
    getAnalytics,
    getReviewQuestions,
    getNewAchievements,
    getAchievementProgress,
    
    // Computed values
    hasData: sessionHistory.length > 0
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Export both the context and the provider
export { ProgressContext };
export default ProgressProvider;
