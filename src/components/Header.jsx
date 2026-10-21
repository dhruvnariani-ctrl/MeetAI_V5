
import { NavLink } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

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
  return (
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          height: 56,
          px: { xs: 1.5, md: 2.5 },
        }}
      >
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}images/Avaada Logo.png`}
          alt="Avaada"
          sx={{
            height: 50,
            width: 'auto',
            display: { xs: 'none', sm: 'block' },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            pl: { sm: 2 },
            borderLeft: { sm: `1px solid ${C.line}` },
          }}
        >
          <Typography sx={{ fontSize: '1.0625rem', fontWeight: 700 }}>
            MeetAI
          </Typography>

          <Pill
            color={C.green}
            bg={C.paleGreen}
            sx={{
              fontSize: '0.6875rem',
              letterSpacing: 0.5,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            WORKSPACE
          </Pill>
        </Box>

        <Box
          sx={{
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 'auto',
            flexShrink: 0,
          }}
        >
          <Tooltip title="Notifications">
            <IconButton
              aria-label="Notifications"
              sx={{ color: C.navy }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          {companion}

          <AccountMenu
            onStartTour={onStartTour}
            onLogout={onLogout}
          />
        </Box>
      </Box>

      <Box
        component="nav"
        aria-label="Main"
        sx={{
          display: 'flex',
          gap: 0.5,
          px: { xs: 1, md: 2 },
          pb: 0.75,
          overflowX: 'auto',
          borderTop: `1px solid ${C.soft}`,
          pt: 0.75,
        }}
      >
        {TABS.map(([label, to]) => (
          <Box
            key={to}
            component={NavLink}
            to={to}
            end={to === '/'}
            sx={{
              flexShrink: 0,
              px: 1.75,
              py: 0.5,
              borderRadius: 999,
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: C.ink,
              textDecoration: 'none',
              '&:hover': {
                bgcolor: C.soft,
              },
              '&.active': {
                bgcolor: C.blue,
                color: '#fff',
                fontWeight: 600,
              },
              '&:focus-visible': {
                outline: `2px solid ${C.blue}`,
                outlineOffset: 2,
              },
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
    </AppBar>
  )
}
