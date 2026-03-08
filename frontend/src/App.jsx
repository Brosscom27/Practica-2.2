import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BreadcrumbHeader } from './components/BreadcrumbHeader';
import { useAuth } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { ReportsPage } from './pages/ReportsPage';
import { WarehousesPage } from './pages/WarehousesPage';

const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <BreadcrumbHeader />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<PrivateRoutes />} />
    </Routes>
  );
}

export default App;
