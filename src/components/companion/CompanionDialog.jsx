
import { useEffect, useId, useRef, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

import { SUGGESTIONS } from './companionEngine'

const NAVY = '#102D4F'
const HEADER_START = '#102C4A'
const HEADER_END = '#063F47'
const BLUE = '#1768B2'
const BORDER = '#E7EDF4'
const CANVAS = '#F7F9FC'
const GREEN = '#15965A'

function BotAvatar({ size = 28, imageSrc }) {
  return (
    <Avatar
      src={imageSrc || undefined}
      alt=""
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        bgcolor: '#EAF2FF',
        color: BLUE,
        border: '1px solid #D8E5F5',
        '& img': { objectFit: 'contain' },
      }}
    >
      {!imageSrc && <SmartToyOutlinedIcon sx={{ fontSize: size * 0.65 }} />}
    </Avatar>
  )
}

function MessageAction({ action, onAction }) {
  return (
    <Button
      key={action.label}
      size="small"
      onClick={() => onAction(action)}
      endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '14px !important' }} />}
      sx={{
        justifyContent: 'space-between',
        textTransform: 'none',
        fontSize: '0.75rem',
        fontWeight: 650,
        color: BLUE,
        bgcolor: '#F3F7FD',
        border: `1px solid ${BORDER}`,
        borderRadius: '9px',
        px: 1.1,
        py: 0.45,
        '&:hover': {
          bgcolor: '#E8F1FC',
          borderColor: '#C7DCF5',
        },
      }}
    >
      {action.label}
    </Button>
  )
}

