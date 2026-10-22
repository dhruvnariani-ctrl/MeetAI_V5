import Box from '@mui/material/Box'

import { C } from '../ui'

const OVERLAY = 'rgba(11, 42, 74, 0.42)'
const PAD = 7

/*
 * Dims the whole screen except the target: four dark panels around it,
 * plus a blue outline on the target itself.
 */
export default function TourOverlay({ targetRect, cardRect = null }) {
  // On small screens, begin dimming below the full tour card. This keeps the
  // card area clean and prevents the tall overlay from appearing to cover it.
  const overlayStart = cardRect ? Math.max(cardRect.bottom, 0) : 0
  const topH = Math.max(targetRect.top - PAD - overlayStart, 0)
  const bottomTop = Math.min(targetRect.bottom + PAD, window.innerHeight)
  const leftW = Math.max(targetRect.left - PAD, 0)
  const rightLeft = Math.min(targetRect.right + PAD, window.innerWidth)
  const midH = Math.max(bottomTop - Math.max(targetRect.top - PAD, overlayStart), 0)

  return (
    <>
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 1400, pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: overlayStart, left: 0, right: 0, height: topH, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: bottomTop, left: 0, right: 0, bottom: 0, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: Math.max(targetRect.top - PAD, overlayStart), left: 0, width: leftW, height: midH, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: Math.max(targetRect.top - PAD, overlayStart), left: rightLeft, right: 0, height: midH, bgcolor: OVERLAY }} />
      </Box>

      <Box
        sx={{
          position: 'fixed',
          zIndex: 1401,
          top: targetRect.top - PAD,
          left: targetRect.left - PAD,
          width: targetRect.width + PAD * 2,
          height: targetRect.height + PAD * 2,
          borderRadius: '12px',
          border: `2px solid ${C.blue}`,
          boxShadow: '0 0 0 4px rgba(11, 87, 208, 0.16)',
          transition: 'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}