import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'

import { T } from './helpers'
import { Badge } from './ui'

export const VALID_TABS = ['overview', 'attendees', 'recording', 'transcript', 'actions']

export default function MeetingTabs({ value, onChange, attendeeCount, openActionCount }) {
  const label = (icon, text, count) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
      {icon}
      <span>{text}</span>
      {count !== undefined && <Badge tone="navy" sx={{ ml: 0.25 }}>{count}</Badge>}
    </Box>
  )

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
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTabs-flexContainer': { gap: { xs: 0.75, sm: 1 } },
          '& .MuiTabs-scroller': { overflowX: 'auto !important' },
          '& .MuiTabs-scrollButtons': {
            width: { xs: 24, sm: 32 },
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {[
          { value: 'overview', icon: <DescriptionOutlinedIcon fontSize="small" />, text: 'Overview & Executive Summary' },
          { value: 'attendees', icon: <PeopleOutlinedIcon fontSize="small" />, text: 'Participants & Attendance', count: attendeeCount },
          { value: 'recording', icon: <PlayCircleOutlineIcon fontSize="small" />, text: 'Recording & Media' },
          { value: 'transcript', icon: <GraphicEqIcon fontSize="small" />, text: 'Synchronized Transcript' },
          { value: 'actions', icon: <CheckBoxOutlinedIcon fontSize="small" />, text: 'Action Items & Tasks', count: openActionCount },
        ].map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={label(tab.icon, tab.text, tab.count)}
            sx={{
              minHeight: 42,
              minWidth: 'fit-content',
              flexShrink: 0,
              px: { xs: 1.5, sm: 2 },
              py: 1,
              borderRadius: '999px',
              textTransform: 'none',
              fontFamily: T.sans,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
              whiteSpace: 'nowrap',
              color: T.ink,
              bgcolor: value === tab.value ? T.primary : T.tint,
              '&.Mui-selected': { color: '#fff' },
              '&:hover': { bgcolor: value === tab.value ? T.primaryHover : T.line },
            }}
          />
        ))}
      </Tabs>
    </Box>
  )
}