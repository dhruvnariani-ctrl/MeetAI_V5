
import {
  recordingFlags,
  hasTranscript as hasAvailableTranscript,
} from '../../data/recorded'

export const TYPES = [
  'All Recorded',
  'With Video',
  'Transcripts Only',
]

/**
 * Check whether the meeting has ended.
 */
export const isMeetingCompleted = (meeting, now = new Date()) => {
  if (!meeting?.end) {
    return false
  }

  const endTime = new Date(meeting.end).getTime()
  const currentTime = new Date(now).getTime()

  return (
    Number.isFinite(endTime) &&
    Number.isFinite(currentTime) &&
    endTime <= currentTime
  )
}

/**
 * Video is available only after the meeting ends and
 * when its effective video recording setting is enabled.
 */
export const hasVideo = (meeting, now = new Date()) => {
  if (!isMeetingCompleted(meeting, now)) {
    return false
  }

  return recordingFlags(meeting).recordVideo === true
}

/**
 * A transcript is available only for a completed meeting
 * where MeetAI was enabled and transcript text exists.
 */
export const hasTranscript = (meeting, now = new Date()) => {
  if (!isMeetingCompleted(meeting, now)) {
    return false
  }

  const { autoJoin, recordVideo } = recordingFlags(meeting)

  if (!autoJoin && !recordVideo) {
    return false
  }

  return hasAvailableTranscript(meeting, now)
}

/**
 * Format a date for display.
 */
export const dateLabel = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Split transcript paragraphs into displayable entries.
 * Expected source format:
 * 12:01 PM — Transcript text
 */
export const chaptersOf = (meeting) => {
  const transcript = meeting?.transcript?.text

  if (
    meeting?.transcript?.available !== true ||
    typeof transcript !== 'string' ||
    !transcript.trim()
  ) {
    return []
  }

  return transcript
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const separatorIndex = block.indexOf(' — ')

      if (separatorIndex === -1) {
        return {
          id: `${meeting.id}-chapter-${index + 1}`,
          time: '',
          text: block,
        }
      }

      return {
        id: `${meeting.id}-chapter-${index + 1}`,
        time: block.slice(0, separatorIndex).trim(),
        text: block.slice(separatorIndex + 3).trim(),
      }
    })
}

/**
 * Styles for the recording filter chips.
 */
export const chipSx = (active) => ({
  borderRadius: '999px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.8125rem',
  px: 1.75,
  py: 0.75,
  minHeight: 34,
  border: '1px solid',
  borderColor: active ? 'primary.main' : 'divider',
  bgcolor: active ? 'primary.main' : 'background.paper',
  color: active ? 'primary.contrastText' : 'text.secondary',
  '&:hover': {
    bgcolor: active ? 'primary.dark' : 'action.hover',
    borderColor: active ? 'primary.dark' : 'text.secondary',
  },
})
