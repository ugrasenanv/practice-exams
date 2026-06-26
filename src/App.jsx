import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext.jsx'
import { ProgressProvider, useProgress } from './contexts/ProgressContext.jsx'
import { StudyIntelligenceProvider } from './contexts/StudyIntelligenceContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import { AutosaveProvider } from './contexts/AutosaveContext.jsx'
import { AnalyticsProvider } from './contexts/AnalyticsContext.jsx'
import { QuestionHistoryProvider } from './contexts/QuestionHistoryContext.jsx'
import AB730Exam from './components/AB730/AB730Exam.jsx'
import AB730ExamQuiz from './components/AB730/AB730ExamQuiz.jsx'
import AI900Exam from './components/AI900/AI900Exam.jsx'
import AI900ExamQuiz from './components/AI900/AI900ExamQuiz.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Achievements from './components/Achievements/Achievements.jsx'
import SmartReview from './components/SmartReview/SmartReview.jsx'
import StudyCompanion from './components/StudyCompanion/StudyCompanion.jsx'
import NotificationSettings from './components/NotificationSettings/NotificationSettings.jsx'
import AchievementNotification from './components/Achievements/AchievementNotification.jsx'
import TimingAnalyticsPage from './components/shared/TimingAnalyticsPage.jsx'
import AdvancedDashboard from './components/analytics/AdvancedDashboard.jsx'
import StudyMaterials from './StudyMaterials.jsx'
import HamburgerMenu from './components/navigation/HamburgerMenu.jsx'
import './App.css'
import './pwa-styles.css'

function App() {
  // Re-introduce only the providers required for current visible features.
  return (
    <ThemeProvider>
      <ProgressProvider>
        <NotificationProvider>
          <StudyIntelligenceProvider>
            <AutosaveProvider>
              <AnalyticsProvider>
                <QuestionHistoryProvider>
                  <AppContent />
                </QuestionHistoryProvider>
              </AnalyticsProvider>
            </AutosaveProvider>
          </StudyIntelligenceProvider>
        </NotificationProvider>
      </ProgressProvider>
    </ThemeProvider>
  )
}

