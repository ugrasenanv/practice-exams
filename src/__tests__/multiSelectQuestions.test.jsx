import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LeadingSAFe6ExamQuiz from '../components/LeadingSAFe6/LeadingSAFe6ExamQuiz';

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

// Mock CSS modules and heavyweight children
vi.mock('../components/LeadingSAFe6/LeadingSAFe6ExamQuiz.module.css', () => ({ default: {} }));

vi.mock('../components/autosave/SessionRecovery.jsx', () => ({
  __esModule: true,
  default: () => null
}));

vi.mock('../components/exam/ProgressIndicator.jsx', () => ({
  __esModule: true,
  default: () => null
}));

vi.mock('../components/help/HelpSystem.jsx', () => ({
  __esModule: true,
  default: () => null,
  MultiSelectHelp: () => <span data-testid="multi-select-help" />
}));

vi.mock('../hooks/useExamTiming.js', () => ({
  useExamTiming: () => ({
    questionTimings: {},
    currentQuestionTime: 0,
    countdown: 5400,
    finalize: vi.fn()
  })
}));

// Mock questions with multi-select for testing - arranged so multi-select comes first
vi.mock('../components/LeadingSAFe6/LeadingSAFe6Questions.js', () => ({
  leadingSAFe6Questions: [
    {
      id: 2,
      questionType: "multiple",
      selectCount: 2,
      question: "Multi-select question: Choose exactly 2 answers",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswers: [0, 2],
      explanation: "Multi-select explanation",
      domain: "Test Domain",
      difficulty: "Foundation"
    },
    {
      id: 3,
      questionType: "multiple",
      selectCount: 3,
      question: "Multi-select question: Choose exactly 3 answers",
      options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
      correctAnswers: [1, 2, 4],
      explanation: "Multi-select explanation with 3 answers",
      domain: "Test Domain",
      difficulty: "Intermediate"
    },
    {
      id: 1,
      question: "Single select question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "Single select explanation",
      domain: "Test Domain",
      difficulty: "Foundation"
    }
  ]
}));

// Mock Math.random to make shuffling deterministic
let mockMathRandom;
beforeAll(() => {
  mockMathRandom = vi.spyOn(Math, 'random');
  mockMathRandom.mockReturnValue(0.5); // Always return 0.5 to make shuffle deterministic
});

afterAll(() => {
  mockMathRandom.mockRestore();
});

