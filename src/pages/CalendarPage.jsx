import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

import CalendarFilters from '../components/calendar/CalendarFilters'
import CalendarMeetingList from '../components/calendar/CalendarMeetingList'
import CalendarMiniMonth from '../components/calendar/CalendarMiniMonth'
import CalendarSidebar from '../components/calendar/CalendarSidebar'
import CalendarToolbar from '../components/calendar/CalendarToolbar'
import { getMeetingToggleSettings } from '../components/meetings/meetingHelpers'
import { C, SERIF, fitSx, lightBtn, primaryBtn, splitSx } from '../components/ui'
import useNow from '../hooks/Usenow'
import useCalendarState from '../hooks/useCalenderState'
import usePageTitle from '../hooks/usePageTitle'
import { dateKey, endOfWeek, parseDate, startOfWeek } from '../utils/calenderDates'

export default function CalendarPage() {
  usePageTitle('Calendar')

  const now = useNow()
  const navigate = useNavigate()
  const { openCreate, openInstant } = useOutletContext() ?? {}
  const calendar = useCalendarState()
  const {
    meetings, visibleMeetings, selectedDate, selectDate, view, setView, filters, setFilters,
    clearFilters, platforms, activeFilterCount, settings, title, onSettingsChange,
  } = calendar

  // Nothing is selected until the person picks a meeting; until then the calendar shows in its place.
  const [selectedId, setSelectedId] = useState(null)
  // Clicking the selected meeting again closes its details.
  const toggleSelect = (id) => setSelectedId((current) => (current === id ? null : id))
  const selected = visibleMeetings.find((m) => m.id === selectedId) ?? null

  // Chip counts ignore the filters, so every chip shows what it would add.
  const inRange = (m) => {
    if (view === 'day') return m.date === dateKey(selectedDate)
    const d = parseDate(m.date)
    if (view === 'week') return d >= startOfWeek(selectedDate) && d <= endOfWeek(selectedDate)
    return d.getFullYear() === selectedDate.getFullYear() && d.getMonth() === selectedDate.getMonth()
  }
  const inPeriod = meetings.filter(inRange)
  const joined = inPeriod.filter((m) => getMeetingToggleSettings(m, settings?.[m.id]).autoJoin).length
  const openMeeting = (id) => navigate(`/meetings/${id}`)

  // Keyed by month so the calendar jumps to the new month when the toolbar changes the date.
  const miniCalendar = (
    <CalendarMiniMonth
      key={dateKey(selectedDate).slice(0, 7)}
      selectedDate={selectedDate}
      meetings={meetings}
      onSelect={selectDate}
      view={view}
    />
  )

  return (
    <Box sx={fitSx}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 600, color: C.navy }}>
          Meetings &amp; Executive Schedule
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={() => openInstant?.()} startIcon={<SmartToyOutlinedIcon />} sx={lightBtn}>Add MeetAI to a Meeting</Button>
          <Button onClick={() => openCreate?.()} startIcon={<AddRoundedIcon />} sx={primaryBtn}>Schedule New Meeting</Button>
        </Box>
      </Box>

      <CalendarToolbar
        title={title}
        count={visibleMeetings.length}
        view={view}
        selectedDate={selectedDate}
        onViewChange={setView}
        onPrevious={calendar.handlePrevious}
        onNext={calendar.handleNext}
        onToday={calendar.handleToday}
      />

      <CalendarFilters
        filters={filters}
        setFilters={setFilters}
        platforms={platforms}
        inPeriod={inPeriod}
        joined={joined}
        activeFilterCount={activeFilterCount}
        onClear={clearFilters}
      />

      {/* Small screens: the calendar sits above the meeting list. */}
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>{miniCalendar}</Box>

      <Box sx={splitSx}>
        <CalendarMeetingList
          meetings={visibleMeetings}
          view={view}
          now={now}
          settings={settings}
          selectedId={selected?.id}
          onSelect={toggleSelect}
          onOpen={openMeeting}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0, minHeight: 0 }}>
          {selected ? (
            <>
              <CalendarSidebar
                meeting={selected}
                settings={settings?.[selected.id]}
                onSettingsChange={onSettingsChange}
                onOpen={openMeeting}
              />
              <Box sx={{ display: { xs: 'none', lg: 'block' }, flexShrink: 0 }}>{miniCalendar}</Box>
            </>
          ) : (
            <>
              <Box sx={{ display: { xs: 'none', lg: 'block' }, flexShrink: 0 }}>{miniCalendar}</Box>
              <CalendarSidebar meeting={null} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}