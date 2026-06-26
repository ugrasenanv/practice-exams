// Pure utility functions extracted for contract testing of scoring and timing.
// These mirror logic inside LeadingSAFe6ExamQuiz (multi-select partial credit) & time formatting.

/**
 * Calculate score for a single question.
 * For multi-select: (correctSelected - incorrectSelected)/totalCorrect clamped to [0,1].
 * For single-select: 1 if correct else 0.
 * @param {Object} question - question object (may contain questionType, correctAnswer(s)).
 * @param {number|number[]} userAnswer - selected index or array of indexes for multi-select.
 * @returns {number} questionScore between 0 and 1.
 */
export function scoreQuestion(question, userAnswer) {
  if (!question) return 0
  if (question.questionType === 'multiple') {
    const correctAnswers = question.correctAnswers || []
    const selections = Array.isArray(userAnswer) ? userAnswer : []
    if (selections.length === 0) return 0
    const correctSelected = selections.filter(i => correctAnswers.includes(i)).length
    const incorrectSelected = selections.filter(i => !correctAnswers.includes(i)).length
    const raw = (correctSelected - incorrectSelected) / (correctAnswers.length || 1)
    return Math.max(0, Math.min(1, raw))
  }
  return userAnswer === question.correctAnswer ? 1 : 0
}

/**
 * Aggregate total score across questions (array of {question, userAnswer}).
 */
export function aggregateScore(pairs) {
  const total = pairs.reduce((sum, p) => sum + scoreQuestion(p.question, p.userAnswer), 0)
  return { raw: total, percentage: pairs.length ? (total / pairs.length) * 100 : 0 }
}

/**
 * Format milliseconds to m:ss (used in timing analytics & per-question display subset).
 */
export function formatMilliseconds(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2,'0')}`
}

/**
 * Format seconds to Hh Mm Ss style used in analytics summary.
 */
export function formatTotalSeconds(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const parts = []
  if (h) parts.push(`${h}h`)
  // Always show minutes (even 0m) for consistency with analytics test expectations
  parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}
