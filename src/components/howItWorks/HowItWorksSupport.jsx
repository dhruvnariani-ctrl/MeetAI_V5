import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import { C, SERIF } from '../ui'

const CONTACTS = [
  ['Internal Helpdesk: ext. 4004', 'Mon–Fri 8:00 AM – 7:00 PM IST'],
  ['it-meetai@avaada.com', 'Guaranteed reply within 15 mins'],
]

/* Navy support banner with the walkthrough and schedule actions and two contact boxes. */
export default function HowItWorksSupport({ onSchedule, onSchedule1on1Action, onGoToSchedule }) {
  return (
    <Box sx={{ borderRadius: '14px', bgcolor: C.navy, color: '#fff', p: { xs: 2.25, md: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: 2.5, alignItems: 'center' }}>
      <Box>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#9FD8B8' }}>Avaada Dedicated Employee Support</Typography>
        <Typography component="h2" sx={{ mt: 0.5, fontFamily: SERIF, fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 600, lineHeight: 1.25 }}>
          Have questions or need someone to walk you through it?
        </Typography>
        <Typography sx={{ mt: 1, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
          Our Avaada Corporate IT desk is available throughout all business hours to test your setup, demonstrate the calendar sync, or answer any workflow questions.
        </Typography>
        <Box sx={{ mt: 1.75, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
          {CONTACTS.map(([title, sub]) => (
            <Box key={title} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '10px', p: 1.25 }}>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700 }}>{title}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>{sub}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 1.25 }}>
        <Button onClick={onSchedule} startIcon={<CalendarMonthOutlinedIcon />} sx={{ bgcolor: C.green, color: '#fff', borderRadius: '10px', py: 1.25, '&:hover': { bgcolor: '#14753A' } }}>
          Schedule 1-on-1 Walkthrough
        </Button>
        <Button onClick={onGoToSchedule} endIcon={<ArrowForwardRoundedIcon />} sx={{ bgcolor: '#fff', color: C.navy, borderRadius: '10px', py: 1.25, '&:hover': { bgcolor: C.soft } }}>
          Go to Today&apos;s Schedule
        </Button>
      </Box>
    </Box>
  )
}