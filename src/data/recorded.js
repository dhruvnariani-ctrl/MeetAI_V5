
import { matchesDateFilter } from '../utils/dateFilters'
import {
  getMeetingSettings,
  getMeetingSettingsForMeeting,
} from './meetingSettings'

export const RECORDED_SORT_OPTIONS = [
  'Newest',
  'Oldest',
  'Meeting title',
]

/**
 * Resolve saved settings and meeting defaults consistently.
 * Saved values override defaults; missing saved fields use defaults.
 */
export function recordingFlags(meeting, saved = getMeetingSettings()) {
  if (!meeting?.id) {
    return {
      autoJoin: false,
      recordVideo: false,
    }
  }

  const defaults = getMeetingSettingsForMeeting(meeting)
  const stored = saved?.[meeting.id] ?? {}

  const autoJoin =
    stored.autoJoin ?? defaults.autoJoin ?? false

  const recordVideo =
    autoJoin === true
      ? (stored.recordVideo ?? defaults.recordVideo ?? false)
      : false

  return {
    autoJoin: autoJoin === true,
    recordVideo: recordVideo === true,
  }
}

/**
 * A meeting is completed only after its end time has passed.
 */
export function isCompletedMeeting(meeting, now = new Date()) {
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
 * when video recording is enabled.
 */
export function hasRecordedVideo(
  meeting,
  saved = getMeetingSettings(),
  now = new Date()
) {
  if (!isCompletedMeeting(meeting, now)) {
    return false
  }

  return recordingFlags(meeting, saved).recordVideo
}

/**
 * A transcript must exist and contain text, and the meeting
 * must have ended.
 */
export function hasTranscript(meeting, now = new Date()) {
  if (!isCompletedMeeting(meeting, now)) {
    return false
  }

  return (
    meeting.transcript?.available === true &&
    typeof meeting.transcript?.text === 'string' &&
    meeting.transcript.text.trim().length > 0
  )
}

/**
 * Return meetings eligible for the Recorded Meetings page.
 *
 * Meetings are excluded when MeetAI was not enabled and video
 * recording was not enabled.
 */
export function getRecordedMeetings(
  meetings,
  search = '',
  dateFilter,
  sortBy = 'Newest',
  typeFilter = 'All Recorded',
  now = new Date()
) {
  const saved = getMeetingSettings()
  const query = search.trim().toLowerCase()

  let result = meetings.filter((meeting) => {
    if (!isCompletedMeeting(meeting, now)) {
      return false
    }

    const { autoJoin, recordVideo } = recordingFlags(meeting, saved)

    if (!autoJoin && !recordVideo) {
      return false
    }

    return (
      hasRecordedVideo(meeting, saved, now) ||
      hasTranscript(meeting, now)
    )
  })

  if (typeFilter === 'With Video') {
    result = result.filter((meeting) =>
      hasRecordedVideo(meeting, saved, now)
    )
  } else if (typeFilter === 'Transcripts Only') {
    result = result.filter(
      (meeting) =>
        !hasRecordedVideo(meeting, saved, now) &&
        hasTranscript(meeting, now)
    )
  }

  if (query) {
    result = result.filter((meeting) => {
      const title = meeting.title ?? ''
      const platform = meeting.platform ?? ''

      const participants = Array.isArray(meeting.participants)
        ? meeting.participants
            .map((participant) => {
              if (typeof participant === 'string') {
                return participant
              }

              return (
                participant?.name ??
                participant?.email ??
                ''
              )
            })
            .join(' ')
        : ''

      return `${title} ${platform} ${participants}`
        .toLowerCase()
        .includes(query)
    })
  }

  if (dateFilter && dateFilter !== 'All') {
    result = result.filter((meeting) =>
      matchesDateFilter(meeting, dateFilter)
    )
  }

  result.sort((a, b) => {
    if (sortBy === 'Meeting title') {
      return (a.title ?? '').localeCompare(b.title ?? '')
    }

    const aTime = new Date(a.start).getTime()
    const bTime = new Date(b.start).getTime()

    return sortBy === 'Oldest'
      ? aTime - bTime
      : bTime - aTime
  })

  return result
}
