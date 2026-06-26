import { useTheme } from '../../contexts/ThemeContext.jsx';
import styles from './AB730Exam.module.css'
import DataPersistenceNotice from '../autosave/DataPersistenceNotice.jsx'
import QuestionHistory from '../QuestionHistory/QuestionHistory.jsx'
import AB730Questions from './AB730Questions.js'

function AB730Exam({ 
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
      <header className={styles.examHeader} data-testid="ab730-exam-header">
        <div className={styles.brand}>
          <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
          <div className={styles.tagline}>AB-730 Practice Exam</div>
        </div>
        <button className={styles.homeButton} onClick={onGoHome}>
          ← Back to Home
        </button>
      </header>

      <main className={styles.examContent} data-testid="ab730-exam-settings">
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
          <h1>AB-730: AI Business Professional</h1>
          <p className={styles.examDescription}>
            Test your knowledge of Microsoft 365 Copilot and AI for business professionals. This exam validates your ability to use generative AI tools to enhance productivity and business outcomes.
          </p>

          <div className={styles.examDetails} data-testid="ab730-exam-details">
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
              <p>70%</p>
            </div>
            <div className={styles.detailCard}>
              <h3>🔄 Retakes</h3>
              <p>Unlimited attempts</p>
            </div>
          </div>

          {/* Exam Settings Panel */}
          <div className={styles.examSettings} data-testid="ab730-exam-config">
            <h2>⚙️ Exam Settings</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingCard}>
                <h4>Number of Questions</h4>
                <select 
                  value={numberOfQuestions} 
                  data-testid="ab730-questions-select"
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
                  data-testid="ab730-exam-mode-select"
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
                    data-testid="ab730-auto-explanation-checkbox"
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
              <div className={styles.settingCard} data-testid="ab730-storage-tile">
                <h4>Local Progress Storage</h4>
                <p className={styles.settingDescription} style={{marginBottom:'0.75rem'}}>
                  Progress & results are saved only in this browser (no cloud sync). Clearing site data / using private mode erases them.
                </p>
                <DataPersistenceNotice />
              </div>
            </div>
          </div>

          {/* Question History Panel */}
          <QuestionHistory examType="ab730" totalQuestions={AB730Questions.length} />

          <div className={styles.examDomains} data-testid="ab730-exam-domains">
            <h2>Exam Domains</h2>
            <div className={styles.domainsGrid}>
              <div className={styles.domainCard}>
                <h3>Understand Generative AI Fundamentals</h3>
                <p>Core concepts of generative AI, responsible AI principles, and Microsoft 365 Copilot capabilities</p>
                <span className={styles.domainWeight}>25-30%</span>
              </div>
              <div className={styles.domainCard}>
                <h3>Manage Prompts and Conversations by Using AI</h3>
                <p>Crafting effective prompts, managing conversations, creating agents, and optimizing AI interactions</p>
                <span className={styles.domainWeight}>35-40%</span>
              </div>
              <div className={styles.domainCard}>
                <h3>Draft and Analyze Business Content by Using AI</h3>
                <p>Using Copilot across Microsoft 365 apps for content creation, analysis, and business workflows</p>
                <span className={styles.domainWeight}>25-30%</span>
              </div>
            </div>
          </div>

          <div className={styles.examActions} data-testid="ab730-exam-actions">
            <button 
              className={`${styles.actionButton} ${styles.primary}`}
              data-testid="ab730-start-quiz"
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

          <div className={styles.examTips} data-testid="ab730-exam-tips">
            <h2>Exam Tips</h2>
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <span className={styles.tipIcon}>💡</span>
                <div>
                  <h4>Focus on Practical Applications</h4>
                  <p>This exam emphasizes real-world use of Copilot across Microsoft 365 applications.</p>
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
                  <h4>Understand Prompt Engineering</h4>
                  <p>Many questions test your ability to craft effective prompts and manage AI conversations.</p>
                </div>
              </div>
              <div className={styles.tipCard}>
                <span className={styles.tipIcon}>📖</span>
                <div>
                  <h4>Know Copilot Features</h4>
                  <p>Be familiar with Copilot capabilities across Word, Excel, PowerPoint, Outlook, and Teams.</p>
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

export default AB730Exam
