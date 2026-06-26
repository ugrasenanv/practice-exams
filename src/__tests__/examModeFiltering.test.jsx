import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LeadingSAFe6ExamQuiz from '../components/LeadingSAFe6/LeadingSAFe6ExamQuiz';
import SAFeTeams6ExamQuiz from '../components/SAFeTeams6/SAFeTeams6ExamQuiz';

// Mock the contexts
const mockRecordSession = vi.fn();
const mockUpdateSpacedRepetition = vi.fn();
const mockSaveExamState = vi.fn();
const mockLoadExamState = vi.fn(() => null);
const mockClearExamState = vi.fn();
const mockGetAutosavedSessions = vi.fn(() => []);

vi.mock('../contexts/ProgressContext', () => ({
  useProgress: () => ({
    recordSession: mockRecordSession
  })
}));

vi.mock('../contexts/StudyIntelligenceContext', () => ({
  useStudyIntelligence: () => ({
    updateSpacedRepetition: mockUpdateSpacedRepetition
  })
}));

vi.mock('../contexts/AutosaveContext.jsx', () => ({
  useAutosave: () => ({
    saveExamState: mockSaveExamState,
    loadExamState: mockLoadExamState,
    clearExamState: mockClearExamState,
    getAutosavedSessions: mockGetAutosavedSessions,
    AUTOSAVE_INTERVAL: 60000,
    DEBOUNCE_DELAY: 100,
    formatSaveTime: vi.fn(() => 'Just now'),
    autosaveStatus: 'idle',
    lastSavedTime: null,
    isEnabled: true,
    setIsEnabled: vi.fn()
  })
}));

// Mock CSS modules
vi.mock('../components/LeadingSAFe6/LeadingSAFe6ExamQuiz.module.css', () => ({ default: {} }));
vi.mock('../components/SAFeTeams6/SAFeTeams6ExamQuiz.module.css', () => ({ default: {} }));

vi.mock('../components/autosave/SessionRecovery.jsx', () => ({
  __esModule: true,
  default: () => null
}));

vi.mock('../components/help/HelpSystem.jsx', () => ({
  __esModule: true,
  default: () => null,
  MultiSelectHelp: () => <span data-testid="multi-select-help" />
}));

vi.mock('../components/exam/ProgressIndicator.jsx', () => ({
  __esModule: true,
  default: () => null
}));

vi.mock('../hooks/useExamTiming.js', () => ({
  useExamTiming: () => ({
    questionTimings: {},
    currentQuestionTime: 0,
    countdown: 5400,
    finalize: vi.fn()
  })
}));

// Mock mixed questions for LeadingSAFe6
vi.mock('../components/LeadingSAFe6/LeadingSAFe6Questions.js', () => ({
  leadingSAFe6Questions: [
    {
      id: 1,
      question: "Single select question 1?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "Single select explanation",
      domain: "Domain A",
      difficulty: "Foundation"
    },
    {
      id: 2,
      questionType: "multiple",
      selectCount: 2,
      question: "Multi-select question 1?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswers: [0, 2],
      explanation: "Multi-select explanation",
      domain: "Domain B",
      difficulty: "Foundation"
    },
    {
      id: 3,
      question: "Single select question 2?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1,
      explanation: "Single select explanation",
      domain: "Domain C",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      questionType: "multiple",
      selectCount: 3,
      question: "Multi-select question 2?",
      options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
      correctAnswers: [1, 2, 4],
      explanation: "Multi-select explanation",
      domain: "Domain D",
      difficulty: "Advanced"
    },
    {
      id: 5,
      question: "Single select question 3?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 2,
      explanation: "Single select explanation",
      domain: "Domain E",
      difficulty: "Foundation"
    }
  ]
}));

