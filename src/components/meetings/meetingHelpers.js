
/*
 * One status palette used everywhere.
 * Live = red, Upcoming = blue, Done = grey.
 */
export const STATUS_STYLES = {
  Live: {
    backgroundColor: '#fff0f0',
    color: '#c62828',
  },
  Upcoming: {
    backgroundColor: '#eaf3ff',
    color: '#1769aa',
  },
  'Up next': {
    backgroundColor: '#eaf3ff',
    color: '#1769aa',
  },
  Done: {
    backgroundColor: '#eef2f6',
    color: '#52657a',
  },
}

export function getStatusKey(value) {
  const raw =
    typeof value === 'string'
      ? value
      : value?.type ?? value?.status

  const status = String(raw ?? '').toLowerCase()

  if (status === 'live' || status === 'in progress') {
    return 'Live'
  }

  if (status === 'done' || status === 'completed') {
    return 'Done'
  }

  return 'Upcoming'
}

export function getMeetingToggleSettings(
  meeting,
  localSettings,
) {
  return {
    autoJoin:
      localSettings?.autoJoin ??
      meeting?.meetAI?.invited ??
      false,

    recordVideo:
      localSettings?.recordVideo ??
      meeting?.meetAI?.recordVideo ??
      false,
  }
}

export function getMeetingStatus(
  meeting,
  now = new Date(),
  nextId = null,
) {
  if (!meeting) return 'Done'

  const meetingStart =
    meeting.start instanceof Date
      ? meeting.start
      : new Date(meeting.start)

  const meetingEnd =
    meeting.end instanceof Date
      ? meeting.end
      : new Date(meeting.end)

  const currentTime =
    now instanceof Date ? now : new Date(now)

  if (
    currentTime >= meetingStart &&
    currentTime < meetingEnd
  ) {
    return 'Live'
  }

  if (meetingStart > currentTime) {
    return meeting.id === nextId
      ? 'Up next'
      : 'Upcoming'
  }

  return 'Done'
}

export function getStatusStyle(status) {
  return (
    STATUS_STYLES[status] ??
    STATUS_STYLES.Upcoming
  )
}

export function getParticipantCount(participants) {
  if (Array.isArray(participants)) {
    return participants.length
  }

  if (typeof participants === 'number') {
    return participants
  }

  return 0
}

export function hasParticipants(participants) {
  if (Array.isArray(participants)) {
    return participants.length > 0
  }

  return (
    typeof participants === 'number' &&
    participants > 0
  )
}

export function shouldShowMeetingToggles(status) {
  return [
    'Live',
    'Upcoming',
    'Up next',
    'Done',
  ].includes(status)
}

export function areMeetingTogglesDisabled(status) {
  return status === 'Done'
}
