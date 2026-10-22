import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import AccountMenu from './AccountMenu'
import HeaderSearch from './HeaderSearch'
import { C, Pill } from './ui'

const TABS = [
  ["Today's Schedule", '/'],
  ['Full Calendar', '/calendar'],
  ['Meeting Notes & Recordings', '/recorded'],
  ['Action Items & Tasks', '/tasks'],
  ['How It Works', '/how-it-works'],
]

export default function Header({
  query,
  onQueryChange,
  companion,
  onStartTour,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  const logo = (
    <Box
      component="img"
      src={`${import.meta.env.BASE_URL}images/Avaada Logo.png`}
      alt="Avaada"
      sx={{
        height: { xs: 30, sm: 42 },
        width: 'auto',
        maxWidth: { xs: 88, sm: 120 },
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  )

  const brand = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.5, sm: 0.75 },
        minWidth: 0,
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '0.94rem', sm: '1.0625rem' },
          fontWeight: 750,
          color: C.navy,
          whiteSpace: 'nowrap',
        }}
      >
        MeetAI
      </Typography>

      <Pill
        color={C.green}
        bg={C.paleGreen}
        sx={{
          fontSize: '0.625rem',
          letterSpacing: 0.4,
          display: { xs: 'none', lg: 'inline-flex' },
        }}
      >
        WORKSPACE
      </Pill>
    </Box>
  )

  const navigationLinks = (mobile = false) =>
    TABS.map(([label, to]) => (
      <Box
        key={to}
        component={NavLink}
        to={to}
        end={to === '/'}
        onClick={mobile ? closeSidebar : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexShrink: 0,
          px: mobile ? 1.75 : 1.5,
          py: mobile ? 1.35 : 0.65,
          borderRadius: mobile ? '10px' : 999,
          fontSize: mobile ? '0.9375rem' : '0.9375rem',
          fontWeight: 500,
          color: C.ink,
          textDecoration: 'none',
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover': {
            bgcolor: C.soft,
          },
          '&.active': {
            bgcolor: C.blue,
            color: '#fff',
            fontWeight: 650,
          },
          '&:focus-visible': {
            outline: `2px solid ${C.blue}`,
            outlineOffset: 2,
          },
        }}
      >
        {label}
        {mobile && <ChevronRightRoundedIcon sx={{ fontSize: 18, opacity: 0.7 }} />}
      </Box>
    ))

  return (
    <>
      <AppBar
        component="header"
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          flexShrink: 0,
          bgcolor: '#fff',
          borderBottom: `1px solid ${C.line}`,
          color: C.navy,
          zIndex: 10,
        }}
      >
        {/* Main header row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.65, sm: 1.5, md: 2 },
            height: { xs: 54, sm: 60 },
            px: { xs: 0.75, sm: 1.5, md: 2.5 },
          }}
        >
          {/* Mobile sidebar button */}
          <IconButton
            aria-label="Open main navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              width: 36,
              height: 36,
              flexShrink: 0,
              color: C.navy,
              borderRadius: '10px',
              '&:hover': { bgcolor: C.soft },
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          {/* Avaada logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {logo}
          </Box>

          {/* Divider and MeetAI brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              pl: { xs: 0.9, sm: 1.75 },
              borderLeft: `1px solid ${C.line}`,
              minWidth: 0,
            }}
          >
            {brand}
          </Box>

          {/* Desktop search */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              flex: 1,
              minWidth: 0,
              maxWidth: 560,
              mx: 'auto',
            }}
          >
            <HeaderSearch
              query={query}
              onQueryChange={onQueryChange}
            />
          </Box>

          {/* Right-side controls */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.1, sm: 0.5 },
              ml: 'auto',
              flexShrink: 0,
            }}
          >
            <Tooltip title="Notifications">
              <IconButton
                aria-label="Notifications"
                sx={{
                  color: C.navy,
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                }}
              >
                <NotificationsNoneOutlinedIcon
                  sx={{ fontSize: { xs: 21, sm: 24 } }}
                />
              </IconButton>
            </Tooltip>

            {/* Existing Companion control */}
            {companion}

            {/* Existing account menu */}
            <AccountMenu
              onStartTour={onStartTour}
              onLogout={onLogout}
            />
          </Box>
        </Box>

        {/* Mobile search row */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            px: { xs: 1.25, sm: 2 },
            pt: 0.35,
            pb: 1.1,
            borderTop: `1px solid ${C.soft}`,
          }}
        >
          <HeaderSearch
            query={query}
            onQueryChange={onQueryChange}
          />
        </Box>

        {/* Desktop main navigation */}
        <Box
          component="nav"
          aria-label="Main"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            px: { md: 2, lg: 2.5 },
            pb: 0.75,
            pt: 0.75,
            overflowX: 'auto',
            borderTop: `1px solid ${C.soft}`,
          }}
        >
          {navigationLinks()}
        </Box>
      </AppBar>

      {/* Mobile navigation sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={closeSidebar}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 'min(300px, 85vw)', sm: 320 },
              boxSizing: 'border-box',
              bgcolor: '#fff',
              borderRight: `1px solid ${C.line}`,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            p: 2,
            minHeight: 76,
            background: 'linear-gradient(120deg, #F5F8FD, #FFFFFF)',
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
            }}
          >
            {logo}

            <Box
              sx={{
                pl: 1.25,
                borderLeft: `1px solid ${C.line}`,
              }}
            >
              <Typography
                sx={{
                  color: C.navy,
                  fontWeight: 750,
                  fontSize: '1rem',
                }}
              >
                MeetAI
              </Typography>

              <Typography
                sx={{
                  color: C.muted,
                  fontSize: '0.7rem',
                }}
              >
                Meeting workspace
              </Typography>
            </Box>
          </Box>

          <IconButton
            aria-label="Close main navigation"
            onClick={closeSidebar}
            sx={{
              color: C.navy,
              borderRadius: '9px',
              '&:hover': { bgcolor: C.soft },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography
            sx={{
              px: 1.5,
              mb: 1,
              color: C.muted,
              fontSize: '0.6875rem',
              fontWeight: 750,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Main menu
          </Typography>

          <Box
            component="nav"
            aria-label="Mobile main navigation"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.6,
            }}
          >
            {navigationLinks(true)}
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${C.line}`,
            bgcolor: '#FAFBFD',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: C.muted,
              lineHeight: 1.6,
            }}
          >
            MeetAI
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              color: C.muted,
            }}
          >
            Your meeting workspace
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}