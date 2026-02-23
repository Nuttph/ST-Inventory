import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ShopPage from './pages/dashboard/ShopPage';
import OrderManagementPage from './pages/orders/OrderManagementPage';
import InventoryPage from './pages/inventory/InventoryPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PaymentPage from './pages/orders/PaymentPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#6366f1',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Main Routes */}
                <Route element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/" element={<Navigate to="/shop" />} />
                  <Route path="/shop" element={<ShopPage />} />

                  {/* Manager/Staff Only */}
                  <Route path="/inventory" element={
                    <ProtectedRoute roles={['manager', 'staff']}>
                      <InventoryPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin/orders" element={
                    <ProtectedRoute roles={['manager', 'staff']}>
                      <OrderManagementPage />
                    </ProtectedRoute>
                  } />

                  {/* Manager Only */}
                  <Route path="/admin/users" element={
                    <ProtectedRoute roles={['manager']}>
                      <UserManagementPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/orders" element={<div>Customer Orders View (Coming Soon)</div>} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ErrorBoundary>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
