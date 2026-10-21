import { useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import { C, Pill } from '../ui'
import DialogShell, { HeadsetMicOutlinedIcon, ToggleCard } from './DialogShell'
import FormField from './FormField'
import ParticipantPicker from './ParticipantPicker'

const MEETING_HOSTS = /(^|\.)(zoom\.us|zoom\.com|zoomgov\.com|meet\.google\.com|teams\.microsoft\.com|teams\.live\.com)$/i

// Accepts links with or without https:// ; returns a clean URL string or null.
function normalizeMeetingLink(value) {
  const raw = value.trim()
  if (!raw) return null
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return MEETING_HOSTS.test(url.hostname) ? url.href : null
  } catch {
    return null
  }
}

function platformOf(url) {
  const host = new URL(url).hostname
  if (/teams\./i.test(host)) return 'Microsoft Teams'
  if (/zoom/i.test(host)) return 'Zoom'
  if (/meet\.google/i.test(host)) return 'Google Meet'
  return null
}

/* "Add MeetAI to a Meeting": paste a link and MeetAI joins. Saves { link, title, participants, recordVideo }. */
export default function InstantJoinDialog({ open, onClose, onSubmit, currentUser, searchDirectory }) {
  const titleId = useId()
  const descId = useId()
  const linkRef = useRef(null)

  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [linkError, setLinkError] = useState(false)
  const [participants, setParticipants] = useState([{ ...currentUser, you: true }])
  const [recordVideo, setRecordVideo] = useState(false)

  const cleanUrl = normalizeMeetingLink(link)
  const platform = cleanUrl ? platformOf(cleanUrl) : null

  const paste = async () => {
    try {
      setLink(await navigator.clipboard.readText())
      setLinkError(false)
    } catch {
      linkRef.current?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cleanUrl) {
      setLinkError(true)
      linkRef.current?.focus()
      return
    }
    onSubmit({ link: cleanUrl, title: title.trim(), participants, recordVideo })
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleId={titleId}
      descId={descId}
      icon={<BoltOutlinedIcon />}
      badge={<Pill color={C.green} bg={C.paleGreen} sx={{ fontWeight: 700 }}>Instant Join</Pill>}
      title="Add MeetAI to a Meeting"
      subtitle="Paste any Microsoft Teams, Google Meet, or Zoom link. MeetAI joins within 30 seconds."
      tone="green"
      footerNote={
        <>
          <HeadsetMicOutlinedIcon sx={{ fontSize: 18, color: C.muted }} aria-hidden="true" />
          <span>Need urgent help?</span>
          <Box component="span" sx={{ fontWeight: 700, color: C.navy, textDecoration: 'underline' }}>Call IT Helpdesk ext. 4004</Box>
        </>
      }
      actions={
        <>
          <Button onClick={onClose} sx={{ color: C.ink, textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<BoltOutlinedIcon />}
            sx={{ bgcolor: C.navy, color: '#fff', borderRadius: '10px', px: 2.5, py: 1, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#08203A' } }}
          >
            Send MeetAI Now
          </Button>
        </>
      }
    >
      <FormField
        label="Meeting Link or URL"
        required
        hint="Supports Teams, Meet, or Zoom"
        ref={linkRef}
        autoFocus
        type="url"
        value={link}
        onChange={(e) => { setLink(e.target.value); if (linkError) setLinkError(false) }}
        error={linkError}
        placeholder="https://teams.microsoft.com/l/meetup-join/..."
        startIcon={<VideocamOutlinedIcon sx={{ fontSize: 20 }} />}
        endAdornment={
          <Button
            onClick={paste}
            startIcon={<ContentPasteRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{ flexShrink: 0, borderRadius: '8px', px: 1.25, py: 0.5, textTransform: 'none', fontWeight: 600, color: C.blue, bgcolor: C.paleBlue, '&:hover': { bgcolor: '#dbe8fb' } }}
          >
            Paste
          </Button>
        }
        helper={linkError ? 'Enter a valid Teams, Google Meet, or Zoom link' : undefined}
      />
      {platform && (
        <Pill color={C.green} bg={C.paleGreen} sx={{ alignSelf: 'flex-start', mt: -1.25 }}>✓ {platform} link detected</Pill>
      )}

      <FormField
        label="Meeting Name / Topic"
        optional
        hint="Optional index tag"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Rajasthan Unit 4 grid sync"
        startIcon={<Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: C.muted }}>#</Typography>}
      />

      <ParticipantPicker
        hint="Summaries are emailed after the call"
        participants={participants}
        searchDirectory={searchDirectory}
        onAdd={(p) => setParticipants((list) => [...list, p])}
        onRemove={(email) => setParticipants((list) => list.filter((p) => p.email !== email))}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25 }}>
        <ToggleCard
          title="Record Video & Audio (1080p)"
          text="Captures presentation & screen share"
          checked={recordVideo}
          onChange={setRecordVideo}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, p: 1.5, borderRadius: '12px', bgcolor: C.soft, border: `1px solid ${C.line}` }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: C.navy }}>MeetAI Attendance</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: C.muted, lineHeight: 1.5 }}>Live speaker identification &amp; notes</Typography>
          </Box>
          <Pill color={C.green} bg={C.paleGreen} sx={{ flexShrink: 0 }}>Always on</Pill>
        </Box>
      </Box>

    </DialogShell>
  )
}