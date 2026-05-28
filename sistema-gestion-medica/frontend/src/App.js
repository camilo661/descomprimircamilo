import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AgendarCitaPage from './pages/AgendarCitaPage';
import HistoriaClinicaPage from './pages/HistoriaClinicaPage';
import LaboratorioPage from './pages/LaboratorioPage';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { paciente } = useAuth();
  return paciente ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { paciente } = useAuth();
  return !paciente ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/registro" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="agendar-cita" element={<AgendarCitaPage />} />
            <Route path="historia-clinica" element={<HistoriaClinicaPage />} />
            <Route path="laboratorio" element={<LaboratorioPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
