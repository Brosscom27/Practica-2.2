import { render, screen } from '@testing-library/react';
import { LowStockAlert } from './LowStockAlert';

describe('LowStockAlert', () => {
  it('renders warnings for low stock products', () => {
    render(<LowStockAlert products={[{ _id: '1', name: 'Tequila', currentStock: 3 }]} />);
    expect(screen.getByText(/Tequila está en stock mínimo/)).toBeInTheDocument();
  });
});
