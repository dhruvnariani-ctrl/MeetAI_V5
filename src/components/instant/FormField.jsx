
import { forwardRef, useId } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'

import {
  C,
  TYPE,
  fieldSx,
  fieldLabelSx,
} from '../ui'

// Preserve these exports for existing components that import them.
export const inputSx = fieldSx
export const labelSx = fieldLabelSx

/* Label, optional hint, input, then helper or error text. */
const FormField = forwardRef(function FormField(
  {
    label,
    optional,
    required,
    hint,
    helper,
    error,
    startIcon,
    endAdornment,
    inputAttrs,
    ...rest
  },
  ref,
) {
  const id = useId()
  const helperId = `${id}-help`

  return (
    <FormControl fullWidth required={required} error={error}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 1,
          mb: 0.75,
        }}
      >
        <FormLabel
          htmlFor={id}
          sx={{ ...labelSx, mb: 0 }}
        >
          {label}
          {optional && (
            <Box
              component="span"
              sx={{ fontWeight: 400, color: C.muted }}
            >
              {' '}(optional)
            </Box>
          )}
        </FormLabel>

        {hint && (
          <Typography
            component="span"
            sx={{
              fontSize: TYPE.helper,
              color: C.muted,
              textAlign: 'right',
            }}
          >
            {hint}
          </Typography>
        )}
      </Box>

      <OutlinedInput
        {...rest}
        id={id}
        inputRef={ref}
        startAdornment={
          startIcon && (
            <Box
              sx={{
                display: 'flex',
                mr: 1,
                color: C.muted,
              }}
            >
              {startIcon}
            </Box>
          )
        }
        endAdornment={endAdornment}
        inputProps={{
          'aria-describedby': helper ? helperId : undefined,
          ...inputAttrs,
        }}
        sx={inputSx}
      />

      {helper && (
        <FormHelperText
          id={helperId}
          role={error ? 'alert' : undefined}
          sx={{
            mx: 0,
            mt: 0.75,
            fontSize: TYPE.helper,
            color: error ? 'error.main' : C.muted,
          }}
        >
          {helper}
        </FormHelperText>
      )}
    </FormControl>
  )
})

export default FormField
