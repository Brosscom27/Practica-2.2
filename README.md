# Sistema de Gestión de Inventarios Multi-Almacén

Aplicación web full stack (MERN) para administrar almacenes, categorías, productos, movimientos y reportes con una interfaz moderna en React + MUI.

## Stack

- **Frontend**: React + Vite, React Router, Context API, Axios, Material UI, React Hook Form.
- **Backend**: Node.js + Express en capas (rutas/controladores/servicios/modelos), JWT, express-validator.
- **Base de datos**: MongoDB con Mongoose.
- **Calidad**: pruebas básicas con `node:test + supertest` (backend) y `vitest + testing-library` (frontend).
- **Docs API**: Swagger disponible en `/api/docs`.

## Funcionalidades implementadas

- Gestión de almacenes y categorías (incluye seed de almacenes predefinidos).
- Gestión de productos con campos clave (nombre, descripción, unidad, stock mínimo/máximo, ubicación, proveedor, código de barras).
- Registro de entradas/salidas y cálculo de stock actual.
- Dashboard con alertas de stock mínimo.
- Búsqueda/filtros por query params en productos y movimientos.
- Reportes básicos: stock actual, bajo stock y movimientos por rango de fecha.
- Roles JWT (`admin`, `encargado`, `consultor`) para autorización.

## Estructura

- `backend/src`: API Express.
- `frontend/src`: SPA React.
- `docs`: espacio para documentación adicional.

## Variables de entorno recomendadas

Backend (`backend/.env`):

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/inventory_app
JWT_SECRET=super-secreto
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:4000/api
```

## Comandos

Desde la raíz:

```bash
npm install
npm run dev:backend
npm run dev:frontend
npm test
```

## Seguridad y escalabilidad

- Contraseñas cifradas con `bcryptjs`.
- Protección básica con `helmet`, `rate-limit` y validación de payloads.
- Arquitectura preparada para ampliar a módulos opcionales (escáner de código, imágenes, exportación PDF/Excel, multi-sucursal).
