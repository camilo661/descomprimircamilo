import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerHistoriaCompleta } from '../services/api';

export default function DashboardPage() {
  const { paciente } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!paciente) return;
    obtenerHistoriaCompleta(paciente.id)
      .then(res => { if (res.data.success) setDatos(res.data.data); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [paciente]);

  const citasProximas = datos?.appointments?.filter(a => a.status === 'SCHEDULED') || [];
  const ultimosLabs = datos?.labResults?.slice(0, 2) || [];

  const Stat = ({ icon, label, value, color = 'var(--teal)' }) => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: 'Playfair Display' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: 4 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.7rem', marginBottom: 4 }}>
          Buenos días, <span style={{ color: 'var(--teal)' }}>{paciente?.firstName}</span> 👋
        </h2>
        <p style={{ color: 'var(--gray-400)' }}>Aquí está el resumen de tu salud</p>
      </div>

      {cargando ? <div className="spinner" /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            <Stat icon="📅" label="Citas pendientes" value={citasProximas.length} />
            <Stat icon="💊" label="Prescripciones" value={datos?.prescriptions?.length || 0} color="var(--mint)" />
            <Stat icon="🔬" label="Exámenes" value={datos?.labResults?.length || 0} color="var(--amber)" />
            <Stat icon="📋" label="Visitas registradas" value={datos?.clinicalHistory?.length || 0} color="var(--rose)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Próximas citas */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.1rem' }}>📅 Próximas Citas</h3>
                <Link to="/agendar-cita" style={{ fontSize: '0.82rem', color: 'var(--teal)' }}>+ Agendar</Link>
              </div>
              {citasProximas.length === 0 ? (
                <div className="empty-state"><div className="icon">📅</div><p>Sin citas programadas</p></div>
              ) : citasProximas.slice(0, 3).map(c => (
                <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.specialty}</div>
                  <div style={{ color: 'var(--gray-400)', fontSize: '0.82rem', marginTop: 2 }}>{c.doctorName} — {c.date}</div>
                </div>
              ))}
            </div>

            {/* Últimos resultados */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.1rem' }}>🔬 Últimos Resultados</h3>
                <Link to="/laboratorio" style={{ fontSize: '0.82rem', color: 'var(--teal)' }}>Ver todo</Link>
              </div>
              {ultimosLabs.length === 0 ? (
                <div className="empty-state"><div className="icon">🔬</div><p>Sin resultados recientes</p></div>
              ) : ultimosLabs.map(lab => (
                <div key={lab.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>{lab.requestedDate}</div>
                  {lab.results?.slice(0, 2).map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: '0.88rem' }}>{r.examName}</span>
                      <span className={`badge ${r.withinNormalRange ? 'badge-green' : 'badge-red'}`}>
                        {r.value} {r.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 14, fontSize: '1rem', color: 'var(--gray-400)', fontFamily: 'DM Sans', fontWeight: 500 }}>ACCESOS RÁPIDOS</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { to: '/agendar-cita', icon: '📅', label: 'Agendar Cita' },
                { to: '/historia-clinica', icon: '📋', label: 'Historia Clínica' },
                { to: '/laboratorio', icon: '🔬', label: 'Solicitar Exámenes' },
              ].map(item => (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 20px', borderRadius: 8,
                  background: 'var(--navy-mid)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--white)', textDecoration: 'none',
                  fontSize: '0.9rem', fontWeight: 500,
                  transition: 'border-color 0.2s',
                }}>
                  <span>{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
