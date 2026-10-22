import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import { T } from './helpers'
import { Badge } from './ui'

const outlineBtn = {
  bgcolor: T.card,
  color: T.primary,
  border: `1px solid ${T.line2}`,
  borderRadius: '8px',
  px: 1.75,
  py: 1,
  textTransform: 'none',
  fontFamily: T.sans,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  '&:hover': { bgcolor: T.tint },
}

/* Title block with status pills and the four actions: watch, transcript, print summary, copy link. */
export default function MeetingHeader({
  meeting, state, flags, timeText, dateText, attendedCount, participantCount,
  onWatch, onTranscript, onPrint, onCopyLink,
}) {
  const upcoming = state?.type === 'upcoming'
  const hasRecording = meeting.recording?.available === true
  const hasTranscript = meeting.transcript?.available === true
  const presentPct = participantCount ? Math.round((attendedCount / participantCount) * 100) : 0
  const summary = typeof meeting.meetingSummary === 'string' ? meeting.meetingSummary : ''

  return (
    <Box sx={{ bgcolor: T.card, border: `1px solid ${T.line}`, borderRadius: '16px', boxShadow: T.shadow, p: { xs: 2, md: 2.5 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: '1 1 420px' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25, color: T.muted, fontSize: '0.8125rem' }}>
            <Badge tone={upcoming ? 'blue' : 'green'} sx={{ fontSize: '0.75rem', py: 0.375 }}>
              {upcoming ? 'Upcoming' : 'Completed'}
            </Badge>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <ScheduleOutlinedIcon sx={{ fontSize: 16 }} /> {dateText} · {timeText}
            </Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <VideocamOutlinedIcon sx={{ fontSize: 16 }} /> {meeting.platform}
            </Box>
          </Box>

          <Typography component="h1" sx={{ mt: 1, fontFamily: T.serif, fontSize: { xs: '1.75rem', md: '2.125rem' }, fontWeight: 500, lineHeight: 1.2, color: T.primary, letterSpacing: '-0.015em' }}>
            {meeting.title}
          </Typography>
          {summary && (
            <Typography sx={{ mt: 0.75, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.6, maxWidth: 720 }}>{summary}</Typography>
          )}

          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {participantCount > 0 && (
              <Badge tone="slate" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                {attendedCount} of {participantCount} Present <Box component="span" sx={{ color: T.green }}>({presentPct}%)</Box>
              </Badge>
            )}
            {flags.meetAIInvited && hasTranscript && (
              <Badge tone="blue" sx={{ fontSize: '0.75rem', py: 0.5 }}>MeetAI Assistant Attended</Badge>
            )}
            {hasRecording && (
              <Badge tone="slate" sx={{ fontSize: '0.75rem', py: 0.5 }}>Recording Available ({meeting.recording.duration})</Badge>
            )}
            {hasTranscript && <Badge tone="slate" sx={{ fontSize: '0.75rem', py: 0.5 }}>Transcript Ready</Badge>}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gap: 1, minWidth: 200, flexShrink: 0 }}>
          <Button
            onClick={onWatch}
            disabled={!hasRecording}
            startIcon={<PlayArrowRoundedIcon />}
            sx={{ bgcolor: T.primary, color: '#fff', borderRadius: '8px', py: 1.125, textTransform: 'none', fontFamily: T.sans, fontWeight: 700, '&:hover': { bgcolor: T.primaryHover }, '&.Mui-disabled': { bgcolor: T.line2, color: T.card } }}
          >
            Watch Recording
          </Button>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Button onClick={onTranscript} disabled={!hasTranscript} startIcon={<DescriptionOutlinedIcon />} sx={outlineBtn}>Transcript</Button>
            <Button onClick={onPrint} startIcon={<PrintOutlinedIcon />} sx={outlineBtn}>Summary PDF</Button>
          </Box>
          <Button onClick={onCopyLink} disabled={!meeting.link} startIcon={<ContentCopyOutlinedIcon />} sx={outlineBtn}>Copy Meeting Link</Button>
        </Box>
      </Box>
    </Box>
  )
}