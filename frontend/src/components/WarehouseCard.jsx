import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

export const WarehouseCard = ({ warehouse }) => (
  <Card>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{warehouse.name}</Typography>
        {warehouse.predefined && <Chip label="Predefinido" color="primary" size="small" />}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {warehouse.description || 'Sin descripción'}
      </Typography>
    </CardContent>
  </Card>
);
