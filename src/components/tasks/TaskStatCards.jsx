import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { C, SERIF, cardSx } from '../ui'

function StatCard({ label, value, note, color = C.navy }) {
  return (
    <Box sx={{ ...cardSx, px: 2, py: 1.25 }}>
      <Typography sx={{ fontSize: '0.875rem', color }}>{label}</Typography>
      <Typography sx={{ fontFamily: SERIF, fontSize: '1.75rem', lineHeight: 1.2, fontWeight: 600, color }}>{value}</Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>{note}</Typography>
    </Box>
  )
}

/* Four headline numbers across the top of My Tasks. */
export default function TaskStatCards({ openCount, highCount, dueTodayCount, doneCount }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.25 }}>
      <StatCard label="Open Tasks" value={openCount} note="Pending & in process & blocked" />
      <StatCard label="High Priority" value={highCount} note="Urgent review required" color={C.red} />
      <StatCard label="Due Today" value={dueTodayCount} note="Open items due today" />
      <StatCard label="Completed" value={doneCount} note="Marked done" color={C.green} />
    </Box>
  )
}