import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { C, Pill, SERIF, cardSx } from '../ui'

const QUESTIONS = [
  {
    q: 'Do I need to install any new software or browser extensions?',
    a: 'No installation needed. MeetAI works directly through your standard Avaada corporate Microsoft Teams, Google Meet, or Zoom accounts. It appears simply as an invited participant in your calendar.',
    badge: 'Zero desktop footprint',
  },
  {
    q: 'Can I pause or stop recording during confidential discussions?',
    a: 'Yes, anytime. You or the meeting organizer can click "Pause MeetAI" in the meeting controls or type /pause in the chat window. Recording stops immediately.',
    badge: 'You hold full control',
  },
  {
    q: 'Who can see my meeting notes and video recordings?',
    a: "Only meeting attendees. Notes and recordings are private to confirmed calendar participants and designated Avaada department heads. Everything is protected under Avaada's ISO 27001 standard.",
    badge: 'Enterprise encryption',
  },
]

/* Common questions in three cards, each with a short reassurance tag. */
export default function HowItWorksFaq() {
  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: C.blue }}>Clear Answers for Avaada Employees</Typography>
        <Typography component="h2" sx={{ mt: 0.5, fontFamily: SERIF, fontSize: { xs: '1.625rem', md: '1.875rem' }, fontWeight: 600, color: C.navy }}>
          Common Questions About MeetAI
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: '0.9375rem', color: C.muted }}>
          Everything you need to know about comfort, security, and day-to-day operation.
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
        {QUESTIONS.map((item) => (
          <Box key={item.q} sx={{ ...cardSx, p: 2.25, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: C.paleBlue }} />
            <Typography sx={{ mt: 1.25, fontFamily: SERIF, fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.3, color: C.navy }}>{item.q}</Typography>
            <Typography sx={{ mt: 1, fontSize: '0.875rem', color: C.muted, lineHeight: 1.6, flex: 1 }}>{item.a}</Typography>
            <Pill color={C.green} bg={C.paleGreen} sx={{ mt: 1.5, alignSelf: 'flex-start' }}>✓ {item.badge}</Pill>
          </Box>
        ))}
      </Box>
    </Box>
  )
}