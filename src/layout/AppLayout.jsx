
import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'

import CompanionBot from '../components/companion/CompanionBot'
import Header from '../components/Header'
import InstantJoinDialog from '../components/instant/InstantJoinDialog'
import CreateEventDialog from '../components/event/CreateEventDialog'
import TourRunner from '../components/tour/TourRunner'

import { ErrorBoundary, PageSkeleton } from '../components/StateViews'

import { getAllMeetings } from '../data/meetings'
import { searchDirectory } from '../data/Directory'
import { APP_TOUR_STEPS } from '../data/tours'
import { startAppTour } from '../components/tour/TourStorage'

import useCurrentUser from '../hooks/useCurrentUser'

export default function AppLayout() {
  const [createOpen, setCreateOpen] = useState(false)
  const [createKey, setCreateKey] = useState(0)

  const [instantOpen, setInstantOpen] = useState(false)
  const [instantKey, setInstantKey] = useState(0)

  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')

  const currentUser = useCurrentUser()

  const mainRef = useRef(null)
  const firstRender = useRef(true)

  const { pathname } = useLocation()

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    mainRef.current?.scrollTo(0, 0)
    mainRef.current?.focus()
  }, [pathname])

  // Open a fresh meeting creation form.
  const openCreate = () => {
    setCreateKey((key) => key + 1)
    setCreateOpen(true)
  }

  // Open a fresh instant-join form.
  const openInstant = () => {
    setInstantKey((key) => key + 1)
    setInstantOpen(true)
  }

  // Start the complete application tour from the account menu.
  const handleStartTour = () => {
    startAppTour(APP_TOUR_STEPS)
  }

  const handleCreate = (event) => {
    setCreateOpen(false)
    setToast(`"${event.title}" was created`)
  }

  const handleRecord = (details) => {
    setInstantOpen(false)

    setToast(
      `MeetAI is joining${
        details.title
          ? ` "${details.title}"`
          : ' your meeting'
      }`
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100dvh',
        minHeight: 0,
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Keyboard-accessible skip link */}
      <Box
        component="a"
        href="#main"
        sx={{
          position: 'fixed',
          left: 12,
          top: -60,
          zIndex: 2000,
          px: 2,
          py: 1.25,
          borderRadius: '12px',
          bgcolor: 'text.primary',
          color: '#fff',
          '&:focus': {
            top: 12,
          },
        }}
      >
        Skip to main content
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <Header
          query={query}
          onQueryChange={setQuery}
          onStartTour={handleStartTour}
          companion={
            <CompanionBot
              meetings={getAllMeetings()}
              imageSrc={`${import.meta.env.BASE_URL}images/companion-robot.svg`}
              onCreateMeeting={openCreate}
              onInstantMeeting={openInstant}
              routes={{
                tasks: '/tasks',
                recorded: '/recorded',
              }}
              placement="header"
            />
          }
        />

        <Box
          component="main"
          id="main"
          ref={mainRef}
          tabIndex={-1}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'auto',
            outline: 'none',
            bgcolor: 'background.default',
            p: { xs: 1.5, md: 1.75 },
            pb: { xs: 1.75, md: 1.75 },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          <ErrorBoundary resetKey={pathname}>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet
                context={{
                  openCreate,
                  openInstant,
                  currentUser,
                }}
              />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </Box>

      {/* Meeting creation dialog */}
      <CreateEventDialog
        key={`create-${createKey}`}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        currentUser={currentUser}
        searchDirectory={searchDirectory}
      />

      {/* Instant meeting dialog */}
      <InstantJoinDialog
        key={`instant-${instantKey}`}
        open={instantOpen}
        onClose={() => setInstantOpen(false)}
        onSubmit={handleRecord}
        currentUser={currentUser}
        searchDirectory={searchDirectory}
      />

      {/* Global tour runner: stays mounted while the page changes */}
      <TourRunner />

      {/* App notifications */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast('')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToast('')}
          sx={{ width: '100%' }}
        >
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  )
}
