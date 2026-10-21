import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

import { C, cardSx } from '../ui'
import { MeetingRow } from './MeetingTimeline'
import { statusOf } from './dashboardUtils'

/* Collapsed bar that sits above the live meeting; opens to the finished meetings. */
export default function DashboardCompletedBar({ meetings, now, settings, onSettingsChange, onOpen }) {
  const [open, setOpen] = useState(false)
  const completed = meetings.filter((m) => statusOf(m, now) === 'past')

  if (completed.length === 0) return null

  return (
    <Box sx={{ ...cardSx, p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        endIcon={open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        sx={{ justifyContent: 'space-between', color: C.navy, fontWeight: 600, borderRadius: '10px', px: 1.5, py: 0.75 }}
      >
        Completed Meetings ({completed.length})
      </Button>
      {open && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1,overflowY: 'auto' }}>
          {completed.map((m) => (
            <MeetingRow
              key={m.id}
              meeting={m}
              status="past"
              settings={settings[m.id]}
              onSettingsChange={(changes) => onSettingsChange(m.id, changes)}
              onOpen={onOpen}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
