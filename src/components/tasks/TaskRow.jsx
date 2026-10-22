import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import { normalizeTaskPriority, normalizeTaskStatus } from '../../data/tasks'
import { C, Pill, lightBtn } from '../ui'
import { getDueLabel, formatDate } from './taskHelpers'

const PRIORITY_STYLE = {
  High: { color: C.red, bg: C.paleRed },
  Medium: { color: C.amber, bg: '#FFF3E1' },
  Low: { color: C.muted, bg: C.soft },
}

export default function TaskRow({
  task,
  selected,
  onSelect,
  onDone,
  onView,
}) {
  const done = normalizeTaskStatus(task.status) === 'Done'
  const status = done ? 'Completed' : normalizeTaskStatus(task.status)
  const priority = normalizeTaskPriority(task.priority)
  const style = PRIORITY_STYLE[priority] ?? PRIORITY_STYLE.Medium

  return (
    <Box
      data-tour="task-card"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Show details for ${task.title}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          e.target === e.currentTarget
        ) {
          e.preventDefault()
          onSelect()
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 0.5, sm: 1 },
        p: { xs: 1, sm: 1.25 },
        borderRadius: '12px',
        cursor: 'pointer',
        minWidth: 0,
        bgcolor: done ? C.soft : '#fff',
        border: `${selected ? 2 : 1}px solid ${selected ? C.blue : C.line}`,
        '&:focus-visible': {
          outline: `2px solid ${C.blue}`,
          outlineOffset: 2,
        },
      }}
    >
      {/* Completion checkbox */}
      <Tooltip title={done ? 'Completed' : 'Mark as done'}>
        <span>
          <Checkbox
            checked={done}
            disabled={done}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onDone(task)}
            slotProps={{
              input: {
                'aria-label': `Mark "${task.title}" as done`,
              },
            }}
            sx={{ p: 0.5 }}
          />
        </span>
      </Tooltip>

      {/* Main task content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Priority, deadline and owner */}
        <Box
          data-tour="task-details" 
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {done ? (
            <Pill color={C.green} bg={C.paleGreen}>
              Completed
            </Pill>
          ) : (
            <>
              <Pill color={style.color} bg={style.bg}>
                {priority} Priority
              </Pill>

              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: priority === 'High' ? C.red : C.ink,
                }}
              >
                {getDueLabel(task.due)}
              </Typography>
            </>
          )}

          <Typography
            sx={{
              fontSize: '0.875rem',
              color: C.muted,
              overflowWrap: 'anywhere',
            }}
          >
            · Assigned to: {task.owner || 'Unassigned'}
          </Typography>
        </Box>

        {/* Task title */}
        <Typography
          sx={{
            mt: 0.5,
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: done ? C.muted : C.navy,
            textDecoration: done ? 'line-through' : 'none',
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
          }}
        >
          {task.title}
        </Typography>

        {/* Meeting information and details action */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            mt: 0.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: C.muted,
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            Meeting: <b>{task.meetingTitle}</b>
            {task.due ? ` · ${formatDate(task.due)}` : ''}
          </Typography>

          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onView(task)
            }}
            sx={{
              ...lightBtn,
              bgcolor: C.paleBlue,
              border: 0,
              color: C.blue,
              py: 0.5,
              minHeight: 36,
              flexShrink: 0,
            }}
          >
            View Details →
          </Button>
        </Box>

        {/* Compact controls shown only on mobile */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1.25,
            pt: 1.25,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          {/* Mobile status tour target */}
          <Box
            data-tour="task-status"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
              flex: '1 1 120px',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: C.muted,
                flexShrink: 0,
              }}
            >
              Status
            </Typography>

            <Box
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: '999px',
                bgcolor: done ? C.paleGreen : C.soft,
                color: done ? C.green : C.navy,
                fontSize: '0.8125rem',
                fontWeight: 700,
                lineHeight: 1.4,
                overflowWrap: 'anywhere',
              }}
            >
              {status}
            </Box>
          </Box>

          {/* Mobile completion tour target */}
          <Box
            data-tour="mark-task-done"
            sx={{
              flexShrink: 0,
              maxWidth: '100%',
            }}
          >
            {!done &&(<Button
              size="small"
              disabled={done}
              startIcon={
              <CheckCircleOutlineRoundedIcon />
              }
              onClick={(e) => {
                e.stopPropagation()
                onDone(task)
              }}
              sx={{
                minHeight: 38,
                px: 1.5,
                borderRadius: '9px',
                textTransform: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                bgcolor: done ? C.line : C.green,
                color: done ? C.muted : '#fff',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: done ? C.line : '#14753A',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  bgcolor: C.line,
                  color: C.muted,
                },
              }}
            >
              { 'Mark as Done'}
            </Button>)}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}