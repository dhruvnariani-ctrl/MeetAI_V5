import { useEffect, useId, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import { C, Pill, initials } from '../ui'
import { inputSx } from './FormField'

const DEFAULT_HINT = 'Summaries are emailed to these people'

/* Directory search box above a row of participant chips. The host is always included and cannot be removed. */
export default function ParticipantPicker({ participants, onAdd, onRemove, searchDirectory, hint = DEFAULT_HINT }) {
  const labelId = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // Debounced directory search; people already added are filtered out.
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return undefined }
    let cancelled = false
    const t = setTimeout(async () => {
      const found = await searchDirectory(query.trim())
      if (!cancelled) setResults(found.filter((p) => !participants.some((s) => s.email === p.email)))
    }, 250)
    return () => { cancelled = true; clearTimeout(t) }
  }, [query, searchDirectory, participants])

  return (
    <Box component="section" aria-labelledby={labelId}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
        <Typography id={labelId} component="h3" sx={{ fontSize: '0.875rem', fontWeight: 650, color: C.navy }}>
          Participants &amp; Directory Selection
        </Typography>
        <Typography component="span" sx={{ fontSize: '0.75rem', color: C.muted, textAlign: 'right' }}>{hint}</Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 1.25, p: 1.25, borderRadius: '12px', bgcolor: C.soft, border: `1px solid ${C.line}` }}>
        <Autocomplete
          size="small"
          value={null}
          inputValue={query}
          onInputChange={(_, v) => setQuery(v)}
          options={results}
          filterOptions={(x) => x /* already filtered by the directory search */}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(a, b) => a.email === b.email}
          forcePopupIcon={false}
          noOptionsText={query.trim().length < 2 ? 'Type at least 2 characters' : 'No matching people'}
          onChange={(_, person) => { if (person) { onAdd(person); setQuery(''); setResults([]) } }}
          renderOption={({ key, ...props }, o) => (
            <Box component="li" key={key} {...props} sx={{ display: 'block !important' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{o.name}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: C.muted }}>{o.email}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Avaada directory by name or email…"
              inputProps={{ ...params.inputProps, 'aria-label': 'Search Avaada directory by name or email' }}
              sx={{ '& .MuiOutlinedInput-root': { ...inputSx, py: '3px', bgcolor: '#fff' } }}
            />
          )}
        />

        <Box component="ul" role="list" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {participants.map((p) => {
            const name = p.name ?? p.email ?? 'Unknown'
            const role = p.role ?? (p.you ? 'Invoker' : null)
            return (
              <Box
                component="li"
                key={p.email ?? name}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pl: 0.5, pr: 0.75, py: 0.5, borderRadius: '999px', bgcolor: '#fff', border: `1px solid ${C.line}` }}
              >
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: p.you ? C.navy : C.blue, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.6875rem', fontWeight: 700 }} aria-hidden="true">
                  {initials(name)}
                </Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: C.navy }}>{name}</Typography>
                {role && <Pill color={C.muted} bg={C.soft} sx={{ fontSize: '0.6875rem', py: 0 }}>{role}</Pill>}
                {p.you ? (
                  <LockOutlinedIcon sx={{ fontSize: 14, color: C.muted, ml: 0.25 }} titleAccess="Always included" />
                ) : (
                  <IconButton size="small" aria-label={`Remove ${name}`} onClick={() => onRemove(p.email)}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}