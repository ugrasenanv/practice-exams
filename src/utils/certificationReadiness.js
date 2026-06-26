export function buildReadinessSummary({ sessions = [], focusAreas = [] }) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      score: 0,
      label: 'Building momentum',
      nextStep: 'Complete a timed practice session to start building certification readiness.',
      focusAreas: focusAreas.slice(0, 3)
    }
  }

  const averageScore = Math.round(
    sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length
  )

  const label = averageScore >= 80
    ? 'Certification-ready'
    : averageScore >= 70
      ? 'Strong progress'
      : 'Building momentum'

  const nextStep = averageScore >= 80
    ? `focus on ${focusAreas[0] || 'your weakest area'} and keep your streak going before exam day.`
    : averageScore >= 70
      ? `focus on ${focusAreas[0] || 'your weakest area'} and complete another timed practice session.`
      : 'Complete a timed practice session to sharpen your exam readiness.'

  return {
    score: averageScore,
    label,
    nextStep,
    focusAreas: focusAreas.slice(0, 3)
  }
}
