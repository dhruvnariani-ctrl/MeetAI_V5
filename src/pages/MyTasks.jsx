import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import SyncRoundedIcon from '@mui/icons-material/SyncRounded'

import ConfirmMarkDoneDialog from '../components/tasks/ConfirmMarkDoneDialog'
import TaskDetailsCard from '../components/tasks/TaskDetailsCard'
import TaskListCard from '../components/tasks/TaskListCard'
import TaskStatCards from '../components/tasks/TaskStatCards'
import TaskToolbar from '../components/tasks/TaskToolbar'
import useTaskStats from '../components/tasks/useTaskStats'
import { C, PageHead, Pill, fitSx, lightBtn, splitSx } from '../components/ui'
import { updateMeetingActionItemStatus } from '../data/meetings'
import { filterAndSortTasks, getTasksFromDashboard, normalizeTaskStatus } from '../data/tasks'
import useCurrentUser from '../hooks/useCurrentUser'
import usePageTitle from '../hooks/usePageTitle'
import { formatTime } from '../utils/time'

export default function MyTasks() {
  usePageTitle('My Tasks')

  const currentUser = useCurrentUser()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState(() => getTasksFromDashboard(currentUser))
  const [syncedAt, setSyncedAt] = useState(() => new Date())
  const [filter, setFilter] = useState('All')
  const [priority, setPriority] = useState('All')
  const [sortBy, setSortBy] = useState('My Order')
  const [selectedId, setSelectedId] = useState(null)
  const [taskToConfirm, setTaskToConfirm] = useState(null)

  const filtered = filterAndSortTasks(tasks, { filter, ...(priority !== 'All' && { priority }) }, sortBy)
  const selected = filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null
  const { filterCounts, highPriority } = useTaskStats(tasks)
  const dueToday = filterAndSortTasks(tasks, { filter: 'Open', dueDate: 'today' }).length

  // Step 1: ask. Step 2: save only after the person confirms.
  const askDone = (task) => {
    if (task?.meetingId && normalizeTaskStatus(task.status) !== 'Done') setTaskToConfirm(task)
  }

  const confirmDone = () => {
    updateMeetingActionItemStatus(taskToConfirm.meetingId, taskToConfirm.id, 'Done')
    setTasks((all) => all.map((t) => (t.id === taskToConfirm.id ? { ...t, status: 'Done', completed: true } : t)))
    setTaskToConfirm(null)
  }

  const resync = () => {
    setTasks(getTasksFromDashboard(currentUser))
    setSyncedAt(new Date())
  }

  // "View Details" opens the meeting's Action Items tab.
  const viewDetails = (task) => task.meetingId && navigate(`/meetings/${task.meetingId}?tab=actions`)

  const clearFilters = () => {
    setFilter('All')
    setPriority('All')
    setSortBy('My Order')
  }

  return (
    <Box sx={fitSx}>
      <PageHead
        badge={
          <>
            <Pill sx={{ fontSize: '0.75rem' }}>MeetAI Automated Extraction</Pill>
            <Typography sx={{ fontSize: '0.875rem', color: C.muted }}>Synced {formatTime(syncedAt)}</Typography>
          </>
        }
        title="Action Items & My Tasks"
        subtitle="Review, prioritise and complete the action items MeetAI found in your meetings."
        actions={<Button onClick={resync} startIcon={<SyncRoundedIcon />} sx={lightBtn}>Re-sync Transcript Tasks</Button>}
      />

      <TaskStatCards
        openCount={filterCounts.Open}
        highCount={highPriority}
        dueTodayCount={dueToday}
        doneCount={filterCounts.Done}
      />

      <TaskToolbar
        filter={filter}
        onFilterChange={setFilter}
        counts={filterCounts}
        priority={priority}
        onPriorityChange={setPriority}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Box sx={splitSx}>
        <TaskListCard
          tasks={filtered}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          onDone={askDone}
          onView={viewDetails}
          onClear={clearFilters}
        />
        <TaskDetailsCard task={selected} onDone={askDone} onView={viewDetails} />
      </Box>

      <ConfirmMarkDoneDialog
        open={Boolean(taskToConfirm)}
        taskTitle={taskToConfirm?.title ?? ''}
        onCancel={() => setTaskToConfirm(null)}
        onConfirm={confirmDone}
      />
    </Box>
  )
}