import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { ReportsPage } from './pages/ReportsPage';
import { WarehousesPage } from './pages/WarehousesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { KardexPage } from './pages/KardexPage';
import { SuppliersPage } from './pages/SuppliersPage';

const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id/kardex" element={<KardexPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
    </CustomThemeProvider>
  );
}

export default App;
