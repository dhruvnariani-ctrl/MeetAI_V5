
import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

import RecordedFilters from '../components/recorded/RecordedFilters'
import RecordingList from '../components/recorded/RecordingList'
import RecordingPlayer from '../components/recorded/RecordingPlayer'

import {
  TYPES,
  hasVideo,
  hasTranscript,
} from '../components/recorded/recordedHelpers'

import {
  C,
  PageHead,
  Pill,
  cardSx,
  fitSx,
  lightBtn,
  primaryBtn,
  splitSx,
} from '../components/ui'

import { getAllMeetings } from '../data/meetings'
import { getRecordedMeetings } from '../data/recorded'
import usePageTitle from '../hooks/usePageTitle'
import usePagination from '../hooks/usePagination'

export default function RecordedMeetings() {
  usePageTitle('Recorded Meetings')

  const navigate = useNavigate()
  const { openCreate, openInstant } = useOutletContext() ?? {}

  const [type, setType] = useState(TYPES[0])
  const [dateFilter, setDateFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [selectedId, setSelectedId] = useState(null)

  const meetings = useMemo(() => getAllMeetings(), [])

  // Calculate the full set of eligible recorded meetings once
  // for the current date and sort settings.
  const byDate = useMemo(
    () =>
      getRecordedMeetings(
        meetings,
        '',
        dateFilter,
        sortBy,
        TYPES[0]
      ),
    [meetings, dateFilter, sortBy]
  )

  // Each category count is calculated from the same eligible list.
  const withVideo = byDate.filter((meeting) =>
    hasVideo(meeting)
  ).length

  const transcriptsOnly = byDate.filter(
    (meeting) =>
      !hasVideo(meeting) &&
      hasTranscript(meeting)
  ).length

  // Apply the selected tab to the displayed list.
  const recorded = useMemo(() => {
    if (type === TYPES[1]) {
      return byDate.filter((meeting) =>
        hasVideo(meeting)
      )
    }

    if (type === TYPES[2]) {
      return byDate.filter(
        (meeting) =>
          !hasVideo(meeting) &&
          hasTranscript(meeting)
      )
    }

    return byDate
  }, [byDate, type])

  const pager = usePagination(
    recorded,
    4,
    [type, dateFilter, sortBy].join('|')
  )

  const selected =
    recorded.find((meeting) => meeting.id === selectedId) ??
    recorded[0] ??
    null

  const open = (meeting, tab) => {
    navigate(
      tab
        ? `/meetings/${meeting.id}?tab=${tab}`
        : `/meetings/${meeting.id}`,
      { state: { meeting } }
    )
  }

  const clearFilters = () => {
    setType(TYPES[0])
    setDateFilter('All')
    setSortBy('Newest')
  }

  return (
    <Box sx={fitSx}>
      <PageHead
        badge={
          <>
            <Pill
              color={C.green}
              bg={C.paleGreen}
              sx={{
                fontSize: '0.75rem',
                letterSpacing: 0.5,
              }}
            >
              RECORDING ARCHIVE
            </Pill>

            <Typography
              sx={{
                fontSize: '0.875rem',
                color: C.muted,
              }}
            >
              {byDate.length} Recordings Saved
            </Typography>
          </>
        }
        title="Recorded Meetings"
        subtitle="Watch past recordings, read transcripts and jump to key moments."
        actions={
          <>
            <Button
              onClick={() => openInstant?.()}
              startIcon={<SmartToyOutlinedIcon />}
              sx={lightBtn}
            >
              Add MeetAI to Meeting
            </Button>

            <Button
              onClick={() => openCreate?.()}
              startIcon={<AddRoundedIcon />}
              sx={primaryBtn}
            >
              Schedule New Meeting
            </Button>
          </>
        }
      />

      <Box sx={splitSx}>
        <Box
          sx={{
            ...cardSx,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <RecordedFilters
            types={TYPES}
            type={type}
            onTypeChange={setType}
            counts={[
              byDate.length,
              withVideo,
              transcriptsOnly,
            ]}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <RecordingList
            recorded={recorded}
            pager={pager}
            selectedId={selected?.id}
            onSelect={setSelectedId}
            onOpen={open}
            onClear={clearFilters}
          />
        </Box>

        <RecordingPlayer
          meeting={selected}
          onOpen={open}
        />
      </Box>
    </Box>
  )
}
