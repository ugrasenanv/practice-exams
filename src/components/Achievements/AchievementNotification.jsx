import React, { useState, useEffect } from 'react';
import styles from './AchievementNotification.module.css';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getAchievementEmoji = (achievementId) => {
    if (achievementId.includes('streak')) return '🔥';
    if (achievementId.includes('score') || achievementId === 'perfect_score') return '🏆';
    if (achievementId.includes('sessions')) return '📚';
    if (achievementId.includes('improvement') || achievementId === 'mastery') return '📈';
    if (achievementId.includes('multi') || achievementId.includes('exploration')) return '🎯';
    return '🎉';
  };

  return (
    <div className={`${styles.notification} ${isVisible ? styles.show : ''}`}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>
          {getAchievementEmoji(achievement.id)}
        </div>
        <div className={styles.notificationText}>
          <h3>Achievement Unlocked!</h3>
          <p>{achievement.title}</p>
          <span className={styles.description}>{achievement.description}</span>
        </div>
        <button className={styles.closeButton} onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 500);
        }}>
          ×
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;