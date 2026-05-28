import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrarPaciente } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    documentNumber: '', firstName: '', lastName: '',
    email: '', phone: '', birthDate: '',
    password: '', confirmPassword: '', allergiesText: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    setCargando(true);
    try {
      const allergies = form.allergiesText
        ? form.allergiesText.split(',').map(a => a.trim()).filter(Boolean)
        : [];
      const res = await registrarPaciente({ ...form, allergies });
      if (res.data.success) {
        login(res.data.data);
        navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally { setCargando(false); }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} placeholder={placeholder}
        value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key !== 'allergiesText'} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🏥</div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'var(--teal)' }}>Crear cuenta</h1>
          <p style={{ color: 'var(--gray-400)', marginTop: 6, fontSize: '0.9rem' }}>Regístrate para acceder al portal</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div>{field('firstName', 'Nombres', 'text', 'Juan')}</div>
              <div>{field('lastName', 'Apellidos', 'text', 'Pérez')}</div>
            </div>
            {field('documentNumber', 'Número de documento', 'text', '1234567890')}
            {field('email', 'Correo electrónico', 'email', 'correo@email.com')}
            {field('phone', 'Teléfono', 'tel', '3001234567')}
            {field('birthDate', 'Fecha de nacimiento', 'date')}
            <div className="form-group">
              <label>Alergias conocidas <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(separadas por coma)</span></label>
              <input type="text" placeholder="penicilina, ibuprofeno..."
                value={form.allergiesText} onChange={e => setForm({ ...form, allergiesText: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div>{field('password', 'Contraseña', 'password', '••••••••')}</div>
              <div>{field('confirmPassword', 'Confirmar contraseña', 'password', '••••••••')}</div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={cargando}>
              {cargando ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray-400)', fontSize: '0.9rem' }}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
