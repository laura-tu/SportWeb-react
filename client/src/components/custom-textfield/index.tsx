import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface CustomTextFieldProps {
  name: string;
  type?: string;
  label: string;
  id?: string;
  variant?: 'filled' | 'outlined' | 'standard';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  icon?: React.ReactNode;
}

// Use the styled API to create a styled wrapper
const Root = styled('div')({
  '& > *': {
    display: 'flex',
    width: '100%',
  },
});

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
  return (
    <Root>
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
    </Root>
  );
};

export default CustomTextField;
