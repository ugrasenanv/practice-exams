import { useState } from 'react'
import styles from './HamburgerMenu.module.css'

const HamburgerMenu = ({ 
  isOpen, 
  onToggle, 
  navigationItems, 
  currentPage,
  onNavigate,
  onClose 
}) => {
  return (
    <div className={styles.hamburgerContainer}>
      {/* Hamburger Button */}
      <button 
        className={`${styles.hamburgerButton} ${isOpen ? styles.open : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        data-testid="nav-hamburger-toggle"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className={styles.menuOverlay} onClick={onClose}>
          <nav 
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Header */}
            <div className={styles.menuHeader}>
              <div className={styles.menuBrand}>
                <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" style={{height: '40px', width: 'auto'}} />
                <span className={styles.menuTagline}>Practice Exams</span>
              </div>
              <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Navigation Sections */}
            <div className={styles.menuContent}>
              {/* Primary Navigation */}
              <section className={styles.menuSection}>
                <h3 className={styles.sectionTitle}>Main</h3>
                <div className={styles.menuItems}>
                  {navigationItems.primary.map((item) => (
                    <button
                      key={item.key}
                      className={`${styles.menuItem} ${currentPage === item.key ? styles.active : ''}`}
                      onClick={() => {
                        onNavigate(item.action)
                        onClose()
                      }}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.menuBadge}>{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Secondary Navigation */}
              <section className={styles.menuSection}>
                <h3 className={styles.sectionTitle}>Study Tools</h3>
                <div className={styles.menuItems}>
                  {navigationItems.secondary.map((item) => (
                    <button
                      key={item.key}
                      className={`${styles.menuItem} ${currentPage === item.key ? styles.active : ''}`}
                      onClick={() => {
                        onNavigate(item.action)
                        onClose()
                      }}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.menuBadge}>{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Utility Navigation */}
              <section className={styles.menuSection}>
                <h3 className={styles.sectionTitle}>Settings</h3>
                <div className={styles.menuItems}>
                  {navigationItems.utility.map((item) => (
                    <button
                      key={item.key}
                      className={`${styles.menuItem} ${currentPage === item.key ? styles.active : ''}`}
                      onClick={() => {
                        onNavigate(item.action)
                        onClose()
                      }}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.menuBadge}>{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className={styles.menuFooter}>
              <p className={styles.footerText}>
                © 2025 AI Cert Studio
              </p>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu