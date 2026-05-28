import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerEspecialidades, obtenerMedicos, agendarCita } from '../services/api';

export default function AgendarCitaPage() {
  const { paciente } = useAuth();
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({ especialidad: '', doctorId: '', fecha: '' });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    obtenerEspecialidades().then(res => { if (res.data.success) setEspecialidades(res.data.data); });
  }, []);

  const handleEspecialidadChange = async (esp) => {
    setForm({ especialidad: esp, doctorId: '', fecha: '' });
    setMedicos([]);
    if (esp) {
      const res = await obtenerMedicos(esp);
      if (res.data.success) setMedicos(res.data.data);
    }
  };

  const medicosiltrados = medicos.filter(m => m.specialty === form.especialidad);
  const medicoSeleccionado = medicos.find(m => m.id === form.doctorId);
  const slotsDisponibles = medicoSeleccionado?.availableSlots || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null); setCargando(true);
    try {
      const res = await agendarCita({
        patientId: paciente.id,
        specialty: form.especialidad,
        doctorId: form.doctorId,
        date: form.fecha,
      });
      if (res.data.success) {
        setMensaje({ tipo: 'success', texto: `✅ Cita agendada con éxito. ${res.data.data.notes}` });
        setForm({ especialidad: '', doctorId: '', fecha: '' });
        setMedicos([]);
      } else {
        setMensaje({ tipo: 'error', texto: res.data.message });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al agendar' });
    } finally { setCargando(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.7rem', marginBottom: 6 }}>📅 Agendar Cita</h2>
        <p style={{ color: 'var(--gray-400)' }}>Selecciona especialidad, médico y horario disponible</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="card">
          {mensaje && (
            <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Especialidad</label>
              <select value={form.especialidad} onChange={e => handleEspecialidadChange(e.target.value)} required>
                <option value="">— Selecciona una especialidad —</option>
                {especialidades.map(esp => <option key={esp} value={esp}>{esp}</option>)}
              </select>
            </div>

            {medicosiltrados.length > 0 && (
              <div className="form-group">
                <label>Médico</label>
                <select value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value, fecha: '' })} required>
                  <option value="">— Selecciona un médico —</option>
                  {medicosiltrados.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>
            )}

            {slotsDisponibles.length > 0 && (
              <div className="form-group">
                <label>Horario disponible</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginTop: 4 }}>
                  {slotsDisponibles.map(slot => (
                    <button type="button" key={slot} onClick={() => setForm({ ...form, fecha: slot })}
                      style={{
                        padding: '10px 12px', borderRadius: 8, textAlign: 'center',
                        fontSize: '0.85rem', fontWeight: 500,
                        background: form.fecha === slot ? 'rgba(14,165,201,0.2)' : 'var(--navy)',
                        color: form.fecha === slot ? 'var(--teal)' : 'var(--gray-400)',
                        border: `1.5px solid ${form.fecha === slot ? 'var(--teal)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      🕐 {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {form.fecha && (
              <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(14,165,201,0.08)', border: '1px solid rgba(14,165,201,0.2)', marginBottom: 16 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>Resumen de tu cita</div>
                <div style={{ marginTop: 6, fontSize: '0.9rem' }}>
                  <strong style={{ color: 'var(--teal)' }}>{form.especialidad}</strong> con {medicoSeleccionado?.fullName}<br />
                  <span style={{ color: 'var(--gray-400)' }}>{form.fecha}</span>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}
              disabled={cargando || !form.fecha}>
              {cargando ? 'Agendando...' : 'Confirmar Cita'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
