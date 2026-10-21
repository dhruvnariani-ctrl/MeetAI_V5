import { useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

import { C } from '../ui'
import DialogShell, { OptionTile, ToggleCard } from '../instant/DialogShell'
import FormField from '../instant/FormField'
import ParticipantPicker from '../instant/ParticipantPicker'
import SelectField from './SelectedField'

const PLATFORMS = [
  { id: 'teams', label: 'Microsoft Teams' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'meet', label: 'Google Meet' },
]

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
]

const pad = (n) => String(n).padStart(2, '0')
const toDateInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toTimeInput = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

function defaultTimes() {
  const s = new Date()
  s.setSeconds(0, 0)
  s.setMinutes(s.getMinutes() < 30 ? 30 : 60) // next half hour
  return { start: toTimeInput(s), end: toTimeInput(new Date(s.getTime() + 30 * 60000)) }
}

const segSx = (on) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 650,
  border: `1px solid ${on ? C.blue : C.line}`,
  bgcolor: on ? C.paleBlue : '#fff',
  color: on ? C.blue : C.ink,
  '&:hover': { bgcolor: on ? C.paleBlue : C.soft },
})

/* "Create Meeting": schedule later or start now, pick one platform, invite people, and turn on MeetAI.
   Saves { title, date, start/end or durationMinutes, platforms, participants, inviteMeetAI, recordVideo }. */
export default function CreateEventDialog({ open, onClose, onSubmit, currentUser, searchDirectory }) {
  const titleId = useId()
  const descId = useId()

  const [initial] = useState(defaultTimes)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [start, setStart] = useState(initial.start)
  const [end, setEnd] = useState(initial.end)
  const [instant, setInstant] = useState(false)
  const [duration, setDuration] = useState(30)
  const [platform, setPlatform] = useState('meet') // exactly one platform at a time
  const [participants, setParticipants] = useState([{ ...currentUser, you: true }])
  const [inviteMeetAI, setInviteMeetAI] = useState(false)
  const [recordVideo, setRecordVideo] = useState(false)
  const [errors, setErrors] = useState({})

  const refs = { title: useRef(null), date: useRef(null), start: useRef(null), end: useRef(null) }
  const clearError = (key) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = 'Enter a title'
    if (!date) e.date = 'Pick a date'
    else if (date < toDateInput(new Date())) e.date = 'The date cannot be in the past'
    if (!instant) {
      if (!start) e.start = 'Pick a start time'
      if (!end) e.end = 'Pick an end time'
      else if (start && end <= start) e.end = 'End time must be after the start time'
    }
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const firstInvalid = ['title', 'date', 'start', 'end'].find((k) => e[k])
    if (firstInvalid) {
      refs[firstInvalid].current?.focus()
      return
    }
    onSubmit({
      title: title.trim(),
      date,
      ...(instant ? { instant: true, durationMinutes: duration } : { instant: false, start, end }),
      platforms: [platform],
      participants,
      inviteMeetAI,
      recordVideo: inviteMeetAI && recordVideo,
    })
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleId={titleId}
      descId={descId}
      icon={<CalendarMonthOutlinedIcon />}
      title="Create Meeting"
      subtitle="Set up meeting details, invite directory participants, and automated AI attendance."
      tone="blue"
      footerNote={<span>Invites go to every participant&apos;s calendar.</span>}
      actions={
        <>
          <Button onClick={onClose} sx={{ color: C.ink, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={instant ? <BoltOutlinedIcon /> : <CalendarMonthOutlinedIcon />}
            sx={{ bgcolor: C.navy, color: '#fff', borderRadius: '10px', px: 2.5, py: 1, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#08203A' } }}
          >
            {instant ? 'Create & start now' : 'Schedule Meeting'}
          </Button>
        </>
      }
    >
      <FormField
        label="Meeting Title"
        required
        ref={refs.title}
        autoFocus
        value={title}
        onChange={(e) => { setTitle(e.target.value); clearError('title') }}
        placeholder="e.g. Western Corridor solar expansion review"
        error={!!errors.title}
        helper={errors.title}
      />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: C.navy }}>Date &amp; Schedule Slot</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: C.muted }}>IST (UTC+05:30)</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.25 }}>
          <Button aria-pressed={!instant} onClick={() => setInstant(false)} startIcon={<CalendarMonthOutlinedIcon />} sx={segSx(!instant)}>Schedule later</Button>
          <Button aria-pressed={instant} onClick={() => setInstant(true)} startIcon={<BoltOutlinedIcon />} sx={segSx(instant)}>Start now</Button>
        </Box>
        <Box sx={{ display: 'grid', gap: 1.25, alignItems: 'start', gridTemplateColumns: instant ? { xs: '1fr', sm: '1fr 1fr' } : { xs: '1fr 1fr', sm: '1.4fr 1fr 1fr' } }}>
          <FormField
            label="Date"
            required
            ref={refs.date}
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); clearError('date') }}
            inputAttrs={{ min: toDateInput(new Date()) }}
            error={!!errors.date}
            helper={errors.date}
          />
          {instant ? (
            <SelectField label="Duration" value={duration} onChange={setDuration} options={DURATIONS} />
          ) : (
            <>
              <FormField
                label="Start time"
                required
                ref={refs.start}
                type="time"
                value={start}
                onChange={(e) => { setStart(e.target.value); clearError('start'); clearError('end') }}
                error={!!errors.start}
                helper={errors.start}
              />
              <FormField
                label="End time"
                required
                ref={refs.end}
                type="time"
                value={end}
                onChange={(e) => { setEnd(e.target.value); clearError('end') }}
                error={!!errors.end}
                helper={errors.end}
              />
            </>
          )}
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: C.navy }}>Platform / Conference</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: C.muted }}>Choose one</Typography>
        </Box>
        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
          {PLATFORMS.map((p) => (
            <OptionTile
              key={p.id}
              type="radio"
              label={p.label}
              tone="blue"
              checked={platform === p.id}
              onChange={(checked) => { if (checked) setPlatform(p.id) }}
            />
          ))}
        </Box>
      </Box>

      <ParticipantPicker
        hint="Invited to this event"
        participants={participants}
        searchDirectory={searchDirectory}
        onAdd={(p) => setParticipants((list) => [...list, p])}
        onRemove={(email) => setParticipants((list) => list.filter((p) => p.email !== email))}
      />

      <Box sx={{ display: 'grid', gap: 1.25 }}>
        <ToggleCard
          tone="green"
          title="Auto-join MeetAI Attendance & Briefing"
          text="Automated transcription, action item detection & executive summary"
          checked={inviteMeetAI}
          onChange={(checked) => { setInviteMeetAI(checked); if (!checked) setRecordVideo(false) }}
        />
        <ToggleCard
          tone="green"
          title="Record Video & Audio"
          text="Archive full high-definition cloud recording in meeting history"
          checked={recordVideo}
          disabled={!inviteMeetAI}
          onChange={setRecordVideo}
        />
      </Box>
    </DialogShell>
  )
}