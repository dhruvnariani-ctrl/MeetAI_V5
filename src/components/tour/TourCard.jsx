import { forwardRef } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Close from '@mui/icons-material/Close'

import TourHint from './TourHint'
import { getTourIcon } from './TourIcons'
import { C, RADIUS, SERIF, TYPE, cardSx, lightBtn, primaryBtn } from '../ui'

/*
 * The floating card for one tour step.
 * `position` is { top, left } from positionCard(); the ref goes to the card
 * so TourRunner can measure it.
 */
const TourCard = forwardRef(function TourCard(
  { step, index, total, position, onNext, onBack, onClose },
  ref,
) {
  const current = index + 1
  const isLast = index === total - 1
  const Icon = getTourIcon(step.icon)

  return (
    <Fade in timeout={180}>
      <Box
        ref={ref}
        role="dialog"
        aria-label={`Tour step ${current} of ${total}: ${step.title}`}
        sx={{
          ...cardSx,
          position: 'fixed',
          zIndex: 1402,
          width: { xs: 'calc(100vw - 24px)', sm: 360 },
          maxWidth: 360,
          top: position?.top ?? 16,
          left: position?.left ?? 16,
          bottom: 'auto',
          maxHeight: { xs: position?.maxHeight ?? '44vh', sm: 'calc(100vh - 32px)' },
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          boxSizing: 'border-box',
          boxShadow: '0 16px 40px rgba(11, 42, 74, 0.18)',
          overflow: 'hidden',
          transition: 'top 180ms ease, left 180ms ease',
          '@media (max-width: 639px)': {
            '& .tour-card-content': { p: 1.25, gap: 1 },
          },
        }}
      >
        <LinearProgress
          variant="determinate"
          value={(current / total) * 100}
          sx={{ height: 3, bgcolor: C.soft, '& .MuiLinearProgress-bar': { bgcolor: C.blue } }}
        />

        <Stack className="tour-card-content" spacing={{ xs: 1, sm: 1.75 }} sx={{ p: { xs: 1.25, sm: 2.25 } }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: { xs: 30, sm: 40 },
                height: { xs: 30, sm: 40 },
                borderRadius: RADIUS.control,
                display: 'grid',
                placeItems: 'center',
                bgcolor: C.paleBlue,
                color: C.blue,
                flexShrink: 0,
              }}
            >
              <Icon fontSize="small" />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: TYPE.helper, fontWeight: 600, color: C.muted }}>
                MeetAI tour
              </Typography>
              <Typography
                sx={{
                  fontFamily: SERIF,
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: C.navy,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {step.title}
              </Typography>
            </Box>

            <IconButton size="small" onClick={onClose} aria-label="Close tour" sx={{ color: C.muted, flexShrink: 0 }}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>

          <Typography sx={{ fontSize: { xs: '0.8rem', sm: TYPE.label }, lineHeight: { xs: 1.4, sm: 1.6 }, color: C.ink, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: { xs: 3, sm: 'unset' }, overflow: { xs: 'hidden', sm: 'visible' } }}>{step.body}</Typography>

          {step.action && <Box sx={{ display: { xs: 'none', sm: 'block' } }}><TourHint label="Try this">{step.action}</TourHint></Box>}
          {step.tip && <Box sx={{ display: { xs: 'none', sm: 'block' } }}><TourHint label="Helpful tip">{step.tip}</TourHint></Box>}

          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Button size="small" onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600, color: C.muted, px: 0.5 }}>
              Skip tour
            </Button>

            <Stack direction="row" spacing={1}>
              {index > 0 && (
                <Button
                  size="small"
                  onClick={onBack}
                  startIcon={<ArrowBack />}
                  sx={{ ...lightBtn, py: 0.6, textTransform: 'none', fontWeight: 600 }}
                >
                  Back
                </Button>
              )}
              <Button
                size="small"
                onClick={onNext}
                endIcon={isLast ? undefined : <ArrowForward />}
                sx={{ ...primaryBtn, py: 0.6, px: 1.75, textTransform: 'none', fontWeight: 600 }}
              >
                {isLast ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </Stack>

          <Typography sx={{ textAlign: 'right', fontSize: TYPE.helper, color: C.muted, lineHeight: 1.2 }}>
            {current} of {total}
          </Typography>
        </Stack>
      </Box>
    </Fade>
  )
})

export default TourCard