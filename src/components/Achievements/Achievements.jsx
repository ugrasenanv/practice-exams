import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import styles from './Achievements.module.css';

const Achievements = ({ onGoHome }) => {
  const { achievements, getAchievementProgress } = useProgress();

  const achievementCategories = {
    streaks: {
      title: 'Study Streaks',
      icon: '🔥',
      achievements: [
        { id: 'streak_3', title: 'Getting Started', description: 'Complete exams 3 days in a row', requirement: 3 },
        { id: 'streak_7', title: 'Week Warrior', description: 'Complete exams 7 days in a row', requirement: 7 },
        { id: 'streak_14', title: 'Fortnight Fighter', description: 'Complete exams 14 days in a row', requirement: 14 },
        { id: 'streak_30', title: 'Monthly Master', description: 'Complete exams 30 days in a row', requirement: 30 },
        { id: 'streak_100', title: 'Centurion', description: 'Complete exams 100 days in a row', requirement: 100 }
      ]
    },
    scores: {
      title: 'High Scores',
      icon: '🏆',
      achievements: [
        { id: 'score_70', title: 'Passing Grade', description: 'Score 70% or higher on any exam', requirement: 70 },
        { id: 'score_80', title: 'Good Performance', description: 'Score 80% or higher on any exam', requirement: 80 },
        { id: 'score_90', title: 'Excellent Work', description: 'Score 90% or higher on any exam', requirement: 90 },
        { id: 'score_95', title: 'Near Perfect', description: 'Score 95% or higher on any exam', requirement: 95 },
        { id: 'perfect_score', title: 'Perfectionist', description: 'Score 100% on any exam', requirement: 100 }
      ]
    },
    consistency: {
      title: 'Consistency',
      icon: '📈',
      achievements: [
        { id: 'sessions_10', title: 'Getting Into It', description: 'Complete 10 practice sessions', requirement: 10 },
        { id: 'sessions_25', title: 'Quarter Century', description: 'Complete 25 practice sessions', requirement: 25 },
        { id: 'sessions_50', title: 'Half Century', description: 'Complete 50 practice sessions', requirement: 50 },
        { id: 'sessions_100', title: 'Centurion Student', description: 'Complete 100 practice sessions', requirement: 100 },
        { id: 'sessions_250', title: 'Quarter Thousand', description: 'Complete 250 practice sessions', requirement: 250 }
      ]
    },
    improvement: {
      title: 'Improvement',
      icon: '📊',
      achievements: [
        { id: 'improvement_10', title: 'Getting Better', description: 'Improve score by 10% from first attempt', requirement: 10 },
        { id: 'improvement_20', title: 'Steady Progress', description: 'Improve score by 20% from first attempt', requirement: 20 },
        { id: 'improvement_30', title: 'Major Improvement', description: 'Improve score by 30% from first attempt', requirement: 30 },
        { id: 'improvement_50', title: 'Transformation', description: 'Improve score by 50% from first attempt', requirement: 50 },
        { id: 'mastery', title: 'Domain Master', description: 'Achieve 90%+ in all domains for any exam', requirement: 1 }
      ]
    },
    exploration: {
      title: 'Exploration',
      icon: '🎯',
      achievements: [
        { id: 'multi_exam', title: 'Explorer', description: 'Take practice sessions in 2 different exams', requirement: 2 },
        { id: 'exam_completionist', title: 'Completionist', description: 'Take practice sessions in 4+ different exams', requirement: 4 },
        { id: 'question_bank', title: 'Bank Robber', description: 'Answer 1000+ questions across all exams', requirement: 1000 },
        { id: 'time_master', title: 'Time Master', description: 'Complete a full exam under time pressure', requirement: 1 },
        { id: 'speed_demon', title: 'Speed Demon', description: 'Complete an exam 20% faster than allocated time', requirement: 1 }
      ]
    }
  };

  const isAchievementUnlocked = (achievementId) => {
    return achievements.includes(achievementId);
  };

  const getAchievementProgressValue = (achievementId, requirement) => {
    const progress = getAchievementProgress(achievementId);
    return Math.min(progress, requirement);
  };

  const getProgressPercentage = (achievementId, requirement) => {
    const progress = getAchievementProgressValue(achievementId, requirement);
    return Math.min((progress / requirement) * 100, 100);
  };

  return (
    <div className={styles.achievementsContainer}>
      <div className={styles.achievementsHeader}>
        <div className={styles.brand}>
          <h1 className={styles.logo}>🏆 Achievements</h1>
          <p className={styles.tagline}>Track your learning milestones</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.achievementsSummary}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryValue}>{achievements.length}</div>
              <div className={styles.summaryLabel}>Unlocked</div>
            </div>
          </div>
          <button className={styles.backButton} onClick={onGoHome}>
            ← Back to Home
          </button>
        </div>
      </div>

      <div className={styles.achievementsContent}>
        {Object.entries(achievementCategories).map(([categoryKey, category]) => (
          <section key={categoryKey} className={styles.achievementCategory}>
            <h2 className={styles.categoryTitle}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              {category.title}
            </h2>
            <div className={styles.achievementsList}>
              {category.achievements.map((achievement) => {
                const isUnlocked = isAchievementUnlocked(achievement.id);
                const progress = getAchievementProgressValue(achievement.id, achievement.requirement);
                const percentage = getProgressPercentage(achievement.id, achievement.requirement);

                return (
                  <div
                    key={achievement.id}
                    className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
                  >
                    <div className={styles.achievementIcon}>
                      {isUnlocked ? '✅' : '🔒'}
                    </div>
                    <div className={styles.achievementInfo}>
                      <h3 className={styles.achievementTitle}>
                        {achievement.title}
                      </h3>
                      <p className={styles.achievementDescription}>
                        {achievement.description}
                      </p>
                      <div className={styles.achievementProgress}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className={styles.progressText}>
                          {progress} / {achievement.requirement}
                        </div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <div className={styles.unlockedBadge}>
                        Unlocked!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Achievements;