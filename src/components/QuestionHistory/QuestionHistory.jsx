import React from 'react';
import { useQuestionHistory } from '../../contexts/QuestionHistoryContext';
import styles from './QuestionHistory.module.css';

const QuestionHistory = ({ examType, totalQuestions }) => {
  const { 
    includePreviouslySeen, 
    setIncludePreviouslySeen, 
    getExamStats, 
    resetHistory 
  } = useQuestionHistory();

  const stats = getExamStats(examType, totalQuestions);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your practice history? This action cannot be undone.')) {
      resetHistory(examType);
    }
  };

  return (
    <div className={styles.questionHistory}>
      <h3 className={styles.title}>Question History</h3>
      
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="includePreviouslySeen"
          checked={includePreviouslySeen}
          onChange={(e) => setIncludePreviouslySeen(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="includePreviouslySeen" className={styles.checkboxLabel}>
          Include previously seen questions
        </label>
      </div>

      <p className={styles.subtext}>
        {includePreviouslySeen 
          ? 'Only show questions you haven\'t seen yet'
          : 'Showing all questions including previously seen'}
      </p>

      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.practiced}</div>
          <div className={styles.statLabel}>PRACTICED</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.remaining}</div>
          <div className={styles.statLabel}>REMAINING</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{stats.mastery}%</div>
          <div className={styles.statLabel}>MASTERY</div>
        </div>
      </div>

      <button 
        className={styles.resetButton}
        onClick={handleReset}
      >
        🔄 Reset Practice History
      </button>
    </div>
  );
};

export default QuestionHistory;
