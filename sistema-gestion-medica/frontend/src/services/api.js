import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/clinica';

const api = axios.create({ baseURL: API_BASE });

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registrarPaciente = (datos) => api.post('/paciente', datos);
export const iniciarSesion = (datos) => api.post('/login', datos);

// ── Citas ─────────────────────────────────────────────────────────────────────
export const agendarCita = (datos) => api.post('/cita', datos);
export const cancelarCita = (citaId) => api.delete(`/cita/${citaId}`);

// ── Historia ──────────────────────────────────────────────────────────────────
export const obtenerHistoriaCompleta = (pacienteId) => api.get(`/historia/${pacienteId}`);

// ── Prescripciones ────────────────────────────────────────────────────────────
export const crearPrescripcion = (datos) => api.post('/prescripcion', datos);

// ── Laboratorio ───────────────────────────────────────────────────────────────
export const solicitarExamenes = (datos) => api.post('/laboratorio', datos);

// ── Médicos ───────────────────────────────────────────────────────────────────
export const obtenerMedicos = (especialidad) =>
  api.get('/medicos', { params: especialidad ? { especialidad } : {} });
export const obtenerEspecialidades = () => api.get('/especialidades');
