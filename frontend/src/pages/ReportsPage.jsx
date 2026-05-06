import { Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsPage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/reports/stock')
      .then((res) => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRows([]));
  }, []);

  const handleExportCSV = () => {
    const headers = ['Producto', 'Costo Unitario', 'Stock Actual', 'Stock Mínimo', 'Stock Máximo', 'Valor Total'];
    const csvRows = rows.map(r => [
      `"${r.name}"`,
      r.cost || 0,
      r.currentStock,
      r.minStock,
      r.maxStock,
      (r.cost || 0) * r.currentStock
    ]);

    const csvContent = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_inventario_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Reporte de Existencias', 14, 15);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableColumn = ["Producto", "Costo", "Actual", "Mínimo", "Máximo", "Valor Total"];
    const tableRows = [];

    rows.forEach(r => {
      const rowData = [
        r.name,
        `$${r.cost || 0}`,
        r.currentStock,
        r.minStock,
        r.maxStock,
        `$${((r.cost || 0) * r.currentStock).toLocaleString('es-MX')}`
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
    });

    const finalY = doc.lastAutoTable.finalY || 28;
    const totalInventoryValue = rows.reduce((acc, curr) => acc + (curr.cost || 0) * curr.currentStock, 0);
    doc.text(`Valor Total del Inventario: $${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 14, finalY + 10);

    doc.save(`reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totalInventoryValue = rows.reduce((acc, curr) => acc + (curr.cost || 0) * curr.currentStock, 0);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Reporte de existencias</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="error" startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF}>
            Exportar PDF
          </Button>
          <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
            Exportar CSV
          </Button>
        </Stack>
      </Stack>

      <Typography variant="subtitle1" fontWeight="bold">
        Valor Total del Inventario: ${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </Typography>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Actual</TableCell>
              <TableCell>Mínimo</TableCell>
              <TableCell>Máximo</TableCell>
              <TableCell>Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>${r.cost || 0}</TableCell>
                <TableCell>{r.currentStock}</TableCell>
                <TableCell>{r.minStock}</TableCell>
                <TableCell>{r.maxStock}</TableCell>
                <TableCell>${((r.cost || 0) * r.currentStock).toLocaleString('es-MX')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};
