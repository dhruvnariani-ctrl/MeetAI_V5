import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { normalizeTaskPriority, normalizeTaskStatus } from '../../data/tasks'
import { C, Pill, lightBtn } from '../ui'
import { getDueLabel, formatDate } from './taskHelpers'

const PRIORITY_STYLE = {
  High: { color: C.red, bg: C.paleRed },
  Medium: { color: C.amber, bg: '#FFF3E1' },
  Low: { color: C.muted, bg: C.soft },
}

/* One task: checkbox (with a "Mark as done" tooltip), status, due date, meeting, and View Details. */
export default function TaskRow({ task, selected, onSelect, onDone, onView }) {
  const done = normalizeTaskStatus(task.status) === 'Done'
  const priority = normalizeTaskPriority(task.priority)
  const style = PRIORITY_STYLE[priority] ?? PRIORITY_STYLE.Medium

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Show details for ${task.title}`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onSelect()}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0.5,
        p: 1.25,
        borderRadius: '12px',
        cursor: 'pointer',
        bgcolor: done ? C.soft : '#fff',
        border: `${selected ? 2 : 1}px solid ${selected ? C.blue : C.line}`,
        '&:focus-visible': { outline: `2px solid ${C.blue}`, outlineOffset: 2 },
      }}
    >
      <Tooltip title={done ? 'Completed' : 'Mark as done'}>
        <span>
          <Checkbox
            checked={done}
            disabled={done}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onDone(task)}
            slotProps={{ input: { 'aria-label': `Mark "${task.title}" as done` } }}
            sx={{ p: 0.5 }}
          />
        </span>
      </Tooltip>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {done ? (
            <Pill color={C.green} bg={C.paleGreen}>Completed</Pill>
          ) : (
            <>
              <Pill color={style.color} bg={style.bg}>{priority} Priority</Pill>
              <Typography sx={{ fontSize: '0.875rem', color: priority === 'High' ? C.red : C.ink }}>{getDueLabel(task.due)}</Typography>
            </>
          )}
          <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>· Assigned to: {task.owner}</Typography>
        </Box>
        <Typography sx={{ mt: 0.5, fontSize: '1.0625rem', fontWeight: 600, color: done ? C.muted : C.navy, textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>
          {task.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>
            Meeting: <b>{task.meetingTitle}</b>{task.due ? ` · ${formatDate(task.due)}` : ''}
          </Typography>
          <Button
            size="small"
            onClick={(e) => { e.stopPropagation(); onView(task) }}
            sx={{ ...lightBtn, bgcolor: C.paleBlue, border: 0, color: C.blue, py: 0.25 }}
          >
            View Details →
          </Button>
        </Box>
      </Box>
    </Box>
  )
}