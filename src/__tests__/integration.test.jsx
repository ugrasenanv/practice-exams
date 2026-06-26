import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';

// Ensure real ProgressContext is available (previous full-mock setup left stale state in cache)
vi.mock('../contexts/ProgressContext.jsx', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual }; // no overrides
});

// Mock NotificationContext only (it depends on ProgressContext and previously triggered missing export error)
vi.mock('../contexts/NotificationContext.jsx', () => {
  const React = require('react');
  const value = {
    permission: 'granted',
    subscription: null,
    notifications: [],
    isSupported: false,
    requestPermission: vi.fn(),
    subscribeToPush: vi.fn(),
    unsubscribeFromPush: vi.fn(),
    scheduleStudyReminder: vi.fn(),
    showAchievementNotification: vi.fn(),
    showPassScoreNotification: vi.fn(),
    showSpacedRepetitionReminder: vi.fn(),
    sendDailyStreakNotification: vi.fn(),
    addLocalNotification: vi.fn(),
    markNotificationAsRead: vi.fn(),
    clearAllNotifications: vi.fn()
  };
  const NotificationContext = React.createContext(value);
  const NotificationProvider = ({ children }) => (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
  return {
    NotificationProvider,
    useNotifications: () => React.useContext(NotificationContext)
  };
});

// Provide lightweight AutosaveContext to satisfy components expecting persistence hooks
vi.mock('../contexts/AutosaveContext.jsx', () => {
  const React = require('react');
  const value = {
    autosaveStatus: 'idle',
    lastSavedTime: null,
    isEnabled: false,
    saveExamState: vi.fn(),
    loadExamState: vi.fn(() => null),
    clearExamState: vi.fn(),
    getAutosavedSessions: vi.fn(() => []),
    setIsEnabled: vi.fn(),
    formatSaveTime: vi.fn(() => 'Just now'),
    AUTOSAVE_INTERVAL: 30000,
    DEBOUNCE_DELAY: 2000
  };
  const AutosaveContext = React.createContext(value);
  const AutosaveProvider = ({ children }) => (
    <AutosaveContext.Provider value={value}>{children}</AutosaveContext.Provider>
  );
  return {
    AutosaveProvider,
    useAutosave: () => React.useContext(AutosaveContext)
  };
});

// NOTE: This test harness was simplified to avoid the prior hoisted mock + worker memory crash.
// We now rely on the real context providers (lighter state) and only mock question data + CSS modules.
// Keep the question set tiny for speed/determinism.

// Mock CSS modules to silence style imports
vi.mock('../App.css', () => ({ __esModule: true, default: {} }));
vi.mock('../StudyMaterials.css', () => ({ __esModule: true, default: {} }));
vi.mock('../components/LeadingSAFe6/LeadingSAFe6Exam.module.css', () => ({ __esModule: true, default: {} }));
vi.mock('../components/LeadingSAFe6/LeadingSAFe6ExamQuiz.module.css', () => ({ __esModule: true, default: {} }));
vi.mock('../components/SAFeTeams6/SAFeTeams6ExamQuiz.module.css', () => ({ __esModule: true, default: {} }));
vi.mock('../components/shared/TimingAnalytics.module.css', () => ({ __esModule: true, default: {} }));
vi.mock('../components/shared/Results.module.css', () => ({ __esModule: true, default: {} }));

// Lightweight HelpSystem mock (avoid side effects)
vi.mock('../components/help/HelpSystem.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="help-system-mock">{children}</div>,
  MultiSelectHelp: () => <span data-testid="multi-select-help" />
}));

// Mock smaller question sets for faster testing
vi.mock('../components/LeadingSAFe6/LeadingSAFe6Questions.js', () => ({
  leadingSAFe6Questions: [
    {
      id: 1,
      question: 'What is the primary goal of SAFe?',
      options: ['Business Agility', 'Technical Excellence', 'Team Performance', 'Process Compliance'],
      correctAnswer: 0,
      explanation: 'Business Agility is the primary goal of SAFe',
      domain: 'Lean-Agile Leadership',
      difficulty: 'Foundation'
    },
    {
      id: 2,
      questionType: 'multiple',
      selectCount: 2,
      question: 'Which are core SAFe values? (Select 2)',
      options: ['Alignment', 'Built-in Quality', 'Transparency', 'Program Execution'],
      correctAnswers: [0, 2],
      explanation: 'Alignment and Transparency are core SAFe values',
      domain: 'Lean-Agile Leadership',
      difficulty: 'Foundation'
    }
  ]
}));

