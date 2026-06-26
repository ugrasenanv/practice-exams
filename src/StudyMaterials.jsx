import { useTheme } from './contexts/ThemeContext.jsx'
import './StudyMaterials.css'

const StudyMaterials = ({ onGoHome, examType }) => {
  const { theme } = useTheme()

  const getStudyContent = () => {
    switch (examType) {
      case 'AB-730':
        return {
          title: 'AB-730: Microsoft Copilot for Microsoft 365 Study Materials',
          description: 'Essential resources to help you prepare for the AI Business Professional certification, focusing on Copilot implementation and AI-driven productivity.',
          sections: [
            {
              title: 'Copilot Fundamentals (25%)',
              items: [
                'Microsoft Copilot architecture and capabilities',
                'Copilot in Word, Excel, PowerPoint, Outlook, and Teams',
                'Natural language processing and prompt engineering',
                'Data sources and Microsoft Graph integration',
                'Security and compliance features',
                'Licensing requirements and deployment options',
                'User adoption and change management strategies',
                'Performance optimization and best practices'
              ]
            },
            {
              title: 'Prompt Engineering & Use Cases (30%)',
              items: [
                'Crafting effective prompts for different scenarios',
                'Context-aware prompting techniques',
                'Multi-turn conversations and refinement',
                'Domain-specific prompt patterns',
                'Common use cases across business functions',
                'Content creation and summarization',
                'Data analysis and visualization requests',
                'Meeting assistance and collaboration'
              ]
            },
            {
              title: 'Copilot Agents & Extensions (20%)',
              items: [
                'Building custom Copilot agents',
                'Declarative agents vs. custom engine agents',
                'Agent capabilities and limitations',
                'Integration with Line-of-Business (LOB) systems',
                'Plugin architecture and development',
                'Microsoft Teams message extensions',
                'Power Platform integration',
                'Testing and deploying custom solutions'
              ]
            },
            {
              title: 'Responsible AI & Governance (25%)',
              items: [
                'Microsoft Responsible AI principles',
                'Data privacy and information protection',
                'Content filtering and moderation',
                'Bias detection and mitigation',
                'Transparency and explainability',
                'Compliance with regulations (GDPR, CCPA)',
                'Organizational policies and guardrails',
                'Monitoring and auditing AI usage'
              ]
            },
            {
              title: 'Recommended Learning Resources',
              items: [
                'Microsoft Learn: Copilot for Microsoft 365 learning path',
                'Microsoft Copilot adoption resources',
                'Prompt engineering best practices documentation',
                'Microsoft Graph documentation',
                'Responsible AI resources from Microsoft',
                'Copilot Studio documentation'
              ]
            }
          ]
        }
      case 'AI-900':
        return {
          title: 'AI-900: Azure AI Fundamentals Study Materials',
          description: 'Comprehensive resources for Azure AI Fundamentals certification, covering core AI concepts and Azure AI services.',
          sections: [
            {
              title: 'AI Workloads & Considerations (15-20%)',
              items: [
                'Common AI workloads: predictions, classification, clustering, anomaly detection',
                'Features of computer vision workloads',
                'Features of Natural Language Processing (NLP) workloads',
                'Features of conversational AI workloads',
                'Responsible AI principles: fairness, reliability, privacy, inclusiveness, transparency, accountability',
                'Considerations for AI solutions in practice'
              ]
            },
            {
              title: 'Machine Learning Fundamentals (25-30%)',
              items: [
                'Core machine learning concepts and terminology',
                'Types of machine learning: supervised, unsupervised, reinforcement',
                'Regression, classification, and clustering scenarios',
                'Training and validation datasets',
                'Model evaluation metrics',
                'Azure Machine Learning service capabilities',
                'Automated ML (AutoML) features',
                'Azure Machine Learning designer',
                'Data and compute resources for training',
                'Model deployment and consumption'
              ]
            },
            {
              title: 'Computer Vision Workloads (15-20%)',
              items: [
                'Image classification, object detection, and semantic segmentation',
                'Optical Character Recognition (OCR)',
                'Facial detection, recognition, and analysis',
                'Azure Computer Vision service',
                'Custom Vision service for custom models',
                'Face API capabilities and limitations',
                'Form Recognizer for document processing',
                'Video analysis scenarios'
              ]
            },
            {
              title: 'Natural Language Processing (15-20%)',
              items: [
                'Text analysis: sentiment analysis, key phrase extraction, entity recognition',
                'Language understanding with LUIS (Language Understanding)',
                'Speech recognition and speech synthesis',
                'Translation services',
                'Azure Cognitive Services for Language',
                'Text Analytics API',
                'Speech service capabilities',
                'Question answering and conversational language understanding'
              ]
            },
            {
              title: 'Conversational AI (15-20%)',
              items: [
                'Conversational AI concepts and use cases',
                'Azure Bot Service fundamentals',
                'Bot Framework SDK',
                'QnA Maker service (now Question Answering)',
                'Language Studio and conversational language understanding',
                'Multi-turn conversations and context',
                'Channel integration (Teams, web, etc.)',
                'Bot testing and deployment'
              ]
            },
            {
              title: 'Recommended Learning Resources',
              items: [
                'Microsoft Learn: AI-900 learning path',
                'Azure AI services documentation',
                'Hands-on labs with Azure AI services',
                'Microsoft AI Business School',
                'Azure pricing calculator for cost estimation',
                'Azure Architecture Center for AI solution patterns'
              ]
            }
          ]
        }
      default:
        return {
          title: 'Study Materials',
          description: 'Study resources will be available here.',
          sections: []
        }
    }
  }

  const studyContent = getStudyContent()

  return (
    <div className={`study-materials-container ${theme}`}>
      <header className="header">
        <div className="brand">
          <div className="logo-container">
            <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className="logo-image" />
          </div>
          <div className="tagline">Study Materials</div>
        </div>
        <nav className="nav">
          <button onClick={onGoHome} className="nav-button">← Back to Exam</button>
        </nav>
      </header>

      <main className="main-content">
        <div className="study-content">
          <div className="study-header">
            <h1>{studyContent.title}</h1>
            <p className="study-description">{studyContent.description}</p>
          </div>

          <div className="study-sections">
            {studyContent.sections.map((section, index) => (
              <div key={index} className="study-section">
                <h2>{section.title}</h2>
                <ul className="study-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="study-item">
                      <span className="study-bullet">📚</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {examType === 'AB-730' && (
            <div className="additional-resources">
              <h2>Additional Resources</h2>
              <div className="resource-cards">
                <div className="resource-card">
                  <h3>🌐 Microsoft Learn</h3>
                  <p>Access the official Microsoft Learn path for Copilot for Microsoft 365 with hands-on labs and modules.</p>
                </div>
                <div className="resource-card">
                  <h3>🚀 Copilot Adoption Kit</h3>
                  <p>Leverage Microsoft's adoption resources to understand deployment strategies and best practices.</p>
                </div>
                <div className="resource-card">
                  <h3>🎯 Key Focus Areas</h3>
                  <p>Master prompt engineering, custom agents, and responsible AI implementation for business scenarios.</p>
                </div>
                <div className="resource-card">
                  <h3>🔧 Hands-On Practice</h3>
                  <p>Get practical experience with Copilot in Word, Excel, PowerPoint, Outlook, and Teams applications.</p>
                </div>
              </div>
            </div>
          )}

          {examType === 'AI-900' && (
            <div className="additional-resources">
              <h2>Additional Resources</h2>
              <div className="resource-cards">
                <div className="resource-card">
                  <h3>🌐 Microsoft Learn</h3>
                  <p>Complete the official AI-900 learning path with interactive modules and knowledge checks.</p>
                </div>
                <div className="resource-card">
                  <h3>🧪 Azure Free Account</h3>
                  <p>Sign up for Azure free tier to practice with AI services hands-on without cost.</p>
                </div>
                <div className="resource-card">
                  <h3>📖 Documentation Deep Dive</h3>
                  <p>Study Azure Cognitive Services, Machine Learning, and Bot Service documentation thoroughly.</p>
                </div>
                <div className="resource-card">
                  <h3>🎯 Exam Skills Outline</h3>
                  <p>Review the official exam skills outline to ensure coverage of all domains and weightings.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default StudyMaterials