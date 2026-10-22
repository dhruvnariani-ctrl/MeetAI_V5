import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import { C, Pill, cardSx, lightBtn } from '../ui'
import { PRIORITY, formatTime,isOpenTask } from './dashboardUtils'

const STATUS_STYLE = {
  pending: { label: 'Pending', color: C.blue, bg: C.paleBlue },
  'in process': { label: 'In Process', color: C.amber, bg: '#FFF3E1' },
  blocked: { label: 'Blocked', color: C.red, bg: C.paleRed },
}

function ActionItem({ task, onToggle }) {
  const priority = PRIORITY[task.priority] ?? PRIORITY.medium
  const status = STATUS_STYLE[task.status] ?? STATUS_STYLE.pending

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, p: 1, borderRadius: '12px', border: `1px solid ${C.line}`, bgcolor: '#fff' }}>
      <Checkbox
        checked={false}
        onChange={() => onToggle(task)}
        slotProps={{ input: { 'aria-label': `Mark "${task.title}" as done` } }}
        sx={{ p: 0.5 }}
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: C.navy, lineHeight: 1.35 }}>{task.title}</Typography>
        <Box sx={{ mt: 0.25, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Pill color={status.color} bg={status.bg} sx={{ fontSize: '0.75rem', py: 0 }}>{status.label}</Pill>
          <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>
            <Box component="span" sx={{ color: priority.color, fontWeight: 700 }}>{priority.label}</Box>
            {task.due && ` · Due by ${formatTime(task.due)}`}
            {` · ${task.meeting}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

/* Stretches to the height of the schedule card beside it; all items show, nothing scrolls inside. */
export default function DashboardActionItemsCard({ items, onToggle, onViewAll }) {
  const open = items.filter(isOpenTask)

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ px: 2, py: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.line}` }}>
        <Box>
          <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: C.navy }}>
            Your Action Items
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>Open items due today</Typography>
        </Box>
        <Pill color={C.red} bg={C.paleRed}>{open.length} open</Pill>
      </Box>

      <Box sx={{ p: 1.25, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        {open.length === 0 && <Typography sx={{ p: 2, color: C.muted }}>No open action items due today.</Typography>}
        {open.map((t) => (
          <ActionItem key={t.id} task={t} onToggle={onToggle} />
        ))}
      </Box>

      <Box sx={{ p: 1.25, borderTop: `1px solid ${C.line}`, flexShrink: 0 }}>
        <Button fullWidth onClick={onViewAll} endIcon={<ArrowForwardRoundedIcon />} sx={{ ...lightBtn, bgcolor: C.paleBlue, border: 0, color: C.blue }}>
          View All Action Items
        </Button>
      </Box>
    </Box>
  )
}
