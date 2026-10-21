import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import { C, SERIF, lightBtn } from '../ui'

/* Confirms before an action item is marked done. Matches the app's card and button style. */
export default function ConfirmMarkDoneDialog({ open, taskTitle = '', onCancel, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-mark-done-title"
      slotProps={{
        paper: {
          sx: { borderRadius: '14px', border: `1px solid ${C.line}`, boxShadow: '0 16px 48px rgba(11,42,74,0.18)', m: 2 },
        },
      }}
    >
      <Box sx={{ px: 3, pt: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: C.paleGreen, color: C.green, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <CheckCircleOutlineRoundedIcon />
        </Box>
        <Typography id="confirm-mark-done-title" component="h2" sx={{ fontFamily: SERIF, fontSize: '1.375rem', fontWeight: 600, color: C.navy }}>
          Mark as done?
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 1.5, pb: 1 }}>
        <Typography sx={{ fontSize: '0.9375rem', color: C.ink, lineHeight: 1.5 }}>
          Confirm you have completed this action item. It will move to Completed on the dashboard and in My Tasks.
        </Typography>
        {taskTitle && (
          <Box sx={{ mt: 1.5, p: 1.25, borderRadius: '10px', bgcolor: C.soft, border: `1px solid ${C.line}` }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: C.navy, overflowWrap: 'anywhere' }}>{taskTitle}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button onClick={onCancel} sx={{ ...lightBtn, flex: 1 }}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={<CheckCircleOutlineRoundedIcon />}
          sx={{ flex: 1, borderRadius: '10px', bgcolor: C.green, color: '#fff', textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#14753A', boxShadow: 'none' } }}
        >
          Mark as done
        </Button>
      </DialogActions>
    </Dialog>
  )
}