
import { CURRENT_USER } from './User'

const MIN = 60000
const TASK_STATUS_STORAGE_KEY = 'meetai-task-status-overrides'

const PEOPLE = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@avaada.com' },
  { name: 'Ananya Rao', email: 'ananya.rao@avaada.com' },
  { name: 'Karan Malhotra', email: 'karan.malhotra@avaada.com' },
  { name: 'Meera Iyer', email: 'meera.iyer@avaada.com' },
  { name: 'Rohan Desai', email: 'rohan.desai@avaada.com' },
  { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@avaada.com' },
]

/* ==========================================================================
   TASK STATUS STORAGE
   ========================================================================== */

function readTaskStatusOverrides() {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(
      TASK_STATUS_STORAGE_KEY,
    )

    if (!raw) return {}

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

function writeTaskStatusOverrides(overrides) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      TASK_STATUS_STORAGE_KEY,
      JSON.stringify(overrides),
    )
  } catch {
    // Meeting data should continue working if storage is unavailable.
  }
}

function applyTaskStatusOverrides(meetings) {
  const overrides = readTaskStatusOverrides()

  return meetings.map((meeting) => ({
    ...meeting,
    actionItems: Array.isArray(meeting.actionItems)
      ? meeting.actionItems.map((item) => {
          const override = overrides[meeting.id]?.[item.id]

          return override
            ? { ...item, status: override.status }
            : item
        })
      : meeting.actionItems,
  }))
}

export function updateMeetingActionItemStatus(
  meetingId,
  actionItemId,
  status,
) {
  if (!meetingId || !actionItemId || !status) return

  const current = readTaskStatusOverrides()
  const meetingOverrides = current[meetingId] ?? {}

  writeTaskStatusOverrides({
    ...current,
    [meetingId]: {
      ...meetingOverrides,
      [actionItemId]: { status },
    },
  })
}

/* ==========================================================================
   DATE AND TRANSCRIPT HELPERS
   ========================================================================== */

function formatMeetingTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getMeetingDuration(start, end) {
  return Math.max(
    0,
    Math.round(
      (new Date(end).getTime() -
        new Date(start).getTime()) /
        MIN,
    ),
  )
}

function buildCompletedTranscript(meeting) {
  const start = new Date(meeting.start)
  const end = new Date(meeting.end)
  const duration = getMeetingDuration(start, end)

  const firstTime = new Date(
    start.getTime() + Math.min(1, duration) * MIN,
  )

  const middleTime = new Date(
    start.getTime() + Math.floor(duration / 2) * MIN,
  )

  const finalTime = new Date(
    Math.max(
      start.getTime(),
      end.getTime() - Math.min(1, duration) * MIN,
    ),
  )

  const actionItems = Array.isArray(meeting.actionItems)
    ? meeting.actionItems
    : []

  const lines = [
    `${formatMeetingTime(firstTime)} — The team started the ${meeting.title.toLowerCase()} discussion.`,
    `${formatMeetingTime(middleTime)} — The team reviewed the meeting topics and discussed the next steps.`,
  ]

  if (actionItems.length > 0) {
    lines.push(
      `${formatMeetingTime(finalTime)} — The team discussed action items: ${actionItems
        .map((item) => item.title)
        .join('; ')}.`,
    )
  } else {
    lines.push(
      `${formatMeetingTime(finalTime)} — The team reviewed the discussion and concluded the meeting.`,
    )
  }

  lines.push(
    `${formatMeetingTime(end)} — Meeting ended.`,
  )

  return lines.join('\n\n')
}

/**
 * Recording and transcript availability are calculated from the meeting times.
 *
 * Recording:
 *   Meeting ended AND video recording toggle is on.
 *
 * Transcript:
 *   Meeting ended.
 *
 * These values are derived at read time, not stored as permanent values
 * in the meeting definitions.
 */
function applyMeetingAvailability(meetings, now = new Date()) {
  const currentTime = new Date(now).getTime()

  return meetings.map((meeting) => {
    const completed =
      new Date(meeting.end).getTime() <= currentTime

    const recordingAvailable =
      completed && meeting.meetAI?.recordVideo === true

    const duration = getMeetingDuration(
      meeting.start,
      meeting.end,
    )

    return {
      ...meeting,

      recording: {
        available: recordingAvailable,
        duration: recordingAvailable
          ? `${duration} min`
          : null,
      },

      transcript: {
        available: completed,
        text: completed
          ? buildCompletedTranscript(meeting)
          : null,
      },
    }
  })
}

