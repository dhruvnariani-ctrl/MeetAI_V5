import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import { normalizeTaskPriority, normalizeTaskStatus } from '../../data/tasks'
import { C, Pill, SERIF, cardSx, lightBtn, scrollSx } from '../ui'
import { formatDate, getDueLabel } from './taskHelpers'

const label = { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: 0.5, color: C.muted }
const box = { p: 1.25, borderRadius: '10px', bgcolor: C.soft }

export default function TaskDetailsCard({ task, onDone, onView }) {
  if (!task) {
    return (
      <Box sx={{ ...cardSx, p: 2 }}>
        <Typography sx={{ fontWeight: 700, color: C.navy }}>
          Selected Task Details
        </Typography>
        <Typography sx={{ mt: 1, color: C.muted }}>
          Select a task to see its details.
        </Typography>
      </Box>
    )
  }

  const done = normalizeTaskStatus(task.status) === 'Done'
  const priority = normalizeTaskPriority(task.priority)

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ ...scrollSx, flex: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 700, color: C.navy }}>
            Selected Task Details
          </Typography>
          {done ? (
            <Pill color={C.green} bg={C.paleGreen}>Completed</Pill>
          ) : (
            priority === 'High' && <Pill color={C.red} bg={C.paleRed}>Urgent Action</Pill>
          )}
        </Box>

        <Typography
          component="h2"
          sx={{ mt: 1.5, fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.25, color: C.navy }}
        >
          {task.title}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: '0.875rem', color: C.muted }}>
          From {task.meetingTitle}
        </Typography>

        <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
          <Button
            disabled={done}
            startIcon={<CheckCircleOutlineRoundedIcon />}
            onClick={() => onDone(task)}
            sx={{
              bgcolor: C.green,
              color: '#fff',
              borderRadius: '10px',
              py: 1,
              '&:hover': { bgcolor: '#14753A' },
              '&.Mui-disabled': { bgcolor: C.line, color: C.muted },
            }}
          >
            {done ? 'Completed' : 'Mark as Completed'}
          </Button>
          <Button
            onClick={() => onView(task)}
            sx={{ ...lightBtn, bgcolor: C.paleBlue, border: 0, color: C.blue }}
          >
            View Meeting Details →
          </Button>
        </Box>

        <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Box sx={box}>
            <Typography sx={label}>ASSIGNED PERSON</Typography>
            <Typography sx={{ fontWeight: 600, color: C.navy }}>
              {task.owner || 'Unassigned'}
            </Typography>
          </Box>
          <Box sx={box}>
            <Typography sx={label}>DUE DEADLINE</Typography>
            <Typography sx={{ fontWeight: 600, color: priority === 'High' && !done ? C.red : C.navy }}>
              {task.due ? `${getDueLabel(task.due)} · ${formatDate(task.due)}` : 'No due date'}
            </Typography>
          </Box>
          <Box sx={box}>
            <Typography sx={label}>PRIORITY</Typography>
            <Typography sx={{ fontWeight: 600, color: C.navy }}>{priority}</Typography>
          </Box>
          <Box sx={box}>
            <Typography sx={label}>STATUS</Typography>
            <Typography sx={{ fontWeight: 600, color: C.navy }}>
              {done ? 'Completed' : normalizeTaskStatus(task.status)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}