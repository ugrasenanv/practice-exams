import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TimingAnalytics from '../components/shared/TimingAnalytics';

vi.mock('../components/shared/TimingAnalytics.module.css', () => ({ default: {} }));

describe('TimingAnalytics Component Tests', () => {
  let mockOnGoHome;

  beforeEach(() => {
    mockOnGoHome = vi.fn();
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Component Rendering', () => {
    test('should render with no data message when localStorage is empty', () => {
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(screen.getByText(/No timing data available yet/)).toBeInTheDocument();
      expect(screen.getByText(/Complete an exam to see your timing analytics/)).toBeInTheDocument();
    });

    test('should render exam sessions when data exists', async () => {
      const mockExamData = {
        examType: 'Leading SAFe 6',
        date: '2021-01-01T00:00:00.000Z',
        totalTimeUsed: 3600,
        questionTimings: { 1: 30000, 2: 45000, 3: 60000 },
        questions: [
          { id: 1, question: 'Test question 1...', domain: 'Domain A', difficulty: 'Foundation' },
          { id: 2, question: 'Test question 2...', domain: 'Domain B', difficulty: 'Intermediate' },
          { id: 3, question: 'Test question 3...', domain: 'Domain C', difficulty: 'Advanced' }
        ]
      };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(mockExamData));
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(await screen.findByText(/Exam Sessions \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Leading SAFe 6/)).toBeInTheDocument();
      expect(screen.getByText(/1\/1\/2021/)).toBeInTheDocument();
    });
  });

  describe('Exam Session Display', () => {
    beforeEach(() => {
      const mockExamData = {
        examType: 'SAFe for Teams 6.0',
        date: '2021-01-01T00:00:00.000Z',
        totalTimeUsed: 2700,
        questionTimings: { 1: 120000, 2: 90000, 3: 180000 },
        questions: [
          { id: 1, question: 'Question about agile practices...', domain: 'Team Agility', difficulty: 'Foundation' },
          { id: 2, question: 'Question about SAFe principles...', domain: 'Lean-Agile Leadership', difficulty: 'Intermediate' },
          { id: 3, question: 'Question about PI planning...', domain: 'Program Execution', difficulty: 'Advanced' }
        ]
      };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(mockExamData));
    });

    test('should display exam statistics correctly', async () => {
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(await screen.findByText(/Total: 45m 0s/)).toBeInTheDocument();
      expect(screen.getByText(/Avg\/Q: 2:10/)).toBeInTheDocument();
      expect(screen.getByText(/Questions: 3/)).toBeInTheDocument();
    });

    test('should show detailed analysis when exam is selected', async () => {
      const user = userEvent.setup();
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const examSession = await screen.findByText(/SAFe for Teams 6.0/);
      await user.click(examSession);
      expect(screen.getByText(/SAFe for Teams 6.0 - Detailed Analysis/)).toBeInTheDocument();
      expect(screen.getByText(/Total Exam Time:/)).toBeInTheDocument();
      // Multiple elements may contain the same time string (summary + detailed view). Ensure at least one found.
      expect(screen.getAllByText(/45m 0s/).length).toBeGreaterThanOrEqual(1);
      // Label and value are split across elements, use a function matcher
      expect(screen.getByText((content, node) => {
        const hasText = /Questions Tracked:/i.test(content)
        if (!hasText) return false
        // Look for sibling containing just the number 3
        const parent = node.parentElement
        return parent && /Questions Tracked:/i.test(node.textContent) && /3/.test(parent.textContent)
      })).toBeInTheDocument();
    });

    test('should display timing statistics in detailed view', async () => {
      const user = userEvent.setup();
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const examSession = await screen.findByText(/SAFe for Teams 6.0/);
      await user.click(examSession);
      expect(screen.getByText(/Average Time per Question:/)).toBeInTheDocument();
      expect(screen.getByText(/Fastest Question:/)).toBeInTheDocument();
      expect(screen.getByText(/Slowest Question:/)).toBeInTheDocument();
      expect(screen.getAllByText(/1:30/)).toHaveLength(2);
      expect(screen.getAllByText(/3:00/).length).toBeGreaterThanOrEqual(1);
    });

    test('should display per-question breakdown', async () => {
      const user = userEvent.setup();
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const examSession = await screen.findByText(/SAFe for Teams 6.0/);
      await user.click(examSession);
      expect(screen.getByText(/Per-Question Breakdown/)).toBeInTheDocument();
      expect(screen.getByText(/Q1/)).toBeInTheDocument();
      expect(screen.getByText(/Q2/)).toBeInTheDocument();
      expect(screen.getByText(/Q3/)).toBeInTheDocument();
      expect(screen.getByText(/Team Agility/)).toBeInTheDocument();
      expect(screen.getByText(/Lean-Agile Leadership/)).toBeInTheDocument();
      expect(screen.getByText(/Program Execution/)).toBeInTheDocument();
    });
  });

  describe('Data Management', () => {
    beforeEach(() => {
      const exam1 = { examType: 'Leading SAFe 6', date: '2021-01-01T00:00:00.000Z', totalTimeUsed: 3600, questionTimings: { 1: 30000, 2: 45000 }, questions: [ { id: 1, question: 'Question 1...', domain: 'Domain A', difficulty: 'Foundation' }, { id: 2, question: 'Question 2...', domain: 'Domain B', difficulty: 'Intermediate' } ] };
      const exam2 = { examType: 'SAFe for Teams 6.0', date: '2021-01-02T00:00:00.000Z', totalTimeUsed: 2400, questionTimings: { 1: 40000, 2: 50000 }, questions: [ { id: 1, question: 'Question A...', domain: 'Domain X', difficulty: 'Foundation' }, { id: 2, question: 'Question B...', domain: 'Domain Y', difficulty: 'Advanced' } ] };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(exam1));
      localStorage.setItem('examTiming_1609545600000', JSON.stringify(exam2));
    });

    test('should display multiple exam sessions', async () => {
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(await screen.findByText(/Exam Sessions \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/Leading SAFe 6/)).toBeInTheDocument();
      expect(screen.getByText(/SAFe for Teams 6.0/)).toBeInTheDocument();
    });

    test('should delete individual exam session', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn().mockReturnValue(true);
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const deleteButtons = await screen.findAllByText('🗑️');
      await user.click(deleteButtons[0]);
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this exam timing data?');
      await waitFor(() => expect(screen.getByText(/Exam Sessions \(1\)/)).toBeInTheDocument());
    });

    test('should clear all data when clear all is clicked', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn().mockReturnValue(true);
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const clearAllButton = await screen.findByText('Clear All');
      await user.click(clearAllButton);
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear all timing data? This cannot be undone.');
      await waitFor(() => expect(screen.getByText(/No timing data available yet/)).toBeInTheDocument());
    });

    test('should cancel deletion when user clicks cancel', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn().mockReturnValue(false);
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const clearAllButton = await screen.findByText('Clear All');
      await user.click(clearAllButton);
      expect(screen.getByText(/Exam Sessions \(2\)/)).toBeInTheDocument();
    });
  });

  describe('Time Formatting', () => {
    test('should format milliseconds correctly', async () => {
      const mockExamData = { examType: 'Leading SAFe 6', date: '2021-01-01T00:00:00.000Z', totalTimeUsed: 3665, questionTimings: { 1: 125000, 2: 65000 }, questions: [ { id: 1, question: 'Question 1...', domain: 'Domain A', difficulty: 'Foundation' }, { id: 2, question: 'Question 2...', domain: 'Domain B', difficulty: 'Intermediate' } ] };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(mockExamData));
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(await screen.findByText(/Total: 1h 1m 5s/)).toBeInTheDocument();
    });

    test('should handle edge cases in time formatting', async () => {
      const mockExamData = { examType: 'Leading SAFe 6', date: '2021-01-01T00:00:00.000Z', totalTimeUsed: 59, questionTimings: { 1: 999, 2: 30500 }, questions: [ { id: 1, question: 'Question 1...', domain: 'Domain A', difficulty: 'Foundation' }, { id: 2, question: 'Question 2...', domain: 'Domain B', difficulty: 'Intermediate' } ] };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(mockExamData));
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(await screen.findByText(/0m 59s/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('examTiming_corrupted', 'invalid json');
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      expect(screen.getByText(/No timing data available yet/)).toBeInTheDocument();
    });

    test('should handle missing questionTimings data', async () => {
      const user = userEvent.setup();
      const incompleteExamData = { examType: 'Leading SAFe 6', date: '2021-01-01T00:00:00.000Z', totalTimeUsed: 3600, questions: [] };
      localStorage.setItem('examTiming_1609459200000', JSON.stringify(incompleteExamData));
      render(<TimingAnalytics onGoHome={mockOnGoHome} />);
      const examSession = await screen.findByText(/Leading SAFe 6/);
      await user.click(examSession);
      expect(screen.getByText(/No question timing data available for this exam/)).toBeInTheDocument();
    });
  });
});

