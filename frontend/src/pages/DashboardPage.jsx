import { Grid, Paper, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../api/client';
import { LowStockAlert } from '../components/LowStockAlert';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const DashboardPage = () => {
  const [stock, setStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topSales, setTopSales] = useState([]);
  const [warehouseDist, setWarehouseDist] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [stockRes, lowRes, topSalesRes, warehouseRes] = await Promise.all([
        api.get('/reports/stock').catch(() => ({ data: [] })),
        api.get('/reports/low-stock').catch(() => ({ data: [] })),
        api.get('/reports/top-sales').catch(() => ({ data: [] })),
        api.get('/reports/warehouse-distribution').catch(() => ({ data: [] }))
      ]);
      setStock(Array.isArray(stockRes.data) ? stockRes.data : []);
      setLowStock(Array.isArray(lowRes.data) ? lowRes.data : []);
      setTopSales(Array.isArray(topSalesRes.data) ? topSalesRes.data : []);
      setWarehouseDist(Array.isArray(warehouseRes.data) ? warehouseRes.data : []);
    };
    load();
  }, []);

  const totalValue = stock.reduce((acc, curr) => acc + (curr.cost || 0) * curr.currentStock, 0);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(30, 60, 114, 0.2)' }}>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500 }}>Productos Totales</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{stock.length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(255, 65, 108, 0.2)' }}>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500 }}>Bajo Stock (Atención)</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{lowStock.length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(17, 153, 142, 0.2)' }}>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500 }}>Valor de Inventario</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
            ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 400, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 600 }}>Top 5 Productos Salientes</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={topSales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="total" fill="#2a5298" name="Cantidad Vendida" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: 400, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 600 }}>Inventario por Almacén</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={warehouseDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {warehouseDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <LowStockAlert products={lowStock} />
      </Grid>
    </Grid>
  );
};
