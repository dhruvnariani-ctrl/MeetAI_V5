
import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined'

import { getMeetingToggleSettings, getStatusKey } from '../meetings/meetingHelpers'
import { getMeetingById } from '../../data/meetings'
import {
  C,
  Pill,
  SERIF,
  cardSx,
  lightBtn,
  minutesOf,
  primaryBtn,
} from '../ui'

function ControlRow({
  title,
  text,
  checked,
  disabled,
  onChange,
  icon,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        p: 1.25,
        borderRadius: '12px',
        border: `1px solid ${
          checked && !disabled ? '#C8DDFB' : C.line
        }`,
        bgcolor: checked && !disabled ? '#F2F7FF' : '#FFFFFF',
        opacity: disabled ? 0.65 : 1,
        transition: 'background-color 180ms ease, border-color 180ms ease',
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '10px',
          color: checked && !disabled ? C.blue : C.muted,
          bgcolor: checked && !disabled ? '#E1EDFF' : C.soft,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            lineHeight: 1.4,
            color: C.navy,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: '0.75rem',
            lineHeight: 1.45,
            color: C.muted,
          }}
        >
          {text}
        </Typography>

        {!disabled && (
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: checked ? C.blue : C.muted,
            }}
          >
            {checked ? 'ENABLED' : 'OFF'}
          </Typography>
        )}

        {disabled && (
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: C.muted,
            }}
          >
            Unavailable for this meeting
          </Typography>
        )}
      </Box>

      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        slotProps={{ input: { 'aria-label': title } }}
        sx={{
          flexShrink: 0,
          mr: -0.5,
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: C.blue,
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            bgcolor: C.blue,
            opacity: 1,
          },
          '& .MuiSwitch-track': {
            borderRadius: 20,
            bgcolor: '#C9D2DF',
            opacity: 1,
          },
        }}
      />
    </Box>
  )
}

/* Selected meeting details and MeetAI controls.
   Attendees are intentionally omitted to keep the panel compact. */
export default function CalendarSidebar({
  meeting,
  settings,
  onSettingsChange,
  onOpen,
}) {
  const [copied, setCopied] = useState(false)

  if (!meeting) {
    return (
      <Box
        sx={{
          ...cardSx,
          flex: 1,
          minHeight: 0,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 1,
          bgcolor: C.soft,
          borderStyle: 'dashed',
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: '#fff',
            border: `1px solid ${C.line}`,
            color: C.blue,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <EventNoteOutlinedIcon />
        </Box>

        <Typography
          sx={{
            fontFamily: SERIF,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: C.navy,
          }}
        >
          Meeting details
        </Typography>

        <Typography sx={{ fontSize: '0.9375rem', color: C.muted }}>
          No meeting selected
        </Typography>
      </Box>
    )
  }

  const status = getStatusKey(meeting)
  const done = status === 'Done'
  const { autoJoin, recordVideo } = getMeetingToggleSettings(meeting, settings)

  const copyLink = async () => {
    if (!meeting.link) return

    try {
      await navigator.clipboard.writeText(meeting.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Box
      sx={{
        ...cardSx,
        flex: 1,
        minHeight: 0,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* Panel heading */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: C.navy }}>
          Meeting details
        </Typography>

        <Pill
          color={status === 'Live' ? C.green : C.muted}
          bg={status === 'Live' ? C.paleGreen : C.soft}
        >
          {status === 'Live'
            ? 'Live now'
            : status === 'Done'
              ? 'Completed'
              : 'Upcoming'}
        </Pill>
      </Box>

      {/* Meeting information */}
      <Box>
        <Pill sx={{ mb: 0.75 }}>
          <VideocamOutlinedIcon />
          {meeting.platform}
        </Pill>

        <Typography
          component="h2"
          sx={{
            fontFamily: SERIF,
            fontSize: '1.375rem',
            fontWeight: 600,
            lineHeight: 1.25,
            color: C.navy,
          }}
        >
          {meeting.title}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: '0.875rem',
            color: C.muted,
          }}
        >
          {meeting.time} ({minutesOf(meeting)} minutes)
        </Typography>
      </Box>

      {/* Meeting actions */}
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        <Button
          fullWidth
          onClick={() => onOpen(meeting.id)}
          sx={{
            ...primaryBtn,
            py: 0.9,
          }}
        >
          Open Meeting Details
        </Button>

        {!done && meeting.link && (
          <Button
            fullWidth
            onClick={copyLink}
            startIcon={<ContentCopyRoundedIcon />}
            sx={{
              ...lightBtn,
              py: 0.9,
              bgcolor: C.paleBlue,
              border: 0,
              color: C.blue,
              '&:hover': {
                bgcolor: '#E4EEFF',
              },
            }}
          >
            {copied ? 'Link copied' : 'Copy Meeting Link'}
          </Button>
        )}
      </Box>

      {/* Redesigned MeetAI controls */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: '14px',
          bgcolor: C.soft,
          border: `1px solid ${C.line}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
        }}
      >
        {/* Controls header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '12px',
              bgcolor: C.paleBlue,
              color: C.blue,
            }}
          >
            <SmartToyOutlinedIcon sx={{ fontSize: 23 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: C.navy,
              }}
            >
              MeetAI Controls
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: '0.75rem',
                lineHeight: 1.45,
                color: C.muted,
              }}
            >
              Manage your meeting assistant
            </Typography>
          </Box>

          <Box
            sx={{
              width: 8,
              height: 8,
              flexShrink: 0,
              borderRadius: '50%',
              bgcolor: done ? C.muted : autoJoin ? C.green : '#C9D2DF',
            }}
          />
        </Box>

        {/* Assistant toggle */}
        <ControlRow
          title="Invite MeetAI Assistant"
          text="Generate notes, action items and summaries"
          checked={autoJoin}
          disabled={done}
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />}
          onChange={(checked) =>
            onSettingsChange(meeting.id, { autoJoin: checked })
          }
        />

        {/* Recording toggle */}
        <ControlRow
          title="Record Video & Slides"
          text={
            !autoJoin
              ? 'Enable the assistant first'
              : 'Keep a video replay of your meeting'
          }
          checked={recordVideo}
          disabled={done || !autoJoin}
          icon={<VideoCameraBackOutlinedIcon sx={{ fontSize: 20 }} />}
          onChange={(checked) =>
            onSettingsChange(meeting.id, { recordVideo: checked })
          }
        />

        {done && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              lineHeight: 1.5,
              color: C.muted,
            }}
          >
            This meeting is completed, so its settings can no longer be changed.
          </Typography>
        )}
      </Box>
    </Box>
  )
}