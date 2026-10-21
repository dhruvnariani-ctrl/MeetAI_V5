import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'

import { C, Pill, SERIF, lightBtn, minutesOf } from '../ui'
import { chaptersOf, dateLabel, hasVideo } from './recordedHelpers'

/* One recording in the list: platform, date, title, summary, and its tags. */
export default function RecordingCard({ meeting, selected, onSelect, onOpen }) {
  const video = hasVideo(meeting)
  const chapters = chaptersOf(meeting).length
  const tasks = meeting.actionItems?.length ?? 0
  const summary = typeof meeting.meetingSummary === 'string' ? meeting.meetingSummary : ''

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Load ${meeting.title} in the player`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onSelect()}
      sx={{
        p: 1.5,
        borderRadius: '12px',
        cursor: 'pointer',
        border: `${selected ? 2 : 1}px solid ${selected ? C.navy : C.line}`,
        '&:focus-visible': { outline: `2px solid ${C.blue}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Pill>{meeting.platform}</Pill>
        <Typography sx={{ fontSize: '0.875rem', color: C.ink }}>
          {dateLabel(meeting.start)} · {minutesOf(meeting)} mins
          {Array.isArray(meeting.participants) && ` · ${meeting.participants.length} attendees`}
        </Typography>
        {selected && <Pill color={C.green} bg={C.paleGreen} sx={{ ml: 'auto' }}>Currently Loaded in Player</Pill>}
      </Box>

      <Typography sx={{ mt: 0.75, fontFamily: SERIF, fontSize: '1.1875rem', fontWeight: 600, color: C.navy, lineHeight: 1.25 }}>
        {meeting.title}
      </Typography>
      {summary && (
        <Typography sx={{ mt: 0.25, fontSize: '0.875rem', color: C.muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {summary}
        </Typography>
      )}

      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
        <Pill color={video ? C.green : C.blue} bg={video ? C.paleGreen : C.paleBlue}>{video ? 'Video recorded' : 'Transcript only'}</Pill>
        {chapters > 0 && <Pill color={C.ink} bg={C.soft}>{chapters} Chapters</Pill>}
        {meeting.transcript?.available && <Pill color={C.ink} bg={C.soft}>Transcript Synced</Pill>}
        {tasks > 0 && <Pill color={C.ink} bg={C.soft}>{tasks} Tasks</Pill>}
        <Button
          onClick={(e) => { e.stopPropagation(); onOpen(meeting, 'recording') }}
          startIcon={<PlayArrowRoundedIcon />}
          sx={{ ...lightBtn, ml: 'auto', bgcolor: C.paleBlue, border: 0, color: C.blue, py: 0.25 }}
        >
          {video ? 'Watch Recording' : 'Play Audio'}
        </Button>
      </Box>
    </Box>
  )
}