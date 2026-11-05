import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Guard
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public / Customer Pages
import { LandingPage } from '../pages/customer/LandingPage';
import { ServicesPage } from '../pages/customer/ServicesPage';
import { RequestPage } from '../pages/customer/RequestPage';
import { SuccessPage } from '../pages/customer/SuccessPage';
import { ContactPage } from '../pages/customer/ContactPage';
import { AccountPage } from '../pages/customer/AccountPage';

// Admin Pages
import { LoginPage } from '../pages/admin/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { RequestsPage } from '../pages/admin/RequestsPage';
import { MessagesPage } from '../pages/admin/MessagesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public / Customer Portal Layout */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* /account intentionally disabled; route now unreachable */}
      </Route>

      {/* Auth Public Fallback Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Admin Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/requests" element={<RequestsPage />} />
          <Route path="/dashboard/contact" element={<MessagesPage />} />
          <Route path="/dashboard/messages" element={<MessagesPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
