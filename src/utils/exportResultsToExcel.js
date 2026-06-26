// Utility to export current attempt + history + optional timing & raw storage into an XLSX workbook
// Uses dynamic import of xlsx to avoid bloating initial bundle

function safeTruncate(text, max = 200) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

function percent(value, total) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

function collectHistory() {
  try {
    const sessionsRaw = JSON.parse(localStorage.getItem('progress.sessions') || '[]')
    return Array.isArray(sessionsRaw) ? sessionsRaw : []
  } catch { return [] }
}

function collectTimingEntries() {
  const entries = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('examTiming_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key))
        entries.push(data)
      } catch {}
    }
  }
  return entries
}

function collectRawStorage(filterFn) {
  const rows = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key.startsWith('e2e.')) continue // skip automation
    if (filterFn && !filterFn(key)) continue
    let value = localStorage.getItem(key)
    if (value && value.length > 5000) {
      value = value.slice(0, 5000) + '…(truncated)'
    }
    rows.push({ key, value })
  }
  return rows
}

export async function exportResultsToExcel({ attempt, questions, selectedAnswers, timingData, includeRaw = false }) {
  const mod = await import('xlsx') // dynamic import
  const XLSX = mod.default || mod

  const wb = XLSX.utils.book_new()

  // Overview sheet (current attempt summary)
  if (attempt) {
    const overviewRows = [
      { Metric: 'Exam Title', Value: attempt.title || 'Practice Exam' },
      { Metric: 'Date', Value: new Date().toLocaleString() },
      { Metric: 'Score %', Value: attempt.score },
      { Metric: 'Passed', Value: attempt.passed ? 'YES' : 'NO' },
      { Metric: 'Correct (weighted)', Value: attempt.correct },
      { Metric: 'Incorrect (weighted)', Value: attempt.incorrect },
      { Metric: 'Total Questions', Value: attempt.total },
      { Metric: 'Time Used (sec)', Value: attempt.timeUsed },
      { Metric: 'Time Used (HH:MM:SS)', Value: attempt.timeUsedFormatted },
    ]
    const wsOverview = XLSX.utils.json_to_sheet(overviewRows)
    XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview')
  }

  // Domain performance sheet
  if (attempt && attempt.domainResults) {
    const domainRows = Object.entries(attempt.domainResults).map(([domain, d]) => ({
      Domain: domain,
      CorrectWeighted: Math.round(d.correct * 100) / 100,
      Total: d.total,
      Percent: percent(d.correct, d.total) + '%'
    }))
    const wsDomain = XLSX.utils.json_to_sheet(domainRows)
    XLSX.utils.book_append_sheet(wb, wsDomain, 'Domains')
  }

  // Question detail sheet
  if (questions && attempt && attempt.perQuestion) {
    const detailRows = attempt.perQuestion.map((qres, idx) => {
      const q = qres.question
      return {
        Index: idx + 1,
        Question: safeTruncate(q.question, 300),
        Type: q.questionType === 'multiple' ? 'Multi' : 'Single',
        Domain: q.domain || 'General',
        Difficulty: q.difficulty || '',
        YourAnswer: qres.selectedAnswer,
        CorrectAnswer: qres.correctAnswer,
        PartialCredit: Math.round(qres.questionScore * 100) + '%',
        FullCredit: qres.isCorrect ? 'Yes' : (qres.questionScore > 0 ? 'Partial' : 'No')
      }
    })
    const wsQuestions = XLSX.utils.json_to_sheet(detailRows)
    XLSX.utils.book_append_sheet(wb, wsQuestions, 'Questions')
  }

  // Timing sheet (aggregate latest timing entry or provided timingData)
  const timingEntries = timingData ? [timingData] : collectTimingEntries()
  if (timingEntries.length) {
    // Use most recent (last) for per-question if structure matches
    const latest = timingEntries.sort((a,b) => (a.date||'').localeCompare(b.date||''))[timingEntries.length-1]
    const rows = []
    if (latest && latest.questionTimings) {
      Object.entries(latest.questionTimings).forEach(([qid, ms]) => {
        const secs = Math.round(ms / 1000)
        rows.push({ QuestionId: qid, Seconds: secs })
      })
    }
    if (!rows.length) rows.push({ Info: 'No per-question timing captured' })
    const wsTiming = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, wsTiming, 'Timing')
  }

  // History sheet (all sessions stored)
  const history = collectHistory()
  if (history.length) {
    const historyRows = history.map(h => ({
      Date: h.date,
      Exam: h.examType,
      Score: h.score,
      CorrectWeighted: h.correctAnswers,
      Total: h.totalQuestions,
      TimeUsedSec: h.timeUsed,
      Passed: h.score >= 77 ? 'YES' : 'NO'
    }))
    const wsHistory = XLSX.utils.json_to_sheet(historyRows)
    XLSX.utils.book_append_sheet(wb, wsHistory, 'History')
  } else {
    const wsHistoryEmpty = XLSX.utils.json_to_sheet([
      { Info: 'No prior exam history found. Take an exam to populate this sheet.' }
    ])
    XLSX.utils.book_append_sheet(wb, wsHistoryEmpty, 'History')
  }

  // Raw storage (optional)
  if (includeRaw) {
    const rawRows = collectRawStorage()
    const wsRaw = XLSX.utils.json_to_sheet(rawRows)
    XLSX.utils.book_append_sheet(wb, wsRaw, 'RawStorage')
  }

  // File name
  const timestamp = new Date().toISOString().replace(/[:]/g,'-').replace(/\..+/,'')
  const filename = `exam-results-${timestamp}.xlsx`
  try {
    XLSX.writeFile(wb, filename)
    try { localStorage.setItem('excel.export.lastStatus', JSON.stringify({ t: Date.now(), file: filename })) } catch(_) {}
  } catch (err) {
    try { localStorage.setItem('excel.export.lastError', JSON.stringify({ t: Date.now(), msg: err.message })) } catch(_) {}
    throw err
  }
}
