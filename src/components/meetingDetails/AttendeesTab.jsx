import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import { T, downloadFile, formatClock, initialsOf, toCsv } from './helpers'
import { Badge, Card, IconTile, StatTile } from './ui'

const FILTERS = ['All', 'Attended', 'Absent', 'Host']

export default function AttendeesTab({ meeting, attendance }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const attendedKeys = new Set((attendance?.attended ?? []).map((p) => p.email || p.name))
  const rows = (meeting.participants || []).map((p) => {
    const key = p.email || p.name
    return { ...p, key, attended: attendedKeys.has(key), record: p.email ? meeting.attendanceDetails?.[p.email] : undefined }
  })

  const attendedRows = rows.filter((r) => r.attended)
  const absentRows = rows.filter((r) => !r.attended)
  const hostRows = rows.filter((r) => r.you)
  const counts = { All: rows.length, Attended: attendedRows.length, Absent: absentRows.length, Host: hostRows.length }
  const byFilter = { All: rows, Attended: attendedRows, Absent: absentRows, Host: hostRows }[filter]
  const q = query.trim().toLowerCase()
  const shown = byFilter.filter((r) => !q || `${r.name} ${r.email || ''}`.toLowerCase().includes(q))

  const exportRoster = () => {
    const header = ['Name', 'Email', 'Attended', 'Joined', 'Left']
    const body = rows.map((r) => [r.name, r.email || '', r.attended ? 'Yes' : 'No', formatClock(r.record?.joinedAt), formatClock(r.record?.leftAt)])
    downloadFile(`${meeting.title || 'meeting'}-roster.csv`, toCsv([header, ...body]), 'text/csv;charset=utf-8')
  }

  const chipSx = (active) => ({
    borderRadius: '999px',
    px: { xs: 1, sm: 1.5 },
    py: 0.5,
    minWidth: 0,
    flex: { xs: '1 1 auto', sm: '0 0 auto' },
    whiteSpace: 'nowrap',
    textTransform: 'none',
    fontFamily: T.sans,
    fontSize: '0.8125rem',
    fontWeight: 600,
    bgcolor: active ? T.primary : T.tint,
    color: active ? '#fff' : T.ink,
    '&:hover': { bgcolor: active ? T.primaryHover : T.line },
  })

  return (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 2fr)' },
      gap: 2,
      minWidth: 0,
      alignItems: 'start',
    }}
  >
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        minWidth: 0,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: '1fr',
        },
      }}
    >
      <StatTile label="Total Invited" value={rows.length} note="Meeting roster" />
      <StatTile
        label="Attended"
        value={attendedRows.length}
        note={attendedRows.map((r) => r.name).join(', ') || 'No one attended'}
        tone="green"
      />
      <StatTile
        label="Absent"
        value={absentRows.length}
        note={absentRows.map((r) => r.name).join(', ') || 'Everyone attended'}
        tone="red"
      />
    </Box>

   <Box sx={{ minWidth: 0, width: '100%' }}>
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 1,
      alignItems: { xs: 'stretch', sm: 'center' },
      mb: 0.5,
      minWidth: 0,
    }}
  >
    <TextField
      size="small"
      fullWidth
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Filter by name or email…"
      slotProps={{
        input: {
          startAdornment: (
            <SearchRoundedIcon sx={{ mr: 1, color: T.muted, fontSize: 18 }} />
          ),
        },
      }}
      sx={{ flex: '1 1 30px', minWidth: 0 }}
    />

    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        minWidth: 0,
        width: { xs: '100%', sm: 'auto' },
      }}
      role="group"
      aria-label="Filter participants"
    >
      {FILTERS.map((f) => (
        <Button
          key={f}
          aria-pressed={filter === f}
          onClick={() => setFilter(f)}
          sx={{
            ...chipSx(filter === f),
            flex: { xs: '0 1 auto', sm: '0 0 auto' },
            minWidth: 0,
            px: { xs: 1, sm: 1.5 },
            whiteSpace: 'nowrap',
          }}
        >
          {f === 'Host' ? 'Host / Organizers' : f} ({counts[f]})
        </Button>
      ))}
    </Box>
  </Box>

        <Card
          title="Participants & Attendance"
          icon={<IconTile><PeopleOutlinedIcon /></IconTile>}
          action={
            <Button onClick={exportRoster} startIcon={<DownloadOutlinedIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: T.primary, whiteSpace: 'nowrap', minWidth: 0 }}>
              Export Roster
            </Button>
          }
        >
          {rows.length === 0 ? (
            <Typography sx={{ color: T.muted }}>No attendees are listed for this meeting.</Typography>
          ) : (
            <Box sx={{ overflowX: 'auto', minWidth: 0 }}>
              <Box sx={{ minWidth: 340 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(100px, 1fr)', gap: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 }, py: 1, bgcolor: T.tint, borderRadius: '8px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: 0.6, color: T.muted, textTransform: 'uppercase' }}>
                  <span>Participant name &amp; email</span>
                  <span>Attendance</span>
                </Box>
                {shown.length === 0 && <Typography sx={{ p: 2, color: T.muted }}>No one matches this filter.</Typography>}
                {shown.map((r) => (
                  <Box key={r.key} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(100px, 1fr)', gap: { xs: 1, sm: 2 }, alignItems: 'center', px: { xs: 1, sm: 2 }, py: 1.5, borderBottom: `1px solid ${T.line}`, opacity: r.attended ? 1 : 0.7 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: '0.8125rem', fontWeight: 700, bgcolor: r.you ? T.primary : T.tint, color: r.you ? '#fff' : T.primary }}>
                        {initialsOf(r.name)}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, color: T.ink, overflowWrap: 'anywhere' }}>{r.name}{r.you ? ' (you)' : ''}</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', color: T.muted, overflowWrap: 'anywhere' }}>{r.email || '—'}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Badge tone={r.attended ? 'green' : 'red'}>{r.attended ? 'Yes' : 'No (Absent)'}</Badge>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  )
}