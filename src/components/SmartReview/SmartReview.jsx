import { useState } from 'react';
import { useProgress } from '../../contexts/ProgressContext.jsx';
import styles from './SmartReview.module.css';

function SmartReview({ onGoHome, onStartExam }) {
  const { getAnalytics, getReviewQuestions, hasData } = useProgress();
  const [selectedMode, setSelectedMode] = useState('incorrect');
  const analytics = getAnalytics();

  // Get review questions for both exam types
  const leadingSafeIncorrect = getReviewQuestions('incorrect', 'Leading SAFe 6');
  const safeTeamsIncorrect = getReviewQuestions('incorrect', 'SAFe for Teams 6.0');
  const leadingSafeWeak = getReviewQuestions('weak-domains', 'Leading SAFe 6');
  const safeTeamsWeak = getReviewQuestions('weak-domains', 'SAFe for Teams 6.0');

  const reviewModes = [
    {
      id: 'incorrect',
      title: '❌ Review Incorrect',
      description: 'Practice questions you got wrong previously',
      icon: '🔄',
      questions: [...leadingSafeIncorrect, ...safeTeamsIncorrect]
    },
    {
      id: 'weak-domains',
      title: '📚 Weak Areas', 
      description: 'Focus on domains where you scored below 70%',
      icon: '🎯',
      questions: [...leadingSafeWeak]
    },
    {
      id: 'comprehensive',
      title: '🧠 Comprehensive Review',
      description: 'Mixed questions from all areas needing attention',
      icon: '💡',
      questions: [] // Will be implemented later
    }
  ];

  const handleStartReview = (mode) => {
    const modeData = reviewModes.find(m => m.id === mode);
    if (modeData && modeData.questions.length > 0) {
      // For now, redirect to regular exams - could implement custom review later
      onStartExam('Leading SAFe 6');
    }
  };

  if (!hasData) {
    return (
      <div className={styles.reviewContainer}>
        <header className={styles.reviewHeader}>
          <div className={styles.brand}>
            <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
            <div className={styles.tagline}>Smart Review</div>
          </div>
          <button className={styles.homeButton} onClick={onGoHome}>
            ← Back to Home
          </button>
        </header>

        <main className={styles.reviewContent}>
          <div className={styles.noDataMessage}>
            <div className={styles.noDataIcon}>🎯</div>
            <h2>No Review Data Available</h2>
            <p>Complete some practice exams first to unlock personalized review modes tailored to your performance.</p>
            <button className={styles.startButton} onClick={onGoHome}>
              Take Your First Exam
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.reviewContainer}>
      <header className={styles.reviewHeader}>
        <div className={styles.brand}>
          <div className={styles.logo}>AI Cert Studio</div>
          <div className={styles.tagline}>Smart Review</div>
        </div>
        <button className={styles.homeButton} onClick={onGoHome}>
          ← Back to Home
        </button>
      </header>

      <main className={styles.reviewContent}>
        {/* Performance Summary */}
        <section className={styles.summarySection}>
          <h2>📈 Your Performance Summary</h2>
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>{analytics.averageScore}%</div>
              <div className={styles.summaryLabel}>Average Score</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>{analytics.totalSessions}</div>
              <div className={styles.summaryLabel}>Sessions Completed</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>{analytics.weakestDomains.length}</div>
              <div className={styles.summaryLabel}>Areas to Improve</div>
            </div>
          </div>
        </section>

        {/* Review Modes */}
        <section className={styles.modesSection}>
          <h2>🎯 Choose Your Review Mode</h2>
          <div className={styles.modesGrid}>
            {reviewModes.map(mode => (
              <div 
                key={mode.id} 
                className={`${styles.modeCard} ${selectedMode === mode.id ? styles.selected : ''}`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className={styles.modeIcon}>{mode.icon}</div>
                <h3 className={styles.modeTitle}>{mode.title}</h3>
                <p className={styles.modeDescription}>{mode.description}</p>
                <div className={styles.modeStats}>
                  <span className={styles.questionCount}>
                    {mode.questions.length} questions available
                  </span>
                </div>
                {mode.questions.length > 0 ? (
                  <button 
                    className={styles.startModeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartReview(mode.id);
                    }}
                  >
                    Start Review
                  </button>
                ) : (
                  <div className={styles.noQuestionsNote}>
                    {mode.id === 'incorrect' 
                      ? 'Great job! No incorrect answers to review.'
                      : mode.id === 'weak-domains'
                      ? 'Excellent! No weak domains identified.'
                      : 'Coming soon...'
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Improvement Tips */}
        <section className={styles.tipsSection}>
          <h2>💡 Study Tips</h2>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>📊</div>
              <h3>Focus on Patterns</h3>
              <p>Review why certain answers are correct. Look for patterns in your mistakes to identify knowledge gaps.</p>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>🔄</div>
              <h3>Spaced Repetition</h3>
              <p>Return to review incorrect questions after a few days. This helps reinforce long-term retention.</p>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>🎯</div>
              <h3>Domain Focus</h3>
              <p>Concentrate on your weakest domains first. Small improvements in weak areas yield big score gains.</p>
            </div>
          </div>
        </section>

        {/* Weak Domains Detail */}
        {analytics.weakestDomains.length > 0 && (
          <section className={styles.weakDomainsSection}>
            <h2>📚 Areas Needing Attention</h2>
            <div className={styles.domainsList}>
              {analytics.weakestDomains.map(({ domain, score }) => (
                <div key={domain} className={styles.domainItem}>
                  <div className={styles.domainInfo}>
                    <h3 className={styles.domainName}>{domain}</h3>
                    <div className={styles.domainScore} style={{ 
                      color: score < 50 ? 'var(--danger-color)' : 'var(--warning-color)' 
                    }}>
                      {score}%
                    </div>
                  </div>
                  <div className={styles.domainBar}>
                    <div 
                      className={styles.domainBarFill} 
                      style={{ 
                        width: `${score}%`,
                        backgroundColor: score < 50 ? 'var(--danger-color)' : 'var(--warning-color)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SmartReview;