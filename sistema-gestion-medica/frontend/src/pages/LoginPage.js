import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { iniciarSesion } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ documentNumber: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setCargando(true);
    try {
      const res = await iniciarSesion(form);
      if (res.data.success) {
        login(res.data.data);
        navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally { setCargando(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏥</div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--teal)', marginBottom: 6 }}>MediCare</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }}>Portal del Paciente — Inicia sesión</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Número de documento</label>
              <input
                type="text"
                placeholder="Ej: 1234567890"
                value={form.documentNumber}
                onChange={e => setForm({ ...form, documentNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={cargando}>
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray-400)', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
