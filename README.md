# 🧩 Backend III – Entrega N°1: Mocks y Generación de Datos

## 🚀 Descripción del Proyecto
Entrega del curso **Backend III (Coderhouse)**.  
Implementa un **router de mocks** para generar datos falsos y un **endpoint** para insertar usuarios y mascotas en **MongoDB**. Se usan **Express**, **Mongoose**, **@faker-js/faker** y **bcrypt**. Cumple con los criterios de la consigna.

---

## ⚙️ Tecnologías y Conceptos
- **Node.js + Express** (routers, middlewares, modularización).
- **MongoDB + Mongoose** (modelos `User` y `Pet`).
- **@faker-js/faker** (mocks realistas).
- **bcrypt** (hash de `coder123`).
- Respuestas normalizadas: `{ status, payload }` o `{ status, inserted }`.

---

## ▶️ Cómo Ejecutar
1. Instalar dependencias:
   A. npm install
   B. npm run dev
   C. Acceder a: http://localhost:8080/api/mocks

---

# 🧠 Endpoints Principales

## GET `/api/mocks/mockingusers`
Genera **50 usuarios** mock (no persiste en DB).  
**Opcional:** `?qty=100`

---

## GET `/api/mocks/mockingpets`
Genera **mascotas** mock (no persiste en DB).  
**Opcional:** `?qty=20`

---

## POST `/api/mocks/generateData`
Inserta datos en **MongoDB**.

**Body (JSON):**
{ "users": 30, "pets": 60 }

---

## GET `/api/users`
Lista todos los **usuarios** almacenados en la base de datos.  
Permite verificar que los registros generados por el endpoint  
`POST /api/mocks/generateData` fueron insertados correctamente.

---

## GET `/api/pets`
Lista todas las **mascotas** almacenadas en la base de datos.  
También sirve para confirmar que los registros fueron creados y asociados correctamente.