describe('Multi-Select Questions Tests', () => {
  const mockOnGoHome = vi.fn();
  const mockOnGoBackToExam = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Multi-Select Question Rendering', () => {
    test('should display multi-select instruction when question is multi-select', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      const requirement = await screen.findByTestId('multi-select-requirement');
      expect(requirement.textContent.replace(/\s+/g, ' ').trim()).toContain('Select exactly 2');
    });

    test('should show checkbox indicators for multi-select questions', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      expect(optionButtons.some(btn => btn.textContent?.includes('☐'))).toBe(true);
    });

    test('should show radio button indicators for single-select questions', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      const nextButton = await screen.findByRole('button', { name: /Next →/ });
      await userEvent.click(nextButton);

      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      expect(optionButtons.every(btn => !btn.textContent?.includes('☐'))).toBe(true);
      expect(optionButtons.some(btn => btn.textContent?.includes('○') || btn.textContent?.includes('●'))).toBe(true);
    });
  });

  describe('Multi-Select Answer Selection', () => {
    test('should allow selecting multiple answers up to selectCount limit', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      await screen.findByTestId('multi-select-requirement');

      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      const optionA = optionButtons.find(btn => btn.textContent?.includes('Option A'));
      await user.click(optionA);

      // Should show selected indicator (☑)
      await waitFor(() => {
        expect(optionA.textContent).toContain('☑');
      });

      // Select second option
      const optionB = optionButtons.find(btn => btn.textContent?.includes('Option B'));
      await user.click(optionB);

      // Should show second selection
      await waitFor(() => {
        expect(optionB.textContent).toContain('☑');
      });

      // Try to select third option - component allows temporary over-selection to show warning
      const optionC = optionButtons.find(btn => btn.textContent?.includes('Option C'));
      await user.click(optionC);

      // All three should appear selected with a warning indicator
      await waitFor(() => {
        const selectedOptions = within(optionsContainer)
          .getAllByRole('button')
          .filter(btn => btn.textContent.includes('☑'));
        expect(selectedOptions).toHaveLength(3);
      });

      const progressIndicator = await screen.findByTestId('multi-select-progress');
      expect(progressIndicator.textContent).toMatch(/3\s+of\s+2/i);
      expect(progressIndicator.textContent).toMatch(/too many/i);
    });

    test('should allow deselecting answers in multi-select', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      await screen.findByTestId('multi-select-requirement');

      // Select and then deselect an option
      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionA = within(optionsContainer)
        .getAllByRole('button')
        .find(btn => btn.textContent?.includes('Option A'));
      
      // Select
      await user.click(optionA);
      await waitFor(() => {
        expect(optionA.textContent).toContain('☑');
      });

      // Deselect
      await user.click(optionA);
      await waitFor(() => {
        expect(optionA.textContent).toContain('☐');
      });
      
      // Verify deselection worked by checking state is preserved
      expect(optionA.textContent).toContain('☐');
    });
  });

  describe('Exam Mode Filtering', () => {
    test('should filter out multi-select questions in exam mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="exam"
        />
      );

      await waitFor(() => {
        expect(screen.queryByTestId('multi-select-requirement')).not.toBeInTheDocument();
      });

      // Should show radio button indicators only
      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      const radioOptions = optionButtons.filter(btn => btn.textContent.includes('○'));
      const checkboxOptions = optionButtons.filter(btn => btn.textContent.includes('☐'));
      
      expect(radioOptions.length).toBeGreaterThan(0);
      expect(checkboxOptions.length).toBe(0);
    });

    test('should include multi-select questions in practice mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
        />
      );

      let foundMultiSelect = false;

      for (let i = 0; i < 3; i++) {
        if (screen.queryByTestId('multi-select-requirement')) {
          foundMultiSelect = true;
          break;
        }

        const nextButton = screen.queryByRole('button', { name: /Next →/ });
        if (!nextButton || nextButton.disabled) break;
        await userEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByTestId('quiz-question-card')).toBeInTheDocument();
        });
      }

      expect(foundMultiSelect).toBe(true);
    });
  });

  describe('Multi-Select Scoring', () => {
    test('should calculate partial credit for multi-select questions', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={1}
          examMode="practice"
        />
      );

      await screen.findByTestId('multi-select-requirement');

      // Select one correct (A) while leaving one unanswered - should yield partial credit
      // Mock data has correctAnswers: [0, 2] so selecting only A should earn partial score
      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      const optionA = optionButtons.find(btn => btn.textContent?.includes('Option A'));
      
      await user.click(optionA);

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await user.click(submitButton);

      // Check that recordSession was called with proper scoring
      await waitFor(() => {
        expect(mockRecordSession).toHaveBeenCalled();
        const sessionData = mockRecordSession.mock.calls[0][0];
        // Should award partial score (50%) and count a fractional correct answer
        expect(sessionData.score).toBe(50);
        expect(sessionData.correctAnswers).toBe(1);
      });
    });

    test('should give full credit for completely correct multi-select answers', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={1}
          examMode="practice"
        />
      );

      await screen.findByTestId('multi-select-requirement');

      // Select both correct answers (A and C) - correctAnswers: [0, 2]
      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      const optionA = optionButtons.find(btn => btn.textContent?.includes('Option A'));
      const optionC = optionButtons.find(btn => btn.textContent?.includes('Option C'));
      
      await user.click(optionA);
      await user.click(optionC);

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await user.click(submitButton);

      // Should get 100% score
      await waitFor(() => {
        expect(mockRecordSession).toHaveBeenCalled();
        const sessionData = mockRecordSession.mock.calls[0][0];
        expect(sessionData.score).toBe(100);
      });
    });

    test('should give zero credit for completely incorrect multi-select answers', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={1}
          examMode="practice"
        />
      );

      await screen.findByTestId('multi-select-requirement');

      // Select two incorrect answers (B and D) - correctAnswers: [0, 2], so [1, 3] are incorrect
      const optionsContainer = await screen.findByTestId('quiz-options-container');
      const optionButtons = within(optionsContainer).getAllByRole('button');
      const optionB = optionButtons.find(btn => btn.textContent?.includes('Option B'));
      const optionD = optionButtons.find(btn => btn.textContent?.includes('Option D'));
      
      await user.click(optionB);
      await user.click(optionD);

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await user.click(submitButton);

      // Should get 0% score
      await waitFor(() => {
        expect(mockRecordSession).toHaveBeenCalled();
        const sessionData = mockRecordSession.mock.calls[0][0];
        expect(sessionData.score).toBe(0);
      });
    });
  });

  describe('Multi-Select Visual Feedback', () => {
    test('should show correct/incorrect indicators after answer submission', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={1}
          examMode="practice"
        />
      );

      // Should show first multi-select question (2 answers) due to deterministic ordering
      await waitFor(() => {
        expect(screen.getByText(/Multi-select question: Choose exactly 2 answers/)).toBeInTheDocument();
      });

      // Select answers based on the 2-answer multi-select mock data (correctAnswers: [0, 2])
      const options = screen.getAllByRole('button');
      const optionA = options.find(btn => btn.textContent.includes('Option A')); // Correct (index 0)
      const optionC = options.find(btn => btn.textContent.includes('Option C')); // Correct (index 2)
      
      await user.click(optionA); // Correct
      await user.click(optionC); // Correct

      // Should show correct visual indicators after selection
      await waitFor(() => {
        expect(optionA.textContent).toContain('✓'); // Correct indicator
        expect(optionC.textContent).toContain('✓'); // Correct indicator
      });
    });
  });
});

