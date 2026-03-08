import { Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { LowStockAlert } from '../components/LowStockAlert';

export const DashboardPage = () => {
  const [stock, setStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [stockRes, lowRes] = await Promise.all([
        api.get('/reports/stock').catch(() => ({ data: [] })),
        api.get('/reports/low-stock').catch(() => ({ data: [] }))
      ]);
      setStock(stockRes.data);
      setLowStock(lowRes.data);
    };
    load();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}><Typography variant="h6">Productos totales</Typography><Typography variant="h4">{stock.length}</Typography></Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}><Typography variant="h6">Bajo stock</Typography><Typography variant="h4">{lowStock.length}</Typography></Paper>
      </Grid>
      <Grid item xs={12}>
        <LowStockAlert products={lowStock} />
      </Grid>
    </Grid>
  );
};
