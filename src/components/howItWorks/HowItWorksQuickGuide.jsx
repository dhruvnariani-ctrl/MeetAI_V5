import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import PrintRoundedIcon from '@mui/icons-material/PrintRounded'

import { C, cardSx, lightBtn } from '../ui'

const STEPS = [
  ['To Add MeetAI', 'Add meetai@avaada.com as an attendee in any meeting invite.'],
  ['During the Call', 'MeetAI appears as a participant. No human mic setup needed; it listens passively.'],
  ['After the Call', 'Visit this workspace or check your Avaada inbox 5 minutes later for notes and tasks.'],
]

/* Printable one-screen summary for executive assistants and managers. */
export default function HowItWorksQuickGuide() {
  return (
    <Box sx={{ ...cardSx, p: { xs: 2, md: 2.5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Box>
          <Typography sx={{ fontSize: '1.0625rem', fontWeight: 700, color: C.navy }}>Quick 30-Second Summary for Executive Assistants &amp; Managers</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>Print or pin this quick reference for your desk.</Typography>
        </Box>
        <Button onClick={() => window.print()} startIcon={<PrintRoundedIcon />} sx={{ ...lightBtn, bgcolor: C.paleBlue, border: 0, color: C.blue }}>
          Print Quick Guide
        </Button>
      </Box>
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.25 }}>
        {STEPS.map(([title, body]) => (
          <Box key={title} sx={{ p: 1.5, borderRadius: '10px', bgcolor: C.soft, border: `1px solid ${C.line}` }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: C.navy }}>{title}</Typography>
            <Typography sx={{ mt: 0.5, fontSize: '0.875rem', color: C.ink, lineHeight: 1.55 }}>{body}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}