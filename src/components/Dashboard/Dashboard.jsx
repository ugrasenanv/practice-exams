import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import styles from './Dashboard.module.css';

function Dashboard({ onGoHome }) {
  const { sessionHistory, streakData, achievements, getAnalytics } = useProgress();
  const analytics = getAnalytics();

  // Get recent performance trend
  const recentSessions = sessionHistory.slice(0, 10).reverse(); // Last 10 sessions in chronological order

  // Get study time data
  const totalStudyTime = sessionHistory.reduce((sum, session) => sum + (session.timeUsed || 0), 0);
  const averageSessionTime = sessionHistory.length > 0 ? Math.round(totalStudyTime / sessionHistory.length / 60) : 0; // in minutes

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➖';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return 'var(--success-color)';
      case 'declining': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  if (!analytics.totalSessions) {
    return (
      <div className={styles.analyticsContainer}>
        <header className={styles.analyticsHeader}>
          <div className={styles.brand}>
            <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
            <div className={styles.tagline}>Performance Analytics</div>
          </div>
          <button className={styles.homeButton} onClick={onGoHome}>
            ← Back to Home
          </button>
        </header>

        <main className={styles.analyticsContent}>
          <div className={styles.noDataMessage}>
            <div className={styles.noDataIcon}>📊</div>
            <h2>No Performance Data Yet</h2>
            <p>Complete your first practice exam to see detailed analytics, progress tracking, and personalized insights.</p>
            <button className={styles.startButton} onClick={onGoHome}>
              Start Your First Exam
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.analyticsContainer}>
      <header className={styles.analyticsHeader}>
        <div className={styles.brand}>
          <div className={styles.logo}>AI Cert Studio</div>
          <div className={styles.tagline}>Performance Analytics</div>
        </div>
        <button className={styles.homeButton} onClick={onGoHome}>
          ← Back to Home
        </button>
      </header>

      <main className={styles.analyticsContent}>
        {/* Overview Stats */}
        <section className={styles.overviewSection}>
          <h2>📈 Performance Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{analytics.averageScore}%</div>
              <div className={styles.statLabel}>Average Score</div>
              <div className={styles.statTrend} style={{ color: getTrendColor(analytics.recentTrend) }}>
                {getTrendIcon(analytics.recentTrend)} {analytics.recentTrend}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{analytics.totalSessions}</div>
              <div className={styles.statLabel}>Exams Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{analytics.totalQuestions}</div>
              <div className={styles.statLabel}>Questions Answered</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatTime(totalStudyTime)}</div>
              <div className={styles.statLabel}>Total Study Time</div>
            </div>
          </div>
        </section>

        {/* Study Streaks & Achievements */}
        <section className={styles.streaksSection}>
          <h2>🔥 Study Progress</h2>
          <div className={styles.streaksGrid}>
            <div className={styles.streakCard}>
              <div className={styles.streakValue}>{streakData.currentStreak}</div>
              <div className={styles.streakLabel}>Current Streak</div>
              <div className={styles.streakSubtext}>
                {streakData.currentStreak > 0 ? 'Keep it up! 🚀' : 'Start today! 💪'}
              </div>
            </div>
            <div className={styles.streakCard}>
              <div className={styles.streakValue}>{streakData.longestStreak}</div>
              <div className={styles.streakLabel}>Longest Streak</div>
            </div>
            <div className={styles.achievementsCard}>
              <div className={styles.achievementsHeader}>
                <h3>🏆 Achievements ({achievements.length})</h3>
              </div>
              <div className={styles.achievementsList}>
                {achievements.length > 0 ? (
                  achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className={styles.achievementItem}>
                      <span className={styles.achievementIcon}>{achievement.icon}</span>
                      <div>
                        <div className={styles.achievementTitle}>{achievement.title}</div>
                        <div className={styles.achievementDesc}>{achievement.description}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noAchievements}>Complete more exams to unlock achievements!</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Domain Performance */}
        <section className={styles.domainSection}>
          <h2>📚 Domain Performance</h2>
          <div className={styles.domainGrid}>
            {Object.keys(analytics.domainPerformance).length > 0 ? (
              <>
                <div className={styles.domainCard}>
                  <h3>💪 Strongest Areas</h3>
                  <div className={styles.domainList}>
                    {analytics.strongestDomains.map(({ domain, score }) => (
                      <div key={domain} className={styles.domainItem}>
                        <span className={styles.domainName}>{domain}</span>
                        <span className={styles.domainScore} style={{ color: 'var(--success-color)' }}>
                          {score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.domainCard}>
                  <h3>📖 Areas for Improvement</h3>
                  <div className={styles.domainList}>
                    {analytics.weakestDomains.length > 0 ? (
                      analytics.weakestDomains.map(({ domain, score }) => (
                        <div key={domain} className={styles.domainItem}>
                          <span className={styles.domainName}>{domain}</span>
                          <span className={styles.domainScore} style={{ color: 'var(--warning-color)' }}>
                            {score}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <p>Great job! No weak areas identified. 🎉</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.noDomainData}>
                <p>Complete more exams to see domain-specific performance breakdown.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Performance Chart */}
        <section className={styles.chartSection}>
          <h2>📊 Recent Performance Trend</h2>
          <div className={styles.chartContainer}>
            {recentSessions.length > 0 ? (
              <div className={styles.scoreChart}>
                {recentSessions.map((session, index) => (
                  <div key={session.id} className={styles.chartBar}>
                    <div 
                      className={styles.chartBarFill}
                      style={{ 
                        height: `${session.score}%`,
                        backgroundColor: session.score >= 70 ? 'var(--success-color)' : 'var(--warning-color)'
                      }}
                    />
                    <div className={styles.chartBarLabel}>
                      {new Date(session.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className={styles.chartBarValue}>{session.score}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Complete more exams to see performance trends.</p>
            )}
          </div>
        </section>

        {/* Session History */}
        <section className={styles.historySection}>
          <h2>📋 Recent Sessions</h2>
          <div className={styles.sessionsList}>
            {sessionHistory.slice(0, 5).map(session => (
              <div key={session.id} className={styles.sessionItem}>
                <div className={styles.sessionInfo}>
                  <div className={styles.sessionTitle}>{session.examType}</div>
                  <div className={styles.sessionMeta}>
                    {new Date(session.timestamp).toLocaleDateString()} • 
                    {session.correctAnswers}/{session.totalQuestions} correct • 
                    {session.timeUsed ? formatTime(session.timeUsed) : 'N/A'}
                  </div>
                </div>
                <div className={styles.sessionScore} style={{ 
                  color: session.score >= 70 ? 'var(--success-color)' : 'var(--warning-color)' 
                }}>
                  {session.score}%
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;