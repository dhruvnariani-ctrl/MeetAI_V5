import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PaginationBar from '../PaginationBar'
import usePagination from '../../hooks/usePagination'
import { C, cardSx, scrollSx } from '../ui'
import TaskRow from './TaskRow'

const PAGE_SIZE = 5

/* Task list with 5 per page. The list scrolls inside the card; pagination stays fixed at the bottom. */
export default function TaskListCard({ tasks, selectedId, onSelect, onDone, onView, onClear }) {
  // Changing the filters changes the task ids, which takes the list back to page 1.
  const pager = usePagination(tasks, PAGE_SIZE, tasks.map((t) => t.id).join('|'))

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ ...scrollSx, flex: 1, p: 1.25, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {tasks.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 600, color: C.navy }}>No tasks match these filters</Typography>
            <Typography onClick={onClear} sx={{ mt: 1, color: C.blue, cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</Typography>
          </Box>
        )}
        {pager.pageItems.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            selected={selectedId === t.id}
            onSelect={() => onSelect(t.id)}
            onDone={onDone}
            onView={onView}
          />
        ))}
      </Box>
      {tasks.length > 0 && (
        <Box sx={{ borderTop: `1px solid ${C.line}`, flexShrink: 0 }}>
          <PaginationBar pager={pager} label="Tasks" />
        </Box>
      )}
    </Box>
  )
}