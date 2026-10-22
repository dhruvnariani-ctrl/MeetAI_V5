import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { C, RADIUS, TYPE } from '../ui'

/* Soft panel with a bold label, e.g. "Try this" / "Helpful tip". */
export default function TourHint({ label, children }) {
  return (
    <Box sx={{ p: 1.25, borderRadius: RADIUS.control, bgcolor: C.soft, border: `1px solid ${C.line}` }}>
      <Typography sx={{ fontSize: TYPE.helper, fontWeight: 700, color: C.navy }}>{label}</Typography>
      <Typography sx={{ mt: 0.25, fontSize: TYPE.helper, lineHeight: 1.55, color: C.muted }}>{children}</Typography>
    </Box>
  )
}