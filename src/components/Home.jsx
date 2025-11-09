import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="tech-background">
      <div className="tech-grid"></div>
      <div className="home-container fade-in">
        <h1 className="home-title">¡Bienvenido al Sistema de Posts! 🚀</h1>
        <p className="home-subtitle">
          Descubre contenido increíble, comparte tus ideas y únete a conversaciones 
          en nuestra plataforma tecnológica moderna
        </p>

        <div className="home-buttons">
          <Link to="/dashboard">
            <button className="tech-button tech-button-secondary" style={{ minWidth: "200px" }}>
              🌟 Ingresar al Dashboard
            </button>
          </Link>
        </div>

        <div className="home-buttons">
          <Link to="/register">
            <button className="tech-button" style={{ minWidth: "160px" }}>
              📝 Registrarse
            </button>
          </Link>
          <Link to="/login">
            <button className="tech-button tech-button-outlined" style={{ minWidth: "160px" }}>
              🔐 Iniciar Sesión
            </button>
          </Link>
        </div>

        {/* Características destacadas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "2rem", 
          marginTop: "3rem",
          width: "100%",
          maxWidth: "900px"
        }}>
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--neon-cyan)" }}>Dashboard Interactivo</h3>
            <p style={{ color: "var(--text-secondary)" }}>Explora categorías y posts con una interfaz moderna y fluida</p>
          </div>
          
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💬</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--neon-green)" }}>Comentarios en Tiempo Real</h3>
            <p style={{ color: "var(--text-secondary)" }}>Interactúa con la comunidad mediante nuestro sistema de comentarios</p>
          </div>
          
          <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--neon-pink)" }}>Sistema Seguro</h3>
            <p style={{ color: "var(--text-secondary)" }}>Autenticación JWT y roles para una experiencia protegida</p>
          </div>
        </div>

        <div style={{ 
          marginTop: "3rem", 
          padding: "1.5rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          width: "100%",
          maxWidth: "900px"
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Desarrollado con React ⚛️ y Vite 🎨 • Por: Maximiliano Lopez y Agustin Lejtneker
          </p>
        </div>
      </div>
    </div>
  );
}
