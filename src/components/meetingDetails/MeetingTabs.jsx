import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'transcript', label: 'Transcript' },
  { value: 'recording', label: 'Recording' },
  { value: 'actions', label: 'Action Items' },
]

export const VALID_TABS = TABS.map((tab) => tab.value)

export default function MeetingTabs({ value, onChange }) {
  return (
    <Box sx={{ borderRadius: '12px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="Meeting details sections"
        sx={{
          minHeight: 46,
          '& .MuiTabs-flexContainer': { gap: 0.5, },
          '& .MuiTab-root': {
            minHeight: 38,
            minWidth: { xs: 90, sm: 110 },
            px: 2,
            my: 0.5,
            borderRadius: '9px',
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#33445E',
            transition: 'background-color 160ms ease, color 160ms ease',
          },
          '& .MuiTab-root.Mui-selected': { color: '#FFFFFF', bgcolor: '#111F55' },
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        {TABS.map(({ value: tabValue, label }) => (
          <Tab key={tabValue} value={tabValue} label={label} />
        ))}
      </Tabs>
    </Box>
  )
}