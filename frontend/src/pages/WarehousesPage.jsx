import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api/client';
import { WarehouseCard } from '../components/WarehouseCard';

export const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchWarehouses = async () => {
    const { data } = await api.get('/warehouses').catch(() => ({ data: [] }));
    setWarehouses(data);
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const onSubmit = async (payload) => {
    await api.post('/warehouses', payload).catch(() => null);
    reset();
    fetchWarehouses();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Gestión de almacenes</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Nombre" {...register('name', { required: true })} />
        <TextField label="Descripción" {...register('description')} />
        <Button variant="contained" type="submit">Crear</Button>
      </Stack>
      <Grid container spacing={2}>
        {warehouses.map((warehouse) => (
          <Grid item xs={12} md={4} key={warehouse._id}><WarehouseCard warehouse={warehouse} /></Grid>
        ))}
      </Grid>
    </Stack>
  );
};
