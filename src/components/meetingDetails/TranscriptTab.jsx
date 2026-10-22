import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import { getDurationMinutes } from './utils'
import { T, copyText, downloadFile, parseTranscript } from './helpers'
import { Badge, Card, IconTile, InfoRow, NotReadyCard } from './ui'

/* Synchronized Transcript: searchable entries with copy and download, plus meeting details. */
export default function TranscriptTab({ meeting, state }) {
  const available = meeting.transcript?.available === true
  const [query, setQuery] = useState('')

  const segments = useMemo(
    () => parseTranscript(available ? meeting.transcript?.text : ''),
    [meeting, available],
  )

  if (!available) {
    return (
      <NotReadyCard
        icon={<DescriptionOutlinedIcon />}
        title={state?.type === 'upcoming' ? 'Transcript is not available yet' : 'Transcript is not available'}
      >
        {state?.type === 'upcoming'
          ? 'The transcript will be created after the meeting has taken place.'
          : 'There is no transcript available for this meeting.'}
      </NotReadyCard>
    )
  }

  const q = query.trim().toLowerCase()
  const shown = q ? segments.filter((s) => `${s.time} ${s.text}`.toLowerCase().includes(q)) : segments
  const fullText = meeting.transcript.text
  const duration = getDurationMinutes(meeting)

  return (
    <Box sx={{ display: 'grid', gap: 2, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(300px, 1fr)' } }}>
      <Card
        title="Full Session Transcript"
        subtitle={`${segments.length} entries`}
        icon={<IconTile><GraphicEqIcon /></IconTile>}
        action={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button onClick={() => copyText(fullText)} startIcon={<ContentCopyOutlinedIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: T.primary }}>Copy All</Button>
            <Button onClick={() => downloadFile(`${meeting.title || 'meeting'}-transcript.txt`, fullText)} startIcon={<DownloadOutlinedIcon />} sx={{ textTransform: 'none', fontWeight: 600, color: T.primary }}>.TXT</Button>
          </Box>
        }
      >
        <TextField
          size="small"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcript keywords…"
          slotProps={{ input: { startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: T.muted, fontSize: 18 }} /> } }}
          sx={{ mb: 2 }}
        />

        {shown.length === 0 && <Typography sx={{ color: T.muted }}>No entries match "{query}".</Typography>}

        {shown.map((seg, index) => (
          <Box key={seg.id} sx={{ p: 1.5, mb: 1.25, borderRadius: '12px', border: `1px solid ${T.line}`, bgcolor: T.card }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: T.tint, color: T.primary, display: 'grid', placeItems: 'center', fontSize: '0.6875rem', fontWeight: 700 }}>MT</Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: T.ink }}>Meeting Transcript</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: T.muted }}>
                  {seg.time ? `· ${seg.time}` : ''} · Line {String(index + 1).padStart(2, '0')}
                </Typography>
              </Box>
              <IconButton size="small" aria-label="Copy entry" onClick={() => copyText(seg.text)} sx={{ color: T.muted }}>
                <ContentCopyOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: '0.9375rem', color: T.ink, lineHeight: 1.65 }}>{seg.text}</Typography>
          </Box>
        ))}

        <Typography sx={{ mt: 1, fontSize: '0.8125rem', color: T.muted }}>
          Showing {shown.length} of {segments.length} entries
        </Typography>
      </Card>

      <Card title="Meeting Details" icon={<IconTile><InfoOutlinedIcon /></IconTile>} badge={<Badge tone="green">Completed</Badge>}>
        <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: T.tint }}>
          <InfoRow label="Platform" value={meeting.platform} />
          <InfoRow label="Duration" value={duration ? `${duration} min` : '—'} />
          <InfoRow label="Transcript status" value="Completed" />
          <InfoRow label="Total entries" value={`${segments.length} entries`} />
          <InfoRow label="Security" value="End-to-end encrypted" />
        </Box>
      </Card>
    </Box>
  )
}