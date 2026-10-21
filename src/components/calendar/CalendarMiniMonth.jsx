import { useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import { C, SERIF, cardSx } from '../ui'
import { dateKey, endOfWeek, startOfWeek } from '../../utils/calenderDates'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const sameDay = (a, b) => Boolean(a && b && dateKey(a) === dateKey(b))

/* Month calendar: shown in the right panel when no meeting is selected, and above the list on small screens.
   The selected day is solid; the rest of the selected week (week view) or month (month view) is lightly shaded.
   Days with meetings get a dot. */
export default function CalendarMiniMonth({ selectedDate, meetings, onSelect, view = 'day' }) {
  const [month, setMonth] = useState(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  const year = month.getFullYear()
  const m = month.getMonth()
  const offset = new Date(year, m, 1).getDay()
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, m, i + 1)),
  ]
  const today = new Date()
  const busy = new Set(meetings.map((x) => x.date))

  const inPeriod = (d) => {
    if (view === 'week') return d >= startOfWeek(selectedDate) && d <= endOfWeek(selectedDate)
    if (view === 'month') return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()
    return false
  }

  return (
    <Box sx={{ ...cardSx, p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton size="small" aria-label="Previous month" onClick={() => setMonth(new Date(year, m - 1, 1))}>
          <ChevronLeftRoundedIcon />
        </IconButton>
        <Typography sx={{ fontFamily: SERIF, fontSize: '1.125rem', fontWeight: 600, color: C.navy }}>
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton size="small" aria-label="Next month" onClick={() => setMonth(new Date(year, m + 1, 1))}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 0.5 }}>
        {WEEKDAYS.map((d) => (
          <Typography key={d} sx={{ textAlign: 'center', fontSize: '0.6875rem', fontWeight: 700, color: C.muted }}>{d}</Typography>
        ))}

        {cells.map((d, i) => {
          if (!d) return <Box key={`blank-${i}`} />
          const selected = sameDay(d, selectedDate)
          const isToday = sameDay(d, today)
          const shaded = !selected && inPeriod(d)
          return (
            <ButtonBase
              key={dateKey(d)}
              aria-label={d.toDateString()}
              aria-pressed={selected}
              onClick={() => onSelect(d)}
              sx={{
                position: 'relative',
                height: 36,
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: selected ? '#fff' : C.navy,
                bgcolor: selected ? C.blue : shaded ? C.paleBlue : 'transparent',
                border: `1px solid ${isToday && !selected ? C.blue : 'transparent'}`,
                '&:hover': { bgcolor: selected ? C.blue : C.soft },
                '&:focus-visible': { outline: `2px solid ${C.blue}`, outlineOffset: 2 },
              }}
            >
              {d.getDate()}
              {busy.has(dateKey(d)) && (
                <Box sx={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', bgcolor: selected ? '#fff' : C.green }} />
              )}
            </ButtonBase>
          )
        })}
      </Box>
    </Box>
  )
}