import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@mui/material/InputAdornment'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      //target all direct child elements of the .root class
      display: 'flex',
      width: '100%',
    },
  },
}))

interface CustomTextFieldProps {
  name: string
  type?: string
  label: string
  id?: string
  variant?: 'filled' | 'outlined' | 'standard'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  maxLength?: number
  minLength?: number
  icon?: React.ReactNode
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  variant = 'outlined',
  value,
  onChange,
  required,
  maxLength,
  type = 'text',
  name,
  minLength,
  icon,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TextField
        name={name}
        type={type}
        label={label}
        variant={variant}
        value={value}
        onChange={onChange}
        required={required}
        inputProps={{ maxLength, minLength }}
        InputProps={{
          startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : null,
        }}
      />
    </div>
  )
}

export default CustomTextField
