import { useTheme } from '../../contexts/ThemeContext.jsx';
import styles from './AI900Exam.module.css'
import DataPersistenceNotice from '../autosave/DataPersistenceNotice.jsx'
import QuestionHistory from '../QuestionHistory/QuestionHistory.jsx'
import AI900Questions from './AI900Questions.js'

function AI900Exam({ 
  onGoHome, 
  onGoToStudyMaterials, 
  onStartQuiz, 
  numberOfQuestions = 45,
  autoShowExplanation = false,
  onNumberOfQuestionsChange,
  onAutoShowExplanationChange,
  examMode = 'exam',
  onExamModeChange
}) {
  const { theme } = useTheme();

  // Calculate timer information based on question count
  const getTimerInfo = () => {
    if (numberOfQuestions <= 45) {
      return "90 minutes"
    } else if (numberOfQuestions <= 100) {
      return `${numberOfQuestions * 2} minutes`
    } else {
      return "Unlimited time"
    }
  }

  return (
    <div className={styles.examContainer}>
      <header className={styles.examHeader} data-testid="ai900-exam-header">
        <div className={styles.brand}>
          <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
          <div className={styles.tagline}>AI-900 Practice Exam</div>
        </div>
        <button className={styles.homeButton} onClick={onGoHome}>
          ← Back to Home
        </button>
      </header>

      <main className={styles.examContent} data-testid="ai900-exam-settings">
        {/* Temporary cross-browser support notice (Firefox / Safari) */}
        {typeof navigator !== 'undefined' && /firefox|safari/i.test(navigator.userAgent) && !/chrome|edg/i.test(navigator.userAgent) && (
          <div style={{
            background: '#fff3cd',
            color: '#7a5b00',
            border: '1px solid #f7d98b',
            padding: '0.85rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            lineHeight: 1.4
          }} data-testid="browser-support-warning">
            <strong>Browser Notice:</strong> Full exam stability is currently optimized for Chrome / Edge. 
            You are using a Firefox/Safari-based browser; if you experience an unexpected interruption after starting the quiz, please try again in a Chromium browser while we finalize a cross‑browser fix.
          </div>
        )}
        <div className={styles.examInfo}>
          <h1>AI-900: Azure AI Fundamentals</h1>
          <p className={styles.examDescription}>
            Test your knowledge of Azure AI services, machine learning concepts, computer vision, natural language processing, and conversational AI on Azure.
          </p>

          <div className={styles.examDetails} data-testid="ai900-exam-details">
            <div className={styles.detailCard}>
              <h3>📝 Questions</h3>
              <p>{numberOfQuestions} practice questions</p>
            </div>
            <div className={styles.detailCard}>
              <h3>⏱️ Time Limit</h3>
              <p>{getTimerInfo()}</p>
            </div>
            <div className={styles.detailCard}>
              <h3>🎯 Passing Score</h3>
              <p>700 (out of 1000)</p>
            </div>
            <div className={styles.detailCard}>
              <h3>🔄 Retakes</h3>
              <p>Unlimited attempts</p>
            </div>
          </div>

          {/* Exam Settings Panel */}
          <div className={styles.examSettings} data-testid="ai900-exam-config">
            <h2>⚙️ Exam Settings</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingCard}>
                <h4>Number of Questions</h4>
                <select 
                  value={numberOfQuestions} 
                  data-testid="ai900-questions-select"
                  onChange={(e) => onNumberOfQuestionsChange && onNumberOfQuestionsChange(Number(e.target.value))}
                  className={styles.settingSelect}
                >
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={40}>40 Questions</option>
                  <option value={45}>45 Questions (Default)</option>
                  <option value={50}>50 Questions</option>
                  <option value={100}>100 Questions (Complete Bank)</option>
                </select>
                <p className={styles.settingDescription}>
                  Choose how many questions you want to practice with
                </p>
              </div>
              <div className={styles.settingCard}>
                <h4>Exam Mode</h4>
                <select 
                  value={examMode} 
                  data-testid="ai900-exam-mode-select"
                  onChange={(e) => onExamModeChange && onExamModeChange(e.target.value)}
                  className={styles.settingSelect}
                >
                  <option value="exam">🎓 Exam Mode (Realistic Simulation)</option>
                  <option value="practice">📚 Practice Mode (Enhanced Learning)</option>
                </select>
                <p className={styles.settingDescription}>
                  {examMode === 'exam' 
                    ? 'Single-select questions only (matches real Microsoft exam format)' 
                    : 'Mix of single-select (75%) and multi-select (25%) questions for deeper learning'}
                </p>
              </div>
              <div className={styles.settingCard}>
                <h4>Auto-Show Explanations</h4>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={autoShowExplanation}
                    data-testid="ai900-auto-explanation-checkbox"
                    onChange={(e) => onAutoShowExplanationChange && onAutoShowExplanationChange(e.target.checked)}
                    className={styles.settingCheckbox}
                  />
                  <span className={styles.checkboxText}>
                    Automatically show detailed explanations
                  </span>
                </label>
                <p className={styles.settingDescription}>
                  When enabled, explanations are shown automatically for each question
                </p>
              </div>
              {/* 4th tile: Local progress / persistence notice */}
              <div className={styles.settingCard} data-testid="ai900-storage-tile">
                <h4>Local Progress Storage</h4>
                <p className={styles.settingDescription} style={{marginBottom:'0.75rem'}}>
                  Progress & results are saved only in this browser (no cloud sync). Clearing site data / using private mode erases them.
                </p>
                <DataPersistenceNotice />
              </div>
            </div>
          </div>

          {/* Question History Panel */}
          <QuestionHistory examType="ai900" totalQuestions={AI900Questions.length} />

          <div className={styles.examDomains} data-testid="ai900-exam-domains">
            <h2>Exam Domains</h2>
            <div className={styles.domainsGrid}>
              <div className={styles.domainCard}>
                <h3>Describe AI Workloads and Considerations</h3>
                <p>Understand AI workloads, responsible AI principles, and AI service capabilities</p>
                <span className={styles.domainWeight}>15-20%</span>
              </div>
              <div className={styles.domainCard}>
                <h3>Describe Machine Learning Principles</h3>
                <p>Core ML concepts, training processes, model types, and Azure ML capabilities</p>
                <span className={styles.domainWeight}>25-30%</span>
              </div>
              <div className={styles.domainCard}>
                <h3>Describe Computer Vision Workloads</h3>
                <p>Image classification, object detection, facial recognition, OCR, and Azure Computer Vision</p>
                <span className={styles.domainWeight}>15-20%</span>
              </div>
              <div className={styles.domainCard}>
                <h3>Describe Natural Language Processing</h3>
                <p>Text analysis, sentiment analysis, translation, speech services, and Azure Language</p>
                <span className={styles.domainWeight}>15-20%</span>
              </div>
              <div className={styles.domainCard}>
                <h3>Describe Conversational AI Workloads</h3>
                <p>Chatbots, virtual agents, Azure Bot Service, and question answering</p>
                <span className={styles.domainWeight}>15-20%</span>
              </div>
            </div>
          </div>

          <div className={styles.examActions} data-testid="ai900-exam-actions">
            <button 
              className={`${styles.actionButton} ${styles.primary}`}
              data-testid="ai900-start-quiz"
              onClick={onStartQuiz}
            >
              🚀 Start Practice Exam
            </button>
            <button 
              className={`${styles.actionButton} ${styles.secondary}`}
              onClick={onGoToStudyMaterials}
            >
              📚 Study Materials
            </button>
          </div>

          <div className={styles.examTips} data-testid="ai900-exam-tips">
            <h2>Exam Tips</h2>
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <span className={styles.tipIcon}>💡</span>
                <div>
                  <h4>Understand Core Concepts</h4>
                  <p>Focus on understanding ML fundamentals, not memorizing specific Azure portal steps.</p>
                </div>
              </div>
              <div className={styles.tipCard}>
                <span className={styles.tipIcon}>⏰</span>
                <div>
                  <h4>Manage Your Time</h4>
                  <p>
                    {numberOfQuestions <= 45 
                      ? `You have 90 minutes for ${numberOfQuestions} questions. This matches the real exam format.`
                      : numberOfQuestions <= 100 
                      ? `You have ${numberOfQuestions * 2} minutes for ${numberOfQuestions} questions (2 minutes per question).`
                      : `No time limit for ${numberOfQuestions} questions. Take your time to learn thoroughly.`
                    }
                  </p>
                </div>
              </div>
              <div className={styles.tipCard}>
                <span className={styles.tipIcon}>🎯</span>
                <div>
                  <h4>Know Azure AI Services</h4>
                  <p>Understand when to use Computer Vision, Language, Speech, and other Cognitive Services.</p>
                </div>
              </div>
              <div className={styles.tipCard}>
                <span className={styles.tipIcon}>📖</span>
                <div>
                  <h4>Review Responsible AI</h4>
                  <p>Microsoft emphasizes fairness, reliability, privacy, security, inclusiveness, and accountability.</p>
                </div>
              </div>
            </div>
          </div>

          {autoShowExplanation && (
            <div className={styles.settingsInfo}>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>ℹ️</span>
                <div>
                  <h4>Auto-Explanation Enabled</h4>
                  <p>Detailed explanations will be automatically shown for each question during the exam.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default AI900Exam
