import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

import { C, SERIF, cardSx, lightBtn, primaryBtn } from '../ui'
import { greetingFor } from './dashboardUtils'

export default function DashboardOverviewHeader({ now, firstName, summary, onSchedule, onInstant }) {
  return (
    <Box sx={{ ...cardSx, px: 2, py: 1.25, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.6, color: C.muted }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
        </Typography>
        <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: '1.5rem', md: '1.75rem' }, lineHeight: 1.2, fontWeight: 600, color: C.navy }}>
          {greetingFor(now)}, {firstName}
        </Typography>
        <Typography sx={{ fontSize: '0.9375rem', color: C.muted }}>{summary}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={onSchedule} data-tour="dashboard-new-meeting" startIcon={<AddRoundedIcon />} sx={{ ...primaryBtn, bgcolor: C.blue, '&:hover': { bgcolor: '#0A49AB' } }}>
          Schedule a Meeting
        </Button>
        <Button onClick={onInstant} data-tour="add-meetai" startIcon={<SmartToyOutlinedIcon />} sx={lightBtn}>
          Add MeetAI to a Meeting
        </Button>
      </Box>
    </Box>
  )
}