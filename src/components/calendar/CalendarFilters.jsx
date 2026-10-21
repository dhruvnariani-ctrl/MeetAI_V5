import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { C } from '../ui'

export function chipSx(active, accent = C.navy) {
  return {
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    border: `1px solid ${active ? accent : C.line}`,
    bgcolor: active ? accent : '#fff',
    color: active ? '#fff' : C.ink,
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    minHeight: 0,
    '&:hover': { bgcolor: active ? accent : C.soft },
  }
}

/* Quick filter row: platform chips, MeetAI joined, hosted by me, and reset. */
export default function CalendarFilters({ filters, setFilters, platforms, inPeriod, joined, activeFilterCount, onClear }) {
  const togglePlatform = (p) =>
    setFilters((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      <Typography sx={{ fontWeight: 700, color: C.navy, mr: 0.5 }}>Quick Filter:</Typography>
      <Button aria-pressed={filters.platforms.length === 0} onClick={() => setFilters((f) => ({ ...f, platforms: [] }))} sx={chipSx(filters.platforms.length === 0)}>
        All Platforms ({inPeriod.length})
      </Button>
      {platforms.map((p) => (
        <Button key={p} aria-pressed={filters.platforms.includes(p)} onClick={() => togglePlatform(p)} sx={chipSx(filters.platforms.includes(p))}>
          {p} ({inPeriod.filter((m) => m.platform === p).length})
        </Button>
      ))}
      <Button aria-pressed={filters.meetAIOnly} onClick={() => setFilters((f) => ({ ...f, meetAIOnly: !f.meetAIOnly }))} sx={chipSx(filters.meetAIOnly, C.green)}>
        MeetAI Joined ({joined})
      </Button>
      <Button aria-pressed={filters.hostedByMe} onClick={() => setFilters((f) => ({ ...f, hostedByMe: !f.hostedByMe }))} sx={chipSx(filters.hostedByMe)}>
        Hosted by me
      </Button>
      {activeFilterCount > 0 && (
        <Button onClick={onClear} sx={{ ml: 'auto', textDecoration: 'underline', color: C.ink }}>Reset All Filters</Button>
      )}
    </Box>
  )
}