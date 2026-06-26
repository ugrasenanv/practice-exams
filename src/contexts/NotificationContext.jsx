import { useState, useEffect, useContext, createContext } from 'react';
import { ProgressContext } from './ProgressContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState(() => {
    // Check if we're in a browser environment and Notification API is available
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [subscription, setSubscription] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const progressData = useContext(ProgressContext);

  useEffect(() => {
    // Check if service worker and push messaging are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      initializePushNotifications();
    }
  }, []);

  const initializePushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToPush();
        showWelcomeNotification();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID key pair for production use
      // For demo purposes, using a placeholder
      const applicationServerKey = urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa40HI80QTsvV7Rywb1D5gZDK-ydZhkWWgtKGzz0uAmfkfCmAgfI7LkEf_5Cgw'
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      setSubscription(subscription);
      
      // In a real app, send this subscription to your server
      console.log('Push subscription:', JSON.stringify(subscription));
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  };

  const showWelcomeNotification = () => {
    if (permission === 'granted') {
      new Notification('Welcome to SAFe Practice Exams!', {
        body: 'You\'ll now receive study reminders and achievement notifications.',
        icon: '/icon-192x192.svg',
        badge: '/favicon-32x32.svg',
        tag: 'welcome',
        requireInteraction: false,
        actions: [
          {
            action: 'start-practice',
            title: 'Start Practice Exam'
          },
          {
            action: 'view-dashboard',
            title: 'View Dashboard'
          }
        ]
      });
    }
  };

  const scheduleStudyReminder = (examType, nextStudyTime) => {
    if (permission !== 'granted' || !('serviceWorker' in navigator)) return;
    
    // Check user preferences
    const preferences = JSON.parse(localStorage.getItem('notification-preferences') || '{"studyReminders": true}');
    if (!preferences.studyReminders) return;

    // Schedule notification via service worker
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        data: {
          title: `Time to study ${examType}!`,
          body: 'Keep up your learning momentum with a quick practice session.',
          delay: nextStudyTime - Date.now(),
          tag: `study-reminder-${examType}`,
          icon: '/icon-192x192.svg',
          badge: '/favicon-32x32.svg',
          actions: [
            {
              action: 'start-exam',
              title: 'Start Exam'
            },
            {
              action: 'snooze',
              title: 'Remind me in 1 hour'
            }
          ],
          data: {
            examType,
            url: `/?exam=${examType}`
          }
        }
      });
    });
  };

  const showAchievementNotification = (achievement) => {
    if (permission !== 'granted') return;
    
    // Check user preferences
    const preferences = JSON.parse(localStorage.getItem('notification-preferences') || '{"achievements": true}');
    if (!preferences.achievements) return;

    new Notification(`Achievement Unlocked: ${achievement.name}!`, {
      body: achievement.description,
      icon: '/icon-192x192.svg',
      badge: '/favicon-32x32.svg',
      tag: `achievement-${achievement.id}`,
      requireInteraction: true,
      actions: [
        {
          action: 'view-achievements',
          title: 'View All Achievements'
        },
        {
          action: 'share',
          title: 'Share Achievement'
        }
      ],
      data: {
        achievementId: achievement.id,
        url: '/?action=achievements'
      }
    });
  };

  const showPassScoreNotification = (examType, score, passed) => {
    if (permission !== 'granted') return;
    
    // Check user preferences
    const preferences = JSON.parse(localStorage.getItem('notification-preferences') || '{"examResults": true}');
    if (!preferences.examResults) return;

    const title = passed 
      ? `🎉 Congratulations! You passed ${examType}!`
      : `Keep going! ${examType} practice completed`;
      
    const body = passed
      ? `Excellent work! You scored ${score}% and are ready for the real exam.`
      : `You scored ${score}%. Review the areas for improvement and try again.`;

    new Notification(title, {
      body,
      icon: '/icon-192x192.svg',
      badge: '/favicon-32x32.svg',
      tag: `exam-result-${examType}`,
      requireInteraction: true,
      actions: passed ? [
        {
          action: 'share-success',
          title: 'Share Success'
        },
        {
          action: 'try-another',
          title: 'Try Another Exam'
        }
      ] : [
        {
          action: 'review-answers',
          title: 'Review Answers'
        },
        {
          action: 'retake',
          title: 'Retake Exam'
        }
      ],
      data: {
        examType,
        score,
        passed,
        url: passed ? '/?action=dashboard' : `/?exam=${examType}&review=true`
      }
    });
  };

  const showSpacedRepetitionReminder = (questionData) => {
    if (permission !== 'granted') return;
    
    // Check user preferences
    const preferences = JSON.parse(localStorage.getItem('notification-preferences') || '{"spacedRepetition": true}');
    if (!preferences.spacedRepetition) return;

    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        data: {
          title: '🧠 Spaced Repetition Time!',
          body: `Review ${questionData.topics.join(', ')} questions to strengthen your memory.`,
          delay: questionData.nextReviewTime - Date.now(),
          tag: 'spaced-repetition',
          icon: '/icon-192x192.svg',
          badge: '/favicon-32x32.svg',
          actions: [
            {
              action: 'start-review',
              title: 'Start Review'
            },
            {
              action: 'snooze-30min',
              title: 'Remind me in 30 min'
            }
          ],
          data: {
            topics: questionData.topics,
            url: '/?action=spaced-repetition'
          }
        }
      });
    });
  };

  const sendDailyStreakNotification = (streakDays) => {
    if (permission !== 'granted') return;
    
    // Check user preferences
    const preferences = JSON.parse(localStorage.getItem('notification-preferences') || '{"streaks": true}');
    if (!preferences.streaks) return;

    const messages = [
      { days: 1, title: '🔥 First day complete!', body: 'Great start! Come back tomorrow to build your streak.' },
      { days: 3, title: '🔥 3-day streak!', body: 'You\'re building momentum! Keep up the great work.' },
      { days: 7, title: '🔥 One week streak!', body: 'Amazing dedication! You\'re developing a solid study habit.' },
      { days: 30, title: '🔥 30-day streak!', body: 'Incredible consistency! You\'re truly committed to success.' },
      { days: 100, title: '🔥 100-day streak!', body: 'Legendary dedication! You\'re a certification champion!' }
    ];

    const message = messages.find(m => m.days === streakDays) || {
      title: `🔥 ${streakDays}-day streak!`,
      body: 'Your dedication is paying off! Keep studying to maintain your streak.'
    };

    new Notification(message.title, {
      body: message.body,
      icon: '/icon-192x192.svg',
      badge: '/favicon-32x32.svg',
      tag: 'daily-streak',
      actions: [
        {
          action: 'continue-streak',
          title: 'Continue Studying'
        },
        {
          action: 'view-progress',
          title: 'View Progress'
        }
      ],
      data: {
        streakDays,
        url: '/?action=dashboard'
      }
    });
  };

  const addLocalNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    return newNotification;
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper function for VAPID key conversion
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Auto-scheduling based on study patterns
  useEffect(() => {
    if (permission === 'granted' && progressData) {
      const now = new Date();
      const studyHistory = progressData.sessionHistory || [];
      
      // Schedule study reminders based on user's typical study times
      const typicalStudyHour = getTypicalStudyHour(studyHistory);
      if (typicalStudyHour && shouldScheduleReminder(studyHistory)) {
        const nextReminderTime = getNextStudyTime(typicalStudyHour);
        scheduleStudyReminder('Daily Practice', nextReminderTime);
      }
      
      // Check for achievements to celebrate
      if (progressData.achievements) {
        const newAchievements = progressData.achievements.filter(a => 
          a.unlockedAt && 
          Date.now() - new Date(a.unlockedAt).getTime() < 5000 // Within last 5 seconds
        );
        
        newAchievements.forEach(achievement => {
          setTimeout(() => showAchievementNotification(achievement), 1000);
        });
      }
    }
  }, [progressData, permission]);

  const getTypicalStudyHour = (history) => {
    if (history.length < 3) return null;
    
    const hours = history.map(session => new Date(session.date).getHours());
    const hourCounts = {};
    
    hours.forEach(hour => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostCommonHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b
    );
    
    return parseInt(mostCommonHour);
  };

  const shouldScheduleReminder = (history) => {
    if (history.length === 0) return true;
    
    const lastStudy = new Date(history[history.length - 1].date);
    const hoursSinceLastStudy = (Date.now() - lastStudy.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastStudy >= 20; // Schedule if it's been 20+ hours
  };

  const getNextStudyTime = (preferredHour) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(preferredHour, 0, 0, 0);
    return tomorrow.getTime();
  };

  const contextValue = {
    permission,
    subscription,
    notifications,
    isSupported: 'Notification' in window && 'serviceWorker' in navigator,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    scheduleStudyReminder,
    showAchievementNotification,
    showPassScoreNotification,
    showSpacedRepetitionReminder,
    sendDailyStreakNotification,
    addLocalNotification,
    markNotificationAsRead,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {/* Mark provider ready for guarded navigations */}
      <ProviderReadyFlag />
      {children}
    </NotificationContext.Provider>
  );
};

// Small component to set global flag once provider renders.
function ProviderReadyFlag() {
  useEffect(() => {
    window.__NOTIFICATION_PROVIDER_READY__ = true;
    return () => { delete window.__NOTIFICATION_PROVIDER_READY__; };
  }, []);
  return null;
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export { NotificationContext };