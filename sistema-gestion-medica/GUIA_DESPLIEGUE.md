# 🏥 Sistema de Gestión Médica — Guía de Despliegue

## Estructura del Proyecto

```
sistema-gestion-medica/
├── backend/          ← Spring Boot (Java 17)
└── frontend/         ← React.js
```

---

## ✅ PRE-REQUISITOS

| Herramienta | Versión mínima | Descarga |
|------------|----------------|---------|
| Java JDK   | 17             | https://adoptium.net |
| Maven      | 3.8+           | https://maven.apache.org |
| Node.js    | 18+            | https://nodejs.org |
| Git        | cualquiera     | https://git-scm.com |

---

## 🔵 PASO 1 — Desplegar el Backend en Railway

### 1.1 Crear cuenta en Railway
1. Ve a https://railway.app y crea una cuenta (puedes usar GitHub).

### 1.2 Preparar el repositorio del backend
```bash
cd sistema-gestion-medica/backend

# Compilar para verificar que funciona
./mvnw clean package -DskipTests
# Si no tienes mvnw, usa: mvn clean package -DskipTests
```

### 1.3 Subir a GitHub
```bash
cd sistema-gestion-medica/backend
git init
git add .
git commit -m "chore: initial backend setup"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/medica-backend.git
git push -u origin main
```

### 1.4 Crear proyecto en Railway
1. En Railway → **New Project** → **Deploy from GitHub repo**
2. Selecciona el repositorio `medica-backend`
3. Railway detectará automáticamente Spring Boot
4. En **Settings → Environment** agrega:
   ```
   PORT = 8080
   ```
5. Railway generará una URL pública del tipo:
   ```
   https://medica-backend-production.up.railway.app
   ```
6. **Copia esa URL** — la necesitas para el frontend.

> ⚠️ El primer deploy puede tardar 3-5 minutos mientras Maven descarga dependencias.

### 1.5 Verificar backend
Abre en el navegador:
```
https://TU_URL_RAILWAY.up.railway.app/api/clinica/health
```
Debes ver: `{"success":true,"message":"Service running","data":"OK"}`

---

## 🟢 PASO 2 — Desplegar el Frontend en Vercel

### 2.1 Crear cuenta en Vercel
Ve a https://vercel.com y crea una cuenta (usa GitHub para facilitar el proceso).

### 2.2 Configurar la variable de entorno
En el archivo `frontend/.env.example` hay una variable importante. Antes de desplegar:
```bash
cd sistema-gestion-medica/frontend
cp .env.example .env.local
```
Edita `.env.local` y reemplaza la URL:
```
REACT_APP_API_URL=https://TU_URL_RAILWAY.up.railway.app/api/clinica
```

### 2.3 Subir a GitHub
```bash
cd sistema-gestion-medica/frontend
git init
git add .
git commit -m "chore: initial frontend setup"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/medica-frontend.git
git push -u origin main
```

### 2.4 Crear proyecto en Vercel
1. En Vercel → **Add New → Project**
2. Importa el repositorio `medica-frontend`
3. Vercel detecta React automáticamente
4. En **Environment Variables** agrega:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://TU_URL_RAILWAY.up.railway.app/api/clinica`
5. Clic en **Deploy**
6. Vercel genera tu URL pública:
   ```
   https://medica-frontend.vercel.app
   ```

### 2.5 Verificar frontend
Abre la URL de Vercel y deberías ver la pantalla de login.

---

## 🖥️ PASO 3 — Prueba local (opcional, para desarrollo)

### Backend local
```bash
cd sistema-gestion-medica/backend
mvn spring-boot:run
# Corre en http://localhost:8080
```

### Frontend local
```bash
cd sistema-gestion-medica/frontend
npm install
npm start
# Corre en http://localhost:3000
```
> El `package.json` tiene `"proxy": "http://localhost:8080"` para desarrollo local.

---

## 📋 ENDPOINTS DEL BACKEND

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/clinica/paciente` | Registrar paciente |
| POST | `/api/clinica/login` | Iniciar sesión |
| POST | `/api/clinica/cita` | Agendar cita |
| DELETE | `/api/clinica/cita/{id}` | Cancelar cita |
| GET | `/api/clinica/historia/{pacienteId}` | Historia completa |
| POST | `/api/clinica/prescripcion` | Crear prescripción |
| POST | `/api/clinica/laboratorio` | Solicitar exámenes |
| GET | `/api/clinica/medicos?especialidad=` | Listar médicos |
| GET | `/api/clinica/especialidades` | Listar especialidades |
| GET | `/api/clinica/health` | Estado del servicio |

---

## 🏗️ PATRÓN FACADE — Explicación

El `ClinicaFacade` coordina 5 subsistemas:

```
Cliente (REST) → ClinicaFacade → PacienteService
                              → AgendaService
                              → HistoriaClinicaService
                              → PrescripcionService
                              → LaboratorioService
```

Cada método del Facade invoca **mínimo 2 subsistemas**:
- `agendarCita()` → PacienteService + AgendaService
- `verHistoriaCompleta()` → los 5 subsistemas
- `generarPrescripcion()` → PacienteService + PrescripcionService
- `solicitarExamenes()` → PacienteService + LaboratorioService + HistoriaClinicaService

---

## ⚠️ SOLUCIÓN DE PROBLEMAS COMUNES

**Error CORS en producción:**
El backend ya tiene CORS configurado para `*`. Si persiste, verifica que Railway no bloquee headers.

**Frontend no conecta al backend:**
Verifica que `REACT_APP_API_URL` en Vercel sea exactamente la URL de Railway sin `/` al final.

**Railway detecta como Node.js:**
Asegúrate que el repositorio del backend solo contenga los archivos de Spring Boot (pom.xml en raíz).

**`mvnw` no tiene permisos:**
```bash
chmod +x mvnw
```
