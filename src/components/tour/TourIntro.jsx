import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForward from '@mui/icons-material/ArrowForward'
import Lightbulb from '@mui/icons-material/Lightbulb'

import TourHint from './TourHint'
import { C, RADIUS, SERIF, TYPE, cardSx, primaryBtn } from '../ui'

/* Welcome card shown before the first step. */
export default function TourIntro({ onStart, onSkip }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        bgcolor: 'rgba(11, 42, 74, 0.55)',
        display: 'grid',
        placeItems: 'center',
        p: 2,
      }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-intro-title"
        sx={{
          ...cardSx,
          width: '100%',
          maxWidth: 480,
          borderRadius: RADIUS.card,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(11, 42, 74, 0.25)',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={0}
          sx={{ height: 3, bgcolor: C.soft, '& .MuiLinearProgress-bar': { bgcolor: C.blue } }}
        />

        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack spacing={2.25}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: RADIUS.control,
                display: 'grid',
                placeItems: 'center',
                bgcolor: C.paleBlue,
                color: C.blue,
              }}
            >
              <Lightbulb />
            </Box>

            <Box>
              <Typography sx={{ fontSize: TYPE.helper, fontWeight: 600, color: C.muted }}>
                MeetAI guided tour
              </Typography>
              <Typography
                id="tour-intro-title"
                sx={{ mt: 0.5, fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.25, color: C.navy }}
              >
                Take a quick tour
              </Typography>
              <Typography sx={{ mt: 1, fontSize: TYPE.label, lineHeight: 1.6, color: C.muted }}>
                We will walk you through the top menu, dashboard, calendar, recorded meetings,
                meeting details and action items, so you know where everything is.
              </Typography>
            </Box>

            <TourHint label="What to expect">
              Follow the highlighted areas and use Next to move through the tour. You can skip it at any time.
            </TourHint>

            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <Button size="small" onClick={onSkip} sx={{ textTransform: 'none', fontWeight: 600, color: C.muted }}>
                Not now
              </Button>
              <Button
                size="small"
                onClick={onStart}
                endIcon={<ArrowForward />}
                sx={{ ...primaryBtn, py: 0.75, px: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Start tour
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}