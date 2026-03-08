import { Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api/client';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { unit: 'pieza', minStock: 0, maxStock: 0 } });

  const load = async () => {
    const [productRes, warehouseRes] = await Promise.all([
      api.get('/products').catch(() => ({ data: [] })),
      api.get('/warehouses').catch(() => ({ data: [] }))
    ]);
    setProducts(productRes.data);
    setWarehouses(warehouseRes.data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (payload) => {
    await api.post('/products', payload).catch(() => null);
    reset();
    load();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Catálogo de productos</Typography>
      <Stack component="form" direction={{ xs: 'column', md: 'row' }} spacing={1} onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Nombre" {...register('name', { required: true })} />
        <TextField select label="Unidad" {...register('unit')} sx={{ minWidth: 120 }}>
          <MenuItem value="pieza">Pieza</MenuItem><MenuItem value="kilo">Kilo</MenuItem><MenuItem value="litro">Litro</MenuItem><MenuItem value="caja">Caja</MenuItem>
        </TextField>
        <TextField select label="Almacén" {...register('warehouse', { required: true })} sx={{ minWidth: 160 }}>
          {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
        </TextField>
        <TextField label="Categoría (id)" {...register('category', { required: true })} />
        <Button variant="contained" type="submit">Agregar</Button>
      </Stack>
      <Paper>
        <Table size="small">
          <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Almacén</TableCell><TableCell>Categoría</TableCell><TableCell>Stock</TableCell></TableRow></TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}><TableCell>{p.name}</TableCell><TableCell>{p.warehouse?.name}</TableCell><TableCell>{p.category?.name}</TableCell><TableCell>{p.currentStock}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};
