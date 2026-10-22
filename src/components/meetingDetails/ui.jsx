import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { T, TONES } from './helpers'

/* White card with 1px hairline border and optional title, icon, badge and action. */
export function Card({ title, subtitle, icon, badge, action, children, sx }) {
  return (
    <Box sx={{ bgcolor: T.card, border: `1px solid ${T.line}`, borderRadius: '16px', boxShadow: T.shadow, p: { xs: 2, md: 2.5 }, minWidth: 0, ...sx }}>
      {(title || action) && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            {icon}
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography component="h2" sx={{ fontFamily: T.serif, fontSize: '1.3125rem', fontWeight: 500, color: T.primary, lineHeight: 1.2 }}>
                  {title}
                </Typography>
                {badge}
              </Box>
              {subtitle && <Typography sx={{ mt: 0.25, fontSize: '0.8125rem', color: T.muted }}>{subtitle}</Typography>}
            </Box>
          </Box>
          {action}
        </Box>
      )}
      {children}
    </Box>
  )
}

export function IconTile({ children }) {
  return (
    <Box aria-hidden="true" sx={{ width: 36, height: 36, borderRadius: '10px', display: 'grid', placeItems: 'center', flexShrink: 0, bgcolor: T.primary, color: '#86efac', '& svg': { fontSize: 20 } }}>
      {children}
    </Box>
  )
}

/* Small status pill. Tones: green, blue, red, amber, slate, navy. */
export function Badge({ tone = 'slate', children, sx }) {
  const t = TONES[tone] ?? TONES.slate
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: '999px',
        bgcolor: t.bg,
        color: t.color,
        fontFamily: T.sans,
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: 0.2,
        whiteSpace: 'nowrap',
        '& svg': { fontSize: 14 },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

/* Label / value row inside a tinted panel. */
export function InfoRow({ label, value, mono = false, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, py: 0.875, borderBottom: `1px solid ${T.line}`, '&:last-child': { borderBottom: 0 } }}>
      <Typography sx={{ fontSize: '0.8125rem', color: T.muted }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: T.ink, textAlign: 'right', fontFamily: mono ? 'monospace' : T.sans, overflowWrap: 'anywhere' }}>
          {value}
        </Typography>
        {action}
      </Box>
    </Box>
  )
}

export function LinkButton({ children, onClick, endIcon }) {
  return (
    <Button onClick={onClick} endIcon={endIcon} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: T.primary, px: 1, minWidth: 0 }}>
      {children}
    </Button>
  )
}

/* Big number tile used at the top of the attendance and action item tabs. */
export function StatTile({ label, value, note, tone = 'ink' }) {
  const color = tone === 'green' ? T.green : tone === 'red' ? T.red : T.primary
  return (
    <Box sx={{ bgcolor: T.card, border: `1px solid ${T.line}`, borderRadius: '12px', p: 1.75, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.8125rem', color: T.muted }}>{label}</Typography>
      <Typography sx={{ mt: 0.25, fontFamily: T.serif, fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.2, color }}>{value}</Typography>
      {note && <Typography sx={{ mt: 0.25, fontSize: '0.8125rem', color: T.muted, overflowWrap: 'anywhere' }}>{note}</Typography>}
    </Box>
  )
}

/* Shown in place of a tab when its data is not ready yet. */
export function NotReadyCard({ icon, title, children }) {
  return (
    <Card title={title} icon={<IconTile>{icon}</IconTile>}>
      <Typography sx={{ color: T.muted, lineHeight: 1.6, fontSize: '0.9375rem' }}>{children}</Typography>
    </Card>
  )
}