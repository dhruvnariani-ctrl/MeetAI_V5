import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { T, formatClock, initialsOf } from './helpers'
import { Badge } from './ui'

/* Attendance snapshot rows. Compact shows the first three people. */
export default function AttendeesRoster({ participants = [], attendance, details = {}, compact = false }) {
  if (participants.length === 0) {
    return <Typography sx={{ color: T.muted }}>No attendees are listed for this meeting.</Typography>
  }

  const attended = new Set((attendance?.attended ?? []).map((p) => p.email || p.name))
  const list = compact ? participants.slice(0, 3) : participants
  const hidden = participants.length - list.length

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      {list.map((p) => {
        const key = p.email || p.name
        const isAttended = attended.has(key)
        const record = p.email ? details[p.email] : undefined

        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, borderRadius: '12px', bgcolor: T.canvas, border: `1px solid ${T.line}` }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: p.you ? T.primary : T.card, color: p.you ? '#fff' : T.primary, border: p.you ? 0 : `1px solid ${T.line}`, fontSize: '0.8125rem', fontWeight: 700 }}>
              {initialsOf(p.name)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.9375rem', fontWeight: 600, color: T.ink }}>{p.name}</Typography>
                {p.you && <Badge tone="navy">Host</Badge>}
              </Box>
              <Typography noWrap sx={{ fontSize: '0.8125rem', color: T.muted }}>
                {record ? `Joined ${formatClock(record.joinedAt)} · Left ${formatClock(record.leftAt)}` : (p.email || 'No attendance record')}
              </Typography>
            </Box>
            <Badge tone={isAttended ? 'green' : 'red'}>{isAttended ? 'Attended' : 'Absent'}</Badge>
          </Box>
        )
      })}
      {hidden > 0 && <Typography sx={{ fontSize: '0.8125rem', color: T.muted }}>+ {hidden} more</Typography>}
    </Box>
  )
}