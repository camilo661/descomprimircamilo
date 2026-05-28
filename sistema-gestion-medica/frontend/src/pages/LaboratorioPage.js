import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerHistoriaCompleta, solicitarExamenes } from '../services/api';

const EXAMENES_DISPONIBLES = [
  { key: 'hemograma', label: 'Hemograma Completo', icon: '🩸' },
  { key: 'glicemia', label: 'Glicemia en Ayunas', icon: '🍬' },
  { key: 'perfil lipidico', label: 'Perfil Lipídico', icon: '💧' },
  { key: 'hemoglobina', label: 'Hemoglobina', icon: '🔴' },
  { key: 'creatinina', label: 'Creatinina Sérica', icon: '🧪' },
  { key: 'urea', label: 'Urea en Sangre', icon: '⚗️' },
];

export default function LaboratorioPage() {
  const { paciente } = useAuth();
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const cargarResultados = () => {
    obtenerHistoriaCompleta(paciente.id)
      .then(res => { if (res.data.success) setResultados(res.data.data.labResults || []); })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargarResultados(); }, [paciente]);

  const toggleExamen = (key) => {
    setSeleccionados(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleSolicitar = async () => {
    if (!seleccionados.length) return;
    setMensaje(null); setEnviando(true);
    try {
      const res = await solicitarExamenes({ patientId: paciente.id, exams: seleccionados });
      if (res.data.success) {
        setMensaje({ tipo: 'success', texto: '✅ Exámenes procesados. Resultados disponibles.' });
        setSeleccionados([]);
        setCargando(true);
        cargarResultados();
      } else {
        setMensaje({ tipo: 'error', texto: res.data.message });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al solicitar exámenes' });
    } finally { setEnviando(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.7rem', marginBottom: 6 }}>🔬 Laboratorio</h2>
        <p style={{ color: 'var(--gray-400)' }}>Solicita exámenes y consulta tus resultados</p>
      </div>

      {/* Solicitar exámenes */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Solicitar nuevos exámenes</h3>
        {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 16 }}>
          {EXAMENES_DISPONIBLES.map(ex => {
            const activo = seleccionados.includes(ex.key);
            return (
              <button key={ex.key} type="button" onClick={() => toggleExamen(ex.key)} style={{
                padding: '12px 14px', borderRadius: 8, textAlign: 'left',
                background: activo ? 'rgba(14,165,201,0.12)' : 'var(--navy)',
                border: `1.5px solid ${activo ? 'var(--teal)' : 'rgba(255,255,255,0.08)'}`,
                color: activo ? 'var(--teal)' : 'var(--gray-400)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: '1.2rem' }}>{ex.icon}</span>
                <span style={{ fontSize: '0.87rem', fontWeight: 500 }}>{ex.label}</span>
              </button>
            );
          })}
        </div>
        <button className="btn-primary" onClick={handleSolicitar}
          disabled={!seleccionados.length || enviando}>
          {enviando ? 'Procesando...' : `Solicitar ${seleccionados.length > 0 ? `(${seleccionados.length})` : ''} exámenes`}
        </button>
      </div>

      {/* Resultados */}
      <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Historial de Resultados</h3>
      {cargando ? <div className="spinner" /> : resultados.length === 0 ? (
        <div className="empty-state"><div className="icon">🔬</div><p>Sin resultados de laboratorio</p></div>
      ) : (
        resultados.map(lab => (
          <div key={lab.id} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 600 }}>Resultados — {lab.requestedDate}</div>
                <div style={{ color: 'var(--gray-400)', fontSize: '0.82rem', marginTop: 2 }}>{lab.id}</div>
              </div>
              <span className="badge badge-green">{lab.status}</span>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {lab.results?.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 8,
                  background: r.withinNormalRange ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
                  border: `1px solid ${r.withinNormalRange ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{r.examName}</div>
                    <div style={{ color: 'var(--gray-400)', fontSize: '0.78rem', marginTop: 2 }}>
                      Referencia: {r.referenceRange} {r.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.1rem', fontWeight: 700,
                      color: r.withinNormalRange ? 'var(--mint)' : 'var(--rose)',
                    }}>
                      {r.value} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>{r.unit}</span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {r.withinNormalRange
                        ? <span className="badge badge-green">✓ Normal</span>
                        : <span className="badge badge-red">⚠ Fuera de rango</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
