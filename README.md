# 📝 EFI - Sistema de Posts y Comentarios

## 👥 Integrantes del Equipo

| Nombre Completo | GitHub |
|----------------|---------|
| **Maximiliano Lopez** | [@Maxi-Lopez](https://github.com/Maxi-Lopez) |
| **Agustin Lejtneker** | [@ALejtneker](https://github.com/ALejtneker) |

## 🔗 Enlaces del Proyecto

- **Frontend (React):** [https://github.com/Maxi-Lopez/EFI_LOPEZ_LEJTNEKER.git](https://github.com/Maxi-Lopez/EFI_LOPEZ_LEJTNEKER.git)
- **Backend (Flask API):** [Enlace al repositorio del backend] *(agregar cuando esté disponible)*

## 🚀 Características del Proyecto

### Frontend (React + Vite)
- ⚡ **React 18** con Vite para desarrollo rápido
- 🎨 **PrimeReact** para componentes UI profesionales
- 🔐 **Sistema de autenticación** JWT con Context API
- 👥 **Gestión de roles** (Admin, Moderator, User)
- 📱 **Design responsive** y accesible
- ✨ **Formularios validados** con Formik & Yup
- 🔔 **Notificaciones** con React Toastify

### Backend (Flask)
- 🐍 **Flask** con arquitectura RESTful
- 🔒 **Autenticación JWT** con Flask-JWT-Extended
- 🛡️ **Sistema de roles y permisos**
- 🗄️ **Base de datos** con SQLAlchemy
- 📧 **Validación de datos** con Marshmallow
- 🔐 **Hash de contraseñas** con bcrypt

## 📋 Prerrequisitos

- **Node.js** (versión 18 o superior)
- **Python** (versión 3.8 o superior)
- **pip** (gestor de paquetes de Python)
- **Git**

## 🛠️ Instalación y Ejecución

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Maxi-Lopez/EFI_LOPEZ_LEJTNEKER.git
cd EFI_LOPEZ_LEJTNEKER

2. Configuración del Frontend
bash

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en: http://localhost:5173

3. Configuración del Backend

(Reemplazar con las instrucciones específicas de tu backend cuando esté disponible)
bash

# Navegar al directorio del backend
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar la aplicación
python app.py

# La API estará disponible en: http://localhost:5000

🏗️ Estructura del Proyecto
text

EFI_LOPEZ_LEJTNEKER/
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
│   ├── api.js              # Configuración de API
│   └── styles/             # Estilos CSS
├── public/
└── package.json

🔐 Funcionalidades de Autenticación

    Registro de usuarios con validación de datos

    Login seguro con tokens JWT

    Protección de rutas basada en roles

    Gestión de sesiones con localStorage

    Logout con limpieza de tokens

👨‍💼 Sistema de Roles

    Usuario (User): Gestionar sus propios posts y comentarios

    Moderador (Moderator): Eliminar cualquier post o comentario

    Administrador (Admin): Acceso completo al sistema

🎯 Endpoints Principales de la API

(Lista de endpoints cuando tengas el backend)
🐛 Solución de Problemas Comunes
Error de CORS
javascript

// En el backend Flask, asegurar:
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

Problemas de instalación
bash

# Limpiar cache de npm
npm cache clean --force
rm -rf node_modules
npm install

Error de dependencias
bash

# Actualizar todas las dependencias
npm update

🤝 Contribución

    Fork el proyecto

    Crear una rama para tu feature (git checkout -b feature/AmazingFeature)

    Commit tus cambios (git commit -m 'Add some AmazingFeature')

    Push a la rama (git push origin feature/AmazingFeature)

    Abrir un Pull Request

📞 Soporte

Si encuentras algún problema o tienes preguntas:

    📧 Maximiliano Lopez: [tu-email@ejemplo.com]

    📧 Agustin Lejtneker: [tu-email@ejemplo.com]

📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

¡Gracias por visitar nuestro proyecto! 🚀
text


## 🎯 **Para completar el README necesitas:**

1. **🔗 Agregar el enlace al backend** cuando lo tengas
2. **📧 Agregar los emails** de contacto si quieren
3. **📋 Completar la sección de endpoints** de la API
4. **🛠️ Verificar** que los comandos de instalación del backend sean correctos

¿Quieres que ajuste algo específico o agregues alguna sección adicional?


