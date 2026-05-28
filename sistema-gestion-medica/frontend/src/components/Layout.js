import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard',       icon: '⊞', label: 'Inicio' },
  { to: '/agendar-cita',    icon: '📅', label: 'Agendar Cita' },
  { to: '/historia-clinica',icon: '📋', label: 'Historia Clínica' },
  { to: '/laboratorio',     icon: '🔬', label: 'Laboratorio' },
];

export default function Layout() {
  const { paciente, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240,
        background: 'var(--navy-mid)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.6rem' }}>🏥</span>
            {!collapsed && (
              <div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: '1.1rem', fontWeight: 700, color: 'var(--teal)' }}>MediCare</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 2 }}>Portal del Paciente</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px' }}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8, marginBottom: 4,
              color: isActive ? 'var(--teal)' : 'var(--gray-400)',
              background: isActive ? 'rgba(14,165,201,0.1)' : 'transparent',
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
              transition: 'all 0.2s',
            })}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & collapse */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {!collapsed && paciente && (
            <div style={{ padding: '10px 12px', marginBottom: 8 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Bienvenido,</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--white)', marginTop: 2 }}>
                {paciente.firstName} {paciente.lastName}
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(244,63,94,0.1)', color: 'var(--rose)',
            border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
          }}>
            <span>🚪</span>{!collapsed && 'Cerrar Sesión'}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            width: '100%', marginTop: 8, padding: '8px',
            background: 'transparent', border: 'none',
            color: 'var(--gray-400)', cursor: 'pointer', fontSize: '1rem',
          }}>
            {collapsed ? '▶' : '◀'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}
