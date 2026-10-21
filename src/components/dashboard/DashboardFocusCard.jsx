import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import MeetingToggles from '../MeetingToggles'
import { C, Pill, SERIF, initials, shortPlatform } from '../ui'
import { formatTime, joinUrlOf } from './dashboardUtils'
import { formatCountdown } from '../../utils/time'

function JoinButton({ meeting }) {
  const url = joinUrlOf(meeting)
  return (
    <Button
      component="a"
      href={url ?? undefined}
      target="_blank"
      rel="noreferrer"
      disabled={!url}
      startIcon={<VideocamOutlinedIcon />}
      sx={{ bgcolor: C.green, color: '#fff', borderRadius: '10px', px: 2.25, py: 1, '&:hover': { bgcolor: '#14753A' } }}
    >
      Join Meeting ({shortPlatform(meeting.platform)})
    </Button>
  )
}

/* Navy hero: the live meeting, or the next one when nothing is live. */
export default function DashboardFocusCard({ meeting, now, live, settings, onSettingsChange }) {
  const people = Array.isArray(meeting.participants) ? meeting.participants : []
  const names = people.map((p) => p.name?.split(' ')[0]).filter(Boolean)
  const when = live
    ? `Started ${formatCountdown(now - meeting._start)} ago (${formatTime(meeting._start)} – ${formatTime(meeting._end)})`
    : `Starts in ${formatCountdown(meeting._start - now)} (${formatTime(meeting._start)})`

  return (
    <Box
      sx={{
        borderRadius: '14px',
        color: '#fff',
        p: { xs: 1.75, md: 2 },
        background: 'linear-gradient(135deg, #0B2A4A 0%, #0F3B63 100%)',
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) auto' },
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.75 }}>
          <Pill color="#fff" bg={live ? C.green : 'rgba(255,255,255,0.18)'} sx={{ fontSize: '0.75rem', letterSpacing: 0.6, fontWeight: 700 }}>
            {live && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#fff' }} />}
            {live ? 'HAPPENING RIGHT NOW' : 'UP NEXT'}
          </Pill>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>
            {meeting.platform} · {when}
          </Typography>
        </Box>

        <Typography component="h2" sx={{ fontFamily: SERIF, fontSize: { xs: '1.375rem', md: '1.625rem' }, fontWeight: 600, lineHeight: 1.2 }}>
          {meeting.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 1 }}>
          <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.6875rem', border: '2px solid #0F3B63' } }}>
            {people.map((p) => (
              <Avatar key={p.email ?? p.name} sx={{ bgcolor: C.blue }}>{initials(p.name)}</Avatar>
            ))}
          </AvatarGroup>
          <Typography sx={{ fontSize: '0.9375rem' }}>
            <b>{people.length} participants</b>
            {names.length > 0 && ` (${names.slice(0, 3).join(', ')}${names.length > 3 ? `, and ${names.length - 3} more` : ''})`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'stretch', md: 'flex-end' }, gap: 1 }}>
        <JoinButton meeting={meeting} />
        <Box sx={{ bgcolor: '#fff', borderRadius: '10px', px: 1.5, py: 0.5 }}>
          <MeetingToggles meeting={meeting} settings={settings} onChange={onSettingsChange} />
        </Box>
      </Box>
    </Box>
  )
}
