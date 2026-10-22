import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import { RECORDED_SORT_OPTIONS } from '../../data/recorded'
import { DATE_FILTERS } from '../../utils/dateFilters'
import { chipSx } from './recordedHelpers'

/* Type chips (All / With Video / Transcripts Only) plus date and sort dropdowns. */
export default function RecordedFilters({ types, type, onTypeChange, counts, dateFilter, onDateChange, sortBy, onSortChange }) {
  return (
    <Box data-tour="recorded-filters" sx={{ p: 1.25, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
      {types.map((t, i) => (
        <Button key={t} aria-pressed={type === t} onClick={() => onTypeChange(t)} sx={chipSx(type === t)}>
          {t} ({counts[i]})
        </Button>
      ))}
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
        <TextField select size="small" label="Date" value={dateFilter} onChange={(e) => onDateChange(e.target.value)} sx={{ minWidth: 120 }}>
          {DATE_FILTERS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Sort" data-tour="recorded-sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)} sx={{ minWidth: 140 }}>
          {RECORDED_SORT_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </TextField>
      </Box>
    </Box>
  )
}