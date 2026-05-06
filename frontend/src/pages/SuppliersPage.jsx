import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api/client';

export const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [editDialog, setEditDialog] = useState({ open: false, supplier: null });
    const [createDialog, setCreateDialog] = useState(false);

    const { register, handleSubmit, reset } = useForm();
    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

    const loadData = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setSuppliers([]);
        }
    };

    useEffect(() => { loadData(); }, []);

    const onSubmit = async (payload) => {
        try {
            await api.post('/suppliers', payload);
            reset();
            setError(null);
            setCreateDialog(false);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const onEditSubmit = async (payload) => {
        try {
            await api.put(`/suppliers/${editDialog.supplier._id}`, payload);
            setEditDialog({ open: false, supplier: null });
            loadData();
        } catch (err) {
            console.error('Edit error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
            await api.delete(`/suppliers/${id}`).catch(console.error);
            loadData();
        }
    };

    const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Stack spacing={2}>
            <Typography variant="h5">Catálogo de Proveedores</Typography>
            {error && <Typography color="error">{error}</Typography>}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                    label="Buscar por nombre..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" onClick={() => setCreateDialog(true)}>+ Nuevo Proveedor</Button>
            </Box>

            <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Nuevo Proveedor</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} component="form" id="create-supplier-form" onSubmit={handleSubmit(onSubmit)}>
                        <TextField label="Nombre del Proveedor" {...register('name', { required: true })} />
                        <TextField label="Clasificación" {...register('classification', { required: true })} placeholder="Ej. Bebidas, Limpieza" />
                        <TextField label="Contacto" {...register('contactInfo')} placeholder="Teléfono o Email" />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
                    <Button type="submit" form="create-supplier-form" variant="contained">Crear</Button>
                </DialogActions>
            </Dialog>

            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Clasificación</TableCell>
                            <TableCell>Contacto</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSuppliers.map((s) => (
                            <TableRow key={s._id}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.classification}</TableCell>
                                <TableCell>{s.contactInfo}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => { resetEdit(s); setEditDialog({ open: true, supplier: s }); }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(s._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredSuppliers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No hay proveedores registrados.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, supplier: null })} maxWidth="xs" fullWidth>
                <DialogTitle>Editar Proveedor</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} component="form" id="edit-supplier-form" onSubmit={handleSubmitEdit(onEditSubmit)}>
                        <TextField label="Nombre" {...registerEdit('name', { required: true })} />
                        <TextField label="Clasificación" {...registerEdit('classification', { required: true })} />
                        <TextField label="Contacto" {...registerEdit('contactInfo')} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, supplier: null })}>Cancelar</Button>
                    <Button type="submit" form="edit-supplier-form" variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
