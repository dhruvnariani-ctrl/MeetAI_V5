import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import { TASK_SORT_OPTIONS } from '../../data/tasks'
import { cardSx,chipSx } from '../ui'
import { STATUS_FILTERS } from './taskConstants'

const PRIORITIES = ['All', 'High', 'Medium', 'Low']
const LABEL = { Done: 'Completed' }

/* Status chips (Open, All, Pending, In Process, Blocked, Completed) with counts, plus priority and sort. */
export default function TaskToolbar({ filter, onFilterChange, counts, priority, onPriorityChange, sortBy, onSortChange }) {
  return (
    <Box sx={{ ...cardSx, p: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }} role="group" aria-label="Task status" data-tour="tasks-filters">
        {STATUS_FILTERS.map((f) => (
          <Button key={f} aria-pressed={filter === f} onClick={() => onFilterChange(f)} sx={chipSx(filter === f)}>
            {LABEL[f] ?? f} ({counts[f] ?? 0})
          </Button>
        ))}
      </Box>
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField select size="small" label="Priority" value={priority} onChange={(e) => onPriorityChange(e.target.value)} sx={{ minWidth: 130 }}>
          {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Sort" data-tour="tasks-sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)} sx={{ minWidth: 130 }}>
          {TASK_SORT_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </TextField>
      </Box>
    </Box>
  )
}