import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QuestionHistoryProvider, useQuestionHistory } from '../contexts/QuestionHistoryContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

describe('QuestionHistory Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('tracks question attempts correctly', () => {
    const { result } = renderHook(() => useQuestionHistory(), {
      wrapper: QuestionHistoryProvider,
    });

    act(() => {
      result.current.recordQuestionAttempt('ab730', 'q1', true);
    });

    expect(result.current.isQuestionSeen('ab730', 'q1')).toBe(true);
    expect(result.current.isQuestionSeen('ab730', 'q2')).toBe(false);
  });

  it('calculates exam stats correctly', () => {
    const { result } = renderHook(() => useQuestionHistory(), {
      wrapper: QuestionHistoryProvider,
    });

    act(() => {
      result.current.recordQuestionAttempt('ab730', 'q1', true);
      result.current.recordQuestionAttempt('ab730', 'q2', false);
      result.current.recordQuestionAttempt('ab730', 'q3', true);
    });

    const stats = result.current.getExamStats('ab730', 10);
    expect(stats.practiced).toBe(3);
    expect(stats.remaining).toBe(7);
    expect(stats.total).toBe(10);
    expect(stats.mastery).toBe(20); // 2 out of 10 mastered = 20%
  });

  it('filters questions based on seen/unseen preference', () => {
    const { result } = renderHook(() => useQuestionHistory(), {
      wrapper: QuestionHistoryProvider,
    });

    const questions = [
      { id: 'q1', question: 'Question 1' },
      { id: 'q2', question: 'Question 2' },
      { id: 'q3', question: 'Question 3' },
    ];

    act(() => {
      result.current.recordQuestionAttempt('ab730', 'q1', true);
      result.current.setIncludePreviouslySeen(false);
    });

    const filtered = result.current.filterQuestions('ab730', questions);
    expect(filtered.length).toBe(2);
    expect(filtered.find(q => q.id === 'q1')).toBeUndefined();
  });

  it('resets history correctly', () => {
    const { result } = renderHook(() => useQuestionHistory(), {
      wrapper: QuestionHistoryProvider,
    });

    act(() => {
      result.current.recordQuestionAttempt('ab730', 'q1', true);
      result.current.recordQuestionAttempt('ai900', 'q1', false);
    });

    expect(result.current.isQuestionSeen('ab730', 'q1')).toBe(true);
    expect(result.current.isQuestionSeen('ai900', 'q1')).toBe(true);

    act(() => {
      result.current.resetHistory('ab730');
    });

    expect(result.current.isQuestionSeen('ab730', 'q1')).toBe(false);
    expect(result.current.isQuestionSeen('ai900', 'q1')).toBe(true);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useQuestionHistory(), {
      wrapper: QuestionHistoryProvider,
    });

    act(() => {
      result.current.recordQuestionAttempt('ab730', 'q1', true);
    });

    const stored = JSON.parse(localStorage.getItem('questionHistory'));
    expect(stored).toBeDefined();
    expect(stored.ab730).toBeDefined();
    expect(stored.ab730.q1).toBeDefined();
    expect(stored.ab730.q1.correctAttempts).toBe(1);
  });
});
