import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import PaginationBar from '../PaginationBar'
import { C, scrollSx } from '../ui'
import RecordingCard from './RecordingCard'

/* Scrollable page of recording cards with pagination; shows an empty state with a reset action. */
export default function RecordingList({ recorded, pager, selectedId, onSelect, onOpen, onClear }) {
  return (
    <>
      <Box sx={{ ...scrollSx, flex: 1, p: 1.25, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {recorded.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: C.navy }}>No recordings found</Typography>
            <Button onClick={onClear} sx={{ mt: 1 }}>Clear filters</Button>
          </Box>
        )}
        {pager.pageItems.map((m) => (
          <RecordingCard key={m.id} meeting={m} selected={selectedId === m.id} onSelect={() => onSelect(m.id)} onOpen={onOpen} />
        ))}
      </Box>
      <PaginationBar pager={pager} label="Recordings" />
    </>
  )
}