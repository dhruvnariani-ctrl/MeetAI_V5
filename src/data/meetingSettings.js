
const STORAGE_KEY = 'meetai-meeting-settings'

function readStoredSettings() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      return {}
    }

    return parsed
  } catch {
    return {}
  }
}

function writeStoredSettings(settings) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    )
  } catch {
    // Ignore localStorage failures.
  }
}

function normalizeSettings(saved = {}, meeting = {}) {
  const autoJoin =
    saved?.autoJoin ??
    meeting?.meetAI?.invited ??
    false

  const recordVideo =
    autoJoin === true
      ? (
          saved?.recordVideo ??
          meeting?.meetAI?.recordVideo ??
          false
        )
      : false

  return {
    ...saved,
    autoJoin: autoJoin === true,
    recordVideo: recordVideo === true,
  }
}

/**
 * Build normalized settings for the supplied meetings.
 * Saved settings take priority over meeting defaults.
 */
export function createMeetingSettings(meetings = []) {
  const stored = readStoredSettings()

  return meetings.reduce((result, meeting) => {
    if (!meeting?.id) {
      return result
    }

    result[meeting.id] = normalizeSettings(
      stored[meeting.id],
      meeting
    )

    return result
  }, {})
}

/**
 * Get the saved MeetAI settings.
 */
export function getMeetingSettings() {
  return readStoredSettings()
}

/**
 * Get the effective settings for one meeting.
 * This includes meeting defaults when no saved value exists.
 */
export function getMeetingSettingsForMeeting(meeting) {
  if (!meeting?.id) {
    return normalizeSettings()
  }

  const stored = readStoredSettings()

  return normalizeSettings(
    stored[meeting.id],
    meeting
  )
}

/**
 * Save settings for one meeting.
 * Video recording is forced off whenever auto-join is off.
 */
export function saveMeetingSettings(meetingId, changes = {}) {
  if (!meetingId) {
    return readStoredSettings()
  }

  const current = readStoredSettings()
  const existing = current[meetingId] ?? {}

  const nextAutoJoin =
    changes?.autoJoin ??
    existing?.autoJoin ??
    false

  const nextRecordVideo =
    nextAutoJoin === true
      ? (
          changes?.recordVideo ??
          existing?.recordVideo ??
          false
        )
      : false

  const nextSettings = {
    ...current,
    [meetingId]: {
      ...existing,
      ...changes,
      autoJoin: nextAutoJoin === true,
      recordVideo: nextRecordVideo === true,
    },
  }

  writeStoredSettings(nextSettings)

  return nextSettings
}

/**
 * Update MeetAI auto-join for multiple meetings.
 * Enabling auto-join does not automatically enable video.
 */
export function saveMeetingSettingsBulk(meetings = [], checked) {
  const current = readStoredSettings()
  const next = { ...current }

  meetings.forEach((meeting) => {
    if (!meeting?.id) {
      return
    }

    const existing = next[meeting.id] ?? {}

    next[meeting.id] = {
      ...existing,
      autoJoin: checked === true,
      ...(checked === true
        ? {}
        : { recordVideo: false }),
    }
  })

  writeStoredSettings(next)

  return next
}

/**
 * Clear the saved settings for one meeting.
 */
export function clearMeetingSettings(meetingId) {
  if (!meetingId) {
    return readStoredSettings()
  }

  const current = readStoredSettings()
  const next = { ...current }

  delete next[meetingId]

  writeStoredSettings(next)

  return next
}

/**
 * Clear only MeetAI meeting settings from localStorage.
 */
export function clearAllMeetingSettings() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore localStorage failures.
  }
}
