import { useState, useEffect } from 'react'
import { useProgress } from '../../contexts/ProgressContext.jsx'
import { useAnalytics } from '../../contexts/AnalyticsContext.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import styles from './AdvancedDashboard.module.css'

const AdvancedDashboard = ({ onGoHome }) => {
  const { theme } = useTheme()
  const { sessions } = useProgress()
  const { 
    performanceData,
    learningTrends,
    strongestDomains,
    weakestDomains,
    studyRecommendations,
    timeAnalytics,
    streakData,
    loadAnalyticsData,
    updateStreak,
    getInsights,
    exportAnalytics,
    resetAnalytics
  } = useAnalytics()

  const [activeTab, setActiveTab] = useState('overview')
  const [showExportConfirm, setShowExportConfirm] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
    updateStreak()
  }, [loadAnalyticsData, updateStreak])

  const insights = getInsights()

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 85) return styles.excellent
    if (score >= 77) return styles.passing
    if (score >= 60) return styles.improving
    return styles.needsWork
  }

  const getRecommendationIcon = (type) => {
    const icons = {
      domain_focus: '📚',
      encouragement: '🎯',
      study_adjustment: '⚠️',
      time_management: '⏱️',
      consistency: '📅',
      certification: '🏆'
    }
    return icons[type] || '💡'
  }

  const getPriorityClass = (priority) => {
    return styles[`priority-${priority}`] || ''
  }

  const StatCard = ({ title, value, subtitle, icon, className = '' }) => (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>{icon}</span>
        <h3 className={styles.statTitle}>{title}</h3>
      </div>
      <div className={styles.statValue}>{value}</div>
      {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
    </div>
  )

  const OverviewTab = () => (
    <div className={styles.tabContent}>
      {/* Performance Summary */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📊 Performance Overview</h2>
        <div className={styles.statsGrid}>
          <StatCard
            title="Total Sessions"
            value={performanceData.totalSessions || 0}
            subtitle={`${performanceData.totalQuestions || 0} questions practiced`}
            icon="📝"
          />
          <StatCard
            title="Average Score"
            value={`${performanceData.averageScore || 0}%`}
            subtitle={`Pass rate: ${performanceData.passingRate || 0}%`}
            icon="🎯"
            className={getScoreColor(performanceData.averageScore)}
          />
          <StatCard
            title="Study Streak"
            value={`${streakData.current} days`}
            subtitle={`Longest: ${streakData.longest} days`}
            icon="🔥"
            className={streakData.current >= 7 ? styles.excellent : ''}
          />
          <StatCard
            title="Total Study Time"
            value={formatTime(timeAnalytics.totalStudyTime || 0)}
            subtitle={`Avg per session: ${formatTime(timeAnalytics.averageSessionTime || 0)}`}
            icon="⏱️"
          />
        </div>
      </section>

      {/* Insights */}
      {insights.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💡 Insights</h2>
          <div className={styles.insightsGrid}>
            {insights.map((insight, index) => (
              <div key={index} className={`${styles.insightCard} ${styles[insight.type]}`}>
                <h4 className={styles.insightTitle}>{insight.title}</h4>
                <p className={styles.insightDescription}>{insight.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {studyRecommendations.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎯 Study Recommendations</h2>
          <div className={styles.recommendationsGrid}>
            {studyRecommendations.map((rec, index) => (
              <div key={index} className={`${styles.recommendationCard} ${getPriorityClass(rec.priority)}`}>
                <div className={styles.recommendationHeader}>
                  <span className={styles.recommendationIcon}>{getRecommendationIcon(rec.type)}</span>
                  <h4 className={styles.recommendationTitle}>{rec.title}</h4>
                  <span className={`${styles.priorityBadge} ${getPriorityClass(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className={styles.recommendationDescription}>{rec.description}</p>
                <div className={styles.recommendationAction}>
                  <strong>Recommended action:</strong> {rec.action}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )

  const PerformanceTab = () => (
    <div className={styles.tabContent}>
      {/* Learning Trends Chart */}
      {learningTrends.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📈 Learning Trends</h2>
          <div className={styles.chartContainer}>
            <div className={styles.trendChart}>
              {learningTrends.map((trend, index) => (
                <div key={index} className={styles.trendPoint}>
                  <div 
                    className={styles.trendBar} 
                    style={{ 
                      height: `${trend.score}%`,
                      backgroundColor: trend.score >= 77 ? 'var(--success-color)' : 'var(--warning-color)'
                    }}
                  >
                    <div className={styles.trendLabel}>{trend.score}%</div>
                  </div>
                  <div className={styles.trendSession}>Session {trend.session}</div>
                </div>
              ))}
            </div>
            <div className={styles.chartFooter}>
              <div className={styles.passLine}>
                <span>Passing Score: 70%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Domain Analysis */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🎯 Domain Performance</h2>
        <div className={styles.domainsGrid}>
          {/* Strongest Domains */}
          <div className={styles.domainCard}>
            <h3 className={styles.domainCardTitle}>
              <span className={styles.domainIcon}>💪</span>
              Strongest Areas
            </h3>
            <div className={styles.domainList}>
              {strongestDomains.length > 0 ? strongestDomains.map((domain, index) => (
                <div key={index} className={styles.domainItem}>
                  <div className={styles.domainName}>{domain.domain}</div>
                  <div className={styles.domainScore}>
                    <span className={getScoreColor(domain.percentage)}>
                      {Math.round(domain.percentage)}%
                    </span>
                    <span className={styles.domainDetails}>
                      ({domain.totalQuestions} questions)
                    </span>
                  </div>
                </div>
              )) : (
                <p className={styles.noData}>Take more practice exams to see domain analysis</p>
              )}
            </div>
          </div>

          {/* Weakest Domains */}
          <div className={styles.domainCard}>
            <h3 className={styles.domainCardTitle}>
              <span className={styles.domainIcon}>📈</span>
              Areas for Improvement
            </h3>
            <div className={styles.domainList}>
              {weakestDomains.length > 0 ? weakestDomains.map((domain, index) => (
                <div key={index} className={styles.domainItem}>
                  <div className={styles.domainName}>{domain.domain}</div>
                  <div className={styles.domainScore}>
                    <span className={getScoreColor(domain.percentage)}>
                      {Math.round(domain.percentage)}%
                    </span>
                    <span className={styles.domainDetails}>
                      ({domain.totalQuestions} questions)
                    </span>
                  </div>
                </div>
              )) : (
                <p className={styles.noData}>All areas are performing well!</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  const TimeAnalysisTab = () => (
    <div className={styles.tabContent}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⏱️ Time Analysis</h2>
        
        {/* Time Statistics */}
        <div className={styles.statsGrid}>
          <StatCard
            title="Average Session"
            value={formatTime(timeAnalytics.averageSessionTime || 0)}
            subtitle={`${Math.round(timeAnalytics.averageQuestionsPerSession || 0)} questions per session`}
            icon="📊"
          />
          <StatCard
            title="Question Speed"
            value={formatTime(timeAnalytics.averageQuestionTime || 0)}
            subtitle="per question"
            icon="⚡"
            className={
              (timeAnalytics.averageQuestionTime || 0) > 120 ? styles.needsWork : 
              (timeAnalytics.averageQuestionTime || 0) < 60 ? styles.excellent : styles.passing
            }
          />
          <StatCard
            title="Total Study Time"
            value={formatTime(timeAnalytics.totalStudyTime || 0)}
            subtitle={`Across ${performanceData.totalSessions || 0} sessions`}
            icon="🕒"
          />
        </div>

        {/* Domain Timing */}
        {timeAnalytics.domainTiming && Object.keys(timeAnalytics.domainTiming).length > 0 && (
          <div className={styles.domainTimingSection}>
            <h3>Time by Domain</h3>
            <div className={styles.domainTimingGrid}>
              {Object.entries(timeAnalytics.domainTiming).map(([domain, timing]) => (
                <div key={domain} className={styles.timingCard}>
                  <h4 className={styles.timingDomain}>{domain}</h4>
                  <div className={styles.timingValue}>{formatTime(timing.average)}</div>
                  <div className={styles.timingSubtitle}>
                    avg per question ({timing.count} questions)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )

  const SettingsTab = () => (
    <div className={styles.tabContent}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⚙️ Analytics Settings</h2>
        
        <div className={styles.settingsGrid}>
          <div className={styles.settingCard}>
            <h3>Export Data</h3>
            <p>Download your analytics data as a JSON file for backup or external analysis.</p>
            <button 
              className={styles.exportButton}
              onClick={() => setShowExportConfirm(true)}
            >
              📤 Export Analytics Data
            </button>
          </div>

          <div className={styles.settingCard}>
            <h3>Reset Analytics</h3>
            <p>Clear all analytics data and start fresh. This action cannot be undone.</p>
            <button 
              className={styles.resetButton}
              onClick={resetAnalytics}
            >
              🗑️ Reset All Data
            </button>
          </div>

          <div className={styles.settingCard}>
            <h3>Data Privacy</h3>
            <p>All analytics data is stored locally in your browser. No data is sent to external servers.</p>
            <div className={styles.privacyInfo}>
              <span className={styles.privacyIcon}>🔒</span>
              <span>Your data stays private</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  return (
    <div className={`${styles.dashboard} ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbItem} onClick={onGoHome}>🏠 Home</span>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbCurrent}>📊 Analytics</span>
            </div>
            <h1 className={styles.title}>Advanced Analytics Dashboard</h1>
            <p className={styles.subtitle}>
              Comprehensive insights into your SAFe certification preparation
            </p>
          </div>
          <button onClick={onGoHome} className={styles.homeButton}>
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.tabNav}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          📈 Performance
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'time' ? styles.active : ''}`}
          onClick={() => setActiveTab('time')}
        >
          ⏱️ Time Analysis
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      {/* Tab Content */}
      <main className={styles.main}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'time' && <TimeAnalysisTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Export Confirmation Modal */}
      {showExportConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Export Analytics Data</h3>
            <p>This will download a JSON file containing all your analytics data including:</p>
            <ul>
              <li>Performance metrics and trends</li>
              <li>Domain analysis</li>
              <li>Time analytics</li>
              <li>Study recommendations</li>
            </ul>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowExportConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={() => {
                  exportAnalytics()
                  setShowExportConfirm(false)
                }}
              >
                Download Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedDashboard