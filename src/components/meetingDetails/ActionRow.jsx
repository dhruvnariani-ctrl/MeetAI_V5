import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import { updateMeetingActionItemStatus } from '../../data/meetings'
import { T, initialsOf, dueLabel } from './helpers'
import { Badge } from './ui'

const PRIORITY = {
  High: 'red',
  Medium: 'amber',
  Low: 'slate',
}

const STATUS = {
  Pending: 'blue',
  'In Process': 'amber',
  Blocked: 'red',
  Done: 'green',
}

/* One action item. Compact rows are used on the overview; full rows (with Mark Complete / Reopen) on the action items tab. */
export default function ActionRow({ meeting, item, onChanged, onAskDone, full = false }) {
  const done = item.status === 'Done'

  // Completing asks for confirmation first (handled by the page). Reopening is applied straight away.
  const toggle = () => {
    if (done) {
      updateMeetingActionItemStatus(meeting.id, item.id, 'Pending')
      onChanged?.()
    } else {
      onAskDone?.(item)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        py: full ? 1.5 : 1.25,
        px: full ? 1.5 : 0,
        borderTop: full ? 'none' : `1px solid ${T.line}`,
        border: full ? `1px solid ${T.line}` : undefined,
        borderRadius: full ? '12px' : 0,
        bgcolor: full && done ? T.canvas : 'transparent',
        mb: full ? 1.25 : 0,
      }}
    >
      <Checkbox
        checked={done}
        onChange={toggle}
        slotProps={{ input: { 'aria-label': `Mark "${item.title}" as ${done ? 'pending' : 'done'}` } }}
        sx={{ p: 0.5, mt: 0.25, color: T.line2, '&.Mui-checked': { color: T.green } }}
      />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
          <Badge tone={PRIORITY[item.priority] ?? 'slate'}>{item.priority} Priority</Badge>
          <Badge tone={STATUS[item.status] ?? 'slate'}>{item.status}</Badge>
        </Box>
        <Typography sx={{ mt: 0.5, fontFamily: T.sans, fontSize: '0.9375rem', fontWeight: 600, color: done ? T.muted : T.ink, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.35 }}>
          {item.title}
        </Typography>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          {full && (
            <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: T.tint, display: 'grid', placeItems: 'center', fontSize: '0.6875rem', fontWeight: 700, color: T.primary }}>
              {initialsOf(item.owner)}
            </Box>
          )}
          <Typography sx={{ fontSize: '0.8125rem', color: T.muted }}>
            {item.owner} · {dueLabel(item.due)}
          </Typography>
        </Box>
      </Box>

      {full && (
        <Button
          onClick={toggle}
          sx={{ flexShrink: 0, textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: done ? T.muted : T.green, minWidth: 0 }}
        >
          {done ? 'Reopen Task' : 'Mark Complete'}
        </Button>
      )}
    </Box>
  )
}