vi.mock('../components/SAFeTeams6/SAFeTeams6Questions.js', () => ({
  safeTeams6Questions: [
    {
      id: 1,
      question: 'What is the recommended team size in SAFe?',
      options: ['5-9 people', '10-12 people', '13-15 people', '16-20 people'],
      correctAnswer: 0,
      explanation: '5-9 people is the recommended team size',
      domain: 'Team and Technical Agility',
      difficulty: 'Foundation'
    }
  ]
}));

beforeAll(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
});

afterAll(() => {
  Math.random.mockRestore();
});

describe('Quiz Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Full Exam Flow with Timing', () => {
    test('should complete full exam with timing and analytics', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: ms => vi.advanceTimersByTime(ms), delay: null });
      const mockDateNow = vi.spyOn(Date, 'now');

      try {
        console.info('render start');
        render(<App />);
        console.info('rendered app');

        // Navigate to Leading SAFe 6 exam
  // Use test id for reliability (button text may include emoji or vary)
  const leadingSAFeButton = await screen.findByTestId('start-leading-safe-home');
        console.info('found leading button');
        await user.click(leadingSAFeButton);
        console.info('clicked leading button');

        // Switch to practice mode and start exam
        const modeSelect = await screen.findByTestId('leading-safe-exam-mode-select');
        await user.selectOptions(modeSelect, 'practice');

  const startExamButton = await screen.findByTestId('leading-safe-start-quiz');
        await user.click(startExamButton);

        // Should start exam with timing
        await waitFor(() => {
          expect(screen.getByTestId('quiz-question-card')).toBeInTheDocument();
          expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
        });

        // Simulate time passing on first question
  mockDateNow.mockReturnValue(1609459230000);
  vi.advanceTimersByTime(30000);

        await waitFor(() => {
          expect(screen.getByText(/Time on question: 0:30/)).toBeInTheDocument();
        });

        // Answer first question within options container
        const firstOptionsContainer = await screen.findByTestId('quiz-options-container');
        const firstOptions = within(firstOptionsContainer).getAllByRole('button');
        const businessAgilityOption = firstOptions.find(btn => btn.textContent?.includes('Business Agility'));
        await user.click(businessAgilityOption);

        // Navigate to second question (multi-select)
        const nextButton = screen.getByRole('button', { name: /Next →/ });
        await user.click(nextButton);

        // Reset time for second question
  mockDateNow.mockReturnValue(1609459230000);

        await waitFor(() => {
          expect(screen.getByText(/Question 2 of 2/)).toBeInTheDocument();
          expect(screen.getByTestId('multi-select-requirement')).toBeInTheDocument();
          expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
        });

        // Simulate time on second question
  mockDateNow.mockReturnValue(1609459275000);
  vi.advanceTimersByTime(45000);

        await waitFor(() => {
          expect(screen.getByText(/Time on question: 0:45/)).toBeInTheDocument();
        });

        // Answer multi-select question
        const secondOptionsContainer = await screen.findByTestId('quiz-options-container');
        const secondOptions = within(secondOptionsContainer).getAllByRole('button');
        const alignmentOption = secondOptions.find(btn => btn.textContent?.includes('Alignment'));
        const transparencyOption = secondOptions.find(btn => btn.textContent?.includes('Transparency'));
        await user.click(alignmentOption);
        await user.click(transparencyOption);

        // Submit exam
        const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
        await user.click(submitButton);

        // Should show results with timing
        await waitFor(() => {
          expect(screen.getByText(/Exam Results/)).toBeInTheDocument();
        });

        // Go back to home (use first Back to Home button)
  const backHomeButton = await screen.findByRole('button', { name: /Back to Home/i }); // still accessible in quiz header
        await user.click(backHomeButton);

        // Access timing analytics
  // Navigate via nav timing test id (original label is just 'Timing')
  const timingButton = await screen.findByTestId('nav-timing');
        await user.click(timingButton);

        // Should show timing analytics with exam data
        await waitFor(() => {
          expect(screen.getByText(/Exam Timing Analytics/i)).toBeInTheDocument();
          expect(screen.getByText(/Leading SAFe 6/i)).toBeInTheDocument();
          expect(screen.getByText(/Questions: 2/i)).toBeInTheDocument();
        });
      } finally {
        mockDateNow.mockRestore();
        vi.useRealTimers();
      }
    });

    test('should handle exam mode filtering correctly', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Navigate to Leading SAFe 6 exam using test id
      const leadingSAFeButton = await screen.findByTestId('start-leading-safe-home');
      await user.click(leadingSAFeButton);

      // Exam mode is default; start exam
  const startExamButton = await screen.findByTestId('leading-safe-start-quiz');
      await user.click(startExamButton);

      // Should start with only single-select questions
      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 1/)).toBeInTheDocument();
        expect(screen.queryByTestId('multi-select-requirement')).not.toBeInTheDocument();
      });

      // Verify radio button indicators
      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      const radioOptions = optionButtons.filter(btn => btn.textContent?.includes('○') || btn.textContent?.includes('●'));
      expect(radioOptions.length).toBeGreaterThan(0);
    });
  });

  describe('Multi-Component Integration', () => {
    test('should persist exam mode preference across sessions', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Set exam mode preference
      const leadingSAFeButton = await screen.findByTestId('start-leading-safe-home');
      await user.click(leadingSAFeButton);

      // Select Practice Mode via settings select
      const modeSelect = await screen.findByTestId('leading-safe-exam-mode-select');
      await user.selectOptions(modeSelect, 'practice');
      expect(modeSelect).toHaveValue('practice');

      // Go back and check if preference is saved
  const backHomeButton = await screen.findByRole('button', { name: /Back to Home/i });
      await user.click(backHomeButton);

      // Re-enter exam
  const leadingSAFeButtonAgain = await screen.findByTestId('start-leading-safe-home');
      await user.click(leadingSAFeButtonAgain);

      // Should remember Practice Mode selection
      const persistedSelect = await screen.findByTestId('leading-safe-exam-mode-select');
      expect(persistedSelect).toHaveValue('practice');
    });

    test('should handle timing data persistence across app reloads', async () => {
      const user = userEvent.setup();

      // Set up timing data in localStorage
      const timingData = {
        examType: 'Leading SAFe 6',
        date: '2021-01-01T00:00:00.000Z',
        totalTimeUsed: 1200,
        questionTimings: { 1: 30000, 2: 45000 },
        questions: [
          { id: 1, question: 'Test question 1...', domain: 'Domain A', difficulty: 'Foundation' },
          { id: 2, question: 'Test question 2...', domain: 'Domain B', difficulty: 'Intermediate' }
        ]
      };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(timingData));

      render(<App />);

      // Access timing analytics
  const timingButton = await screen.findByTestId('nav-timing');
      await user.click(timingButton);

      // Should load persisted timing data
      await waitFor(() => {
        expect(screen.getByText(/Exam Sessions \(1\)/)).toBeInTheDocument();
        expect(screen.getByText(/Leading SAFe 6/)).toBeInTheDocument();
      });

      // Select exam for details
      const examSession = screen.getByText(/Leading SAFe 6/);
      await user.click(examSession);

      // Should show detailed timing information
      await waitFor(() => {
        expect(screen.getByText(/Total Exam Time: 20m 0s/)).toBeInTheDocument();
        expect(screen.getByText(/Questions Tracked: 2/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle empty question sets gracefully', async () => {
      const user = userEvent.setup();
      const questionModule = await import('../components/LeadingSAFe6/LeadingSAFe6Questions.js');
      const originalQuestions = [...questionModule.leadingSAFe6Questions];
      questionModule.leadingSAFe6Questions.splice(0, questionModule.leadingSAFe6Questions.length);

      try {
        render(<App />);

    const leadingSAFeButton = await screen.findByTestId('start-leading-safe-home');
        await user.click(leadingSAFeButton);

        const startExamButton = await screen.findByRole('button', { name: /Start Practice Exam/i });
        await user.click(startExamButton);

        // Should show loading or handle empty state
        await waitFor(() => {
          expect(screen.getByText(/Preparing your exam/i)).toBeInTheDocument();
        });
      } finally {
        questionModule.leadingSAFe6Questions.splice(0, questionModule.leadingSAFe6Questions.length, ...originalQuestions);
      }
    });

    test('should handle corrupt timing data gracefully', async () => {
      const user = userEvent.setup();

      // Add corrupt timing data
      localStorage.setItem('examTiming_corrupt', 'invalid json data');
      
      render(<App />);

  const timingButton = await screen.findByRole('button', { name: /Timing Analytics/i });
      await user.click(timingButton);

      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByText(/Exam Timing Analytics/)).toBeInTheDocument();
      });
    });

    test('should handle rapid question navigation without timing errors', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: ms => vi.advanceTimersByTime(ms), delay: null });
      
      try {
        render(<App />);

        // Start exam in practice mode for multiple questions
        const leadingSAFeButton = await screen.findByRole('button', { name: /Leading SAFe 6/i });
        await user.click(leadingSAFeButton);

    const modeSelect = await screen.findByTestId('leading-safe-exam-mode-select');
    await user.selectOptions(modeSelect, 'practice');

    const startExamButton = await screen.findByTestId('leading-safe-start-quiz');
        await user.click(startExamButton);

        await waitFor(() => {
          expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
        });

        // Rapidly navigate between questions
        const nextButton = screen.getByRole('button', { name: /Next →/ });
        const prevButton = screen.getByRole('button', { name: /← Previous/ });
        
        for (let i = 0; i < 5; i++) {
          await user.click(nextButton);
          vi.advanceTimersByTime(100);
          await user.click(prevButton);
          vi.advanceTimersByTime(100);
        }

        // Should still function correctly
        expect(screen.getByText(/Time on question:/)).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('Performance and Memory', () => {
    test('should not cause memory leaks with timing intervals', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Start and stop exam multiple times
      for (let i = 0; i < 3; i++) {
        const leadingSAFeButton = await screen.findByRole('button', { name: /Leading SAFe 6/i });
        await user.click(leadingSAFeButton);

        const startExamButton = await screen.findByRole('button', { name: /Start Practice Exam/i });
        await user.click(startExamButton);

        await screen.findByTestId('quiz-question-card');

        const backHomeButton = screen.getByTestId('quiz-back-home');
        await user.click(backHomeButton);
      }

      // Should not accumulate timers or cause errors
      expect(screen.getByText(/AI Cert Studio/)).toBeInTheDocument();
    });

    test('should handle large amounts of timing data efficiently', async () => {
      const user = userEvent.setup();

      // Add many exam sessions to localStorage
      for (let i = 0; i < 50; i++) {
        const timingData = {
          examType: i % 2 === 0 ? 'Leading SAFe 6' : 'SAFe for Teams 6.0',
          date: new Date(2021, 0, i + 1).toISOString(),
          totalTimeUsed: 1200 + i * 60,
          questionTimings: { 1: 30000 + i * 1000 },
          questions: [{ id: 1, question: `Question ${i}...`, domain: 'Domain', difficulty: 'Foundation' }]
        };
        localStorage.setItem(`examTiming_${1609459200000 + i * 86400000}`, JSON.stringify(timingData));
      }

      render(<App />);

  const timingButton = await screen.findByRole('button', { name: /Timing Analytics/i });
      await user.click(timingButton);

      // Should load and display data efficiently
      await waitFor(() => {
        expect(screen.getByText(/Exam Sessions \(50\)/)).toBeInTheDocument();
      });

      // Should be able to scroll through sessions
      const examSessions = screen.getAllByText(/Leading SAFe 6|SAFe for Teams 6.0/);
      expect(examSessions.length).toBeGreaterThan(0);
    });
  });
});

