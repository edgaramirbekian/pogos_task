import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';

interface ButtonComponentProps {
  label: string;
  handleOnClick: () => void;
}

const ButtonComponent: FC<ButtonComponentProps> = ({ label, handleOnClick }) => {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOnClick}>
        {label}
      </Button>
    </div>
  );
};

export default ButtonComponent;