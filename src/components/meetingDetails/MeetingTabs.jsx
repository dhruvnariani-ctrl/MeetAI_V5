import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'

import { RADIUS, TYPE } from '../ui'
import { T } from './helpers'
import { Badge } from './ui'

export const VALID_TABS = [
  'overview',
  'attendees',
  'recording',
  'transcript',
  'actions',
]

const TAB_DEFINITIONS = [
  {
    value: 'overview',
    icon: <DescriptionOutlinedIcon fontSize="small" />,
    text: 'Overview & Executive Summary',
  },
  {
    value: 'attendees',
    icon: <PeopleOutlinedIcon fontSize="small" />,
    text: 'Participants & Attendance',
    countKey: 'attendeeCount',
  },
  {
    value: 'recording',
    icon: <PlayCircleOutlineIcon fontSize="small" />,
    text: 'Recording & Media',
  },
  {
    value: 'transcript',
    icon: <GraphicEqIcon fontSize="small" />,
    text: 'Synchronized Transcript',
  },
  {
    value: 'actions',
    icon: <CheckBoxOutlinedIcon fontSize="small" />,
    text: 'Action Items & Tasks',
    countKey: 'openActionCount',
  },
]

function TabLabel({ icon, text, count }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <span>{text}</span>

      {count !== undefined && (
        <Badge tone="navy" sx={{ ml: 0.25 }}>
          {count}
        </Badge>
      )}
    </Box>
  )
}

export default function MeetingTabs({
  value,
  onChange,
  attendeeCount,
  openActionCount,
}) {
  const counts = { attendeeCount, openActionCount }

  return (
    <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Meeting details sections"
        sx={{
          minHeight: 0,
          width: '100%',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTabs-flexContainer': {
            gap: { xs: 0.75, sm: 1 },
          },
          '& .MuiTabs-scroller': {
            overflowX: 'auto !important',
          },
          '& .MuiTabs-scrollButtons': {
            width: { xs: 24, sm: 32 },
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
        }}
      >
        {TAB_DEFINITIONS.map((tab) => {
          const selected = value === tab.value

          return (
            <Tab
              key={tab.value}
              data-tour={tab.value === 'attendees' ? 'meeting-participants' : undefined}
              value={tab.value}
              label={
                <TabLabel
                  icon={tab.icon}
                  text={tab.text}
                  count={
                    tab.countKey
                      ? counts[tab.countKey]
                      : undefined
                  }
                />
              }
              sx={{
                minHeight: 42,
                minWidth: 'fit-content',
                flexShrink: 0,
                px: { xs: 1.5, sm: 2 },
                py: 1,
                borderRadius: RADIUS.pill,
                textTransform: 'none',
                fontFamily: T.sans,
                fontSize: {
                  xs: TYPE.helper,
                  sm: TYPE.label,
                },
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: T.ink,
                bgcolor: selected ? T.primary : T.tint,
                '&.Mui-selected': {
                  color: T.card,
                },
                '&:hover': {
                  bgcolor: selected
                    ? T.primaryHover
                    : T.line,
                },
              }}
            />
          )
        })}
      </Tabs>
    </Box>
  )
}