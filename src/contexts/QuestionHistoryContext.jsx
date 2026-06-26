import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const QuestionHistoryContext = createContext();

export const useQuestionHistory = () => {
  const context = useContext(QuestionHistoryContext);
  if (!context) {
    throw new Error('useQuestionHistory must be used within QuestionHistoryProvider');
  }
  return context;
};

export const QuestionHistoryProvider = ({ children }) => {
  const [questionHistory, setQuestionHistory] = useState({});
  const [includePreviouslySeen, setIncludePreviouslySeen] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('questionHistory');
      if (stored) {
        setQuestionHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load question history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('questionHistory', JSON.stringify(questionHistory));
    } catch (error) {
      console.error('Failed to save question history:', error);
    }
  }, [questionHistory]);

  // Mark a question as seen/attempted
  const recordQuestionAttempt = useCallback((examType, questionId, isCorrect) => {
    setQuestionHistory(prev => {
      const examHistory = prev[examType] || {};
      const questionData = examHistory[questionId] || {
        attempts: 0,
        correctAttempts: 0,
        firstSeenAt: Date.now(),
        lastAttemptAt: Date.now()
      };

      return {
        ...prev,
        [examType]: {
          ...examHistory,
          [questionId]: {
            ...questionData,
            attempts: questionData.attempts + 1,
            correctAttempts: questionData.correctAttempts + (isCorrect ? 1 : 0),
            lastAttemptAt: Date.now()
          }
        }
      };
    });
  }, []);

  // Check if a question has been seen
  const isQuestionSeen = useCallback((examType, questionId) => {
    return !!(questionHistory[examType]?.[questionId]);
  }, [questionHistory]);

  // Get statistics for an exam
  const getExamStats = useCallback((examType, totalQuestions) => {
    const examHistory = questionHistory[examType] || {};
    const seenQuestions = Object.keys(examHistory);
    const practiced = seenQuestions.length;
    const remaining = totalQuestions - practiced;
    
    // Calculate mastery: questions with more correct than incorrect attempts
    const masteredCount = seenQuestions.filter(qid => {
      const q = examHistory[qid];
      return q.correctAttempts > (q.attempts - q.correctAttempts);
    }).length;
    
    const mastery = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

    return {
      practiced,
      remaining,
      mastery,
      total: totalQuestions
    };
  }, [questionHistory]);

  // Reset history for a specific exam or all exams
  const resetHistory = useCallback((examType = null) => {
    if (examType) {
      setQuestionHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[examType];
        return newHistory;
      });
    } else {
      setQuestionHistory({});
    }
  }, []);

  // Filter questions based on seen/unseen preference
  const filterQuestions = useCallback((examType, questions) => {
    if (includePreviouslySeen) {
      return questions;
    }
    return questions.filter(q => !isQuestionSeen(examType, q.id));
  }, [includePreviouslySeen, isQuestionSeen]);

  const value = {
    questionHistory,
    includePreviouslySeen,
    setIncludePreviouslySeen,
    recordQuestionAttempt,
    isQuestionSeen,
    getExamStats,
    resetHistory,
    filterQuestions
  };

  return (
    <QuestionHistoryContext.Provider value={value}>
      {children}
    </QuestionHistoryContext.Provider>
  );
};