function Bubble({ message, imageSrc, onAction }) {
  const bot = message.role === 'bot'

  return (
    <Stack
      direction="row"
      spacing={0.9}
      sx={{
        alignItems: 'flex-end',
        justifyContent: bot ? 'flex-start' : 'flex-end',
        width: '100%',
      }}
    >
      {bot && <BotAvatar size={21} imageSrc={imageSrc} />}

      <Box
        sx={{
          maxWidth: '86%',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: bot ? 'flex-start' : 'flex-end',
        }}
      >
        <Box
          sx={{
            px: 1.35,
            py: 1.05,
            borderRadius: bot
              ? '15px 15px 15px 5px'
              : '15px 15px 5px 15px',
            bgcolor: bot ? '#FFFFFF' : NAVY,
            color: bot ? NAVY : '#FFFFFF',
            border: bot ? `1px solid ${BORDER}` : '1px solid transparent',
            boxShadow: bot
              ? '0 2px 5px rgba(20, 45, 75, 0.025)'
              : '0 3px 8px rgba(16, 45, 79, 0.10)',
            fontSize: '0.77rem',
            lineHeight: 1.55,
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere',
          }}
        >
          <span style={visuallyHidden}>
            {bot ? 'MeetAI Companion: ' : 'You: '}
          </span>
          {message.text}
        </Box>

        {bot && message.actions?.length > 0 && (
          <Stack
            direction="row"
            spacing={0.65}
            useFlexGap
            sx={{
              mt: 0.75,
              flexWrap: 'wrap',
              rowGap: 0.65,
              maxWidth: '100%',
            }}
          >
            {message.actions.map((action) => (
              <MessageAction
                key={action.label}
                action={action}
                onAction={onAction}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

function Typing({ imageSrc }) {
  return (
    <Stack direction="row" spacing={0.9} sx={{ alignItems: 'flex-end' }}>
      <BotAvatar size={21} imageSrc={imageSrc} />

      <Box
        role="status"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.55,
          px: 1.4,
          py: 1.2,
          bgcolor: '#fff',
          border: `1px solid ${BORDER}`,
          borderRadius: '14px 14px 14px 5px',
          '@keyframes companionTyping': {
            '0%, 60%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
            '30%': { opacity: 1, transform: 'translateY(-2px)' },
          },
        }}
      >
        <span style={visuallyHidden}>Companion is typing</span>

        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            aria-hidden="true"
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: '#8296AD',
              animation: 'companionTyping 1s infinite',
              animationDelay: `${index * 0.15}s`,
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          />
        ))}
      </Box>
    </Stack>
  )
}

export default function CompanionDialog({
  open,
  onClose,
  messages,
  busy,
  onSend,
  onAction,
  onReset,
  imageSrc,

}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const titleId = useId()
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const [text, setText] = useState('')

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, busy, open])

  const send = (value) => {
    const trimmed = value.trim()
    if (!trimmed || busy) return

    setText('')
    onSend(trimmed)
  }

  const handleClose = () => {
    setText('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      slotProps={{
        paper: {
          'data-tour': 'meetai-companion-dialog',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          bgcolor: 'rgba(12, 32, 55, 0.30)',
          backdropFilter: 'blur(2px)',
        },
        '& .MuiDialog-container': {
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        },
        '& .MuiDialog-paper': {
          m: 0,
          mr: fullScreen ? 0 : { sm: '20px', md: '24px' },
          mt: 0,
          mb:{ sm: '76px', md: '84px' },
          width: fullScreen ? '100%' : 360,
          maxWidth: '100%',
          height: fullScreen ? '100%' : { sm: 460, md: 470 },
          maxHeight: fullScreen ? '100%' : 'calc(100dvh - 110px)',
          minHeight: fullScreen ? 0 : 340,
          borderRadius: fullScreen ? 0 : '19px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
          boxShadow: '0 18px 55px rgba(10, 35, 62, 0.25)',
          border: fullScreen ? 0 : '1px solid rgba(255,255,255,0.75)',
        },
      }}
    >
      {/* Dark gradient header */}
      <Box
        sx={{
          px: 1.6,
          py: 1.35,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#fff',
          background: `linear-gradient(115deg, ${HEADER_START} 0%, #123D52 58%, ${HEADER_END} 100%)`,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          flexShrink: 0,
        }}
      >
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            {imageSrc ? (
              <Avatar
                src={imageSrc}
                alt=""
                sx={{
                  width: 31,
                  height: 31,
                  bgcolor: 'transparent',
                  '& img': { objectFit: 'contain' },
                }}
              />
            ) : (
              <SmartToyOutlinedIcon sx={{ fontSize: 25 }} />
            )}
          </Box>

          <Box
            aria-label="Online"
            sx={{
              position: 'absolute',
              right: -2,
              top: -2,
              width: 10,
              height: 10,
              bgcolor: '#39D98A',
              border: '2px solid #123D52',
              borderRadius: '50%',
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={0.7}
            useFlexGap
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Typography
              id={titleId}
              component="h2"
              sx={{
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 750,
                letterSpacing: '-0.015em',
                lineHeight: 1.3,
              }}
            >
              MeetAI Companion
            </Typography>

            <Box
              sx={{
                px: 0.65,
                py: 0.2,
                borderRadius: '5px',
                bgcolor: 'rgba(57,217,138,0.13)',
                border: '1px solid rgba(57,217,138,0.30)',
                color: '#82E9B5',
                fontSize: '0.56rem',
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              AI ACTIVE
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={0.65}
            sx={{ alignItems: 'center', mt: 0.45 }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                bgcolor: '#55D99B',
              }}
            />

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.88)',
                fontSize: '0.7rem',
                lineHeight: 1.4,
              }}
            >
              Connected · ready to help
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={0.1} sx={{ flexShrink: 0 }}>
          <IconButton
            size="small"
            aria-label="Start a new chat"
            onClick={onReset}
            sx={{
              width: 29,
              height: 29,
              color: 'rgba(255,255,255,0.85)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: 17 }} />
          </IconButton>

          <IconButton
            size="small"
            aria-label="Close Companion"
            onClick={handleClose}
            sx={{
              width: 29,
              height: 29,
              color: 'rgba(255,255,255,0.92)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Conversation */}
      <Box
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 1.5,
          py: 1.35,
          bgcolor: CANVAS,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.4,
          overscrollBehavior: 'contain',
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#D5DFEA',
            borderRadius: 10,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.1 }}>
          <Chip
            label="Today · MeetAI Companion"
            size="small"
            sx={{
              height: 22,
              bgcolor: '#EAF0FA',
              color: '#637994',
              fontSize: '0.62rem',
              fontWeight: 600,
              '& .MuiChip-label': { px: 1.1 },
            }}
          />
        </Box>

        {messages.map((message) => (
          <Bubble
            key={message.id}
            message={message}
            imageSrc={imageSrc}
            onAction={onAction}
          />
        ))}

        {busy && <Typing imageSrc={imageSrc} />}
      </Box>

      {/* Quick prompts */}
      <Box
        sx={{
          px: 1.2,
          pt: 0.85,
          pb: 0.8,
          bgcolor: '#fff',
          borderTop: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={0.6}
          sx={{
            width: '100%',
            overflowX: 'auto',
            pb: 0.15,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {SUGGESTIONS.map((label, index) => {
            const icons = ['▦', '›', '◉']

            return (
              <Chip
                key={label}
                label={
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: index === 2 ? GREEN : BLUE,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {icons[index % icons.length]}
                    </Box>
                    <span>{label}</span>
                  </Stack>
                }
                size="small"
                clickable
                disabled={busy}
                onClick={() => send(label)}
                sx={{
                  flexShrink: 0,
                  height: 25,
                  borderRadius: '9px',
                  bgcolor: '#F5F8FC',
                  color: '#455D78',
                  border: '1px solid #EDF1F6',
                  fontSize: '0.64rem',
                  fontWeight: 650,
                  '& .MuiChip-label': { px: 0.9 },
                  '&:hover': {
                    bgcolor: '#EAF2FC',
                    borderColor: '#D6E5F6',
                  },
                }}
              />
            )
          })}
        </Stack>
      </Box>

      {/* Message input */}
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault()
          send(text)
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.9,
          px: 1.2,
          pt: 0.45,
          pb: 1.15,
          bgcolor: '#fff',
          flexShrink: 0,
        }}
      >
        <OutlinedInput
          inputRef={inputRef}
          fullWidth
          size="small"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask about meetings, tasks, recordings..."
          inputProps={{
            'aria-label': 'Message the Companion',
            maxLength: 300,
          }}
          sx={{
            minWidth: 0,
            borderRadius: '12px',
            bgcolor: '#F9FBFD',
            fontSize: '0.75rem',
            color: NAVY,
            '& .MuiOutlinedInput-input': {
              py: 1.05,
              px: 1.3,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E5EBF3',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#C8D8EA',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: BLUE,
              borderWidth: 1,
            },
          }}
        />

        <IconButton
          type="submit"
          aria-label="Send message"
          disabled={!text.trim() || busy}
          sx={{
            width: 39,
            height: 39,
            flexShrink: 0,
            borderRadius: '11px',
            color: '#fff',
            bgcolor: NAVY,
            boxShadow: '0 3px 7px rgba(16,45,79,0.15)',
            '&:hover': { bgcolor: '#17456F' },
            '&.Mui-disabled': {
              bgcolor: '#DCE5EF',
              color: '#93A4B8',
              boxShadow: 'none',
            },
          }}
        >
          <SendRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Small keyboard hint */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: 1.6,
          pb: 0.6,
          mt: -0.45,
          bgcolor: '#fff',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.53rem',
            letterSpacing: 0.45,
            color: '#A0ACBB',
          }}
        >
          ESC TO CLOSE
        </Typography>
      </Box>
    </Dialog>
  )
}