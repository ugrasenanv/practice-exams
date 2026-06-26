import React from 'react';
import styles from './QuestionBadge.module.css';

const QuestionBadge = ({ type, text }) => {
  const badgeClass = type === 'new' ? styles.newBadge : 
                     type === 'seen' ? styles.seenBadge : 
                     styles.defaultBadge;

  return (
    <span className={`${styles.badge} ${badgeClass}`}>
      {text}
    </span>
  );
};

export default QuestionBadge;
