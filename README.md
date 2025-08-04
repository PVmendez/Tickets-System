# Tickets-System

Sistema de gestión de tickets con procesamiento OCR simulado para recibos y cálculo de cashback.

## 🚀 Características

- **Frontend**: Next.js con React 18
- **Backend**: Node.js con Express
- **Base de Datos**: PostgreSQL 16 con migraciones automáticas

## 🚀 Cómo correr la app desde cero

### Opción 1: Usando Docker

1. **Clona este repositorio:**
   ```bash
   git clone <url-del-repo>
   cd Tickets-System
   ```

2. **Asegúrate de tener Docker y Docker Compose instalados.**
   - En Windows y Mac es necesario tener Docker Desktop instalado y corriendo.

3. **Ejecuta:**
   ```bash
   docker-compose up --build
   ```
   
   Esto:
   - Descargará las imágenes necesarias
   - Creará los contenedores con healthchecks
   - Ejecutará automáticamente las migraciones de la base de datos
   - Levantará backend, frontend y PostgreSQL

4. **Accede a la aplicación:**
   - Frontend: [http://localhost:4000](http://localhost:4000)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Base de datos: localhost:5432

### Opción 2: Desarrollo Local

1. **Requisitos previos:**
   - Node.js 18+ 
   - PostgreSQL 12+

2. **Clona y configura:**
   ```bash
   git clone <url-del-repo>
   cd Tickets-System
   ```

3. **Configura las variables de entorno:**
   ```bash
   # En backend/
   cp .env.example .env
   # Edita .env con tus credenciales de PostgreSQL
   ```

4. **Levanta la base de datos y backend:**
   ```bash
   cd backend
   npm install
   npm run createdb    # Crea la base de datos
   npm run migrate     # Ejecuta migraciones
   npm run start      # Levanta el servidor
   ```

5. **En otra terminal, levanta el frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run start       # Producción
npm run dev        # Desarrollo con nodemon
npm run createdb   # Crear base de datos
npm run migrate    # Ejecutar migraciones
```

### Frontend
```bash
npm run dev        # Desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
```

## 📋 API Documentation

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/tickets` | Crear ticket con imagen |
| GET | `/tickets` | Obtener todos los tickets |
| GET | `/tickets/:id/cashback` | Calcular cashback |
| PATCH | `/tickets/:id` | Actualizar estado |
| DELETE | `/tickets/:id` | Eliminar ticket |

### Ejemplo de Uso

```bash
# Crear ticket
curl -X POST http://localhost:3000/tickets \
  -F "userId=user123" \
  -F "image=@ticket.jpg"

# Aprobar ticket
curl -X PATCH http://localhost:3000/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Obtener cashback
curl http://localhost:3000/tickets/1/cashback
```