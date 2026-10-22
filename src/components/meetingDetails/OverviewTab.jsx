import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

import ActionRow from './ActionRow'
import AttendeesRoster from './AttendeesRoster'
import { T, copyText } from './helpers'
import { Badge, Card, IconTile, InfoRow, LinkButton } from './ui'

/* Overview & Executive Summary: summary and MeetAI/media details on the left; action items and attendance on the right. */
export default function OverviewTab({ meeting, flags, attendance, onNavigate, onChanged, onAskDone }) {
  const summary = typeof meeting.meetingSummary === 'string' ? meeting.meetingSummary : ''
  const actions = Array.isArray(meeting.actionItems) ? meeting.actionItems : []
  const openActions = actions.filter((item) => item.status !== 'Done')
  const participants = meeting.participants || []
  const transcriptReady = meeting.transcript?.available === true
  const recordingReady = meeting.recording?.available === true

  const panel = { flex: 1, minWidth: 0, p: 1.75, borderRadius: '12px', bgcolor: T.tint }

  return (
    <Box sx={{ display: 'grid', gap: 2, alignItems: 'start', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.5fr) minmax(300px, 1fr)' } }}>
      <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <Card
          title="Meeting Summary"
          subtitle={`Generated for ${meeting.title} · Meeting ID: ${meeting.id}`}
          icon={<IconTile><DescriptionOutlinedIcon /></IconTile>}
          action={
            <IconButton aria-label="Copy summary" onClick={() => copyText(summary)} sx={{ color: T.muted }}>
              <ContentCopyOutlinedIcon />
            </IconButton>
          }
        >
          <Box sx={{ p: 2, bgcolor: T.tint, borderLeft: `4px solid ${T.primary}`, borderRadius: '8px' }}>
            <Typography sx={{ fontSize: '0.9375rem', color: T.ink, lineHeight: 1.6 }}>
              {summary || 'No summary has been generated for this meeting yet.'}
            </Typography>
          </Box>
        </Card>

        <Card
          title="MeetAI & Media Details"
          icon={<IconTile><SmartToyOutlinedIcon /></IconTile>}
          badge={<Badge tone={transcriptReady ? 'green' : 'amber'}>{transcriptReady ? 'Processed' : 'Pending'}</Badge>}
        >
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <Box sx={panel}>
              <Typography sx={{ mb: 0.5, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.6, color: T.muted, textTransform: 'uppercase' }}>MeetAI Assistant</Typography>
              <InfoRow label="Invited" value={flags.meetAIInvited ? 'Yes' : 'No'} />
              <InfoRow label="Attended" value={meeting.meetAI?.attended === true ? 'Yes' : 'No'} />
              <InfoRow label="Video recording" value={flags.recordVideo ? 'Enabled' : 'Disabled'} />
            </Box>
            <Box sx={panel}>
              <Typography sx={{ mb: 0.5, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.6, color: T.muted, textTransform: 'uppercase' }}>Media & Platform</Typography>
              <InfoRow label="Recording" value={recordingReady ? `Available (${meeting.recording.duration})` : 'Not available'} />
              <InfoRow label="Transcript" value={transcriptReady ? 'Available (Completed)' : 'Not available'} />
              <InfoRow label="Platform" value={meeting.platform} />
              <InfoRow label="Meeting link" value={meeting.link || '—'} mono />
            </Box>
          </Box>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <Card
          title="Action Items"
          icon={<IconTile><CheckBoxOutlinedIcon /></IconTile>}
          badge={<Badge tone="green">{openActions.length} Open</Badge>}
          action={<LinkButton onClick={() => onNavigate('actions')} endIcon={<ArrowForwardRoundedIcon />}>View All</LinkButton>}
        >
          {actions.length === 0 ? (
            <Typography sx={{ color: T.muted }}>No action items from this meeting.</Typography>
          ) : (
            actions.slice(0, 3).map((item) => (
              <ActionRow key={item.id} meeting={meeting} item={item} onChanged={onChanged} onAskDone={onAskDone} />
            ))
          )}
        </Card>

        <Card
          title="Attendance Snapshot"
          icon={<IconTile><PeopleOutlinedIcon /></IconTile>}
          action={<LinkButton onClick={() => onNavigate('attendees')} endIcon={<ArrowForwardRoundedIcon />}>Roster ({participants.length})</LinkButton>}
        >
          <AttendeesRoster participants={participants} attendance={attendance} details={meeting.attendanceDetails} compact />
        </Card>
      </Box>
    </Box>
  )
}