import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../api/client';

export const KardexPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movements, setMovements] = useState([]);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    const load = async () => {
        try {
            // Fetch product name (we could get it from the movement list if it has items, but just in case)
            const moveRes = await api.get(`/movements?productId=${id}`);
            setMovements(moveRes.data);
            if (moveRes.data.length > 0) {
                setProduct(moveRes.data[0].product);
            }
        } catch (err) {
            setError('Error al cargar historial de movimientos');
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')}>Volver</Button>
                <Typography variant="h5">Kardex / Historial: {product ? product.name : 'Cargando...'}</Typography>
            </Stack>
            {error && <Typography color="error">{error}</Typography>}

            <Paper>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Motivo</TableCell>
                            <TableCell>Folio / Cliente</TableCell>
                            <TableCell>Usuario Responsable</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movements.map((m) => (
                            <TableRow key={m._id}>
                                <TableCell>{new Date(m.date).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={m.type.toUpperCase()}
                                        color={m.type === 'entrada' ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{m.quantity}</TableCell>
                                <TableCell>{m.reason}</TableCell>
                                <TableCell>{m.clientFolio || '-'}</TableCell>
                                <TableCell>{m.user?.name || m.user?.email || 'Sistema'}</TableCell>
                            </TableRow>
                        ))}
                        {movements.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No hay movimientos registrados para este producto.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Stack>
    );
};
