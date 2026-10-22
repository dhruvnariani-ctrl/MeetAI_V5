import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined'

import { T, copyText, formatClock } from './helpers'
import { Badge, Card, IconTile, InfoRow, NotReadyCard } from './ui'

/* Recording & Media: player, chapters from the timed transcript, and recording details. */
export default function RecordingTab({ meeting, state, flags, segments, timeText }) {
  const available = meeting.recording?.available === true

  if (!available) {
    return (
      <NotReadyCard
        icon={<PlayCircleOutlineIcon />}
        title={state?.type === 'upcoming' ? 'Recording is not available yet' : 'No recording available'}
      >
        {state?.type === 'upcoming'
          ? 'The recording will be ready after the meeting has taken place.'
          : 'This meeting was not recorded.'}
      </NotReadyCard>
    )
  }

  const chapters = segments.filter((s) => s.time).slice(0, 6)
  const duration = meeting.recording.duration

  return (
    <Box sx={{ display: 'grid', gap: 2, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(300px, 1fr)' } }}>
      <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(160deg, #0b1733 0%, #1b2c52 100%)', color: '#fff', minHeight: { xs: 220, md: 360 }, display: 'grid', placeItems: 'center', p: 2 }}>
          <Box sx={{ position: 'absolute', top: 14, left: 14, display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.625, borderRadius: '8px', bgcolor: 'rgba(15,23,42,0.6)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <MovieOutlinedIcon sx={{ fontSize: 18 }} /> {meeting.title}
          </Box>
          <Badge tone="green" sx={{ position: 'absolute', top: 14, right: 14, fontSize: '0.75rem', py: 0.5 }}>Verified</Badge>

          <IconButton disabled aria-label="Play recording" sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', '&.Mui-disabled': { color: '#fff', opacity: 0.85 } }}>
            <PlayArrowRoundedIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, px: 2, py: 1.5, bgcolor: 'rgba(15,23,42,0.55)' }}>
            <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.25)' }}>
              <Box sx={{ width: '0%', height: '100%', borderRadius: 2, bgcolor: T.greenBright }} />
            </Box>
            <Typography sx={{ mt: 1, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>00:00 / {duration}</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.8125rem', color: T.muted }}>Video playback needs the recording file to be connected to this workspace.</Typography>

        <Card
          title="Chapters"
          icon={<IconTile><PlayCircleOutlineIcon /></IconTile>}
          badge={<Badge tone="slate">{chapters.length} Chapters</Badge>}
        >
          {chapters.length === 0 ? (
            <Typography sx={{ color: T.muted }}>No chapters are available because the transcript has no timestamps.</Typography>
          ) : (
            chapters.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.125, borderTop: `1px solid ${T.line}` }}>
                <Badge tone="navy" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', py: 0.5 }}>{c.time}</Badge>
                <Typography sx={{ fontSize: '0.9375rem', color: T.ink, lineHeight: 1.5 }}>{c.text}</Typography>
              </Box>
            ))
          )}
        </Card>
      </Box>

      <Card title="Recording Details" icon={<IconTile><MovieOutlinedIcon /></IconTile>} badge={<Badge tone="green">Verified</Badge>}>
        <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: T.tint }}>
          <InfoRow label="Recording status" value={`Available (${duration})`} />
          <InfoRow label="Video recording" value={flags.recordVideo ? 'Enabled' : 'Disabled'} />
          <InfoRow label="Platform" value={meeting.platform} />
          <InfoRow label="Meeting link" value={meeting.link || '—'} mono action={meeting.link && (
            <IconButton size="small" aria-label="Copy meeting link" onClick={() => copyText(meeting.link)}><ContentCopyOutlinedIcon fontSize="small" /></IconButton>
          )} />
          <InfoRow label="Meeting ID" value={String(meeting.id)} mono />
          <InfoRow label="Recorded range" value={timeText} />
          <InfoRow label="Started" value={formatClock(meeting.start)} />
        </Box>
      </Card>
    </Box>
  )
}