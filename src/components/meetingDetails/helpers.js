import { getMeetingSettings } from '../../data/meetingSettings'
import { formatDate, formatTime } from '../../utils/time'

/* Design tokens from the Executive Enterprise Horizon system. */
export const T = {
  primary: '#1b2c52',
  primaryHover: '#253a6b',
  green: '#16a34a',
  greenBright: '#22c55e',
  blue: '#3b82f6',
  amber: '#d97706',
  red: '#dc2626',
  ink: '#0f172a',
  muted: '#64748b',
  line: '#e2e8f0',
  line2: '#cbd5e1',
  canvas: '#f8fafc',
  card: '#ffffff',
  tint: '#f1f5f9',
  shadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
  serif: "'Newsreader', Georgia, 'Times New Roman', serif",
  sans: "'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif",
}

export const TONES = {
  green: { bg: '#dcfce7', color: '#166534' },
  blue: { bg: '#dbeafe', color: '#1e40af' },
  red: { bg: '#fee2e2', color: '#991b1b' },
  amber: { bg: '#fef3c7', color: '#92400e' },
  slate: { bg: '#e2e8f0', color: '#334155' },
  navy: { bg: T.primary, color: '#ffffff' },
}

/* MeetAI settings: a saved calendar toggle wins, otherwise the meeting's own setting applies. */
export function getMeetingFlags(meeting) {
  const saved = getMeetingSettings()?.[meeting.id]
  return {
    meetAIInvited: saved?.autoJoin !== undefined ? saved.autoJoin === true : meeting?.meetAI?.invited === true,
    recordVideo: saved?.recordVideo !== undefined ? saved.recordVideo === true : meeting?.meetAI?.recordVideo === true,
  }
}

/* Transcript text is "12:01 PM — What was said" blocks separated by blank lines. Blocks without a time are kept as plain text. */
export function parseTranscript(text = '') {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const match = block.match(/^(\d{1,2}:\d{2}\s*[AP]M)\s*[—-]\s*([\s\S]*)$/)
      return match ? { id: index, time: match[1], text: match[2] } : { id: index, time: '', text: block }
    })
}

export function formatClock(value) {
  if (!value) return '—'
  return formatTime(value instanceof Date ? value : new Date(value))
}

/* "Due in 45m", "Due in 3h", "Overdue · 10:30 AM" or the date. */
export function dueLabel(value) {
  if (!value) return 'No due time'
  const due = value instanceof Date ? value : new Date(value)
  const minutes = Math.round((due - new Date()) / 60000)
  if (minutes < 0) return `Overdue · ${formatTime(due)}`
  if (minutes < 60) return `Due in ${minutes}m`
  if (minutes < 1440) return `Due in ${Math.round(minutes / 60)}h`
  return `Due ${formatDate(due)}`
}

export function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function copyText(text) {
  if (!text) return
  navigator.clipboard?.writeText(text).catch(() => {})
}

export function downloadFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function toCsv(rows) {
  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
}