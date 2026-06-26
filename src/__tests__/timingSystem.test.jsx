import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LeadingSAFe6ExamQuiz from '../components/LeadingSAFe6/LeadingSAFe6ExamQuiz';

// Mock the contexts
const mockRecordSession = vi.fn();
const mockUpdateSpacedRepetition = vi.fn();

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

// Mock AutosaveContext to avoid invoking real localStorage logic complexity in unit tests
vi.mock('../contexts/AutosaveContext.jsx', () => ({
  useAutosave: () => ({
    saveExamState: vi.fn(),
    loadExamState: vi.fn(() => null),
    clearExamState: vi.fn(),
    getAutosavedSessions: vi.fn(() => []),
    AUTOSAVE_INTERVAL: 30000,
    DEBOUNCE_DELAY: 2000
  })
}));

// Mock CSS modules with default export object to satisfy style usage
vi.mock('../components/LeadingSAFe6/LeadingSAFe6ExamQuiz.module.css', () => ({ default: {} }));
vi.mock('../components/shared/Results.module.css', () => ({ default: {} }));

const createScheduler = (timeRef) => {
  let nextId = 1;
  const timers = new Map();

  const register = (cb, ms, type) => {
    const id = nextId++;
    timers.set(id, { cb, ms, elapsed: 0, type });
    return id;
  };

  const clear = (id) => {
    if (timers.has(id)) {
      timers.delete(id);
    }
  };

  const tick = (seconds) => {
    for (let s = 0; s < seconds; s++) {
      timeRef.current += 1000;
      const entries = Array.from(timers.entries());
      for (const [id, timer] of entries) {
        timer.elapsed += 1000;
        while (timer.elapsed >= timer.ms) {
          if (timer.type === 'timeout') {
            timers.delete(id);
            timer.cb();
            break;
          }
          timer.elapsed -= timer.ms;
          timer.cb();
          if (!timers.has(id)) break;
        }
      }
    }
  };

  return {
    setInterval: (cb, ms) => register(cb, ms, 'interval'),
    clearInterval: clear,
    setTimeout: (cb, ms) => register(cb, ms, 'timeout'),
    clearTimeout: clear,
    tick
  };
};

describe('Timing System Tests', () => {
  const mockOnGoHome = vi.fn();
  const mockOnGoBackToExam = vi.fn();
  const BASE = 1609459200000;
  let scheduler;
  let timeRef;

  const advanceTime = (seconds) => act(() => {
    scheduler.tick(seconds);
  });
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    timeRef = { current: BASE };
    scheduler = createScheduler(timeRef);
    vi.spyOn(Date, 'now').mockImplementation(() => timeRef.current);
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Per-Question Timing', () => {
    test('should display initial question timer', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={5}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
      });
    });
    test('should update question timer every second', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={5}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
      });

      advanceTime(5);

      await waitFor(() => {
        expect(screen.getByText(/Time on question: 0:05/)).toBeInTheDocument();
      });
    });

    test('should track timing when navigating between questions', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={5}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      // Wait for questions to load
      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument();
      });

      advanceTime(3);

      // Find and click next button
      const nextButton = screen.getByRole('button', { name: /Next →/ });
      await user.click(nextButton);

      // Verify we moved to question 2
      await waitFor(() => {
        expect(screen.getByText(/Question 2 of 5/)).toBeInTheDocument();
      });

      // Timer should reset for new question
      expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
    });
  });

  describe('Timing Data Storage', () => {
    test('should store timing data in localStorage on exam submission', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={2}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      // Wait for questions to load
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Submit Exam/ })).toBeInTheDocument();
      });

      // Answer first question
      const firstOption = screen.getByTestId('quiz-option-0');
      await user.click(firstOption);

      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Advance a few seconds before submitting
      advanceTime(4);

      // Submit exam
      await user.click(submitButton);

      // Check if timing data was stored
      const storageKeys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
      const timingKeys = storageKeys.filter(key => key && key.startsWith('examTiming_'));
      expect(timingKeys.length).toBeGreaterThan(0);
    });

    test('should store correct timing data structure', async () => {
      const user = userEvent.setup();

      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={1}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      // Wait and submit
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Submit Exam/ })).toBeInTheDocument();
      });

      const firstOption = screen.getByTestId('quiz-option-0');
      await user.click(firstOption);

      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Simulate some elapsed time
      advanceTime(3);

      await user.click(submitButton);

      const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
      const timingKey = keys.find(key => key && key.startsWith('examTiming_'));
      expect(timingKey).toBeTruthy();
      const stored = JSON.parse(localStorage.getItem(timingKey));
      expect(stored).toMatchObject({
        examType: 'Leading SAFe 6',
        totalTimeUsed: expect.any(Number),
        questionTimings: expect.any(Object),
        questions: expect.any(Array)
      });
    });
  });

  describe('Timer Integration with Exam Modes', () => {
    test('should handle unlimited time in practice mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={200} // Large number triggers unlimited time
          examMode="practice"
          scheduler={scheduler}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Unlimited Time/)).toBeInTheDocument();
      });
    });

    test('should show countdown timer in exam mode', async () => {
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={45} // Standard exam size
          examMode="exam"
          scheduler={scheduler}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Time Remaining:/)).toBeInTheDocument();
        expect(screen.getByText(/01:30:00/)).toBeInTheDocument(); // 90 minutes
      });
    });
  });

  describe('Question Timer Reset', () => {
    test('should reset timer when navigating between questions', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={3}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();
      });

      // Simulate 10 seconds on first question
      advanceTime(10);

      await waitFor(() => {
        expect(screen.getByText(/Time on question: 0:10/)).toBeInTheDocument();
      });

      // Navigate to next question
      const nextButton = screen.getByRole('button', { name: /Next →/ });
      await user.click(nextButton);

      // Timer should reset
      await waitFor(() => {
        expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
      });
    });

    test('should reset all timing states on exam retake', async () => {
      const user = userEvent.setup();
      
      render(
        <LeadingSAFe6ExamQuiz
          onGoHome={mockOnGoHome}
          onGoBackToExam={mockOnGoBackToExam}
          numberOfQuestions={1}
          examMode="practice"
          scheduler={scheduler}
        />
      );

      // Submit exam first
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Submit Exam/ })).toBeInTheDocument();
      });

      const firstOption = screen.getByTestId('quiz-option-0');
      await user.click(firstOption);

      const submitButton = screen.getByRole('button', { name: /Submit Exam/ });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      await user.click(submitButton);

      // Should show results page
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Leading SAFe 6 Exam Results/ })).toBeInTheDocument();
      });

      // Find retake button
      const retakeButton = screen.getByRole('button', { name: /Retake Exam/ });
      await user.click(retakeButton);

      // Should be back to question 1 with timer reset
      await waitFor(() => {
        expect(screen.getByText(/Question 1 of 1/)).toBeInTheDocument();
        expect(screen.getByText(/Time on question: 0:00/)).toBeInTheDocument();
      });
    });
  });
});

