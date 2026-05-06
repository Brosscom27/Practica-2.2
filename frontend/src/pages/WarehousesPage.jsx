import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api/client';

export const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [totalWarehouses, setTotalWarehouses] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, warehouse: null });
  const [createDialog, setCreateDialog] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  const fetchWarehouses = async () => {
    const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
    if (searchTerm) params.append('search', searchTerm);

    const { data } = await api.get(`/warehouses?${params.toString()}`).catch(() => ({ data: { data: [], total: 0 } }));

    if (Array.isArray(data)) {
      setWarehouses(data);
      setTotalWarehouses(data.length);
    } else {
      setWarehouses(data.data || []);
      setTotalWarehouses(data.total || 0);
    }
  };

  useEffect(() => { fetchWarehouses(); }, [page, rowsPerPage, searchTerm]);

  const onSubmit = async (payload) => {
    try {
      await api.post('/warehouses', payload);
      reset();
      setError(null);
      setCreateDialog(false);
      fetchWarehouses();
    } catch (err) {
      console.error('Error in post:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const onEditSubmit = async (payload) => {
    try {
      await api.put(`/warehouses/${editDialog.warehouse._id}`, payload);
      setEditDialog({ open: false, warehouse: null });
      fetchWarehouses();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este almacén lógicamente?')) {
      await api.delete(`/warehouses/${id}`).catch(console.error);
      fetchWarehouses();
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Gestión de almacenes</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          label="Buscar por nombre..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
        />
        <Button variant="contained" onClick={() => setCreateDialog(true)}>+ Nuevo Almacén</Button>
      </Box>

      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nuevo Almacén</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="create-warehouse-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Nombre" {...register('name', { required: true })} />
            <TextField label="Descripción" {...register('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button type="submit" form="create-warehouse-form" variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((w) => (
              <TableRow key={w._id}>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.description}</TableCell>
                <TableCell>
                  {w.predefined && <Chip label="Predefinido" color="primary" size="small" />}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary" onClick={() => { resetEdit(w); setEditDialog({ open: true, warehouse: w }); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(w._id)} disabled={w.predefined}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalWarehouses}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, warehouse: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Editar Almacén</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="edit-warehouse-form" onSubmit={handleSubmitEdit(onEditSubmit)}>
            <TextField label="Nombre" {...registerEdit('name', { required: true })} />
            <TextField label="Descripción" {...registerEdit('description')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, warehouse: null })}>Cancelar</Button>
          <Button type="submit" form="edit-warehouse-form" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
