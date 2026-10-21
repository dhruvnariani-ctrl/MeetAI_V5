import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import { C, cardSx, lightBtn } from '../ui'
import { chipSx } from './CalendarFilters'
import { endOfWeek, startOfWeek } from '../../utils/calenderDates'

const VIEWS = [['day', 'Day View'], ['week', 'Week'], ['month', 'Month']]
const DAY_MS = 86400000

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/* How many periods the selected date is from today: 0 = current, -1 = previous, 1 = next. */
function offsetFor(view, selected, today) {
  if (view === 'week') return Math.round((startOfWeek(selected) - startOfWeek(today)) / (7 * DAY_MS))
  if (view === 'month') {
    return (selected.getFullYear() * 12 + selected.getMonth()) - (today.getFullYear() * 12 + today.getMonth())
  }
  return Math.round((startOfDay(selected) - startOfDay(today)) / DAY_MS)
}

const NAMES = {
  day: { 0: 'Today', '-1': 'Yesterday', 1: 'Tomorrow' },
  week: { 0: 'This Week', '-1': 'Previous Week', 1: 'Next Week' },
  month: { 0: 'This Month', '-1': 'Previous Month', 1: 'Next Month' },
}

/* Label for the middle button: the relative name when it is near today, otherwise the date, week range or month. */
function periodLabel(view, selected, today) {
  const offset = offsetFor(view, selected, today)
  if (NAMES[view][offset]) return NAMES[view][offset]

  if (view === 'week') {
    const start = startOfWeek(selected).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const end = endOfWeek(selected).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${start} – ${end}`
  }
  if (view === 'month') return selected.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return selected.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

const UNIT = { day: 'day', week: 'week', month: 'month' }

/* ‹ [Today / Yesterday / date] › : each chevron moves one period and the middle label says where you are.
   Then the period title, a separate Go to Today button, and the Day / Week / Month switch. */
export default function CalendarToolbar({ title, count, view, selectedDate, onViewChange, onPrevious, onNext, onToday }) {
  const label = periodLabel(view, selectedDate, new Date())
  const unit = UNIT[view] ?? 'day'

  return (
    <Box sx={{ ...cardSx, px: 1.5, py: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: C.soft, borderRadius: '10px', p: 0.25 }}>
        <IconButton size="small" aria-label={`Previous ${unit}`} onClick={onPrevious}>
          <ChevronLeftRoundedIcon />
        </IconButton>
        <Button
          onClick={onToday}
          aria-label={`${label}. Go to the current ${unit}`}
          sx={{ bgcolor: '#fff', color: C.navy, fontWeight: 700, minWidth: 150, px: 1.5, py: 0.5, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#fff' } }}
        >
          {label}
        </Button>
        <IconButton size="small" aria-label={`Next ${unit}`} onClick={onNext}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>

      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: C.navy }}>
        {title}{' '}
        <Box component="span" sx={{ fontWeight: 400, color: C.blue }}>({count} Meetings Scheduled)</Box>
      </Typography>

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button onClick={onToday} sx={{ ...lightBtn, bgcolor: C.paleBlue, color: C.blue, border: 0, px: 1.5, py: 0.6, whiteSpace: 'nowrap' }}>
          Go to Today
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} role="group" aria-label="Calendar view">
          {VIEWS.map(([value, text]) => (
            <Button key={value} aria-pressed={view === value} onClick={() => onViewChange(value)} sx={{ ...chipSx(view === value), borderRadius: '10px', px: 2 }}>
              {text}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  )
}