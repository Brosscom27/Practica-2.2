import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Paper, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api/client';

export const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [totalCategories, setTotalCategories] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [error, setError] = useState(null);
    const [editDialog, setEditDialog] = useState({ open: false, category: null });
    const [createDialog, setCreateDialog] = useState(false);

    const { register, handleSubmit, reset } = useForm();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

    const loadData = async () => {
        const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
        if (searchTerm) params.append('search', searchTerm);

        const [catRes, whRes] = await Promise.all([
            api.get(`/categories?${params.toString()}`).catch(() => ({ data: { data: [], total: 0 } })),
            api.get('/warehouses').catch(() => ({ data: [] }))
        ]);

        // Set Categories
        if (Array.isArray(catRes.data)) {
            setCategories(catRes.data);
            setTotalCategories(catRes.data.length);
        } else {
            setCategories(catRes.data.data || []);
            setTotalCategories(catRes.data.total || 0);
        }

        // Set Warehouses
        setWarehouses(Array.isArray(whRes.data) ? whRes.data : []);
    };

    useEffect(() => { loadData(); }, [page, rowsPerPage, searchTerm]);

    const onSubmit = async (payload) => {
        try {
            await api.post('/categories', payload);
            reset();
            setError(null);
            setCreateDialog(false);
            loadData();
        } catch (err) {
            console.error('Error in post:', err);
            setError(err.response?.data?.message || err.message);
        }
    };

    const onEditSubmit = async (payload) => {
        try {
            await api.put(`/categories/${editDialog.category._id}`, payload);
            setEditDialog({ open: false, category: null });
            loadData();
        } catch (err) {
            console.error('Edit error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Seguro que deseas eliminar esta categoría lógicamente?')) {
            await api.delete(`/categories/${id}`).catch(console.error);
            loadData();
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h5">Gestión de Categorías</Typography>
            {error && <Typography color="error">{error}</Typography>}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                    label="Buscar por nombre..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                />
                <Button variant="contained" onClick={() => setCreateDialog(true)}>+ Nueva Categoría</Button>
            </Box>

            <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Nueva Categoría</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} component="form" id="create-category-form" onSubmit={handleSubmit(onSubmit)}>
                        <TextField label="Nombre Categoria" {...register('name', { required: true })} />
                        <TextField select label="Almacén Asociado" {...register('warehouse', { required: true })} defaultValue="">
                            {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
                    <Button type="submit" form="create-category-form" variant="contained">Crear</Button>
                </DialogActions>
            </Dialog>

            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre Categoría</TableCell>
                            <TableCell>Almacén Asociado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((c) => (
                            <TableRow key={c._id}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.warehouse?.name}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => { resetEdit(c); setEditDialog({ open: true, category: c }); }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(c._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No hay categorías registradas.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalCategories}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                />
            </Paper>

            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, category: null })} maxWidth="xs" fullWidth>
                <DialogTitle>Editar Categoría</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} component="form" id="edit-category-form" onSubmit={handleSubmitEdit(onEditSubmit)}>
                        <TextField label="Nombre Categoría" {...registerEdit('name', { required: true })} />
                        <TextField select label="Almacén Asociado" {...registerEdit('warehouse', { required: true })} defaultValue={editDialog.category?.warehouse?._id}>
                            {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, category: null })}>Cancelar</Button>
                    <Button type="submit" form="edit-category-form" variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
