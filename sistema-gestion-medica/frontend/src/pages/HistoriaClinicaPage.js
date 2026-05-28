import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerHistoriaCompleta } from '../services/api';

function TabCitas({ citas }) {
  if (!citas?.length) return <div className="empty-state"><div className="icon">📅</div><p>Sin citas registradas</p></div>;
  return (
    <div>
      {citas.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{c.specialty}</div>
              <div style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginTop: 2 }}>
                {c.doctorName} · {c.date}
              </div>
              {c.notes && <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--teal)' }}>{c.notes}</div>}
            </div>
            <span className={`badge ${c.status === 'SCHEDULED' ? 'badge-blue' : c.status === 'CANCELLED' ? 'badge-red' : 'badge-green'}`}>
              {c.status === 'SCHEDULED' ? 'Programada' : c.status === 'CANCELLED' ? 'Cancelada' : 'Completada'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabPrescripciones({ prescripciones }) {
  if (!prescripciones?.length) return <div className="empty-state"><div className="icon">💊</div><p>Sin prescripciones registradas</p></div>;
  return (
    <div>
      {prescripciones.map(p => (
        <div key={p.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>Prescripción {p.id}</div>
              <div style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{p.doctorName} · {p.issuedDate}</div>
            </div>
            <span className="badge badge-green">Activa</span>
          </div>
          {p.medications?.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem' }}>💊</span>
              <div>
                <div style={{ fontWeight: 500 }}>{m.name} — {m.dosage}</div>
                <div style={{ color: 'var(--gray-400)', fontSize: '0.82rem' }}>{m.frequency} por {m.duration}</div>
              </div>
            </div>
          ))}
          {p.notes && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: '0.85rem', color: 'var(--gray-400)' }}>{p.notes}</div>}
        </div>
      ))}
    </div>
  );
}

function TabHistorial({ historial }) {
  if (!historial?.length) return <div className="empty-state"><div className="icon">📋</div><p>Sin historial clínico registrado</p></div>;
  return (
    <div>
      {historial.map(h => (
        <div key={h.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{h.visitDate}</div>
            <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{h.doctorName}</span>
          </div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Diagnóstico</span>
            <div style={{ marginTop: 2, fontSize: '0.9rem' }}>{h.diagnosis}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tratamiento</span>
            <div style={{ marginTop: 2, fontSize: '0.9rem' }}>{h.treatment}</div>
          </div>
          {h.allergiesNoted?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {h.allergiesNoted.map((a, i) => <span key={i} className="badge badge-amber" style={{ marginRight: 4 }}>⚠️ {a}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HistoriaClinicaPage() {
  const { paciente } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState('citas');

  useEffect(() => {
    obtenerHistoriaCompleta(paciente.id)
      .then(res => { if (res.data.success) setDatos(res.data.data); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [paciente]);

  const TABS = [
    { key: 'citas', label: '📅 Consultas' },
    { key: 'prescripciones', label: '💊 Prescripciones' },
    { key: 'historial', label: '📋 Registros Clínicos' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.7rem', marginBottom: 6 }}>📋 Historia Clínica</h2>
        <p style={{ color: 'var(--gray-400)' }}>Revisa tu historial médico completo</p>
      </div>

      {paciente.allergies?.length > 0 && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 20 }}>
          <span style={{ fontWeight: 600, color: 'var(--amber)' }}>⚠️ Alergias registradas: </span>
          {paciente.allergies.map((a, i) => <span key={i} className="badge badge-amber" style={{ marginLeft: 6 }}>{a}</span>)}
        </div>
      )}

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.key} className={`tab ${tabActiva === t.key ? 'active' : ''}`}
            onClick={() => setTabActiva(t.key)}>{t.label}</button>
        ))}
      </div>

      {cargando ? <div className="spinner" /> : (
        <>
          {tabActiva === 'citas' && <TabCitas citas={datos?.appointments} />}
          {tabActiva === 'prescripciones' && <TabPrescripciones prescripciones={datos?.prescriptions} />}
          {tabActiva === 'historial' && <TabHistorial historial={datos?.clinicalHistory} />}
        </>
      )}
    </div>
  );
}
