import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      login(data);
      navigate('/');
    } catch {
      setError('No fue posible iniciar sesión');
    }
  };

  return (
    <Paper sx={{ maxWidth: 380, mx: 'auto', mt: 8, p: 3 }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5">Iniciar sesión</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Correo" {...register('email', { required: true })} />
        <TextField label="Contraseña" type="password" {...register('password', { required: true })} />
        <Button variant="contained" type="submit">Entrar</Button>
      </Stack>
    </Paper>
  );
};
