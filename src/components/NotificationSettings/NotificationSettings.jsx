import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import styles from './NotificationSettings.module.css';

const NotificationSettings = ({ onGoHome }) => {
  const {
    permission,
    subscription,
    notifications,
    isSupported,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    markNotificationAsRead,
    clearAllNotifications
  } = useNotifications();

  // Local state for notification preferences
  const [preferences, setPreferences] = useState({
    studyReminders: true,
    achievements: true,
    spacedRepetition: true,
    streaks: true,
    examResults: true
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notification-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Save preferences to localStorage when changed
  const updatePreference = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('notification-preferences', JSON.stringify(newPreferences));
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      await subscribeToPush();
    }
  };

  const handleDisableNotifications = async () => {
    try {
      await unsubscribeFromPush();
      // Also reset permission state if possible (browser limitation)
      if ('Notification' in window && Notification.permission === 'granted') {
        // Note: There's no direct way to revoke permission programmatically
        // Users need to do this manually in browser settings
        alert('To fully disable notifications, please:\n1. Click the 🔒 icon in your address bar\n2. Set notifications to "Block"\n3. Refresh this page');
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <div className={styles.unsupported}>
          <h3>Notifications Not Supported</h3>
          <p>Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Safari.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button 
            className={styles.backButton}
            onClick={onGoHome}
          >
            ← Back to Home
          </button>
        </div>
        <h2>Notification Settings</h2>
        <p>Stay motivated with smart study reminders and achievement alerts</p>
      </div>

      <div className={styles.settingsGrid}>
        {/* Permission Status */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <h3>Permission Status</h3>
            <div className={`${styles.status} ${styles[permission]}`}>
              {permission === 'granted' && '✅ Enabled'}
              {permission === 'denied' && '❌ Denied'}
              {permission === 'default' && '⚪ Not Set'}
            </div>
          </div>
          
          {permission === 'default' && (
            <div className={styles.cardContent}>
              <p>Enable notifications to receive study reminders and achievement alerts.</p>
              <button 
                className={styles.primaryButton}
                onClick={handleEnableNotifications}
              >
                Enable Notifications
              </button>
            </div>
          )}
          
          {permission === 'granted' && (
            <div className={styles.cardContent}>
              <p>✅ You'll receive helpful study reminders and achievement notifications.</p>
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => {
                    new Notification('SAFe Practice Exams', {
                      body: 'Test notification! Your notifications are working perfectly. 🎉',
                      icon: '/icon-192x192.svg',
                      badge: '/favicon-32x32.svg'
                    });
                  }}
                >
                  Test Notification
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={handleDisableNotifications}
                >
                  Disable Notifications
                </button>
              </div>
            </div>
          )}
          
          {permission === 'denied' && (
            <div className={styles.cardContent}>
              <p>Notifications are blocked. To enable them:</p>
              <ol>
                <li>Click the 🔒 lock icon in your browser's address bar</li>
                <li>Select "Allow" for notifications</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </div>

        {/* Notification Types */}
        {permission === 'granted' && (
          <div className={styles.settingCard}>
            <div className={styles.cardHeader}>
              <h3>Notification Types</h3>
              <p>Customize what notifications you want to receive</p>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.notificationType}>
                <div className={styles.typeInfo}>
                  <h4>📚 Study Reminders</h4>
                  <p>Daily reminders based on your study patterns</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={preferences.studyReminders}
                    onChange={(e) => updatePreference('studyReminders', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              
              <div className={styles.notificationType}>
                <div className={styles.typeInfo}>
                  <h4>🏆 Achievement Alerts</h4>
                  <p>Celebrate your milestones and accomplishments</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={preferences.achievements}
                    onChange={(e) => updatePreference('achievements', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              
              <div className={styles.notificationType}>
                <div className={styles.typeInfo}>
                  <h4>🧠 Spaced Repetition</h4>
                  <p>Optimal timing for reviewing difficult questions</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={preferences.spacedRepetition}
                    onChange={(e) => updatePreference('spacedRepetition', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              
              <div className={styles.notificationType}>
                <div className={styles.typeInfo}>
                  <h4>🔥 Streak Celebrations</h4>
                  <p>Maintain your daily study momentum</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={preferences.streaks}
                    onChange={(e) => updatePreference('streaks', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              
              <div className={styles.notificationType}>
                <div className={styles.typeInfo}>
                  <h4>📊 Exam Results</h4>
                  <p>Instant feedback on your practice exam performance</p>
                </div>
                <label className={styles.toggle}>
                  <input 
                    type="checkbox" 
                    checked={preferences.examResults}
                    onChange={(e) => updatePreference('examResults', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className={styles.settingCard}>
            <div className={styles.cardHeader}>
              <h3>Recent Notifications</h3>
              <div className={styles.headerActions}>
                {unreadCount > 0 && (
                  <span className={styles.badge}>{unreadCount} new</span>
                )}
                <button 
                  className={styles.textButton}
                  onClick={clearAllNotifications}
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.notificationsList}>
                {notifications.slice(0, 5).map(notification => (
                  <div 
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className={styles.notificationContent}>
                      <h4>{notification.title}</h4>
                      <p>{notification.body}</p>
                      <span className={styles.timestamp}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>
                ))}
              </div>
              
              {notifications.length > 5 && (
                <button className={styles.textButton}>
                  View all {notifications.length} notifications
                </button>
              )}
            </div>
          </div>
        )}

        {/* Browser Support Info */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <h3>Browser Features</h3>
            <p>Check your browser's PWA capabilities</p>
          </div>
          
          <div className={styles.cardContent}>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <span className={styles.featureLabel}>Service Worker:</span>
                <span className={`${styles.featureStatus} ${styles[('serviceWorker' in navigator) ? 'supported' : 'unsupported']}`}>
                  {'serviceWorker' in navigator ? '✅ Supported' : '❌ Not Supported'}
                </span>
              </div>
              
              <div className={styles.featureItem}>
                <span className={styles.featureLabel}>Push Notifications:</span>
                <span className={`${styles.featureStatus} ${styles[('PushManager' in window) ? 'supported' : 'unsupported']}`}>
                  {'PushManager' in window ? '✅ Supported' : '❌ Not Supported'}
                </span>
              </div>
              
              <div className={styles.featureItem}>
                <span className={styles.featureLabel}>Background Sync:</span>
                <span className={`${styles.featureStatus} ${styles[('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) ? 'supported' : 'unsupported']}`}>
                  {('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) ? '✅ Supported' : '❌ Not Supported'}
                </span>
              </div>
              
              <div className={styles.featureItem}>
                <span className={styles.featureLabel}>Install Prompt:</span>
                <span className={`${styles.featureStatus} ${styles.supported}`}>
                  ✅ Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <h3>Troubleshooting</h3>
            <p>Common notification issues and solutions</p>
          </div>
          
          <div className={styles.cardContent}>
            <div className={styles.troubleshootingList}>
              <details className={styles.troubleshootingItem}>
                <summary>Notifications aren't working</summary>
                <div className={styles.troubleshootingContent}>
                  <p>Try these steps:</p>
                  <ol>
                    <li>Check that notifications are enabled in your browser settings</li>
                    <li>Ensure this site isn't blocked in your notification settings</li>
                    <li>Try refreshing the page or restarting your browser</li>
                    <li>Make sure you're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
                  </ol>
                </div>
              </details>
              
              <details className={styles.troubleshootingItem}>
                <summary>Too many or too few notifications</summary>
                <div className={styles.troubleshootingContent}>
                  <p>You can customize notification frequency:</p>
                  <ul>
                    <li>Use the toggles above to enable/disable specific types</li>
                    <li>Study reminders adapt to your schedule automatically</li>
                    <li>Achievement notifications only appear for new accomplishments</li>
                  </ul>
                </div>
              </details>
              
              <details className={styles.troubleshootingItem}>
                <summary>Notifications on mobile devices</summary>
                <div className={styles.troubleshootingContent}>
                  <p>For the best mobile experience:</p>
                  <ul>
                    <li>Install this app to your home screen for native-like notifications</li>
                    <li>Enable notifications when prompted during installation</li>
                    <li>Check your device's notification settings for this app</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;