function AppContent() {
  const { theme, setLightTheme, setDarkTheme, autoShowExplanation, setAutoShowExplanation } = useTheme()
  const { achievements, getNewAchievements } = useProgress()
  const [currentPage, setCurrentPage] = useState('home')
  const [studyExamType, setStudyExamType] = useState('AB-730')
  const [achievementNotification, setAchievementNotification] = useState(null)
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [numberOfQuestions, setNumberOfQuestions] = useState(() => {
    const savedQuestionCount = localStorage.getItem('personal-practice-exams-question-count')
    const count = savedQuestionCount ? Number(savedQuestionCount) : 45
    // Migration: Update old default of 40 to new default of 45
    return count === 40 ? 45 : count
  })
  
  // Add exam mode state management
  const [examMode, setExamMode] = useState(() => {
    const savedExamMode = localStorage.getItem('personal-practice-exams-exam-mode')
    return savedExamMode || 'exam'
  })

  // Save numberOfQuestions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('personal-practice-exams-question-count', numberOfQuestions.toString())
  }, [numberOfQuestions])

  // Save examMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('personal-practice-exams-exam-mode', examMode)
  }, [examMode])

  // One-time migration effect to update localStorage for migrated users
  useEffect(() => {
    const savedQuestionCount = localStorage.getItem('personal-practice-exams-question-count')
    if (savedQuestionCount === '40') {
      localStorage.setItem('personal-practice-exams-question-count', '45')
    }
  }, [])

  // Watch for new achievements and show notifications
  useEffect(() => {
    const newAchievements = getNewAchievements()
    if (newAchievements.length > 0) {
      setAchievementNotification(newAchievements[0])
    }
  }, [achievements, getNewAchievements])

  const startExam = (examType) => {
    if (examType === 'AB-730') {
      setCurrentPage('ab730')
    } else if (examType === 'AI-900') {
      setCurrentPage('ai900')
    }
  }

  const startAB730Quiz = () => {
    setCurrentPage('ab730-quiz')
  }

  const startAI900Quiz = () => {
    setCurrentPage('ai900-quiz')
  }

  const goToStudyMaterials = (examType = 'AB-730') => {
    setStudyExamType(examType)
    setCurrentPage('study-materials')
  }

  const goHome = () => {
    setCurrentPage('home')
  }

  const goToSettings = () => {
    setCurrentPage('settings')
  }

  const goToDashboard = () => {
    setCurrentPage('dashboard')
  }

  const goToAchievements = () => {
    setCurrentPage('achievements')
  }

  const goToSmartReview = () => {
    setCurrentPage('smart-review')
  }

  const goToStudyCompanion = () => {
    setCurrentPage('study-companion')
  }

  const goToNotifications = () => {
    // Guard: only navigate if NotificationProvider is mounted (window flag set below)
    if (window.__NOTIFICATION_PROVIDER_READY__) {
      setCurrentPage('notifications')
    } else {
      console.warn('Notifications provider not ready yet.')
      // Optional: add a transient local notification substitute later
    }
  }

  const goToTiming = () => {
    setCurrentPage('timing')
  }

  const goToAdvancedAnalytics = () => {
    setCurrentPage('advanced-analytics')
  }

  const goToExams = () => {
    setCurrentPage('exams')
  }

  // Hamburger menu handlers
  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen)
  }

  const closeHamburgerMenu = () => {
    setIsHamburgerOpen(false)
  }

  // Navigation structure for hamburger menu
  const navigationItems = {
    primary: [
      { key: 'home', icon: '🏠', label: 'Home', action: 'home' },
      { key: 'exams', icon: '📋', label: 'Exams', action: 'exams' }
    ],
    secondary: [
      { key: 'dashboard', icon: '📊', label: 'Dashboard', action: 'dashboard' },
      { key: 'achievements', icon: '🏆', label: 'Achievements', action: 'achievements' },
      { key: 'smart-review', icon: '🎯', label: 'Smart Review', action: 'smart-review' },
      { key: 'study-companion', icon: '🧠', label: 'AI Study Companion', action: 'study-companion' },
      { key: 'timing', icon: '⏱️', label: 'Timing Analytics', action: 'timing' },
      { key: 'advanced-analytics', icon: '📈', label: 'Advanced Analytics', action: 'advanced-analytics' }
    ],
    utility: [
      { key: 'notifications', icon: '🔔', label: 'Notifications', action: 'notifications' },
      { key: 'settings', icon: '⚙️', label: 'Settings', action: 'settings' }
    ]
  }

  const goBackToExam = () => {
    if (studyExamType === 'AB-730') {
      setCurrentPage('ab730')
    } else if (studyExamType === 'AI-900') {
      setCurrentPage('ai900')
    }
  }

  const goBackToAB730 = () => {
    setCurrentPage('ab730')
  }

  const goBackToAI900 = () => {
    setCurrentPage('ai900')
  }

  // AB-730 Exam Page
  if (currentPage === 'ab730') {
    return (
      <AB730Exam 
        onGoHome={goHome} 
        onGoToStudyMaterials={() => goToStudyMaterials('AB-730')} 
        onStartQuiz={startAB730Quiz} 
        numberOfQuestions={numberOfQuestions} 
        autoShowExplanation={autoShowExplanation}
        onNumberOfQuestionsChange={setNumberOfQuestions}
        onAutoShowExplanationChange={setAutoShowExplanation}
        examMode={examMode}
        onExamModeChange={setExamMode}
      />
    )
  }

  // AB-730 Quiz Page
  if (currentPage === 'ab730-quiz') {
    return (
      <AB730ExamQuiz 
        onGoHome={goHome} 
        onGoBackToExam={goBackToAB730} 
        numberOfQuestions={numberOfQuestions} 
        autoShowExplanation={autoShowExplanation} 
        examMode={examMode}
      />
    )
  }

  // AI-900 Exam Page
  if (currentPage === 'ai900') {
    return (
      <AI900Exam 
        onGoHome={goHome} 
        onGoToStudyMaterials={() => goToStudyMaterials('AI-900')} 
        onStartQuiz={startAI900Quiz} 
        numberOfQuestions={numberOfQuestions} 
        autoShowExplanation={autoShowExplanation}
        onNumberOfQuestionsChange={setNumberOfQuestions}
        onAutoShowExplanationChange={setAutoShowExplanation}
        examMode={examMode}
        onExamModeChange={setExamMode}
      />
    )
  }

  // AI-900 Quiz Page
  if (currentPage === 'ai900-quiz') {
    return (
      <AI900ExamQuiz 
        onGoHome={goHome} 
        onGoBackToExam={goBackToAI900} 
        numberOfQuestions={numberOfQuestions} 
        autoShowExplanation={autoShowExplanation} 
        examMode={examMode}
      />
    )
  }

  // Study Materials Page
  if (currentPage === 'study-materials') {
    return <StudyMaterials onGoHome={goBackToExam} examType={studyExamType} />
  }

  // Analytics Page
  if (currentPage === 'dashboard') {
    return <Dashboard onGoHome={goHome} />
  }

  if (currentPage === 'achievements') {
    return <Achievements onGoHome={goHome} />
  }

  if (currentPage === 'smart-review') {
    return <SmartReview onGoHome={goHome} onStartExam={startExam} />
  }

  if (currentPage === 'study-companion') {
    return <StudyCompanion 
      examType='ab730'
      onStartRecommendedSession={(config) => {
        setNumberOfQuestions(config.questionCount);
        goHome();
      }}
      onGoHome={goHome}
      onGoToDashboard={goToDashboard}
      onGoToSettings={goToSettings}
    />
  }

  if (currentPage === 'notifications') {
    return <NotificationSettings onGoHome={goHome} />
  }

  // Timing Analytics Page
  if (currentPage === 'timing') {
    return <TimingAnalyticsPage onGoHome={goHome} />
  }

  // Advanced Analytics Dashboard
  if (currentPage === 'advanced-analytics') {
    return <AdvancedDashboard onGoHome={goHome} />
  }

  // Settings Page
  if (currentPage === 'settings') {
    return (
      <>
        <header className="header">
          <div className="header-content">
            <div className="brand">
              <div className="logo-container">
                <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className="logo-image" />
              </div>
              <div className="tagline">Practice Exams - Settings</div>
            </div>
            <nav className="nav">
              <button onClick={goToNotifications} className="nav-button">
                <span className="nav-icon">🔔</span><span>Notifications</span>
              </button>
              <button onClick={goHome} className="nav-button">
                <span className="nav-icon">🏠</span><span>Home</span>
              </button>
            </nav>
            <HamburgerMenu
              isOpen={isHamburgerOpen}
              onToggle={toggleHamburgerMenu}
              onClose={closeHamburgerMenu}
              navigationItems={navigationItems}
              currentPage={currentPage}
              onNavigate={(page) => {
                switch (page) {
                  case 'home':
                    goHome();
                    break;
                  case 'exams':
                    goToExams();
                    break;
                  case 'dashboard':
                    goToDashboard();
                    break;
                  case 'achievements':
                    goToAchievements();
                    break;
                  case 'smart-review':
                    goToSmartReview();
                    break;
                  case 'study-companion':
                    goToStudyCompanion();
                    break;
                  case 'timing':
                    goToTiming();
                    break;
                  case 'notifications':
                    goToNotifications();
                    break;
                  case 'advanced-analytics':
                    goToAdvancedAnalytics();
                    break;
                  case 'settings':
                    goToSettings();
                    break;
                  default:
                    break;
                }
                closeHamburgerMenu();
              }}
            />
          </div>
        </header>

        <main className="main-content">
          <div className="settings-container">
            <h1>Settings</h1>

            <div className="settings-section">
              <h2>Appearance</h2>
              <div className="setting-item">
                <label htmlFor="themeSelect">Theme:</label>
                <select
                  id="themeSelect"
                  value={theme}
                  onChange={(e) => {
                    if (e.target.value === 'light') {
                      setLightTheme()
                    } else {
                      setDarkTheme()
                    }
                  }}
                  className="settings-select"
                >
                  <option value="light">Light Theme (Default)</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>
              <div className="settings-info">
                <p>Current theme: <strong>{theme === 'light' ? 'Light' : 'Dark'}</strong></p>
                <p className="settings-note">
                  Theme changes take effect immediately and are saved to your browser.
                </p>
              </div>
            </div>

            <div className="settings-section">
              <h2>Exam Configuration</h2>
              <div className="setting-item">
                <label htmlFor="questionCount">Number of Questions per Exam:</label>
                <select
                  id="questionCount"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  className="settings-select"
                >
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={40}>40 Questions</option>
                  <option value={45}>45 Questions (Default)</option>
                  <option value={50}>50 Questions</option>
                  <option value={100}>100 Questions (Complete Bank)</option>
                </select>
              </div>
              <div className="settings-info">
                <p>Current setting: <strong>{numberOfQuestions} questions</strong> per exam</p>
                <p className="settings-note">
                  This setting applies to all practice exams. Changes take effect immediately and are saved to your browser.
                </p>
              </div>
              <div style={{ marginTop: '1.5rem' }} />
              <div className="setting-item">
                <label htmlFor="autoShowExplanation">Automatically show detailed explanations:</label>
                <input
                  id="autoShowExplanation"
                  type="checkbox"
                  checked={autoShowExplanation}
                  onChange={e => setAutoShowExplanation(e.target.checked)}
                  style={{ marginLeft: '0.75rem' }}
                />
              </div>
              <div className="settings-info">
                <p>Current setting: <strong>{autoShowExplanation ? 'On' : 'Off'}</strong></p>
                <p className="settings-note">
                  When enabled, detailed explanations will be automatically shown in all exams.<br />Default is Off.
                </p>
              </div>
            </div>

            <div className="settings-actions">
              <button onClick={goHome} className="settings-back-button">
                Save & Return to Home
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Exams Page
  if (currentPage === 'exams') {
    return (
      <>
        <header className="header">
          <div className="header-content">
            <div className="brand">
              <div className="logo-container">
                <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className="logo-image" />
              </div>
              <div className="tagline">Practice Exams</div>
            </div>
            <nav className="nav">
            <button onClick={goHome} className="nav-button">
              <span className="nav-icon">🏠</span><span>Home</span>
            </button>
            <button onClick={goToSettings} className="nav-button settings-button">
              <span className="nav-icon">⚙️</span><span>Settings</span>
            </button>
          </nav>
          <HamburgerMenu
            isOpen={isHamburgerOpen}
            onToggle={toggleHamburgerMenu}
            onClose={closeHamburgerMenu}
            navigationItems={navigationItems}
            currentPage={currentPage}
            onNavigate={(page) => {
              switch (page) {
                case 'home':
                  goHome();
                  break;
                case 'exams':
                  goToExams();
                  break;
                case 'dashboard':
                  goToDashboard();
                  break;
                case 'achievements':
                  goToAchievements();
                  break;
                case 'smart-review':
                  goToSmartReview();
                  break;
                case 'study-companion':
                  goToStudyCompanion();
                  break;
                case 'timing':
                  goToTiming();
                  break;
                case 'notifications':
                  goToNotifications();
                  break;
                case 'advanced-analytics':
                  goToAdvancedAnalytics();
                  break;
                case 'settings':
                  goToSettings();
                  break;
                default:
                  break;
              }
              closeHamburgerMenu();
            }}
          />
          </div>
        </header>

        <main className="main-content">
          <div className="hero-section">
            <h1>Available Practice Exams</h1>
            <p className="hero-subtitle">
              Choose from our comprehensive collection of Microsoft Azure AI certification practice exams
            </p>

            <div className="cta-section">
              <div className="exam-group">
                <h2 className="exam-group-title">Microsoft Azure AI Certifications</h2>
                <div className="exam-buttons agile-exams">
                  <button
                    className="cta-button azure-ai-ab730 recommended"
                    data-testid="start-ab730-exams"
                    onClick={() => startExam('AB-730')}
                  >
                    <span className="button-content">
                      Start AB-730: AI Business Professional Practice Exam
                      <span className="recommended-badge">Available</span>
                    </span>
                  </button>
                  <button
                    className="cta-button azure-ai-ai900 recommended"
                    data-testid="start-ai900-exams"
                    onClick={() => startExam('AI-900')}
                  >
                    <span className="button-content">
                      Start AI-900: Azure AI Fundamentals Practice Exam
                      <span className="recommended-badge">Available</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="exam-group coming-soon-group">
                <h2 className="exam-group-title">Coming Soon</h2>
                <div className="exam-buttons coming-soon-exams">
                  <button
                    className="cta-button coming-soon-button azure-ai-102"
                    disabled
                  >
                    <span className="button-content">
                      AI-102: Azure AI Engineer Associate
                      <span className="coming-soon-badge">Coming Soon</span>
                    </span>
                  </button>
                  <button
                    className="cta-button coming-soon-button azure-dp-100"
                    disabled
                  >
                    <span className="button-content">
                      DP-100: Azure Data Scientist Associate
                      <span className="coming-soon-badge">Coming Soon</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>&copy; 2025 AI Cert Studio. Empowering Azure AI professionals worldwide.</p>
        </footer>
      </>
    )
  }

  // Home Page
  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="logo-container">
              <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className="logo-image" />
            </div>
            <div className="tagline">Practice Exams</div>
          </div>
          <nav className="nav">
            <button onClick={goToExams} className="nav-button" data-testid="nav-exams">
              <span className="nav-icon">📋</span><span>Exams</span>
            </button>
            <button onClick={goToDashboard} className="nav-button dashboard-button" data-testid="nav-dashboard">
              <span className="nav-icon">📊</span><span>Dashboard</span>
            </button>
            <button onClick={goToAchievements} className="nav-button achievements-button" data-testid="nav-achievements">
              <span className="nav-icon">🏆</span><span>Achievements</span>
            </button>
            <button onClick={goToSmartReview} className="nav-button smart-review-button" data-testid="nav-review">
              <span className="nav-icon">🎯</span><span>Review</span>
            </button>
            <button onClick={goToStudyCompanion} className="nav-button study-companion-button" data-testid="nav-ai">
              <span className="nav-icon">🧠</span><span>AI</span>
            </button>
            <button onClick={goToTiming} className="nav-button timing-button" data-testid="nav-timing">
              <span className="nav-icon">⏱️</span><span>Timing</span>
            </button>
            <button onClick={goToAdvancedAnalytics} className="nav-button advanced-analytics-button" data-testid="nav-analytics">
              <span className="nav-icon">📈</span><span>Analytics</span>
            </button>
            <button onClick={goToNotifications} className="nav-button notifications-button" data-testid="nav-alerts">
              <span className="nav-icon">🔔</span><span>Alerts</span>
            </button>
            <button onClick={goToSettings} className="nav-button settings-button" data-testid="nav-settings">
              <span className="nav-icon">⚙️</span><span>Settings</span>
            </button>
          </nav>
          <HamburgerMenu
            isOpen={isHamburgerOpen}
            onToggle={toggleHamburgerMenu}
            onClose={closeHamburgerMenu}
            navigationItems={navigationItems}
            currentPage={currentPage}
            onNavigate={(page) => {
              switch (page) {
                case 'home':
                  goHome();
                  break;
                case 'exams':
                  goToExams();
                  break;
                case 'dashboard':
                  goToDashboard();
                  break;
                case 'achievements':
                  goToAchievements();
                  break;
                case 'smart-review':
                  goToSmartReview();
                  break;
                case 'study-companion':
                  goToStudyCompanion();
                  break;
                case 'timing':
                  goToTiming();
                  break;
                case 'notifications':
                  goToNotifications();
                  break;
                case 'advanced-analytics':
                  goToAdvancedAnalytics();
                  break;
                case 'settings':
                  goToSettings();
                  break;
                default:
                  break;
              }
              closeHamburgerMenu();
            }}
          />
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <h1>Master Your Azure AI Certifications</h1>
          <p className="hero-subtitle">
            Prepare for success with comprehensive practice exams for Microsoft Azure AI certifications
          </p>

          <div className="featured-exams-section">
            <div className="featured-exams-card">
              <h2 className="featured-title">🌟 Featured Practice Exam</h2>
              <p className="featured-subtitle">Start with our flagship certification track</p>

              <div className="featured-exams-grid">
                <div className="featured-exam-item">
                  <button
                    className="featured-exam-button azure-ai-ab730"
                    onClick={() => startExam('AB-730')}
                  >
                      <div className="featured-exam-content" data-testid="start-ab730-home">
                      <h3>AB-730</h3>
                      <p>AI Business Professional</p>
                      <span className="featured-badge available">Available</span>
                    </div>
                  </button>
                </div>

                <div className="featured-exam-item">
                  <button
                    className="featured-exam-button azure-ai-ai900"
                    onClick={() => startExam('AI-900')}
                  >
                      <div className="featured-exam-content" data-testid="start-ai900-home">
                      <h3>AI-900</h3>
                      <p>Azure AI Fundamentals</p>
                      <span className="featured-badge available">Available</span>
                    </div>
                  </button>
                </div>

                <div className="featured-exam-item">
                  <button
                    className="featured-exam-button azure-ai-102 coming-soon"
                    disabled
                  >
                    <div className="featured-exam-content">
                      <h3>AI-102</h3>
                      <p>Azure AI Engineer Associate</p>
                      <span className="featured-badge coming-soon-badge">Coming Soon</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="featured-actions">
                <button onClick={goToExams} className="view-all-exams-button">
                  View All Practice Exams →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-header">
              <h3>🎯 Comprehensive Coverage</h3>
            </div>
            <p>Practice exams covering all key domains and competencies for each certification</p>
          </div>
          <div className="feature-card">
            <div className="feature-header">
              <h3>📊 Detailed Analytics</h3>
            </div>
            <p>Track your progress and identify areas for improvement with comprehensive results</p>
          </div>
          <div className="feature-card">
            <div className="feature-header">
              <h3>⏱️ Timed Exams</h3>
            </div>
            <p>Realistic exam simulation with proper time constraints and scoring</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 AI Cert Studio. Empowering Azure AI professionals worldwide.</p>
      </footer>

      {/* Achievement Notification */}
        <div data-testid="achievement-notification-wrapper">
          <AchievementNotification
            achievement={achievementNotification}
            onClose={() => setAchievementNotification(null)}
          />
        </div>
    </>
  )
}

export default App
