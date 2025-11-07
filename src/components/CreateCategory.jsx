import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function CreateCategory() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast.error("🔐 Debes iniciar sesión para crear una categoría");
      navigate("/login");
      return;
    }

    if (!name.trim()) {
      toast.error("📝 El nombre de la categoría es obligatorio");
      return;
    }

    if (name.length < 2) {
      toast.error("📝 El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (name.length > 50) {
      toast.error("📝 El nombre no puede exceder los 50 caracteres");
      return;
    }

    setLoading(true);
    
    try {
      const res = await api.post("/categories", { name: name.trim() }, token);
      
      toast.success("🎉 ¡Categoría creada exitosamente!");
      
      // Extraer el ID de la categoría creada
      const categoryId = res.id || res.data?.id || res.category_id;
      
      // Redirigir para crear un post en esta categoría
      setTimeout(() => {
        if (categoryId) {
          navigate(`/posts/create/${categoryId}`);
        } else {
          navigate("/dashboard");
        }
      }, 1500);
      
    } catch (error) {
      console.error("Error creating category:", error);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`❌ Error creando categoría: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSelectCategory = () => {
    navigate("/categories/select");
  };

  return (
    <div className="tech-background">
      <div className="tech-grid"></div>
      <ToastContainer />
      
      <div className="dashboard-content fade-in">
        <div className="card" style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-pink))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              📁
            </div>
            <h2 style={{ 
              marginBottom: "0.5rem",
              background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Crear Nueva Categoría
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Organiza el contenido de la comunidad con categorías temáticas
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Campo Nombre de Categoría */}
            <div className="form-field">
              <label>
                <i className="pi pi-tag" style={{ marginRight: "0.5rem" }}></i>
                Nombre de la Categoría
              </label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Tecnología, Deportes, Cocina, Programación..."
                style={{ width: "100%" }}
                disabled={loading}
                maxLength={50}
              />
              <small style={{ color: "var(--text-muted)", marginTop: "0.5rem", display: "block" }}>
                {name.length}/50 caracteres • Mínimo 2 caracteres
              </small>
            </div>

            {/* Información de la Categoría */}
            <div style={{ 
              padding: "1rem",
              background: "rgba(67, 233, 123, 0.1)",
              border: "1px solid rgba(67, 233, 123, 0.3)",
              borderRadius: "var(--radius-md)",
              textAlign: "center"
            }}>
              <p style={{ 
                color: "var(--neon-green)", 
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}>
                <i className="pi pi-info-circle"></i>
                Después de crear la categoría podrás agregar posts inmediatamente
              </p>
            </div>

            {/* Botones de Acción Principales */}
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "1rem"
            }}>
              <Button
                type="submit"
                label={loading ? "Creando Categoría..." : "Crear Categoría"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-plus"}
                className="tech-button tech-button-secondary"
                disabled={loading}
                style={{ minWidth: "180px" }}
              />
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                className="tech-button-outlined"
                style={{ 
                  minWidth: "140px",
                  borderColor: "var(--neon-purple)",
                  color: "var(--neon-purple)"
                }}
                onClick={handleCancel}
                disabled={loading}
              />
            </div>
          </form>

          {/* Navegación Alternativa */}
          <div style={{ 
            marginTop: "2rem",
            padding: "1.5rem",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center"
          }}>
            <h4 style={{ 
              color: "var(--text-primary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}>
              <i className="pi pi-folder-open" style={{ color: "var(--neon-cyan)" }}></i>
              ¿Prefieres usar una categoría existente?
            </h4>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Explora las categorías ya creadas por la comunidad
            </p>
            <Button
              label="Ver Categorías Existentes"
              icon="pi pi-search"
              className="tech-button-outlined"
              style={{ 
                borderColor: "var(--neon-cyan)",
                color: "var(--neon-cyan)"
              }}
              onClick={handleSelectCategory}
            />
          </div>

          {/* Consejos para nombres de categorías */}
          <div style={{ 
            marginTop: "1.5rem",
            padding: "1.5rem",
            background: "rgba(102, 126, 234, 0.1)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(102, 126, 234, 0.2)"
          }}>
            <h4 style={{ 
              color: "var(--text-primary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <i className="pi pi-lightbulb" style={{ color: "var(--neon-blue)" }}></i>
              Consejos para nombres efectivos
            </h4>
            <ul style={{ 
              color: "var(--text-secondary)", 
              paddingLeft: "1.5rem",
              margin: 0,
              lineHeight: "1.6"
            }}>
              <li>Usa nombres claros y descriptivos</li>
              <li>Mantén una longitud razonable</li>
              <li>Evita caracteres especiales</li>
              <li>Considera la temática general</li>
              <li>Piensa en la facilidad de búsqueda</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}