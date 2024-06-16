'use client'
import React from 'react';
import { useTheme } from '@/Context/themeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button } from '@mui/material';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button className = 'toggleButton' variant = 'contained' style={{height: 40}} onClick={toggleTheme}>
      {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </Button>
  );
};

export default ThemeToggle;
