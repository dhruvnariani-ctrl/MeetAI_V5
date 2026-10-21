import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { C, Pill, SERIF, cardSx } from '../ui'

const POINTS = [
  ['High-Accuracy Clean Energy Terminology', 'Trained on Avaada solar, green hydrogen, and wind terminology (e.g., PPAs, MWh, BESS, transmission nodes).'],
  ['Speaker Separation (Who Said What)', 'Automatically tags voices so you know exactly which stakeholder agreed to deliver a milestone.'],
  ['Confidentiality Guarantee', 'Data stays strictly within Avaada firewalls. Your recordings are never used to train public models.'],
]

function MeetingMock() {
  return (
    <Box sx={{ borderRadius: '14px', bgcolor: C.navy, color: '#fff', p: 1.5, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.25 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>Executive Strategy Meeting — Transmission &amp; EPC Review</Typography>
        <Pill color="#fff" bg="rgba(255,255,255,0.14)" sx={{ fontSize: '0.6875rem' }}>● MEETAI ACTIVE</Pill>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr' }, gap: 1.25 }}>
        <Box sx={{ position: 'relative', minHeight: 170, borderRadius: '10px', background: 'linear-gradient(135deg, #1F4E7A, #3A7CA5)', display: 'flex', alignItems: 'flex-end', p: 1 }}>
          <Pill color={C.navy} bg={C.green} sx={{ position: 'absolute', top: 8, right: 8, fontSize: '0.6875rem', color: '#fff' }}>FULL HD 1080P</Pill>
          <Pill color="#fff" bg="rgba(0,0,0,0.45)" sx={{ fontSize: '0.75rem' }}>Vineet M. (COO - Renewables)</Pill>
        </Box>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>Auto-Captured Points <Box component="span" sx={{ color: '#7EE2A8', ml: 0.5 }}>Live AI</Box></Typography>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 1, fontSize: '0.75rem' }}>
            <b>Decision #1:</b> Inverter order approved for 300MW Bikaner installation.
          </Box>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: 1, fontSize: '0.75rem' }}>
            <b>Task Extracted:</b> Dhruv to circulate updated EPC contract draft by 4 PM.
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '8px', px: 1.25, py: 0.75, fontSize: '0.75rem' }}>
        Transcribing in real time (English &amp; Hindi mixed) <span>34:12 elapsed</span>
      </Box>
    </Box>
  )
}

/* "Never scramble to write meeting minutes again" with the key points and a meeting preview. */
export default function HowItWorksFeature() {
  return (
    <Box sx={{ ...cardSx, p: { xs: 2, md: 3 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.15fr' }, gap: 3, alignItems: 'center' }}>
      <Box>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: C.green }}>Effortless Everyday Operation</Typography>
        <Typography component="h2" sx={{ mt: 0.5, fontFamily: SERIF, fontSize: { xs: '1.625rem', md: '1.875rem' }, fontWeight: 600, lineHeight: 1.2, color: C.navy }}>
          Never scramble to write meeting minutes again.
        </Typography>
        <Typography sx={{ mt: 1.25, fontSize: '0.9375rem', color: C.muted, lineHeight: 1.65 }}>
          Corporate life moves fast. MeetAI handles documentation with military precision so you can remain 100% focused on executive leadership, strategic decisions, and cross-team dialogue.
        </Typography>
        <Box sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
          {POINTS.map(([title, body]) => (
            <Box key={title} sx={{ display: 'flex', gap: 1.25 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: C.paleBlue, flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: C.navy }}>{title}</Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: C.muted, lineHeight: 1.5 }}>{body}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <MeetingMock />
    </Box>
  )
}