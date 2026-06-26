/**
 * Utility for shuffling question answers to eliminate position bias
 * Uses a seeded random function for consistent shuffling per question
 */

/**
 * Simple seeded random number generator for consistent shuffling
 * @param {number} seed - Seed value
 * @returns {function} Random number generator function
 */
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

/**
 * Fisher-Yates shuffle algorithm with optional seeding
 * @param {Array} array - Array to shuffle
 * @param {number} seed - Optional seed for consistent shuffling
 * @returns {Array} Shuffled array
 */
function shuffleArray(array, seed) {
  const shuffled = [...array];
  const random = seed !== undefined ? seededRandom(seed) : Math.random;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Shuffles question answers while maintaining correct answer tracking
 * @param {Object} question - Question object with options and correctAnswer(s)
 * @param {number} userId - Optional user ID for consistent shuffling per user
 * @returns {Object} Question with shuffled options and updated correct answer index(es)
 */
export function shuffleQuestionAnswers(question, userId = null) {
  // Don't modify the original question
  const shuffledQuestion = { ...question };
  
  // Create seed based on question ID and optionally user ID
  // This ensures consistent shuffle for same question/user combo
  const seed = userId ? question.id * 1000 + userId : question.id * 1000 + Math.floor(Math.random() * 1000);
  
  // Create array of option objects with original indices
  const optionsWithIndices = question.options.map((option, index) => ({
    option,
    originalIndex: index
  }));
  
  // Shuffle the options
  const shuffledOptions = shuffleArray(optionsWithIndices, seed);
  
  // Extract shuffled options
  shuffledQuestion.options = shuffledOptions.map(item => item.option);
  
  // Update correct answer index/indices based on new positions
  if (question.questionType === 'multiple') {
    // For multiple choice, update array of correct indices
    shuffledQuestion.correctAnswers = question.correctAnswers.map(correctIdx => {
      const newIndex = shuffledOptions.findIndex(item => item.originalIndex === correctIdx);
      return newIndex;
    });
  } else {
    // For single choice, update single correct index
    const newIndex = shuffledOptions.findIndex(item => item.originalIndex === question.correctAnswer);
    shuffledQuestion.correctAnswer = newIndex;
  }
  
  return shuffledQuestion;
}

/**
 * Shuffles all questions' answers in a question set
 * @param {Array} questions - Array of question objects
 * @param {number} userId - Optional user ID for consistent shuffling per user
 * @returns {Array} Questions with shuffled answers
 */
export function shuffleAllQuestionAnswers(questions, userId = null) {
  return questions.map(question => shuffleQuestionAnswers(question, userId));
}

/**
 * Check if answers should be shuffled (can be controlled by settings)
 * @param {Object} settings - User settings object
 * @returns {boolean} Whether to shuffle answers
 */
export function shouldShuffleAnswers(settings = {}) {
  // Default to true unless explicitly disabled
  return settings.shuffleAnswers !== false;
}

export default {
  shuffleQuestionAnswers,
  shuffleAllQuestionAnswers,
  shouldShuffleAnswers
};
