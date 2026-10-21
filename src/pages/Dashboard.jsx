import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'

import ConfirmMarkDoneDialog from '../components/tasks/ConfirmMarkDoneDialog'
import DashboardActionItemsCard, { isOpenTask } from '../components/dashboard/DashboardActionItemsCard'
import DashboardFocusCard from '../components/dashboard/DashboardFocusCard'
import DashboardOverviewHeader from '../components/dashboard/DashboardOverviewHeader'
import MeetingTimeline from '../components/dashboard/MeetingTimeline'
import { PRIORITY_ORDER, getActionItemsFromMeetings, statusOf, tasksDueTodayForUser } from '../components/dashboard/dashboardUtils'
import { fitSx, splitSx } from '../components/ui'

import { getTodaysMeetings, updateMeetingActionItemStatus } from '../data/meetings'
import { createMeetingSettings, saveMeetingSettings } from '../data/meetingSettings'
import useNow from '../hooks/Usenow'
import useCurrentUser from '../hooks/useCurrentUser'
import usePageTitle from '../hooks/usePageTitle'
import { filterUserMeetings } from '../utils/meetingAccess'

export default function Dashboard() {
  usePageTitle('Dashboard')

  const now = useNow()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const { openCreate, openInstant } = useOutletContext() ?? {}

  const [settings, setSettings] = useState(() => createMeetingSettings(getTodaysMeetings()))
  const [taskToConfirm, setTaskToConfirm] = useState(null)
  const [version, setVersion] = useState(0)

  // Today's meetings for this user, with real Date objects, earliest first.
  const meetings = useMemo(
    () =>
      filterUserMeetings(getTodaysMeetings(now), currentUser)
        .map((m) => ({ ...m, _start: new Date(m.start), _end: new Date(m.end) }))
        .sort((a, b) => a._start - b._start),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Math.floor(now.getTime() / 60000), currentUser, version],
  )

  // Due today and still open (pending, in progress or blocked), highest priority first.
  const tasks = useMemo(
    () =>
      tasksDueTodayForUser(getActionItemsFromMeetings(meetings), currentUser, now)
        .filter(isOpenTask)
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
    [meetings, currentUser, now],
  )

  const live = meetings.find((m) => statusOf(m, now) === 'live')
  const focus = live ?? meetings.find((m) => statusOf(m, now) === 'upcoming')
  const liveCount = meetings.filter((m) => statusOf(m, now) === 'live').length
  const upcomingCount = meetings.filter((m) => statusOf(m, now) === 'upcoming').length
  const firstName = currentUser?.name?.split(' ')[0] ?? 'there'
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

  const summary = liveCount
    ? `You have ${plural(liveCount, 'meeting')} happening right now, ${upcomingCount} coming up later today and ${plural(tasks.length, 'action item')} open.`
    : `You have ${plural(upcomingCount, 'upcoming meeting')} and ${plural(tasks.length, 'open action item')} due today.`

  const onSettingsChange = (meetingId, changes) => setSettings(saveMeetingSettings(meetingId, changes))
  const openMeeting = (id) => navigate(`/meetings/${id}`)

  const confirmDone = () => {
    updateMeetingActionItemStatus(taskToConfirm.meetingId, taskToConfirm.id, 'Done')
    setTaskToConfirm(null)
    setVersion((v) => v + 1)
  }

  return (
    <Box sx={fitSx}>
      <DashboardOverviewHeader
        now={now}
        firstName={firstName}
        summary={summary}
        onSchedule={() => openCreate?.()}
        onInstant={() => openInstant?.()}
      />

      {focus && (
        <DashboardFocusCard
          meeting={focus}
          now={now}
          live={Boolean(live)}
          settings={settings[focus.id]}
          onSettingsChange={(changes) => onSettingsChange(focus.id, changes)}
        />
      )}

      {/* Row height follows the taller card, so both cards match and show all their content. */}
      <Box sx={{ ...splitSx}}>
        <MeetingTimeline
          meetings={meetings}
          now={now}
          settings={settings}
          onSettingsChange={onSettingsChange}
          onOpen={openMeeting}
        />
        <DashboardActionItemsCard items={tasks} onToggle={setTaskToConfirm} onViewAll={() => navigate('/tasks')} />
      </Box>

      <ConfirmMarkDoneDialog
        open={Boolean(taskToConfirm)}
        taskTitle={taskToConfirm?.title ?? ''}
        onCancel={() => setTaskToConfirm(null)}
        onConfirm={confirmDone}
      />
    </Box>
  )
}
