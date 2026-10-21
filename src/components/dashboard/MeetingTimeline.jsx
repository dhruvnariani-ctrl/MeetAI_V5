import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import MeetingToggles from '../MeetingToggles'
import DashboardCompletedBar from './DashboardCompletedBar'
import { C, Pill, cardSx, lightBtn, minutesOf } from '../ui'
import { formatTime, statusOf } from './dashboardUtils'

const PAGE_SIZE = 5

/* One meeting row: time block, status, title, and either MeetAI toggles or the summary button. */
export function MeetingRow({
  meeting,
  status,
  settings,
  onSettingsChange,
  onOpen,
}) {
  const live = status === 'live'
  const past = status === 'past'
  const count = Array.isArray(meeting.participants)
    ? meeting.participants.length
    : 0

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.25,
        borderRadius: '12px',
        border: `1px solid ${live ? C.green : C.line}`,
        bgcolor: live ? '#F2FBF5' : '#fff',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      {/* Time */}
      <Box
        sx={{
          width: 78,
          flexShrink: 0,
          textAlign: 'center',
          bgcolor: live ? C.paleGreen : C.soft,
          borderRadius: '10px',
          py: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: C.navy,
            lineHeight: 1.3,
          }}
        >
          {formatTime(meeting._start)}
        </Typography>

        <Typography sx={{ fontSize: '0.75rem', color: C.muted }}>
          {minutesOf(meeting)} mins
        </Typography>
      </Box>

      {/* Meeting information */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flexWrap: 'wrap',
          }}
        >
          <Pill
            color={live ? C.green : past ? C.muted : C.blue}
            bg={live ? C.paleGreen : past ? C.soft : C.paleBlue}
            sx={{ fontSize: '0.75rem' }}
          >
            {live ? 'LIVE NOW' : past ? 'Completed' : 'Upcoming'}
          </Pill>

          <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>
            {meeting.platform}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: C.navy,
            lineHeight: 1.3,
          }}
          noWrap
        >
          {meeting.title}
        </Typography>

        <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>
          {count} participants
        </Typography>
      </Box>

      {/* Meeting action */}
      <Box sx={{ flexShrink: 0, maxWidth: '100%' }}>
        {past ? (
          <Button
            onClick={() => onOpen(meeting.id)}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={lightBtn}
          >
            View Meeting Summary
          </Button>
        ) : (
          <MeetingToggles
            meeting={meeting}
            settings={settings}
            onChange={onSettingsChange}
          />
        )}
      </Box>
    </Box>
  )
}

/* Today's schedule with completed meetings above the paginated live/upcoming list. */
export default function MeetingTimeline({
  meetings = [],
  now,
  settings,
  onSettingsChange,
  onOpen,
}) {
  const [page, setPage] = useState(1)

  const scheduled = useMemo(
    () => meetings.filter((meeting) => statusOf(meeting, now) !== 'past'),
    [meetings, now],
  )

  const totalPages = Math.max(1, Math.ceil(scheduled.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginatedMeetings = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE
    return scheduled.slice(startIndex, startIndex + PAGE_SIZE)
  }, [scheduled, safePage])

  useEffect(() => {
    setPage(1)
  }, [meetings])

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  const firstItem =
    scheduled.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const lastItem = Math.min(safePage * PAGE_SIZE, scheduled.length)

  return (
    <Box
      sx={{
        ...cardSx,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          borderBottom: `1px solid ${C.line}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'inherit',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: C.navy,
            }}
          >
            Today&apos;s Meeting Schedule
          </Typography>

          <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>
            Recordings, summaries and MeetAI settings
          </Typography>
        </Box>

        <Pill>{scheduled.length} upcoming</Pill>
      </Box>

      {/* Completed meetings stay above the paginated rows */}
      <Box
        sx={{
          p: 1.25,
          pb: 0,
          flexShrink: 0,
        }}
      >
        <DashboardCompletedBar
          meetings={meetings}
          now={now}
          settings={settings}
          onSettingsChange={onSettingsChange}
          onOpen={onOpen}
        />
      </Box>

      {/* Paginated live/upcoming meetings */}
      <Box
        sx={{
          p: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        {scheduled.length === 0 && (
          <Typography sx={{ p: 2, color: C.muted }}>
            No more meetings today.
          </Typography>
        )}

        {paginatedMeetings.map((meeting) => (
          <MeetingRow
            key={meeting.id}
            meeting={meeting}
            status={statusOf(meeting, now)}
            settings={settings?.[meeting.id]}
            onSettingsChange={(changes) =>
              onSettingsChange(meeting.id, changes)
            }
            onOpen={onOpen}
          />
        ))}
      </Box>

      {/* Pagination footer */}
      {scheduled.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
            px: 1.5,
            py: 1.25,
            borderTop: `1px solid ${C.line}`,
            bgcolor: '#fff',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: C.muted,
              fontWeight: 500,
            }}
            aria-live="polite"
          >
            Showing {firstItem}–{lastItem} of {scheduled.length}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              disabled={safePage <= 1}
              onClick={() => goToPage(safePage - 1)}
              startIcon={<ChevronLeftRoundedIcon />}
              sx={{
                minWidth: 0,
                px: 1.25,
                py: 0.625,
                borderRadius: '9px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: C.line,
                color: C.navy,
                '&:hover': {
                  borderColor: C.blue,
                  bgcolor: C.paleBlue,
                },
                '&.Mui-disabled': {
                  borderColor: C.line,
                  color: '#A7B0BD',
                },
              }}
            >
              Previous
            </Button>

            <Typography
              sx={{
                minWidth: 48,
                textAlign: 'center',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: C.navy,
              }}
              aria-label={`Page ${safePage} of ${totalPages}`}
            >
              {safePage} / {totalPages}
            </Typography>

            <Button
              size="small"
              variant="outlined"
              disabled={safePage >= totalPages}
              onClick={() => goToPage(safePage + 1)}
              endIcon={<ChevronRightRoundedIcon />}
              sx={{
                minWidth: 0,
                px: 1.25,
                py: 0.625,
                borderRadius: '9px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: C.line,
                color: C.navy,
                '&:hover': {
                  borderColor: C.blue,
                  bgcolor: C.paleBlue,
                },
                '&.Mui-disabled': {
                  borderColor: C.line,
                  color: '#A7B0BD',
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}