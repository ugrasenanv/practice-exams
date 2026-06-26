import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import Tooltip from './Tooltip.jsx'
import styles from './HelpSystem.module.css'

// Full HelpSystem restored in a simplified, performance-conscious form.

export const NavigationHelp = () => null // Placeholder for potential future use

export const ProgressHelp = React.memo(({ position = 'top' }) => {
	const content = useMemo(() => (
		<div style={{ maxWidth: '240px' }}>
			<p style={{ margin: '0 0 4px' }}><strong>Progress Grid</strong></p>
			<ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.75rem', lineHeight: 1.3 }}>
				<li>Click a number to jump</li>
				<li>Colors: 🔵 current | ✅ answered</li>
				<li>Bookmark questions to review later</li>
			</ul>
		</div>
	), [])

	const inlineButtonStyle = {
		background: 'transparent',
		border: '1px solid var(--border-color, #ccc)',
		borderRadius: '50%',
		width: '18px',
		height: '18px',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		color: 'var(--text-secondary, #666)',
		fontSize: '0.65rem',
		marginLeft: '4px'
	}

	return (
		<Tooltip content={content} position={position} trigger="hover">
			<button type="button" style={inlineButtonStyle} aria-label="Progress help">❓</button>
		</Tooltip>
	)
})

export const MultiSelectHelp = React.memo(({ position = 'right' }) => {
	const content = useMemo(() => (
		<div style={{ maxWidth: '260px' }}>
			<p style={{ margin: '0 0 4px' }}><strong>Multiple Choice</strong></p>
			<p style={{ margin: 0, fontSize: '0.7rem', lineHeight: 1.3 }}>
				Select exactly the number of answers indicated. The counter shows how many you've chosen. Too many selections turn the counter orange.
			</p>
		</div>
	), [])

	const iconStyle = {
		color: 'var(--text-secondary, #666)',
		fontSize: '0.70rem',
		marginLeft: '6px',
		cursor: 'help'
	}

	return (
		<Tooltip content={content} position={position} trigger="hover">
			<span style={iconStyle} aria-label="Multi-select help" role="img">❓</span>
		</Tooltip>
	)
})

const STORAGE_KEYS = {
	TOUR_SEEN: 'helpSystem.tour.seen.v1',
	DISMISSED: 'helpSystem.dismissed.v1'
}

