import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { C, Pill, SERIF, cardSx } from '../ui'

const STEPS = [
  {
    n: 1, color: C.navy, tag: 'Outlook & Google', tagColor: C.blue, tagBg: C.paleBlue,
    title: 'Invite MeetAI to Any Meeting',
    body: 'When scheduling in Outlook or Google Calendar, simply toggle "Invite MeetAI" or add meetai@avaada.com. MeetAI quietly joins as your silent virtual assistant.',
    preview: 'invite',
  },
  {
    n: 2, color: C.green, tag: 'Encrypted 1080p', tagColor: C.green, tagBg: C.paleGreen,
    title: 'Automatic Recording & Smart Capture',
    body: 'MeetAI securely captures high-definition video, shared presentations, and crystal-clear audio. Real-time encryption keeps all clean energy data strictly confidential.',
    preview: 'record',
  },
  {
    n: 3, color: C.navy, tag: 'Under 5 Min', tagColor: C.blue, tagBg: C.paleBlue,
    title: 'Executive 3-Bullet Summary & Notes',
    body: 'Within five minutes after your call concludes, you receive a crisp executive recap: key decisions finalized, discussion themes, and clickable timestamped video chapters.',
    preview: 'summary',
  },
  {
    n: 4, color: C.green, tag: 'Automated', tagColor: C.green, tagBg: C.paleGreen,
    title: 'Action Items Direct to Your To-Do List',
    body: 'Any commitment or task assigned to you during the discussion is extracted and placed directly in your "Action Items & Tasks" tab, with owners and due dates.',
    preview: 'tasks',
  },
]

function Preview({ kind }) {
  const box = { mt: 'auto', p: 1, borderRadius: '10px', bgcolor: C.soft, border: `1px solid ${C.line}` }
  const row = { fontSize: '0.8125rem', color: C.ink, lineHeight: 1.5 }

  if (kind === 'invite') return (
    <Box sx={box}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', borderRadius: '8px', p: 1 }}>
        <Box>
          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: C.navy }}>Avaada MeetAI Bot</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: C.green }}>Auto-Join Enabled</Typography>
        </Box>
        <Box sx={{ width: 34, height: 18, borderRadius: 999, bgcolor: C.green, position: 'relative' }}>
          <Box sx={{ position: 'absolute', right: 2, top: 2, width: 14, height: 14, borderRadius: '50%', bgcolor: '#fff' }} />
        </Box>
      </Box>
      <Typography sx={{ mt: 0.75, textAlign: 'center', fontSize: '0.75rem', color: C.muted }}>Syncs with corporate calendar</Typography>
    </Box>
  )

  if (kind === 'record') return (
    <Box sx={{ ...box, display: 'grid', gap: 0.75 }}>
      <Box sx={{ bgcolor: C.navy, color: '#fff', borderRadius: '8px', px: 1.25, py: 0.75, fontSize: '0.8125rem', fontWeight: 700 }}>● REC • 1080p HD</Box>
      <Box sx={{ bgcolor: '#fff', borderRadius: '8px', px: 1.25, py: 0.75, fontSize: '0.8125rem', color: C.ink }}>〰 Voice isolating</Box>
    </Box>
  )

  if (kind === 'summary') return (
    <Box sx={{ ...box, bgcolor: '#fff' }}>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: C.navy, mb: 0.5 }}>Executive Highlights</Typography>
      <Typography sx={row}>• Solar park phase-2 tender approved.</Typography>
      <Typography sx={row}>• Grid connectivity synchronized.</Typography>
      <Typography sx={row}>• Next review set for Thursday 2 PM.</Typography>
    </Box>
  )

  return (
    <Box sx={{ ...box, display: 'grid', gap: 0.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff', borderRadius: '8px', px: 1, py: 0.75, fontSize: '0.8125rem' }}>
        ☑ <Box component="span" sx={{ flex: 1 }}>Review PPA clause #4</Box>
        <Pill color={C.red} bg={C.paleRed} sx={{ fontSize: '0.6875rem', py: 0 }}>Today</Pill>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff', borderRadius: '8px', px: 1, py: 0.75, fontSize: '0.8125rem' }}>
        ☐ <Box component="span" sx={{ flex: 1 }}>Share battery specs</Box>
        <Pill color={C.muted} bg={C.soft} sx={{ fontSize: '0.6875rem', py: 0 }}>Tomorrow</Pill>
      </Box>
    </Box>
  )
}

/* Four numbered step cards in a row. */
export default function HowItWorksSteps() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
      {STEPS.map((s) => (
        <Box key={s.n} sx={{ ...cardSx, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ height: 4, bgcolor: s.color }} />
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: s.color, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{s.n}</Box>
              <Pill color={s.tagColor} bg={s.tagBg} sx={{ fontSize: '0.6875rem' }}>{s.tag}</Pill>
            </Box>
            <Typography sx={{ mt: 1.25, fontFamily: SERIF, fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25, color: C.navy }}>{s.title}</Typography>
            <Typography sx={{ mt: 0.75, fontSize: '0.875rem', color: C.muted, lineHeight: 1.6 }}>{s.body}</Typography>
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Preview kind={s.preview} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}