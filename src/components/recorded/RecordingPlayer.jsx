import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'

import { C, Pill, SERIF, cardSx, lightBtn, minutesOf, primaryBtn, scrollSx } from '../ui'
import { chaptersOf, hasVideo } from './recordedHelpers'

/* Right-hand player: the selected recording, its chapters, and open actions. */
export default function RecordingPlayer({ meeting, onOpen }) {
  if (!meeting) {
    return (
      <Box sx={{ ...cardSx, p: 2 }}>
        <Typography sx={{ color: C.muted }}>Select a recording to load it here.</Typography>
      </Box>
    )
  }

  const chapters = chaptersOf(meeting)

  return (
    <Box sx={{ ...cardSx, border: `2px solid ${C.navy}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ ...scrollSx, flex: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.6, color: C.green }}>RECORDING PLAYBACK &amp; MEDIA</Typography>
            <Typography component="h2" sx={{ fontFamily: SERIF, fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.25, color: C.navy }}>
              {meeting.title}
            </Typography>
          </Box>
          <Pill color={C.green} bg={C.paleGreen}>Recording Ready</Pill>
        </Box>

        <Box
          role="button"
          tabIndex={0}
          aria-label="Open the recording"
          onClick={() => onOpen(meeting, 'recording')}
          onKeyDown={(e) => e.key === 'Enter' && onOpen(meeting, 'recording')}
          sx={{
            mt: 1.5,
            position: 'relative',
            aspectRatio: '16 / 9',
            maxHeight: 230,
            width: '100%',
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #0B2A4A, #1A4D7A)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: C.green, display: 'grid', placeItems: 'center', color: '#fff' }}>
            <PlayArrowRoundedIcon sx={{ fontSize: 34 }} />
          </Box>
          <Typography sx={{ position: 'absolute', left: 12, bottom: 8, color: '#fff', fontSize: '0.8125rem', fontWeight: 600 }}>
            {hasVideo(meeting) ? 'Video recording' : 'Transcript only'} · {meeting.recording?.duration ?? `${minutesOf(meeting)} min`}
          </Typography>
        </Box>

        {chapters.length > 0 && (
          <Box sx={{ mt: 1.5, p: 1.25, borderRadius: '12px', border: `1px solid ${C.line}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700, color: C.navy }}>Recording Highlights &amp; Chapters</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>Jump to timecode</Typography>
            </Box>
            <Box sx={{ mt: 0.75, display: 'grid', gap: 0.75 }}>
              {chapters.slice(0, 5).map((c) => (
                <Button
                  key={c.time + c.text}
                  onClick={() => onOpen(meeting, 'transcript')}
                  sx={{ justifyContent: 'flex-start', gap: 1.25, textAlign: 'left', textTransform: 'none', border: `1px solid ${C.line}`, borderRadius: '8px', color: C.ink, fontWeight: 400 }}
                >
                  <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: C.paleBlue, color: C.blue, px: 0.75, borderRadius: '6px', flexShrink: 0 }}>{c.time}</Box>
                  <Box component="span">{c.text}</Box>
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 1.5, display: 'grid', gap: 1, borderTop: `1px solid ${C.line}` }}>
        <Button fullWidth onClick={() => onOpen(meeting, 'recording')} sx={{ ...primaryBtn, py: 1 }}>Open Full Recording</Button>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
          <Button onClick={() => onOpen(meeting, 'transcript')} sx={lightBtn}>Transcript</Button>
          <Button onClick={() => onOpen(meeting, 'notes')} sx={lightBtn}>Notes</Button>
          <Button onClick={() => onOpen(meeting, '')} sx={lightBtn}>Details</Button>
        </Box>
      </Box>
    </Box>
  )
}