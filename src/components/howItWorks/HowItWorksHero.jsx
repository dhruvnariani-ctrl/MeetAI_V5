import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { C, Pill, SERIF } from '../ui'

const TRUST = ['Zero software downloads required', 'Avaada Private Enterprise Cloud', 'Works in Teams, Zoom & Google Meet']

/* Page title, short intro and the three trust points. */
export default function HowItWorksHero() {
  return (
    <Box sx={{ textAlign: 'center', pt: 1, pb: 0.5 }}>
      <Pill color={C.green} bg={C.paleGreen} sx={{ fontSize: '0.75rem' }}>Avaada MeetAI Employee Guide</Pill>
      <Typography component="h1" sx={{ mt: 1.25, fontFamily: SERIF, fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 600, color: C.navy, lineHeight: 1.15 }}>
        How MeetAI Works for You
      </Typography>
      <Typography sx={{ mt: 1, mx: 'auto', maxWidth: 680, fontSize: '1rem', color: C.muted, lineHeight: 1.6 }}>
        A simple, step-by-step guide to automated meeting notes, video recordings, and action items — designed for executive ease without technical complexity.
      </Typography>
      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {TRUST.map((t) => (
          <Pill key={t} color={C.ink} bg="#fff" sx={{ border: `1px solid ${C.line}`, fontWeight: 500 }}>✓ {t}</Pill>
        ))}
      </Box>
    </Box>
  )
}