import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2D6CDF' },
    secondary: { main: '#00A6A6' },
    background: { default: '#F6F8FC', paper: '#FFFFFF' }
  },
  shape: { borderRadius: 10 }
});
