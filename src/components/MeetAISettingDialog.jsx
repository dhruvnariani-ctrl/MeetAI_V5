
import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import { switchSx } from './meetAISettingStyles'

const controlRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  px: 1.5,
  py: 1.25,
  border: '1px solid #e1e6ec',
  borderRadius: '12px',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { bgcolor: '#f8fafc' },
}

const onActivateKey = (action) => (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return

  event.preventDefault()
  event.stopPropagation()
  action()
}

function SettingRow({
  title,
  description,
  checked,
  disabled,
  onToggle,
  onSwitchChange,
  switchProps,
  sx,
}) {
  return (
    <Box
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        if (!disabled) onToggle()
      }}
      onKeyDown={onActivateKey(() => {
        if (!disabled) onToggle()
      })}
      sx={{
        ...controlRowSx,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...sx,
      }}
    >
      <Box sx={{ pr: 2 }}>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: '0.75rem',
            lineHeight: 1.45,
            color: 'text.secondary',
          }}
        >
          {description}
        </Typography>
      </Box>

      <Switch
        size="small"
        checked={checked}
        disabled={disabled}
        onChange={onSwitchChange}
        onClick={(event) => event.stopPropagation()}
        sx={switchSx}
        {...switchProps}
      />
    </Box>
  )
}

function MeetAISettingsDialogContent({
  onClose,
  onSave,
  settings,
  disabled,
}) {
  const [draftAutoJoin, setDraftAutoJoin] = useState(
    settings.autoJoin === true,
  )

  const [draftRecordVideo, setDraftRecordVideo] = useState(
    settings.autoJoin === true && settings.recordVideo === true,
  )

  const toggleAutoJoin = () => {
    const next = !draftAutoJoin

    setDraftAutoJoin(next)

    if (!next) {
      setDraftRecordVideo(false)
    }
  }

  const toggleRecordVideo = () => {
    if (draftAutoJoin) {
      setDraftRecordVideo((current) => !current)
    }
  }

  const handleClose = (event) => {
    event?.stopPropagation()
    onClose()
  }

  const handleSave = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (disabled) return

    onSave({
      autoJoin: draftAutoJoin,
      recordVideo: draftAutoJoin && draftRecordVideo,
    })
  }

  const recordDisabled = disabled || !draftAutoJoin

  return (
    <>
      <DialogTitle sx={{ fontSize: '0.9375rem', fontWeight: 700, pb: 1 }}>
        {draftAutoJoin
          ? 'MeetAI meeting settings'
          : 'Invite MeetAI to this meeting?'}
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            color: 'text.secondary',
            mb: 2.25,
          }}
        >
          MeetAI can automatically join this meeting. You can also choose
          whether you want to save a video recording.
        </Typography>

        <SettingRow
          title="Invite MeetAI"
          description="Let MeetAI automatically join this meeting."
          checked={draftAutoJoin}
          disabled={disabled}
          onToggle={toggleAutoJoin}
          onSwitchChange={(event) => {
            event.stopPropagation()

            if (disabled) return

            const checked = event.target.checked
            setDraftAutoJoin(checked)

            if (!checked) {
              setDraftRecordVideo(false)
            }
          }}
          sx={{ opacity: disabled ? 0.65 : 1 }}
        />

        <SettingRow
          title="Record video"
          description="Save a video recording of the meeting."
          checked={draftAutoJoin && draftRecordVideo}
          disabled={recordDisabled}
          onToggle={toggleRecordVideo}
          onSwitchChange={(event) => {
            event.stopPropagation()

            if (!recordDisabled) {
              setDraftRecordVideo(event.target.checked)
            }
          }}
          switchProps={{
            slotProps: {
              input: { 'aria-label': 'Record video' },
            },
          }}
          sx={{ mt: 1.25, opacity: recordDisabled ? 0.5 : 1 }}
        />

        {!draftAutoJoin && (
          <Typography
            sx={{
              mt: 1.25,
              fontSize: '0.75rem',
              lineHeight: 1.45,
              color: 'text.secondary',
            }}
          >
            Video recording is unavailable until MeetAI is enabled.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: 'none', fontSize: '0.8125rem' }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={disabled}
          sx={{
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </>
  )
}

export default function MeetAISettingsDialog({
  open,
  onClose,
  onSave,
  settings = {},
  disabled = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      onClick={(event) => event.stopPropagation()}
    >
      {open && (
        <MeetAISettingsDialogContent
          key={`${settings.autoJoin}-${settings.recordVideo}`}
          onClose={onClose}
          onSave={onSave}
          settings={settings}
          disabled={disabled}
        />
      )}
    </Dialog>
  )
}
