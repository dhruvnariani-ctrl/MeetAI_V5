import { useState } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'

import ActionRow from './ActionRow'
import { T, dueLabel } from './helpers'
import { Card, IconTile, InfoRow, NotReadyCard, StatTile } from './ui'

const PRIORITIES = ['All', 'High', 'Medium', 'Low']

/* Key Decisions & Action Items: counts, status and priority filters, and the full list with Mark Complete / Reopen. */
export default function ActionItemsTab({ meeting, state, onChanged, onAskDone }) {
  const items = meeting.actionItems || []
  const [filter, setFilter] = useState('All')
  const [priority, setPriority] = useState('All')

  if (state?.type === 'upcoming') {
    return (
      <NotReadyCard icon={<CheckBoxOutlinedIcon />} title="Action items will appear after the meeting">
        Action items are created from the meeting once it has taken place.
      </NotReadyCard>
    )
  }

  if (items.length === 0) {
    return (
      <NotReadyCard icon={<CheckBoxOutlinedIcon />} title="No action items">
        No action items have been recorded for this meeting.
      </NotReadyCard>
    )
  }

  const count = (status) => items.filter((i) => i.status === status).length
  const open = items.filter((i) => i.status === 'Pending' || i.status === 'Blocked').length
  const inProcess = count('In Process')
  const done = count('Done')

  const byStatus = {
    All: items,
    Open: items.filter((i) => i.status === 'Pending' || i.status === 'Blocked'),
    'In Progress': items.filter((i) => i.status === 'In Process'),
    Done: items.filter((i) => i.status === 'Done'),
  }[filter]
  const shown = priority === 'All' ? byStatus : byStatus.filter((i) => i.priority === priority)

  const chipSx = (active) => ({
    borderRadius: '999px',
    px: 1.5,
    py: 0.5,
    textTransform: 'none',
    fontFamily: T.sans,
    fontSize: '0.8125rem',
    fontWeight: 600,
    bgcolor: active ? T.primary : T.tint,
    color: active ? '#fff' : T.ink,
    '&:hover': { bgcolor: active ? T.primaryHover : T.line },
  })

  return (
    <Box sx={{ display: 'grid', gap: 2, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(300px, 1fr)' } }}>
      <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' } }}>
          <StatTile label="Total Tasks" value={items.length} />
          <StatTile label="Pending" value={count('Pending')} tone="red" />
          <StatTile label="In Process" value={inProcess} />
          <StatTile label="Done" value={done} tone="green" />
        </Box>

        <Card title="Tasks" icon={<IconTile><CheckBoxOutlinedIcon /></IconTile>}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }} role="group" aria-label="Filter tasks by status">
              {[
                ['All', items.length],
                ['Open', open],
                ['In Progress', inProcess],
                ['Done', done],
              ].map(([label, n]) => (
                <Button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)} sx={chipSx(filter === label)}>
                  {label} ({n})
                </Button>
              ))}
            </Box>
            <TextField select size="small" label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} sx={{ minWidth: 150 }}>
              {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p === 'All' ? 'All priorities' : `${p} priority`}</MenuItem>)}
            </TextField>
          </Box>

          {shown.length === 0 && <Typography sx={{ color: T.muted }}>No tasks match these filters.</Typography>}
          {shown.map((item) => (
            <ActionRow key={item.id} meeting={meeting} item={item} onChanged={onChanged} onAskDone={onAskDone} full />
          ))}
        </Card>
      </Box>

      <Card title="Meeting Information" icon={<IconTile><CheckBoxOutlinedIcon /></IconTile>}>
        <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: T.tint }}>
          <InfoRow label="Meeting title" value={meeting.title} />
          <InfoRow label="Meeting ID" value={String(meeting.id)} mono />
          <InfoRow label="Platform" value={meeting.platform} />
          <InfoRow label="Action items" value={`${items.length} items total`} />
          <InfoRow label="Next due" value={dueLabel(items.find((i) => i.status !== 'Done')?.due)} />
        </Box>
      </Card>
    </Box>
  )
}