// Mock mixed questions for SAFeTeams6
vi.mock('../components/SAFeTeams6/SAFeTeams6Questions.js', () => ({
  safeTeams6Questions: [
    {
      id: 1,
      question: "Teams single select question 1?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "Teams single select explanation",
      domain: "Team Agility",
      difficulty: "Foundation"
    },
    {
      id: 2,
      questionType: "multiple",
      selectCount: 2,
      question: "Teams multi-select question 1?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswers: [0, 3],
      explanation: "Teams multi-select explanation",
      domain: "Team Agility",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      question: "Teams single select question 2?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1,
      explanation: "Teams single select explanation",
      domain: "Agile Product Delivery",
      difficulty: "Foundation"
    }
  ]
}));

describe('Exam Mode Filtering Tests', () => {
  const mockOnGoHome = vi.fn();
  const mockOnGoBackToExam = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('LeadingSAFe6 Exam Mode Filtering', () => {
    test('should filter out multi-select questions in exam mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={5}
          examMode="exam"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
      });

      // Should only have single-select questions (3 out of 5 total)
      expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();

      // Navigate through all questions to ensure no multi-select
      const nextButton = screen.getByRole('button', { name: /Next →/ });
      
      // Check first question (should be single-select)
      expect(screen.queryByText(/Select exactly/)).not.toBeInTheDocument();
      
      // Navigate to second question
      await userEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(/Question 2 of 3/)).toBeInTheDocument();
      });
      expect(screen.queryByText(/Select exactly/)).not.toBeInTheDocument();

      // Navigate to third question
      await userEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(/Question 3 of 3/)).toBeInTheDocument();
      });
      expect(screen.queryByText(/Select exactly/)).not.toBeInTheDocument();
    });

    test('should include all questions in practice mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={5}
          examMode="practice"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument();
      });

      // Should include both single-select and multi-select questions
      let foundMultiSelect = false;
      const nextButton = screen.getByRole('button', { name: /Next →/ });

      // Navigate through questions to find multi-select
      for (let i = 0; i < 4; i++) {
        if (screen.queryByText(/Select exactly/)) {
          foundMultiSelect = true;
          break;
        }
        await userEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText(new RegExp(`Question ${i + 2} of 5`))).toBeInTheDocument();
        });
      }

      // Check last question if not found yet
      if (!foundMultiSelect && screen.queryByText(/Select exactly/)) {
        foundMultiSelect = true;
      }

      expect(foundMultiSelect).toBe(true);
    });

    test('should preserve question randomization in both modes', async () => {
      // Test exam mode
      const examResults = [];
      const randomSeeds = [0, 0.4, 0.9];
      
      for (let i = 0; i < 3; i++) {
        const randomMock = vi.spyOn(Math, 'random').mockImplementation(() => randomSeeds[i]);
        const { unmount } = render(
          <LeadingSAFe6ExamQuiz
            onGoHome={mockOnGoHome}
            onGoBackToExam={mockOnGoBackToExam}
            numberOfQuestions={3}
            examMode="exam"
          />
        );

        await waitFor(() => {
          expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
        });

        // Get first question text
        const questionText = screen.getByRole('heading', { level: 2 }).textContent;
        examResults.push(questionText);

        randomMock.mockRestore();
        unmount();
      }

      // Questions should produce different starting prompts across seeds
      const uniqueStarts = new Set(examResults);
      expect(uniqueStarts.size).toBeGreaterThan(1);
    });
  });

  describe('SAFeTeams6 Exam Mode Filtering', () => {
    test('should filter out multi-select questions in exam mode', async () => {
      render(
        <SAFeTeams6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="exam"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
      });

      // Should only have 2 single-select questions out of 3 total
      expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();

      // Navigate through questions
      const nextButton = screen.getByRole('button', { name: /Next →/ });

      // Check first question
      expect(screen.queryByText(/Select exactly/)).not.toBeInTheDocument();

      // Navigate to second question
      await userEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(/Question 2 of 2/)).toBeInTheDocument();
      });
      expect(screen.queryByText(/Select exactly/)).not.toBeInTheDocument();
    });

    test('should include multi-select questions in practice mode', async () => {
      render(
        <SAFeTeams6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();
      });

      // Find the multi-select question
      let foundMultiSelect = false;
      const nextButton = screen.getByRole('button', { name: /Next →/ });

      // Check current question
      if (screen.queryByText(/Select exactly/)) {
        foundMultiSelect = true;
      }

      // Navigate through remaining questions if not found
      if (!foundMultiSelect) {
        for (let i = 0; i < 2; i++) {
          await userEvent.click(nextButton);
          await waitFor(() => {
            expect(screen.getByText(new RegExp(`Question ${i + 2} of 3`))).toBeInTheDocument();
          });
          
          if (screen.queryByText(/Select exactly/)) {
            foundMultiSelect = true;
            break;
          }
        }
      }

      expect(foundMultiSelect).toBe(true);
    });
  });

  describe('Mode-Specific Question Counts', () => {
    test('should adjust question count based on available questions in exam mode', async () => {
      // Request more questions than available single-select questions
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={10} // More than the 3 single-select available
          examMode="exam"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
      });

      // Should cap at available single-select questions (3)
      expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();
    });

    test('should use requested question count in practice mode when available', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={4} // Less than total available (5)
          examMode="practice"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 4/)).toBeInTheDocument();
      });
    });
  });

  describe('Question Type Indicators', () => {
    test('should show only radio button indicators in exam mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="exam"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
      });

      // Should only see radio button indicators (○)
      const options = screen.getAllByRole('button');
      const radioOptions = options.filter(btn => 
        btn.textContent && btn.textContent.includes('○')
      );
      const checkboxOptions = options.filter(btn => 
        btn.textContent && btn.textContent.includes('☐')
      );

      expect(radioOptions.length).toBeGreaterThan(0);
      expect(checkboxOptions.length).toBe(0);
    });

    test('should show both radio and checkbox indicators in practice mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={5}
          examMode="practice"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument();
      });

      // Navigate through questions to find both types
      let foundRadio = false;
      let foundCheckbox = false;
      const nextButton = screen.getByRole('button', { name: /Next →/ });

      for (let i = 0; i < 5; i++) {
        const options = screen.getAllByRole('button');
        
        if (!foundRadio) {
          const radioOptions = options.filter(btn => 
            btn.textContent && btn.textContent.includes('○')
          );
          if (radioOptions.length > 0) foundRadio = true;
        }
        
        if (!foundCheckbox) {
          const checkboxOptions = options.filter(btn => 
            btn.textContent && btn.textContent.includes('☐')
          );
          if (checkboxOptions.length > 0) foundCheckbox = true;
        }

        if (foundRadio && foundCheckbox) break;

        // Navigate to next question if available
        if (i < 4) {
          await userEvent.click(nextButton);
          await waitFor(() => {
            expect(screen.getByText(new RegExp(`Question ${i + 2} of 5`))).toBeInTheDocument();
          });
        }
      }

      expect(foundRadio).toBe(true);
      expect(foundCheckbox).toBe(true);
    });
  });

  describe('Scoring with Mixed Question Types', () => {
    test('should handle mixed scoring correctly in practice mode', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();
      });

      // Answer all questions (mix of single and multi-select)
      const nextButton = screen.getByRole('button', { name: /Next →/ });
      
      for (let i = 0; i < 3; i++) {
        // Answer current question
        const options = screen.getAllByRole('button');
        const answerOptions = options.filter(btn => 
          btn.textContent && (btn.textContent.includes('○') || btn.textContent.includes('☐'))
        );
        
        if (answerOptions.length > 0) {
          await user.click(answerOptions[0]); // Select first option
        }

        // Navigate to next question if not last
        if (i < 2) {
          await user.click(nextButton);
          await waitFor(() => {
            expect(screen.getByText(new RegExp(`Question ${i + 2} of 3`))).toBeInTheDocument();
          });
        }
      }

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await user.click(submitButton);

      // Verify scoring was calculated
      await waitFor(() => {
        expect(mockRecordSession).toHaveBeenCalled();
        const sessionData = mockRecordSession.mock.calls[0][0];
        expect(sessionData.score).toBeGreaterThanOrEqual(0);
        expect(sessionData.score).toBeLessThanOrEqual(100);
      });
    });
  });
});

