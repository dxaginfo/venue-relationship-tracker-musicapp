import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState, AppDispatch } from './store';
import { checkAuth } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Main Pages
import DashboardPage from './pages/DashboardPage';
import VenuesPage from './pages/venues/VenuesPage';
import VenueDetailsPage from './pages/venues/VenueDetailsPage';
import BookingsPage from './pages/bookings/BookingsPage';
import BookingDetailsPage from './pages/bookings/BookingDetailsPage';
import PerformancesPage from './pages/performances/PerformancesPage';
import CommunicationsPage from './pages/communications/CommunicationsPage';
import UserProfilePage from './pages/UserProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      
      {/* Main App Routes (Protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Venues */}
        <Route path="venues" element={<VenuesPage />} />
        <Route path="venues/:id" element={<VenueDetailsPage />} />
        
        {/* Bookings */}
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/:id" element={<BookingDetailsPage />} />
        
        {/* Performances */}
        <Route path="performances" element={<PerformancesPage />} />
        
        {/* Communications */}
        <Route path="communications" element={<CommunicationsPage />} />
        
        {/* User Profile */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
      
      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;