/* eslint-disable react-refresh/only-export-components */
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'

import { C, SERIF, RADIUS, TYPE } from '../ui'

export const TONES = {
  green: { color: C.green, bg: C.paleGreen, line: '#CFE8DA' },
  blue: { color: C.blue, bg: C.paleBlue, line: '#C9DCF5' },
}

/* Dialog frame used by both MeetAI dialogs. The header and footer stay fixed;
   the form body scrolls only when its content is taller than the window. */
export default function DialogShell({
  open, onClose, titleId, descId, icon, badge, title, subtitle, tone = 'green', footerNote, actions, onSubmit, children,
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const t = TONES[tone]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      aria-describedby={descId}
      slotProps={{
        paper: {
          sx: {
            width: 620,
            maxWidth: '100%',
            maxHeight: fullScreen ? '100%' : 'calc(100% - 48px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: fullScreen ? 0 : RADIUS.card,
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ flexShrink: 0, height: 4, background: `linear-gradient(90deg, ${C.green}, #8FE3B0, ${C.navy})` }} />

      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5, px: 3, pt: 2, pb: 1.75 }}>
        <Box
          aria-hidden="true"
          sx={{ width: 44, height: 44, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '12px', bgcolor: t.bg, color: t.color }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography id={titleId} component="h2" sx={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.2, color: C.navy }}>
              {title}
            </Typography>
            {badge}
          </Box>
          <Typography id={descId} sx={{ mt: 0.5, fontSize: TYPE.label, color: C.muted, lineHeight: 1.5 }}>
            {subtitle}
          </Typography>
        </Box>

        <IconButton aria-label="Close" onClick={onClose} sx={{ color: C.muted, alignSelf: 'flex-start' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        component={onSubmit ? 'form' : 'div'}
        noValidate
        onSubmit={onSubmit}
        sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, pt: 1.5, pb: 2, display: 'grid', gap: 1.75, alignContent: 'start' }}>
          {children}
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 2 },
            px: 3,
            py: 1.5,
            bgcolor: C.soft,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, flex: 1, minWidth: 0, fontSize: '0.8125rem', color: C.ink, lineHeight: 1.5 }}>
            {footerNote}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, flexShrink: 0, '& .MuiButton-root': { height: 42, minWidth: 120 } }}>
            {actions}
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

/* Card with a switch: used for MeetAI recording and attendance options. */
export function ToggleCard({ title, text, checked, onChange, disabled = false, tone = 'green' }) {
  const t = TONES[tone]
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        p: 1.5,
        borderRadius: RADIUS.control,
        bgcolor: '#fff',
        border: `1px solid ${checked ? t.color : C.line}`,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: C.navy }}>{title}</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: C.muted, lineHeight: 1.5 }}>{text}</Typography>
      </Box>
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        slotProps={{ input: { 'aria-label': title } }}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': { color: t.color },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: t.color },
        }}
      />
    </Box>
  )
}

/* Selectable tile: a checkbox by default, or a radio button when type="radio" (only one can be chosen). */
export function OptionTile({ label, checked, onChange, tone = 'blue', type = 'checkbox' }) {
  const t = TONES[tone]
  const Control = type === 'radio' ? Radio : Checkbox
  return (
    <Box
      component="label"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 1,
        borderRadius: RADIUS.control,
        cursor: 'pointer',
        border: `1px solid ${checked ? t.color : C.line}`,
        bgcolor: checked ? t.bg : '#fff',
        '&:focus-within': { outline: `2px solid ${t.color}`, outlineOffset: 2 },
      }}
    >
      <Control
        size="small"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{ p: 0, color: '#9fb0c6', '&.Mui-checked': { color: t.color } }}
      />
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: C.navy }}>{label}</Typography>
    </Box>
  )
}

export { HeadsetMicOutlinedIcon }