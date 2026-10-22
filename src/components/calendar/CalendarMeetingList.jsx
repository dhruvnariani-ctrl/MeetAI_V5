import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import { getMeetingToggleSettings, getStatusKey } from '../meetings/meetingHelpers'
import { C, Pill, cardSx, lightBtn, minutesOf, scrollSx } from '../ui'
import { chipSx } from './CalendarFilters'
import { formatCountdown } from '../../utils/time'
import usePagination from '../../hooks/usePagination'

const STATUS_FILTERS = [
  ['All', 'All'],
  ['Done', 'Completed'],
  ['Live', 'Live'],
  ['Upcoming', 'Upcoming'],
]

const PAGE_SIZE = 5

function MeetingCard({
  meeting,
  view,
  settings,
  now,
  selected,
  onSelect,
  onOpen,
}) {
  const status = getStatusKey(meeting)
  const { autoJoin, recordVideo } = getMeetingToggleSettings(meeting, settings)
  const start = new Date(meeting.start)

  const statusLabel =
    status === 'Done' ? (
      <Pill color={C.green} bg="transparent" sx={{ px: 0 }}>
        <CheckCircleOutlineRoundedIcon />
        Meeting Completed
      </Pill>
    ) : status === 'Live' ? (
      <Pill color="#fff" bg={C.green}>
        LIVE NOW
      </Pill>
    ) : (
      <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>
        Upcoming in {formatCountdown(start - now)}
      </Typography>
    )

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Inspect ${meeting.title}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          e.target === e.currentTarget
        ) {
          e.preventDefault()
          onSelect()
        }
      }}
      sx={{
        p: 1.5,
        borderRadius: '12px',
        cursor: 'pointer',
        border: `${selected ? 2 : 1}px solid ${
          selected ? C.blue : C.line
        }`,
        bgcolor: status === 'Live' ? '#F2FBF5' : '#fff',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          borderColor: selected ? C.blue : '#B7CDED',
          boxShadow: '0 2px 8px rgba(30, 64, 110, 0.05)',
        },
        '&:focus-visible': {
          outline: `2px solid ${C.blue}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flexWrap: 'wrap',
        }}
      >
        <Pill color={C.navy} bg={C.soft}>
          {view !== 'day' &&
            `${start.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })} · `}
          {meeting.time}
        </Pill>

        {statusLabel}

        <Pill
          color={C.muted}
          bg={C.soft}
          sx={{ ml: 'auto' }}
        >
          {meeting.platform} · {minutesOf(meeting)} mins
        </Pill>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mt: 1,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: C.navy,
              lineHeight: 1.3,
              overflowWrap: 'anywhere',
            }}
          >
            {meeting.title}
          </Typography>

          <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>
            {meeting.participants} participants
          </Typography>
        </Box>

        {status === 'Done' ? (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onOpen(meeting.id)
            }}
            sx={{
              ...lightBtn,
              bgcolor: C.paleBlue,
              border: 0,
              color: C.blue,
              flexShrink: 0,
            }}
          >
            View Meeting Details →
          </Button>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              bgcolor: C.soft,
              borderRadius: '10px',
              px: 1.5,
              py: 0.75,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: C.muted,
                }}
              >
                MEETAI PRESENCE
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: autoJoin ? C.green : C.muted,
                }}
              >
                {autoJoin ? 'Auto-Join ON' : 'Auto-Join OFF'}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: C.muted,
                }}
              >
                VIDEO CAPTURE
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: recordVideo ? C.green : C.muted,
                }}
              >
                {recordVideo ? 'Recording ON' : 'Notes Only (Video OFF)'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

/* Meeting list with status filters and pagination. */
export default function CalendarMeetingList({
  meetings = [],
  view,
  now,
  settings,
  selectedId,
  onSelect,
  onOpen,
}) {
  const [statusFilter, setStatusFilter] = useState('All')

  const withStatus = useMemo(
    () =>
      meetings.map((meeting) => ({
        meeting,
        status: getStatusKey(meeting),
      })),
    [meetings],
  )

  const counts = (key) =>
    key === 'All'
      ? withStatus.length
      : withStatus.filter((item) => item.status === key).length

  const shown = useMemo(
    () =>
      withStatus
        .filter(
          (item) =>
            statusFilter === 'All' || item.status === statusFilter,
        )
        .map((item) => item.meeting),
    [withStatus, statusFilter],
  )

  const {
    page: safePage,
    pageCount: totalPages,
    total,
    from: firstItem,
    to: lastItem,
    pageItems: paginatedMeetings,
    setPage,
  } = usePagination(shown, PAGE_SIZE, statusFilter)

  const handleFilterChange = (filter) => setStatusFilter(filter)
  const goToPage = setPage

  return (
    <Box
      sx={{
        ...cardSx,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Status filters */}
      <Box
        sx={{
          p: 1.25,
          pb: 1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          flexShrink: 0,
        }}
        role="group"
        aria-label="Filter meetings by status"
      >
        {STATUS_FILTERS.map(([key, label]) => (
          <Button
            key={key}
            aria-pressed={statusFilter === key}
            onClick={() => handleFilterChange(key)}
            sx={chipSx(statusFilter === key)}
          >
            {label} ({counts(key)})
          </Button>
        ))}
      </Box>

      {/* List hint */}
      <Typography
        sx={{
          px: 1.25,
          pt: 1,
          fontSize: '0.8125rem',
          color: C.muted,
          flexShrink: 0,
        }}
      >
        Click a meeting to see its details. Click it again to go back to
        Calendar.
      </Typography>

      {/* Paginated meeting cards */}
      <Box
        sx={{
          ...scrollSx,
          flex: 1,
          minHeight: 0,
          p: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {paginatedMeetings.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center', color: C.muted }}>
            <Typography sx={{ fontWeight: 600, color: C.navy }}>
              No meetings in this period
            </Typography>

            <Typography sx={{ fontSize: '0.9375rem' }}>
              Try another date, status or reset the filters.
            </Typography>
          </Box>
        )}

        {paginatedMeetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            view={view}
            now={now}
            settings={settings?.[meeting.id]}
            selected={selectedId === meeting.id}
            onSelect={() => onSelect(meeting.id)}
            onOpen={onOpen}
          />
        ))}
      </Box>

      {/* Pagination footer */}
      {shown.length > 0 && (
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
            Showing {firstItem}–{lastItem} of {total}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
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