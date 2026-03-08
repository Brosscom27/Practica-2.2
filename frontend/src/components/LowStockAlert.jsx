import { Alert, Stack } from '@mui/material';

export const LowStockAlert = ({ products }) => {
  if (!products.length) return null;

  return (
    <Stack spacing={1}>
      {products.map((product) => (
        <Alert key={product._id} severity="warning">
          {product.name} está en stock mínimo ({product.currentStock})
        </Alert>
      ))}
    </Stack>
  );
};
