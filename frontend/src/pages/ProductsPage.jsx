import { Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TablePagination, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);

  const [stockError, setStockError] = useState(null);
  const [stockDialog, setStockDialog] = useState({ open: false, product: null });
  const [editDialog, setEditDialog] = useState({ open: false, product: null });
  const [createDialog, setCreateDialog] = useState(false);
  
  const [stockType, setStockType] = useState('entrada');

  const { register, handleSubmit, reset } = useForm({ defaultValues: { unit: 'pieza', cost: 0, minStock: 0, maxStock: 0, type: 'directo', unitsPerPackage: 1, preparationTime: 0, taxRate: 0, area: 'General' } });
  const { register: registerStock, handleSubmit: handleSubmitStock, reset: resetStock } = useForm({ defaultValues: { type: 'entrada', quantity: 1, reason: '' } });
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  const load = async () => {
    const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
    if (searchTerm) params.append('search', searchTerm);

    const [productRes, warehouseRes, categoryRes, supplierRes] = await Promise.all([
      api.get(`/products?${params.toString()}`).catch(() => ({ data: { data: [], total: 0 } })),
      api.get('/warehouses').catch(() => ({ data: [] })),
      api.get('/categories').catch(() => ({ data: [] })),
      api.get('/suppliers').catch(() => ({ data: [] }))
    ]);

    if (Array.isArray(productRes.data)) {
      setProducts(productRes.data);
      setTotalProducts(productRes.data.length);
    } else {
      setProducts(productRes.data.data || []);
      setTotalProducts(productRes.data.total || 0);
    }

    setWarehouses(Array.isArray(warehouseRes.data) ? warehouseRes.data : []);
    setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
    setSuppliers(Array.isArray(supplierRes.data) ? supplierRes.data : []);
  };

  useEffect(() => { load(); }, [page, rowsPerPage, searchTerm]);

  const onSubmit = async (payload) => {
    try {
      await api.post('/products', payload);
      reset();
      setError(null);
      setCreateDialog(false);
      load();
    } catch (err) {
      console.error('Error in post:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const onStockSubmit = async (payload) => {
    try {
      await api.post('/movements', {
        productId: stockDialog.product._id,
        type: payload.type,
        quantity: Number(payload.quantity),
        reason: payload.reason || 'Ajuste',
        clientFolio: payload.clientFolio
      });
      setStockError(null);
      setStockDialog({ open: false, product: null });
      setStockType('entrada');
      resetStock();
      load();
    } catch (err) {
      console.error('Error stock:', err);
      setStockError(err.response?.data?.message || err.message);
    }
  };

  const onEditSubmit = async (payload) => {
    try {
      await api.put(`/products/${editDialog.product._id}`, payload);
      setEditDialog({ open: false, product: null });
      load();
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este producto lógico?')) {
      await api.delete(`/products/${id}`).catch(console.error);
      load();
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Catálogo de productos</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          label="Buscar por nombre..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
        />
        <Button variant="contained" onClick={() => setCreateDialog(true)}>+ Nuevo Producto</Button>
      </Box>

      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Producto</DialogTitle>
        <DialogContent dividers>
          <Stack component="form" id="create-product-form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Nombre" {...register('name', { required: true })} />
            <TextField type="number" label="Costo ($)" {...register('cost', { required: true, min: 0 })} inputProps={{ step: "0.01" }} />
            <TextField type="number" label="Impuesto (%)" {...register('taxRate', { min: 0 })} />
            <TextField type="number" label="Mínimo" {...register('minStock', { required: true, min: 0, valueAsNumber: true })} />
            <TextField type="number" label="Máximo" {...register('maxStock', { required: true, min: 0, valueAsNumber: true })} />
            <TextField select label="Tipo" {...register('type')} defaultValue="directo">
              <MenuItem value="directo">Directo</MenuItem><MenuItem value="indirecto">Indirecto</MenuItem>
            </TextField>
            <TextField type="number" label="Unidades por caja" {...register('unitsPerPackage', { min: 1 })} />
            <TextField label="Área" {...register('area')} />
            <TextField type="number" label="Tiempo Preparación (min)" {...register('preparationTime', { min: 0 })} />
            
            <TextField select label="Unidad" {...register('unit')} defaultValue="pieza">
              <MenuItem value="pieza">Pieza</MenuItem><MenuItem value="kilo">Kilo</MenuItem><MenuItem value="litro">Litro</MenuItem><MenuItem value="caja">Caja</MenuItem>
            </TextField>
            <TextField select label="Almacén" {...register('warehouse', { required: true })} defaultValue="">
              {warehouses.map((w) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
            </TextField>
            <TextField select label="Categoría" {...register('category', { required: true })} defaultValue="">
              {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField select label="Proveedor" {...register('supplier')} defaultValue="">
              {suppliers.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button type="submit" form="create-product-form" variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
      <Paper>
        <Table size="small">
          <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Costo</TableCell><TableCell>Almacén</TableCell><TableCell>Categoría</TableCell><TableCell>Stock</TableCell><TableCell align="center">Acciones</TableCell></TableRow></TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.cost}</TableCell>
                <TableCell>{p.warehouse?.name}</TableCell>
                <TableCell>{p.category?.name}</TableCell>
                <TableCell>{p.currentStock}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" onClick={() => setStockDialog({ open: true, product: p })} sx={{ mr: 1 }}>Mover Stock</Button>
                  <IconButton size="small" color="info" component={Link} to={`/products/${p._id}/kardex`} title="Ver Kardex"><HistoryIcon /></IconButton>
                  <IconButton size="small" color="primary" onClick={() => { resetEdit(p); setEditDialog({ open: true, product: p }); }} title="Editar"><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p._id)} title="Eliminar"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>

      <Dialog open={stockDialog.open} onClose={() => setStockDialog({ open: false, product: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Stock: {stockDialog.product?.name}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="stock-form" onSubmit={handleSubmitStock(onStockSubmit)}>
            {stockError && <Typography color="error" variant="body2">{stockError}</Typography>}
            <TextField 
              select 
              label="Tipo de movimiento" 
              {...registerStock('type', { required: true, onChange: (e) => setStockType(e.target.value) })}
            >
              <MenuItem value="entrada">Entrada (+)</MenuItem>
              <MenuItem value="salida">Salida (-)</MenuItem>
            </TextField>
            <TextField type="number" label="Cantidad" {...registerStock('quantity', { required: true, min: 1 })} inputProps={{ min: 1 }} />
            <TextField label="Motivo" placeholder="Ej. Venta, Merma, Ajuste" {...registerStock('reason')} />
            {stockType === 'salida' && (
              <TextField label="Folio del Cliente / Venta" placeholder="Ej. 00123" {...registerStock('clientFolio')} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockDialog({ open: false, product: null })}>Cancelar</Button>
          <Button type="submit" form="stock-form" variant="contained">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, product: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="edit-form" onSubmit={handleSubmitEdit(onEditSubmit)}>
            <TextField label="Nombre" {...registerEdit('name', { required: true })} />
            <TextField type="number" label="Costo" {...registerEdit('cost', { required: true, min: 0 })} inputProps={{ step: "0.01" }} />
            <TextField type="number" label="Impuesto (%)" {...registerEdit('taxRate', { min: 0 })} />
            <TextField type="number" label="Mínimo" {...registerEdit('minStock', { required: true, min: 0, valueAsNumber: true })} />
            <TextField type="number" label="Máximo" {...registerEdit('maxStock', { required: true, min: 0, valueAsNumber: true })} />
            <TextField select label="Tipo" {...registerEdit('type')} defaultValue="directo">
              <MenuItem value="directo">Directo</MenuItem><MenuItem value="indirecto">Indirecto</MenuItem>
            </TextField>
            <TextField type="number" label="Unidades por caja" {...registerEdit('unitsPerPackage', { min: 1 })} />
            <TextField label="Área" {...registerEdit('area')} />
            <TextField type="number" label="Tiempo Preparación (min)" {...registerEdit('preparationTime', { min: 0 })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, product: null })}>Cancelar</Button>
          <Button type="submit" form="edit-form" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
