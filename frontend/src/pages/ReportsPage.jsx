import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '../api/client';

export const ReportsPage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/reports/stock').then((res) => setRows(res.data)).catch(() => setRows([]));
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Reporte de existencias</Typography>
      <Paper>
        <Table size="small">
          <TableHead><TableRow><TableCell>Producto</TableCell><TableCell>Actual</TableCell><TableCell>Mínimo</TableCell><TableCell>Máximo</TableCell></TableRow></TableHead>
          <TableBody>{rows.map((r) => <TableRow key={r._id}><TableCell>{r.name}</TableCell><TableCell>{r.currentStock}</TableCell><TableCell>{r.minStock}</TableCell><TableCell>{r.maxStock}</TableCell></TableRow>)}</TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};
