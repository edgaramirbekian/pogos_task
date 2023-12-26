import React, { FC, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

interface InputFieldProps {
  label: string;
  type?: string;
  error?: boolean;
  errorMessage?: string;
  onChange: (value: string) => void;
  validate: (value: string) => void
}

const InputFieldComponent: FC<InputFieldProps> = ({ label, type = 'text', error = false, errorMessage, onChange, validate }) => {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    validate(event.target.value);
  };

  return (
    <div>
      <TextField
        label={label}
        type={type}
        error={error}
        helperText={error ? errorMessage : ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputFieldComponent;