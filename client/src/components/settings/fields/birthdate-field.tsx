import React from 'react';
import { TextField } from '@mui/material';

interface BirthDateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const BirthDateField: React.FC<BirthDateFieldProps> = ({ value, onChange }) => (
  <TextField
    label="Dátum narodenia"
    variant="outlined"
    fullWidth
    margin="normal"
    type="date"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

export default BirthDateField;
