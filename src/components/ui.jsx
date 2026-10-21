import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif"

export const C = {
  navy: '#0B2A4A',
  ink: '#16324A',
  muted: '#556B80',
  line: '#DFE7EC',
  soft: '#F3F6F9',
  blue: '#0B57D0',
  paleBlue: '#E8F0FC',
  green: '#1B8A47',
  paleGreen: '#E6F5EB',
  red: '#C0392B',
  paleRed: '#FCECEA',
  amber: '#B7791F',
}

export const cardSx = {
  bgcolor: '#fff',
  border: `1px solid ${C.line}`,
  borderRadius: '14px',
  boxShadow: '0 1px 3px rgba(11,42,74,0.05)',
  minWidth: 0,
}

/* Page root: fills the screen on desktop so the lists scroll inside their cards. */
export const fitSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
}

/* Two-column area under the page header. Children scroll internally on desktop. */
export const splitSx = {
  flex: 1,
  minHeight: { xs: 'auto', lg: 280 },
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.55fr) minmax(300px, 1fr)' },
  gridTemplateRows: { lg: 'minmax(0, 1fr)' },
  gap: 1.25,
  '& > *': { minHeight: 0 },
}

export const scrollSx = { overflowY: { lg: 'auto' }, minHeight: 0 }

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const minutesOf = (m) => Math.max(0, Math.round((new Date(m.end) - new Date(m.start)) / 60000))

/* "Microsoft Teams" -> "Teams", "Google Meet" -> "Meet", "Zoom" -> "Zoom" */
export const shortPlatform = (p = '') => p.replace(/^Microsoft /, '').replace(/^Google /, '')

export function Pill({ children, color = C.blue, bg = C.paleBlue, sx }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: 999,
        bgcolor: bg,
        color,
        fontSize: '0.8125rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        '& .MuiSvgIcon-root': { fontSize: 15 },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function PageHead({ badge, title, subtitle, actions }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 1.25,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {badge && <Box sx={{ mb: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>{badge}</Box>}
        <Typography component="h1" sx={{ fontFamily: SERIF, fontSize: { xs: '1.5rem', md: '1.75rem' }, lineHeight: 1.2, fontWeight: 600, color: C.navy }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.25, fontSize: '0.9375rem', color: C.muted }}>{subtitle}</Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>}
    </Box>
  )
}

export const primaryBtn = {
  bgcolor: C.navy,
  color: '#fff',
  borderRadius: '10px',
  px: 2,
  '&:hover': { bgcolor: '#08203A' },
}

export const lightBtn = {
  bgcolor: '#fff',
  color: C.navy,
  border: `1px solid ${C.line}`,
  borderRadius: '10px',
  px: 2,
  '&:hover': { bgcolor: C.soft },
}