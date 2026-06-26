import React, { createContext, useContext, useState, useEffect } from 'react';

const StudyIntelligenceContext = createContext();

export const useStudyIntelligence = () => {
  const context = useContext(StudyIntelligenceContext);
  if (!context) {
    throw new Error('useStudyIntelligence must be used within StudyIntelligenceProvider');
  }
  return context;
};

export const StudyIntelligenceProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState({});
  const [predictiveAnalytics, setPredictiveAnalytics] = useState({});
  const [spacedRepetition, setSpacedRepetition] = useState({});
  const [learningInsights, setLearningInsights] = useState({});

  // ================== PREDICTIVE ANALYTICS ENGINE ==================
  
  const calculatePassProbability = (sessions, targetScore = 77, examType = 'leadingsafe') => {
    if (!sessions || sessions.length < 3) return null;

    // Get exam-specific sessions only
    const examSessions = sessions.filter(s => s.examType === examType);
    if (examSessions.length < 3) return null;

    const recentSessions = examSessions.slice(-10); // Last 10 sessions
    const avgScore = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
    const trend = calculateTrend(recentSessions);
    const consistency = calculateConsistency(recentSessions);
    const velocity = calculateLearningVelocity(recentSessions);

    // Sophisticated probability calculation with multiple factors
    const baseProbability = (avgScore / targetScore) * 100;
    const trendBonus = Math.max(0, trend * 10); // Positive trend bonus
    const consistencyBonus = consistency > 80 ? 10 : consistency > 60 ? 5 : 0;
    const velocityBonus = velocity > 0.5 ? 5 : 0;
    
    const probability = Math.min(100, Math.max(0, 
      baseProbability * 0.6 + trendBonus * 0.2 + consistencyBonus * 0.1 + velocityBonus * 0.1
    ));

    // Confidence level based on data quality
    let confidence = 'Low';
    if (recentSessions.length >= 8 && consistency > 70) confidence = 'High';
    else if (recentSessions.length >= 5 && consistency > 60) confidence = 'Medium';

    // Time to readiness estimation
    const timeToReadiness = estimateTimeToReadiness(probability, targetScore, trend);

    return {
      probability: Math.round(probability),
      confidence,
      recommendation: probability >= targetScore ? 'Ready to test!' : 'Continue studying',
      avgScore: Math.round(avgScore),
      trend: Math.round(trend * 10) / 10,
      consistency: Math.round(consistency),
      velocity: Math.round(velocity * 10) / 10,
      timeToReadiness,
      sessionsAnalyzed: recentSessions.length
    };
  };

  const calculateTrend = (sessions) => {
    if (sessions.length < 2) return 0;
    
    const scores = sessions.map(s => s.accuracy);
    const n = scores.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = scores.reduce((a, b) => a + b, 0);
    const sumXY = scores.reduce((sum, score, i) => sum + (score * (i + 1)), 0);
    const sumXX = (n * (n + 1) * (2 * n + 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope; // Points per session improvement
  };

  const calculateConsistency = (sessions) => {
    if (sessions.length < 2) return 0;
    
    const scores = sessions.map(s => s.accuracy);
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency percentage (lower std dev = higher consistency)
    return Math.max(0, 100 - (stdDev * 2));
  };

  const calculateLearningVelocity = (sessions) => {
    if (sessions.length < 2) return 0;
    
    // Calculate improvement per week
    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];
    const timeDiff = new Date(lastSession.timestamp) - new Date(firstSession.timestamp);
    const weeksDiff = timeDiff / (1000 * 60 * 60 * 24 * 7);
    
    if (weeksDiff === 0) return 0;
    
    const scoreImprovement = lastSession.accuracy - firstSession.accuracy;
    return scoreImprovement / weeksDiff; // Points per week
  };

  const estimateTimeToReadiness = (currentProbability, targetScore, trend) => {
    if (currentProbability >= targetScore) return 'Ready now!';
    if (trend <= 0) return 'Focus on improvement first';
    
    const pointsNeeded = targetScore - currentProbability;
    const sessionsNeeded = Math.ceil(pointsNeeded / Math.max(0.1, trend));
    
    if (sessionsNeeded <= 5) return '1-2 weeks';
    if (sessionsNeeded <= 10) return '2-4 weeks';
    if (sessionsNeeded <= 20) return '1-2 months';
    return '2+ months';
  };

  // ================== SMART RECOMMENDATIONS ENGINE ==================
  
  const generateStudyRecommendations = (sessions, achievements, examType) => {
    if (!sessions || sessions.length < 2) {
      return {
        optimalStudyTime: 25,
        bestTimeOfDay: 'Morning (8-10 AM)',
        recommendedQuestionCount: 15,
        sessionType: 'mixed',
        focusAreas: ['General'],
        recommendation: 'Take more practice sessions to generate personalized recommendations.'
      };
    }

    // Analyze performance patterns
    const examSessions = sessions.filter(s => s.examType === examType);
    const optimalDuration = findOptimalStudyDuration(examSessions);
    const bestTimes = findOptimalStudyTimes(examSessions);
    const weakDomains = analyzeWeakDomains(examSessions);
    const optimalQuestionCount = findOptimalQuestionCount(examSessions);
    const recommendedSessionType = determineSessionType(examSessions, achievements);

    return {
      optimalStudyTime: optimalDuration,
      bestTimeOfDay: bestTimes[0]?.description || 'Flexible',
      recommendedQuestionCount: optimalQuestionCount,
      sessionType: recommendedSessionType,
      focusAreas: weakDomains.slice(0, 3),
      recommendation: generatePersonalizedRecommendation(examSessions, weakDomains),
      confidence: examSessions.length >= 5 ? 'High' : 'Building...'
    };
  };

  const findOptimalStudyDuration = (sessions) => {
    const performanceByDuration = {};
    
    sessions.forEach(session => {
      const duration = Math.floor(session.duration / 60000); // minutes
      if (duration >= 5 && duration <= 120) { // reasonable range
        if (!performanceByDuration[duration]) performanceByDuration[duration] = [];
        performanceByDuration[duration].push(session.accuracy);
      }
    });

    const optimal = Object.entries(performanceByDuration)
      .filter(([_, accuracies]) => accuracies.length >= 2) // need minimum data
      .map(([duration, accuracies]) => ({
        duration: parseInt(duration),
        avgAccuracy: accuracies.reduce((a, b) => a + b) / accuracies.length,
        sessions: accuracies.length
      }))
      .sort((a, b) => b.avgAccuracy - a.avgAccuracy)[0];

    return optimal?.duration || 25; // fallback
  };

  const findOptimalStudyTimes = (sessions) => {
    const hourPerformance = {};
    
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      if (!hourPerformance[hour]) hourPerformance[hour] = [];
      hourPerformance[hour].push(session.accuracy);
    });

    return Object.entries(hourPerformance)
      .filter(([_, scores]) => scores.length >= 2)
      .map(([hour, scores]) => ({
        hour: parseInt(hour),
        avgScore: scores.reduce((a, b) => a + b) / scores.length,
        sessions: scores.length,
        description: getTimeDescription(parseInt(hour))
      }))
      .sort((a, b) => b.avgScore - a.avgScore);
  };

  const getTimeDescription = (hour) => {
    if (hour >= 6 && hour < 12) return 'Morning (6 AM - 12 PM)';
    if (hour >= 12 && hour < 17) return 'Afternoon (12 PM - 5 PM)';
    if (hour >= 17 && hour < 21) return 'Evening (5 PM - 9 PM)';
    return 'Night (9 PM - 6 AM)';
  };

  const analyzeWeakDomains = (sessions) => {
    const domainPerformance = {};
    
    sessions.forEach(session => {
      session.answers?.forEach((answer, index) => {
        const domain = answer.domain || 'General';
        if (!domainPerformance[domain]) {
          domainPerformance[domain] = { correct: 0, total: 0 };
        }
        domainPerformance[domain].total++;
        if (answer.isCorrect) domainPerformance[domain].correct++;
      });
    });

    return Object.entries(domainPerformance)
      .filter(([_, data]) => data.total >= 5) // minimum questions
      .map(([domain, data]) => ({
        domain,
        accuracy: (data.correct / data.total) * 100,
        totalQuestions: data.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .map(item => item.domain);
  };

  const findOptimalQuestionCount = (sessions) => {
    const performanceByCount = {};
    
    sessions.forEach(session => {
      const count = session.totalQuestions;
      if (count >= 5 && count <= 200) {
        if (!performanceByCount[count]) performanceByCount[count] = [];
        performanceByCount[count].push(session.accuracy);
      }
    });

    const optimal = Object.entries(performanceByCount)
      .filter(([_, accuracies]) => accuracies.length >= 2)
      .map(([count, accuracies]) => ({
        count: parseInt(count),
        avgAccuracy: accuracies.reduce((a, b) => a + b) / accuracies.length
      }))
      .sort((a, b) => b.avgAccuracy - a.avgAccuracy)[0];

    return optimal?.count || 20; // fallback
  };

  const determineSessionType = (sessions, achievements) => {
    if (sessions.length < 5) return 'mixed';
    
    const recentAccuracy = sessions.slice(-3).reduce((sum, s) => sum + s.accuracy, 0) / 3;
    
    if (recentAccuracy < 60) return 'review'; // Focus on review
    if (recentAccuracy > 85) return 'challenge'; // Increase difficulty
    return 'balanced'; // Mix of new and review
  };

  const generatePersonalizedRecommendation = (sessions, weakDomains) => {
    const recentAccuracy = sessions.slice(-3).reduce((sum, s) => sum + s.accuracy, 0) / 3;
    
    if (recentAccuracy < 50) {
      return 'Focus on foundational concepts. Start with shorter sessions and review explanations thoroughly.';
    } else if (recentAccuracy < 70) {
      return `Concentrate on ${weakDomains[0] || 'weak areas'}. Use Smart Review to target missed questions.`;
    } else if (recentAccuracy < 85) {
      return 'Great progress! Mix challenging questions with review of missed topics.';
    } else {
      return 'Excellent performance! Take full practice exams to maintain readiness.';
    }
  };

  // ================== SPACED REPETITION SYSTEM ==================
  
  const initializeSpacedRepetition = (questionId, performance) => {
    const questions = JSON.parse(localStorage.getItem('spacedRepetitionData') || '{}');
    
    if (!questions[questionId]) {
      questions[questionId] = {
        easeFactor: 2.5,
        interval: 1,
        repetition: 0,
        nextReview: new Date().toISOString()
      };
    }

    const quality = Math.max(0, Math.min(5, Math.floor(performance * 5)));
    updateSpacedRepetition(questionId, quality);
    
    return questions[questionId];
  };

  const updateSpacedRepetition = (questionId, quality) => {
    const questions = JSON.parse(localStorage.getItem('spacedRepetitionData') || '{}');
    const qData = questions[questionId] || { easeFactor: 2.5, interval: 1, repetition: 0 };

    if (quality >= 3) {
      if (qData.repetition === 0) {
        qData.interval = 1;
      } else if (qData.repetition === 1) {
        qData.interval = 6;
      } else {
        qData.interval = Math.round(qData.interval * qData.easeFactor);
      }
      qData.repetition++;
    } else {
      qData.repetition = 0;
      qData.interval = 1;
    }

    // Update ease factor (SM-2 algorithm)
    qData.easeFactor = Math.max(1.3, 
      qData.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + qData.interval);
    qData.nextReview = nextReview.toISOString();

    questions[questionId] = qData;
    localStorage.setItem('spacedRepetitionData', JSON.stringify(questions));
    
    return qData;
  };

  const getQuestionsForReview = () => {
    const now = new Date();
    const questions = JSON.parse(localStorage.getItem('spacedRepetitionData') || '{}');
    
    return Object.entries(questions)
      .filter(([_, data]) => new Date(data.nextReview) <= now)
      .map(([id, data]) => ({
        questionId: id,
        priority: calculateReviewPriority(data),
        ...data
      }))
      .sort((a, b) => b.priority - a.priority);
  };

  const calculateReviewPriority = (questionData) => {
    const daysSinceReview = (new Date() - new Date(questionData.nextReview)) / (1000 * 60 * 60 * 24);
    const easeFactor = questionData.easeFactor;
    
    // Higher priority for overdue questions and difficult questions (low ease factor)
    return daysSinceReview * (3.0 - easeFactor);
  };

  // ================== LEARNING INSIGHTS ==================
  
  const generateLearningInsights = (sessions, achievements) => {
    if (!sessions || sessions.length < 3) return {};

    const insights = {
      learningVelocity: calculateLearningVelocity(sessions),
      retentionRate: calculateRetentionRate(sessions),
      optimalReviewCycle: calculateOptimalReviewCycle(sessions),
      performancePredictor: calculatePerformancePredictor(sessions),
      studyEfficiency: calculateStudyEfficiency(sessions),
      knowledgeGrowth: calculateKnowledgeGrowth(sessions),
      focusMetric: calculateFocusMetric(sessions)
    };

    return insights;
  };

  const calculateRetentionRate = (sessions) => {
    // Analyze how well users remember previously correct answers
    const questionHistory = {};
    let retentionEvents = 0;
    let correctRetentions = 0;

    sessions.forEach(session => {
      session.answers?.forEach((answer, index) => {
        const qId = `${session.examType}_${index}`;
        
        if (questionHistory[qId]) {
          retentionEvents++;
          if (questionHistory[qId].wasCorrect && answer.isCorrect) {
            correctRetentions++;
          }
        }
        
        questionHistory[qId] = {
          wasCorrect: answer.isCorrect,
          timestamp: session.timestamp
        };
      });
    });

    return retentionEvents > 0 ? (correctRetentions / retentionEvents) * 100 : 0;
  };

  const calculateOptimalReviewCycle = (sessions) => {
    // Find the optimal time between reviews for maximum retention
    const reviewIntervals = [];
    const questionHistory = {};

    sessions.forEach(session => {
      session.answers?.forEach((answer, index) => {
        const qId = `${session.examType}_${index}`;
        
        if (questionHistory[qId] && answer.isCorrect) {
          const daysBetween = (new Date(session.timestamp) - new Date(questionHistory[qId].timestamp)) / (1000 * 60 * 60 * 24);
          if (daysBetween > 0 && daysBetween <= 30) {
            reviewIntervals.push(daysBetween);
          }
        }
        
        questionHistory[qId] = {
          wasCorrect: answer.isCorrect,
          timestamp: session.timestamp
        };
      });
    });

    if (reviewIntervals.length === 0) return 3; // default

    const avgInterval = reviewIntervals.reduce((a, b) => a + b, 0) / reviewIntervals.length;
    return Math.round(avgInterval);
  };

  const calculatePerformancePredictor = (sessions) => {
    const trend = calculateTrend(sessions);
    const consistency = calculateConsistency(sessions);
    const recentScore = sessions[sessions.length - 1]?.accuracy || 0;
    
    const predictedScore = recentScore + (trend * 5); // 5 sessions ahead
    
    return {
      nextSessionPrediction: Math.max(0, Math.min(100, Math.round(predictedScore))),
      confidence: consistency > 80 ? 'High' : consistency > 60 ? 'Medium' : 'Low',
      trendDirection: trend > 0.5 ? 'Improving' : trend < -0.5 ? 'Declining' : 'Stable'
    };
  };

  const calculateStudyEfficiency = (sessions) => {
    // Points improved per minute of study time
    if (sessions.length < 2) return 0;
    
    const totalTimeMinutes = sessions.reduce((sum, s) => sum + (s.duration / 60000), 0);
    const scoreImprovement = sessions[sessions.length - 1].accuracy - sessions[0].accuracy;
    
    return totalTimeMinutes > 0 ? scoreImprovement / totalTimeMinutes : 0;
  };

  const calculateKnowledgeGrowth = (sessions) => {
    if (sessions.length < 4) return { growth: 0, trajectory: 'Insufficient data' };
    
    const quarters = Math.floor(sessions.length / 4);
    const growthRates = [];
    
    for (let i = 0; i < quarters; i++) {
      const start = i * 4;
      const end = start + 4;
      const quarterSessions = sessions.slice(start, end);
      const quarterGrowth = quarterSessions[3].accuracy - quarterSessions[0].accuracy;
      growthRates.push(quarterGrowth);
    }
    
    const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
    const trajectory = avgGrowth > 2 ? 'Accelerating' : avgGrowth > 0 ? 'Steady' : 'Needs focus';
    
    return { growth: avgGrowth, trajectory };
  };

  const calculateFocusMetric = (sessions) => {
    // Measure consistency within sessions (less variation = better focus)
    const focusScores = sessions.map(session => {
      if (!session.answers || session.answers.length < 5) return 100;
      
      const correctAnswers = session.answers.map(a => a.isCorrect ? 1 : 0);
      const mean = correctAnswers.reduce((a, b) => a + b) / correctAnswers.length;
      const variance = correctAnswers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / correctAnswers.length;
      
      return Math.max(0, 100 - (variance * 100)); // Higher score = more consistent
    });

    return focusScores.reduce((a, b) => a + b, 0) / focusScores.length;
  };

  // ================== PUBLIC API ==================

  const getComprehensiveAnalysis = (sessions, achievements, examType) => {
    if (!sessions || sessions.length < 2) return null;

    return {
      predictiveAnalytics: calculatePassProbability(sessions, 77, examType),
      studyRecommendations: generateStudyRecommendations(sessions, achievements, examType),
      learningInsights: generateLearningInsights(sessions, achievements),
      spacedRepetition: {
        questionsForReview: getQuestionsForReview(),
        totalTracked: Object.keys(JSON.parse(localStorage.getItem('spacedRepetitionData') || '{}')).length
      }
    };
  };

  const value = {
    // Analytics
    calculatePassProbability,
    generateStudyRecommendations,
    generateLearningInsights,
    getComprehensiveAnalysis,
    
    // Spaced Repetition
    initializeSpacedRepetition,
    updateSpacedRepetition,
    getQuestionsForReview,
    
    // State
    recommendations,
    predictiveAnalytics,
    spacedRepetition,
    learningInsights,
    setRecommendations,
    setPredictiveAnalytics,
    setSpacedRepetition,
    setLearningInsights
  };

  return (
    <StudyIntelligenceContext.Provider value={value}>
      {children}
    </StudyIntelligenceContext.Provider>
  );
};

export default StudyIntelligenceContext;