# 📝 EFI - Práctica Profesionalizante JavaScript

## 👥 Integrantes del Equipo

| Nombre Completo | GitHub |
|----------------|---------|
| **Maximiliano Lopez** | [@Maxi-Lopez](https://github.com/Maxi-Lopez) |
| **Agustin Lejtneker** | [@ALejtneker](https://github.com/ALejtneker) |

---

## 🔗 Enlaces del Proyecto

- **Frontend (React):** https://github.com/Maxi-Lopez/EFI_LOPEZ_LEJTNEKER_JS.git  
- **Backend (Flask API - referencia):** https://github.com/Maxi-Lopez/EFI_LOPEZ_LEJTNEKER.git

---

## 🚀 Características del Proyecto (Frontend)

### ⚙️ Tecnologías Principales
- ⚡ **React 18** con **Vite** para un desarrollo rápido y modular.
- 🎨 **PrimeReact** para componentes UI profesionales y personalizables.
- 🔐 **Autenticación JWT** gestionada con **Context API**.
- 👥 **Roles de usuario**: Admin, Moderador y Usuario.
- 📱 **Diseño responsive** adaptable a dispositivos móviles.
- ✨ **Validación de formularios** con **Formik** y **Yup**.
- 🔔 **Notificaciones dinámicas** con **React Toastify**.

---

## 📋 Prerrequisitos

Antes de comenzar, asegurate de tener instalados:

- **Node.js** (v18 o superior)
- **Git**

---

## 🛠️ Instalación y Ejecución del Frontend

### 1. Clonar el repositorio

```bash
git clone https://github.com/Maxi-Lopez/EFI_LOPEZ_LEJTNEKER_JS.git
cd EFI_LOPEZ_LEJTNEKER_JS

2. Instalar dependencias

npm install

3. Ejecutar en modo desarrollo

npm run dev

La aplicación estará disponible en:
👉 http://localhost:5173
🏗️ Estructura del Proyecto

EFI_LOPEZ_LEJTNEKER_JS/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Home.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PostsList.jsx
│   │   ├── CreatePost.jsx
│   │   ├── CreateCategory.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/             # Contextos de React
│   │   └── AuthContext.jsx
│   ├── api.js               # Configuración de conexión con API
│   └── styles/              # Estilos CSS
├── public/
└── package.json

🔐 Funcionalidades de Autenticación

    Registro de usuarios con validación de datos.

    Login seguro con tokens JWT.

    Protección de rutas basada en roles.

    Gestión de sesiones con localStorage.

    Logout que limpia sesión y token.

👨‍💼 Sistema de Roles
Rol	Permisos
Usuario (User)	Gestiona sus propios posts y comentarios.
Moderador (Moderator)	Puede eliminar cualquier post o comentario.
Administrador (Admin)	Acceso total al sistema.
🧰 Solución de Problemas Comunes
❗ Error de CORS

Si el backend devuelve un error de CORS, asegurate de tener esto en Flask:

from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

⚙️ Problemas de instalación

# Limpiar cache de npm
npm cache clean --force
rm -rf node_modules
npm install

🧩 Error de dependencias

npm update

🤝 Contribución

    Hacé un fork del proyecto.

    Creá una nueva rama para tu feature:

git checkout -b feature/NuevaFeature

Realizá tus cambios y hacé commit:

    git commit -m "Agrego nueva feature"

    Subí tu rama y abrí un Pull Request.

📞 Contacto

📧 Maximiliano Lopez: m.lopez@itecriocuarto.org.ar

📧 Agustin Lejtneker: a.lejtneker@itecriocuarto.org.ar

✨ Gracias por visitar nuestro proyecto 🚀