/* ==========================================================================
   MEETING DATA
   ========================================================================== */

function buildMeetings(now = new Date()) {
  const t = new Date(now)
  t.setSeconds(0, 0)
  t.setMilliseconds(0)

  const at = (offsetMin) =>
    new Date(t.getTime() + offsetMin * MIN)

  const me = { ...CURRENT_USER }

  return [
    // M10 — Yesterday's project review
    {
      id: 'm10',
      title: 'Old project review',
      start: at(-24 * 60 - 90),
      end: at(-24 * 60 - 60),
      platform: 'Microsoft Teams',
      link: 'https://teams.microsoft.com/l/meetup-join/old-project',

      participants: [
        { ...me, attended: true },
        { ...PEOPLE[0], attended: true },
        { ...PEOPLE[4], attended: true },
      ],

      meetAI: {
        invited: true,
        attended: true,
        recordVideo: true,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary:
        'The team reviewed the previous project, discussed lessons learned, and agreed on improvements for the next project.',

      actionItems: [
        {
          id: 'm10-a1',
          title: 'Document the lessons learned',
          owner: 'Dhruv Nariani',
          due: at(24 * 60 + 120),
          priority: 'Low',
          status: 'Done',
        },
      ],

      attendanceDetails: {
        [me.email]: {
          joinedAt: at(-24 * 60 - 89),
          leftAt: at(-24 * 60 - 60),
        },
        [PEOPLE[0].email]: {
          joinedAt: at(-24 * 60 - 87),
          leftAt: at(-24 * 60 - 62),
        },
      },
    },

    // M1 — Weekly design review
    {
      id: 'm1',
      title: 'Weekly design review',
      start: at(-240),
      end: at(-210),
      platform: 'Google Meet',
      link: 'https://meet.google.com/abc-defg-hij',

      participants: [
        { ...me, attended: true },
        { ...PEOPLE[0], attended: true },
        { ...PEOPLE[1], attended: false },
      ],

      meetAI: {
        invited: true,
        attended: true,
        recordVideo: true,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary:
        'The team reviewed the current design progress, discussed the remaining changes, and agreed on the next steps for the design work.',

      actionItems: [
        {
          id: 'm1-a1',
          title: 'Review the revised design',
          owner: 'Dhruv Nariani',
          due: at(60),
          priority: 'High',
          status: 'Pending',
        },
        {
          id: 'm1-a2',
          title: 'Share the updated design with the team',
          owner: 'Aarav Mehta',
          due: at(180),
          priority: 'Medium',
          status: 'In Process',
        },
      ],

      attendanceDetails: {
        [me.email]: {
          joinedAt: at(-239),
          leftAt: at(-210),
        },
        [PEOPLE[0].email]: {
          joinedAt: at(-237),
          leftAt: at(-212),
        },
      },
    },

    // M5 — Leadership review
    {
      id: 'm5',
      title: 'Leadership review',
      start: at(-180),
      end: at(-150),
      platform: 'Zoom',
      link: 'https://zoom.us/j/987654321',

      participants: [
        { ...me, attended: true },
        { ...PEOPLE[2], attended: true },
        { ...PEOPLE[3], attended: true },
      ],

      meetAI: {
        invited: false,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary:
        'Leadership reviewed the current business priorities and discussed the next quarter objectives.',

      actionItems: [
        {
          id: 'm5-a1',
          title: 'Prepare next quarter priorities',
          owner: 'Dhruv Nariani',
          due: at(24 * 60),
          priority: 'High',
          status: 'Blocked',
        },
        {
          id: 'm5-a2',
          title: 'Send leadership summary',
          owner: 'Meera Iyer',
          due: at(24 * 60 + 180),
          priority: 'Medium',
          status: 'Pending',
        },
      ],

      attendanceDetails: {
        [me.email]: {
          joinedAt: at(-179),
          leftAt: at(-150),
        },
      },
    },

    // M22 — Sales follow-up
    {
      id: 'm22',
      title: 'Sales follow-up',
      start: at(-120),
      end: at(-90),
      platform: 'Google Meet',
      link: 'https://meet.google.com/sales-followup',

      participants: [
        { ...me, attended: true },
        { ...PEOPLE[4], attended: true },
        { ...PEOPLE[5], attended: true },
      ],

      meetAI: {
        invited: true,
        attended: true,
        recordVideo: true,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary:
        'The sales team reviewed the customer follow-up plan and agreed on the next communication steps.',

      actionItems: [
        {
          id: 'm22-a1',
          title: 'Send the customer follow-up email',
          owner: 'Dhruv Nariani',
          due: at(120),
          priority: 'High',
          status: 'Done',
        },
      ],

      attendanceDetails: {
        [me.email]: {
          joinedAt: at(-119),
          leftAt: at(-90),
        },
      },
    },

    // M8 — Candidate interview
    {
      id: 'm8',
      title: 'Candidate interview',
      start: at(-60),
      end: at(-30),
      platform: 'Microsoft Teams',
      link: 'https://teams.microsoft.com/l/meetup-join/interview',

      participants: [
        { ...me, attended: true },
        { ...PEOPLE[5], attended: true },
      ],

      meetAI: {
        invited: false,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary:
        'The interview covered the candidate background, previous experience, and role expectations.',

      actionItems: [
        {
          id: 'm8-a1',
          title: 'Share interview feedback',
          owner: 'Dhruv Nariani',
          due: at(180),
          priority: 'Low',
          status: 'In Process',
        },
      ],

      attendanceDetails: {
        [me.email]: {
          joinedAt: at(-59),
          leftAt: at(-30),
        },
      },
    },

    // M2 — Sprint planning
    {
      id: 'm2',
      title: 'Sprint planning',
      start: at(-10),
      end: at(50),
      platform: 'Microsoft Teams',
      link: 'https://teams.microsoft.com/l/meetup-join/sample',

      participants: [
        { ...me, attended: null },
        { ...PEOPLE[0], attended: null },
        { ...PEOPLE[2], attended: null },
        { ...PEOPLE[3], attended: null },
        { ...PEOPLE[4], attended: null },
      ],

      meetAI: {
        invited: true,
        attended: true,
        recordVideo: true,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary: null,

      actionItems: [
        {
          id: 'm2-a1',
          title: 'Finalize sprint priorities',
          owner: 'Dhruv Nariani',
          due: at(120),
          priority: 'High',
          status: 'In Process',
        },
        {
          id: 'm2-a2',
          title: 'Update sprint board',
          owner: 'Karan Malhotra',
          due: at(240),
          priority: 'Medium',
          status: 'Pending',
        },
      ],

      attendanceDetails: {},
    },

    // M3 — Customer sync
    {
      id: 'm3',
      title: 'Customer sync',
      start: at(60),
      end: at(90),
      platform: 'Zoom',
      link: 'https://zoom.us/j/123456789',

      participants: [
        { ...me, attended: null },
        { ...PEOPLE[1], attended: null },
        { ...PEOPLE[4], attended: null },
      ],

      meetAI: {
        invited: true,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary: null,

      actionItems: [
        {
          id: 'm3-a1',
          title: 'Prepare customer questions',
          owner: 'Dhruv Nariani',
          due: at(30),
          priority: 'Medium',
          status: 'Pending',
        },
      ],

      attendanceDetails: {},
    },

    // M4 — Product demo
    {
      id: 'm4',
      title: 'Product demo',
      start: at(150),
      end: at(180),
      platform: 'Google Meet',
      link: 'https://meet.google.com/product-demo',

      participants: [
        { ...me, attended: null },
        { ...PEOPLE[3], attended: null },
        { ...PEOPLE[5], attended: null },
      ],

      meetAI: {
        invited: false,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary: null,

      actionItems: [
        {
          id: 'm4-a1',
          title: 'Prepare product demonstration',
          owner: 'Dhruv Nariani',
          due: at(90),
          priority: 'High',
          status: 'Pending',
        },
      ],

      attendanceDetails: {},
    },

    // M6 — Engineering standup
    {
      id: 'm6',
      title: 'Engineering standup',
      start: at(240),
      end: at(270),
      platform: 'Microsoft Teams',
      link: 'https://teams.microsoft.com/l/meetup-join/standup',

      participants: [
        { ...me, attended: null },
        { ...PEOPLE[0], attended: null },
        { ...PEOPLE[2], attended: null },
        { ...PEOPLE[5], attended: null },
      ],

      meetAI: {
        invited: false,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary: null,

      actionItems: [
        {
          id: 'm6-a1',
          title: 'Resolve the deployment blocker',
          owner: 'Dhruv Nariani',
          due: at(300),
          priority: 'High',
          status: 'Blocked',
        },
        {
          id: 'm6-a2',
          title: 'Review the engineering checklist',
          owner: 'Sneha Kulkarni',
          due: at(360),
          priority: 'Low',
          status: 'Pending',
        },
      ],

      attendanceDetails: {},
    },

    // M9 — Tomorrow planning
    {
      id: 'm9',
      title: 'Tomorrow planning',
      start: at(24 * 60 + 60),
      end: at(24 * 60 + 90),
      platform: 'Google Meet',
      link: 'https://meet.google.com/tomorrow-planning',

      participants: [
        { ...me, attended: null },
        { ...PEOPLE[2], attended: null },
        { ...PEOPLE[4], attended: null },
      ],

      meetAI: {
        invited: false,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary: null,

      actionItems: [
        {
          id: 'm9-a1',
          title: 'Prepare tomorrow planning notes',
          owner: 'Dhruv Nariani',
          due: at(24 * 60),
          priority: 'Medium',
          status: 'Pending',
        },
      ],

      attendanceDetails: {},
    },

    // M11 — Aarav and Meera project review
    // Renamed from duplicate m7 to ensure unique meeting IDs.
    {
      id: 'm11',
      title: 'Aarav and Meera project review',
      start: at(300),
      end: at(330),

      owner: {
        name: 'Aarav Mehta',
        email: 'aarav@avaada.com',
      },

      platform: 'Google Meet',
      link: 'https://meet.google.com/project-review',

      participants: [
        { ...PEOPLE[1], attended: null },
        { ...PEOPLE[3], attended: null },
        { ...PEOPLE[4], attended: null },
      ],

      meetAI: {
        invited: false,
        attended: false,
        recordVideo: false,
      },

      recording: { available: false, duration: null },
      transcript: { available: false, text: null },

      meetingSummary: null,

      actionItems: [
        {
          id: 'm11-a1',
          title: 'Review project milestones',
          owner: 'Aarav Mehta',
          due: at(360),
          priority: 'Medium',
          status: 'Pending',
        },
      ],

      attendanceDetails: {},
    },
  ]
}

/* ==========================================================================
   ALL MEETINGS
   ========================================================================== */

export function getAllMeetings(now = new Date()) {
  const meetings = buildMeetings(now)

  // Ensure that every meeting ID is unique.
  const meetingIds = meetings.map((meeting) => meeting.id)

  if (new Set(meetingIds).size !== meetingIds.length) {
    throw new Error(
      'Duplicate meeting IDs detected in buildMeetings().',
    )
  }

  // Ensure that every action-item ID is globally unique.
  const actionItemIds = meetings.flatMap((meeting) =>
    (meeting.actionItems ?? []).map((item) => item.id),
  )

  if (
    new Set(actionItemIds).size !== actionItemIds.length
  ) {
    throw new Error(
      'Duplicate action-item IDs detected in buildMeetings().',
    )
  }

  const meetingsWithOverrides =
    applyTaskStatusOverrides(meetings)

  return applyMeetingAvailability(
    meetingsWithOverrides,
    now,
  )
}

/* ==========================================================================
   TODAY'S MEETINGS
   ========================================================================== */

export function getTodaysMeetings(now = new Date()) {
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return getAllMeetings(now).filter((meeting) => {
    const start = new Date(meeting.start)

    return start >= today && start < tomorrow
  })
}

/* ==========================================================================
   FIND MEETING BY ID
   ========================================================================== */

export function getMeetingById(meetingId, now = new Date()) {
  return getAllMeetings(now).find(
    (meeting) =>
      String(meeting.id) === String(meetingId),
  )
}

/* ==========================================================================
   MEETINGS FOR A SPECIFIC DATE
   ========================================================================== */

export function getMeetingsForDate(date, now = new Date()) {
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  const nextDay = new Date(target)
  nextDay.setDate(nextDay.getDate() + 1)

  return getAllMeetings(now).filter((meeting) => {
    const start = new Date(meeting.start)

    return start >= target && start < nextDay
  })
}