const HelpSystem = ({ isEnabled = true, examContext = 'exam' }) => {
	const [isPanelOpen, setIsPanelOpen] = useState(false)
	const [showTour, setShowTour] = useState(false)
	const [dismissed, setDismissed] = useState(new Set())
	const [initialized, setInitialized] = useState(false)
	const initRef = useRef(false)

	// Load persisted state once
	useEffect(() => {
		if (initRef.current) return
		initRef.current = true
		try {
			const isE2E = typeof window !== 'undefined' && (window.__E2E__ || localStorage.getItem('e2e.suppressTour') === 'true')
			// Proactively mark tour seen for E2E before any potential render of overlay
			if (isE2E) {
				try { localStorage.setItem(STORAGE_KEYS.TOUR_SEEN, 'true') } catch(_) {}
			}
			const tourSeen = localStorage.getItem(STORAGE_KEYS.TOUR_SEEN) === 'true'
			const dismissedRaw = localStorage.getItem(STORAGE_KEYS.DISMISSED)
			if (!tourSeen && !isE2E) setShowTour(true)
			if (dismissedRaw) setDismissed(new Set(JSON.parse(dismissedRaw)))
		} catch (_) { /* ignore storage errors */ }
		setInitialized(true)
	}, [])

	const saveTourSeen = useCallback((persist) => {
		setShowTour(false)
		if (persist) {
			try { localStorage.setItem(STORAGE_KEYS.TOUR_SEEN, 'true') } catch (_) {}
		}
	}, [])

	const dismissSection = useCallback((id) => {
		setDismissed(prev => {
			const next = new Set(prev)
			next.add(id)
			try { localStorage.setItem(STORAGE_KEYS.DISMISSED, JSON.stringify([...next])) } catch (_) {}
			return next
		})
	}, [])

	// Define contextual help content (minimal yet useful)
	const helpSections = useMemo(() => {
		const base = {
			navigation: {
				id: 'navigation',
				title: 'Navigation',
				content: (
					<div className={styles.sectionBody}>
						<p>Use the grid or Previous/Next buttons to move between questions. Bookmarks help you revisit items before submitting.</p>
					</div>
				)
			},
			progress: {
				id: 'progress',
				title: 'Progress Tracking',
				content: (
					<div className={styles.sectionBody}>
						<ul>
							<li><strong>Blue</strong>: current question</li>
							<li><strong>Green</strong>: answered</li>
							<li><strong>Gray</strong>: unanswered</li>
						</ul>
					</div>
				)
			},
			questionTypes: {
				id: 'questionTypes',
				title: 'Question Types',
				content: (
					<div className={styles.sectionBody}>
						<p>Single choice: select one. Multiple choice: select exactly the required number shown above the answers.</p>
					</div>
				)
			}
		}
		if (examContext === 'exam') return base
		return base // can tailor per context later
	}, [examContext])

	const visibleSections = useMemo(() => Object.values(helpSections).filter(s => !dismissed.has(s.id)), [helpSections, dismissed])

	const Panel = () => (
		<div className={styles.panel} role="dialog" aria-label="Help panel" data-testid="help-panel">
			<div className={styles.panelHeader}>
				<h3 className={styles.panelTitle}>Help</h3>
				<button className={styles.closeButton} onClick={() => setIsPanelOpen(false)} aria-label="Close help">×</button>
			</div>
			<div className={styles.panelContent}>
				{visibleSections.length === 0 && (
					<p className={styles.emptyState}>All help sections dismissed.</p>
				)}
				{visibleSections.map(section => (
					<div key={section.id} className={styles.section}>
						<div className={styles.sectionHeader}>
							<h4>{section.title}</h4>
							<button onClick={() => dismissSection(section.id)} className={styles.dismissBtn} aria-label={`Dismiss ${section.title}`}>Hide</button>
						</div>
						{section.content}
					</div>
				))}
			</div>
			<div className={styles.panelFooter}>
				<p className={styles.footerNote}>Tips are contextual and can be rediscovered by resetting storage.</p>
			</div>
		</div>
	)

	const Tour = () => {
		if (!showTour) return null
		return (
			<div className={styles.tourOverlay} role="dialog" aria-label="Help tour" data-testid="help-tour-overlay">
				<div className={styles.tourModal} data-testid="help-tour-modal">
					<div className={styles.tourHeader}>
						<h3>Quick Help Tour</h3>
						<button className={styles.closeButton} data-testid="help-tour-close" onClick={() => saveTourSeen(false)} aria-label="Close tour">×</button>
					</div>
					<div className={styles.tourBody}>
						<p>We provide lightweight help for navigation, progress, and question types. Open the Help panel anytime.</p>
						<ul className={styles.tourList}>
							{visibleSections.map(s => <li key={s.id}>{s.title}</li>)}
						</ul>
					</div>
					<div className={styles.tourActions}>
						<button data-testid="help-tour-dismiss" onClick={() => saveTourSeen(false)} className={styles.secondaryBtn}>Dismiss</button>
						<button data-testid="help-tour-open-panel" onClick={() => { saveTourSeen(true); setIsPanelOpen(true) }} className={styles.primaryBtn}>Open Help</button>
					</div>
				</div>
			</div>
		)
	}

	if (!isEnabled || !initialized) return null

	return (
		<>
			<button
				type="button"
				className={styles.fab}
				data-testid="help-fab"
				aria-haspopup="dialog"
				aria-expanded={isPanelOpen}
				onClick={() => setIsPanelOpen(v => !v)}
			>
				❓
			</button>
			{isPanelOpen && (
				<div data-testid="help-panel-wrapper" aria-hidden={!isPanelOpen}>
					<div data-visible={isPanelOpen}>
						<Panel />
					</div>
				</div>
			)}
			{/* Suppress Tour entirely in E2E or when localStorage e2e.suppressTour flag set */}
			{typeof window !== 'undefined' && (window.__E2E__ || localStorage.getItem('e2e.suppressTour') === 'true') ? null : <Tour />}
		</>
	)
}

export default React.memo(HelpSystem)