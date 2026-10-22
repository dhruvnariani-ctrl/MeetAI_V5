import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'

import PageShell, { EmptyPanel } from '../components/PageShell'
import ConfirmMarkDoneDialog from '../components/tasks/ConfirmMarkDoneDialog'
import ActionItemsTab from '../components/meetingDetails/ActionItemsTab'
import AttendeesTab from '../components/meetingDetails/AttendeesTab'
import MeetingHeader from '../components/meetingDetails/MeetingHeader'
import MeetingTabs, { VALID_TABS } from '../components/meetingDetails/MeetingTabs'
import OverviewTab from '../components/meetingDetails/OverviewTab'
import RecordingTab from '../components/meetingDetails/RecordingTab'
import TranscriptTab from '../components/meetingDetails/TranscriptTab'
import { T, copyText, downloadFile, getMeetingFlags, parseTranscript } from '../components/meetingDetails/helpers'
import { formatTimeRange, getAttendance, getMeetingState } from '../components/meetingDetails/utils'
import { getMeetingById, updateMeetingActionItemStatus } from '../data/meetings'
import usePageTitle from '../hooks/usePageTitle'
import { formatDate } from '../utils/time'

export default function MeetingDetails() {
  usePageTitle('Meeting Details')

  const navigate = useNavigate()
  const { meetingId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [now, setNow] = useState(() => new Date())
  const [, setVersion] = useState(0)
  // The action item waiting for the "Mark as done?" confirmation.
  const [pendingItem, setPendingItem] = useState(null)
  const meeting = getMeetingById(meetingId)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  // The URL holds the active tab. Old links still work; unknown values fall back to the overview.
  const requestedTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(requestedTab) ? requestedTab : 'overview'

  const goToTab = (value) => {
    if (!VALID_TABS.includes(value)) return
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.set('tab', value)
        return next
      },
      { replace: true },
    )
  }

  // Action item changes are saved elsewhere; bumping this re-reads the meeting so every tab shows the new status.
  const refresh = () => setVersion((v) => v + 1)

  // Mark complete: the person confirms in the dialog, then the change is saved.
  const confirmDone = () => {
    if (meeting && pendingItem) updateMeetingActionItemStatus(meeting.id, pendingItem.id, 'Done')
    setPendingItem(null)
    refresh()
  }

  if (!meeting) {
    return (
      <PageShell title="Meeting not found" subtitle="We couldn't find the meeting you're looking for.">
        <EmptyPanel
          title="This meeting is not available"
          action={
            <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>
              Go back
            </Button>
          }
        >
          The meeting may have been removed or is no longer available.
        </EmptyPanel>
      </PageShell>
    )
  }

  const state = getMeetingState(meeting, now)
  const flags = getMeetingFlags(meeting)
  const participants = meeting.participants || []
  const attendance = getAttendance(meeting, participants)
  const attendedCount = attendance?.attended?.length ?? 0
  const openActionCount = (meeting.actionItems || []).filter((i) => i.status === 'Pending' || i.status === 'Blocked').length
  const segments = parseTranscript(meeting.transcript?.available ? meeting.transcript?.text : '')
  const timeText = formatTimeRange(meeting.start, meeting.end)
  const dateText = formatDate(meeting.start)

  return (
    <PageShell title="" subtitle="">
      <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto', color: T.ink, boxSizing: 'border-box', minWidth: 0 }}>
        <Stack spacing={2} sx={{ width: '100%', minWidth: 0 }}>
          <Box>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: 'none', fontFamily: T.sans, fontSize: '0.8125rem', fontWeight: 600, color: T.primary, px: 0, '&:hover': { bgcolor: 'transparent', color: T.blue } }}
            >
              Back to Meetings
            </Button>
          </Box>

          <MeetingHeader
            meeting={meeting}
            state={state}
            flags={flags}
            timeText={timeText}
            dateText={dateText}
            attendedCount={attendedCount}
            participantCount={participants.length}
            onWatch={() => goToTab('recording')}
            onTranscript={() => downloadFile(`${meeting.title || 'meeting'}-transcript.txt`, meeting.transcript?.text || '')}
            onPrint={() => window.print()}
            onCopyLink={() => copyText(meeting.link)}
          />

          <Box sx={{ overflowX: 'auto' }}>
            <MeetingTabs
              value={activeTab}
              onChange={(_event, value) => goToTab(value)}
              attendeeCount={participants.length}
              openActionCount={openActionCount}
            />
          </Box>

          <Box data-tour="meeting-content" sx={{ minWidth: 0 }}>
            {activeTab === 'overview' && (
              <OverviewTab meeting={meeting} flags={flags} attendance={attendance} onNavigate={goToTab} onChanged={refresh} onAskDone={setPendingItem} />
            )}
            {activeTab === 'attendees' && <AttendeesTab meeting={meeting} attendance={attendance} />}
            {activeTab === 'recording' && (
              <RecordingTab meeting={meeting} state={state} flags={flags} segments={segments} timeText={timeText} />
            )}
            {activeTab === 'transcript' && <TranscriptTab meeting={meeting} state={state} />}
            {activeTab === 'actions' && <ActionItemsTab meeting={meeting} state={state} onChanged={refresh} onAskDone={setPendingItem} />}
          </Box>
        </Stack>
      </Box>

      <ConfirmMarkDoneDialog
        open={Boolean(pendingItem)}
        taskTitle={pendingItem?.title ?? ''}
        onCancel={() => setPendingItem(null)}
        onConfirm={confirmDone}
      />
    </PageShell>
  )
}