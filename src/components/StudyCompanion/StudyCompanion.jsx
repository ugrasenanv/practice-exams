import React, { useState, useEffect } from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import { useStudyIntelligence } from '../../contexts/StudyIntelligenceContext';
import styles from './StudyCompanion.module.css';

const StudyCompanion = ({ examType = 'leadingsafe', onStartRecommendedSession, onGoHome, onGoToDashboard, onGoToSettings }) => {
  const { sessions, achievements } = useProgress();
  const { getComprehensiveAnalysis } = useStudyIntelligence();
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateAnalysis = () => {
      setIsLoading(true);
      try {
        const comprehensiveAnalysis = getComprehensiveAnalysis(sessions, achievements, examType);
        setAnalysis(comprehensiveAnalysis);
      } catch (error) {
        console.error('Error generating analysis:', error);
        setAnalysis(null);
      }
      setIsLoading(false);
    };

    // Add small delay for better UX
    const timer = setTimeout(generateAnalysis, 300);
    return () => clearTimeout(timer);
  }, [sessions, achievements, examType, getComprehensiveAnalysis]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <h3>Analyzing your learning patterns...</h3>
          <p>Generating personalized insights with AI</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <>
        {/* Header Navigation */}
        <header className="header">
          <div className="header-content">
            <div className="brand">
              <div className="logo-container">
                <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className="logo-image" />
              </div>
              <div className="tagline">AI Study Companion</div>
            </div>
            <nav className="nav">
              <button onClick={onGoHome} className="nav-button">
                <span className="nav-icon">🏠</span><span>Home</span>
              </button>
              <button onClick={onGoToDashboard} className="nav-button dashboard-button">
                <span className="nav-icon">📊</span><span>Dashboard</span>
              </button>
              <button onClick={onGoToSettings} className="nav-button settings-button">
                <span className="nav-icon">⚙️</span><span>Settings</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeContent}>
              <div className={styles.aiIntro}>
                <div className={styles.aiIcon}>🤖</div>
                <h1>AI-Powered Study Companion</h1>
                <p className={styles.aiDescription}>
                  Your personal learning assistant that analyzes your performance patterns, 
                  predicts certification readiness, and provides data-driven recommendations 
                  to optimize your study journey.
                </p>
              </div>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>📈</div>
                  <h3>Performance Analytics</h3>
                  <p>Track learning velocity, retention rates, and study efficiency metrics</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🎯</div>
                  <h3>Readiness Prediction</h3>
                  <p>AI calculates your certification probability with confidence intervals</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>💡</div>
                  <h3>Smart Recommendations</h3>
                  <p>Personalized study schedules and focus areas based on your data</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🔄</div>
                  <h3>Spaced Repetition</h3>
                  <p>Optimal review timing to maximize long-term knowledge retention</p>
                </div>
              </div>

              <div className={styles.getStartedSection}>
                <div className={styles.emptyStateCard}>
                  <div className={styles.emptyIcon}>🧠</div>
                  <h3>Build Your Learning Profile</h3>
                  <p>Take at least 3 practice sessions to unlock personalized AI recommendations and predictive analytics.</p>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.learnMoreButton}
                      onClick={onGoHome}
                    >
                      Browse Practice Exams
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  const { predictiveAnalytics, studyRecommendations, learningInsights, spacedRepetition } = analysis;

  const handleStartRecommendedSession = () => {
    const sessionConfig = {
      questionCount: studyRecommendations.recommendedQuestionCount,
      mode: studyRecommendations.sessionType,
      focusAreas: studyRecommendations.focusAreas
    };
    
    if (onStartRecommendedSession) {
      onStartRecommendedSession(sessionConfig);
    }
  };

  const renderOverviewTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.metricsGrid}>
        {/* Pass Probability Card */}
        <div className={`${styles.metricCard} ${styles.primaryCard}`}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🎯</span>
            <h4>Certification Readiness</h4>
          </div>
          <div className={styles.metricValue}>
            <span className={styles.percentage}>{predictiveAnalytics?.probability || 0}%</span>
            <span className={styles.confidence}>
              {predictiveAnalytics?.confidence || 'Low'} Confidence
            </span>
          </div>
          <div className={styles.metricDetails}>
            <p>{predictiveAnalytics?.recommendation || 'Keep studying!'}</p>
            {predictiveAnalytics?.timeToReadiness && (
              <p className={styles.timeEstimate}>
                <strong>Time to readiness:</strong> {predictiveAnalytics.timeToReadiness}
              </p>
            )}
          </div>
        </div>

        {/* Learning Velocity Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⚡</span>
            <h4>Learning Velocity</h4>
          </div>
          <div className={styles.metricValue}>
            <span className={styles.velocity}>
              {learningInsights?.learningVelocity > 0 ? '+' : ''}
              {(learningInsights?.learningVelocity || 0).toFixed(1)} pts/week
            </span>
          </div>
          <div className={styles.metricDetails}>
            <p>
              {learningInsights?.learningVelocity > 1 ? 'Excellent progress!' :
               learningInsights?.learningVelocity > 0 ? 'Steady improvement' :
               'Focus on consistency'}
            </p>
          </div>
        </div>

        {/* Retention Rate Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🧠</span>
            <h4>Knowledge Retention</h4>
          </div>
          <div className={styles.metricValue}>
            <span className={styles.percentage}>
              {(learningInsights?.retentionRate || 0).toFixed(0)}%
            </span>
          </div>
          <div className={styles.metricDetails}>
            <p>
              {learningInsights?.retentionRate > 85 ? 'Excellent memory!' :
               learningInsights?.retentionRate > 70 ? 'Good retention' :
               'Review more frequently'}
            </p>
          </div>
        </div>

        {/* Study Efficiency Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>📊</span>
            <h4>Study Efficiency</h4>
          </div>
          <div className={styles.metricValue}>
            <span className={styles.efficiency}>
              {(learningInsights?.studyEfficiency || 0).toFixed(2)}
            </span>
            <span className={styles.efficiencyUnit}>pts/min</span>
          </div>
          <div className={styles.metricDetails}>
            <p>
              {learningInsights?.studyEfficiency > 0.1 ? 'Highly efficient' :
               learningInsights?.studyEfficiency > 0.05 ? 'Good efficiency' :
               'Consider focused sessions'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div className={styles.recommendedAction}>
        <h4>🎯 AI Recommendation</h4>
        <p>{studyRecommendations?.recommendation}</p>
        <button 
          className={styles.actionButton}
          onClick={handleStartRecommendedSession}
        >
          Start Optimized Session ({studyRecommendations?.recommendedQuestionCount} questions)
        </button>
      </div>
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.recommendationsGrid}>
        {/* Optimal Study Schedule */}
        <div className={styles.recommendationCard}>
          <h4>📅 Optimal Study Schedule</h4>
          <div className={styles.scheduleDetails}>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Best time:</span>
              <span className={styles.scheduleValue}>{studyRecommendations?.bestTimeOfDay}</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Session length:</span>
              <span className={styles.scheduleValue}>{studyRecommendations?.optimalStudyTime} minutes</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Questions per session:</span>
              <span className={styles.scheduleValue}>{studyRecommendations?.recommendedQuestionCount}</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Review cycle:</span>
              <span className={styles.scheduleValue}>Every {learningInsights?.optimalReviewCycle || 3} days</span>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className={styles.recommendationCard}>
          <h4>🎯 Priority Focus Areas</h4>
          <div className={styles.focusAreas}>
            {studyRecommendations?.focusAreas?.length > 0 ? (
              studyRecommendations.focusAreas.map((area, index) => (
                <div key={index} className={styles.focusArea}>
                  <span className={styles.focusRank}>#{index + 1}</span>
                  <span className={styles.focusName}>{area}</span>
                </div>
              ))
            ) : (
              <p>Keep practicing to identify focus areas</p>
            )}
          </div>
        </div>

        {/* Session Type Recommendation */}
        <div className={styles.recommendationCard}>
          <h4>📚 Recommended Session Type</h4>
          <div className={styles.sessionType}>
            <span className={styles.sessionTypeTag}>
              {studyRecommendations?.sessionType === 'review' ? '🔄 Review Mode' :
               studyRecommendations?.sessionType === 'challenge' ? '💪 Challenge Mode' :
               studyRecommendations?.sessionType === 'balanced' ? '⚖️ Balanced Mode' :
               '🌟 Mixed Mode'}
            </span>
            <p className={styles.sessionDescription}>
              {studyRecommendations?.sessionType === 'review' ? 'Focus on previously missed questions and weak areas' :
               studyRecommendations?.sessionType === 'challenge' ? 'Take on more difficult questions to push your limits' :
               studyRecommendations?.sessionType === 'balanced' ? 'Mix of new questions and review for optimal growth' :
               'Combination of all question types for comprehensive practice'}
            </p>
          </div>
        </div>

        {/* Spaced Repetition */}
        <div className={styles.recommendationCard}>
          <h4>🔄 Spaced Repetition Queue</h4>
          <div className={styles.spacedRepetition}>
            <div className={styles.repetitionStats}>
              <div className={styles.repetitionStat}>
                <span className={styles.statValue}>{spacedRepetition?.questionsForReview?.length || 0}</span>
                <span className={styles.statLabel}>Due for review</span>
              </div>
              <div className={styles.repetitionStat}>
                <span className={styles.statValue}>{spacedRepetition?.totalTracked || 0}</span>
                <span className={styles.statLabel}>Questions tracked</span>
              </div>
            </div>
            {spacedRepetition?.questionsForReview?.length > 0 && (
              <button className={styles.reviewButton}>
                Review {spacedRepetition.questionsForReview.length} Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.insightsGrid}>
        {/* Performance Predictor */}
        <div className={styles.insightCard}>
          <h4>🔮 Performance Prediction</h4>
          <div className={styles.prediction}>
            <div className={styles.predictionValue}>
              {learningInsights?.performancePredictor?.nextSessionPrediction || 0}%
            </div>
            <div className={styles.predictionLabel}>
              Predicted next session score
            </div>
            <div className={styles.predictionDetails}>
              <span className={styles.trendIndicator}>
                {learningInsights?.performancePredictor?.trendDirection === 'Improving' ? '📈' :
                 learningInsights?.performancePredictor?.trendDirection === 'Declining' ? '📉' : '➡️'}
                {learningInsights?.performancePredictor?.trendDirection}
              </span>
              <span className={styles.predictionConfidence}>
                {learningInsights?.performancePredictor?.confidence} confidence
              </span>
            </div>
          </div>
        </div>

        {/* Knowledge Growth */}
        <div className={styles.insightCard}>
          <h4>📈 Knowledge Growth</h4>
          <div className={styles.growthMetrics}>
            <div className={styles.growthValue}>
              {learningInsights?.knowledgeGrowth?.growth > 0 ? '+' : ''}
              {(learningInsights?.knowledgeGrowth?.growth || 0).toFixed(1)}%
            </div>
            <div className={styles.growthLabel}>Per study period</div>
            <div className={styles.growthTrajectory}>
              <span className={styles.trajectoryIcon}>
                {learningInsights?.knowledgeGrowth?.trajectory === 'Accelerating' ? '🚀' :
                 learningInsights?.knowledgeGrowth?.trajectory === 'Steady' ? '📊' : '🎯'}
              </span>
              <span>{learningInsights?.knowledgeGrowth?.trajectory}</span>
            </div>
          </div>
        </div>

        {/* Focus Metric */}
        <div className={styles.insightCard}>
          <h4>🎯 Focus Quality</h4>
          <div className={styles.focusMetric}>
            <div className={styles.focusScore}>
              {(learningInsights?.focusMetric || 0).toFixed(0)}%
            </div>
            <div className={styles.focusLabel}>Consistency within sessions</div>
            <div className={styles.focusDescription}>
              {learningInsights?.focusMetric > 80 ? 'Excellent focus! You maintain consistency throughout sessions.' :
               learningInsights?.focusMetric > 60 ? 'Good focus. Consider shorter sessions if concentration drops.' :
               'Variable focus. Try breaking sessions into smaller chunks.'}
            </div>
          </div>
        </div>

        {/* Study Pattern Analysis */}
        <div className={styles.insightCard}>
          <h4>📊 Study Pattern Analysis</h4>
          <div className={styles.patternAnalysis}>
            <div className={styles.patternItem}>
              <span className={styles.patternLabel}>Avg Score Trend:</span>
              <span className={styles.patternValue}>
                {predictiveAnalytics?.trend > 0 ? '↗️' : predictiveAnalytics?.trend < 0 ? '↘️' : '➡️'}
                {(predictiveAnalytics?.trend || 0).toFixed(1)} pts/session
              </span>
            </div>
            <div className={styles.patternItem}>
              <span className={styles.patternLabel}>Consistency:</span>
              <span className={styles.patternValue}>
                {(predictiveAnalytics?.consistency || 0).toFixed(0)}%
              </span>
            </div>
            <div className={styles.patternItem}>
              <span className={styles.patternLabel}>Sessions Analyzed:</span>
              <span className={styles.patternValue}>
                {predictiveAnalytics?.sessionsAnalyzed || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerActions}>
          {onGoHome && (
            <button onClick={onGoHome} className={styles.backButton}>
              ← Back to Home
            </button>
          )}
        </div>
        <h2>🧠 AI Study Companion</h2>
        <p>Personalized insights powered by advanced analytics</p>
        <div className={styles.analysisConfidence}>
          Analysis confidence: <strong>{studyRecommendations?.confidence || 'Building...'}</strong>
        </div>
      </div>

      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'recommendations' ? styles.active : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          💡 Recommendations
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'insights' ? styles.active : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          🔬 Deep Insights
        </button>
      </div>

      <div className={styles.tabContainer}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}
        {activeTab === 'insights' && renderInsightsTab()}
      </div>
    </div>
  );
};

export default StudyCompanion;