import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const { categoryId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setCategoryLoading(true);
        const res = await api.get(`/categories/${categoryId}`, token);
        setCategoryName(res.name || "Categoría");
      } catch (error) {
        console.error("Error loading category:", error);
        toast.error("❌ Error cargando la categoría");
        setCategoryName("Categoría desconocida");
      } finally {
        setCategoryLoading(false);
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast.error("🔐 Debes iniciar sesión para crear un post");
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("📝 Completa todos los campos requeridos");
      return;
    }

    if (title.length < 3) {
      toast.error("📝 El título debe tener al menos 3 caracteres");
      return;
    }

    if (content.length < 10) {
      toast.error("📝 El contenido debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);
    
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category_id: parseInt(categoryId)
      };

      await api.post("/posts", postData, token);

      toast.success("🎉 ¡Post creado exitosamente!");
      setTimeout(() => navigate("/dashboard"), 1000);
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(`❌ Error creando el post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (categoryLoading) {
    return (
      <div className="tech-background">
        <div className="tech-grid"></div>
        <div className="dashboard-content">
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "400px",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <ProgressSpinner style={{ width: "60px", height: "60px" }} />
            <p style={{ color: "var(--text-secondary)" }}>Cargando categoría...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tech-background">
      <div className="tech-grid"></div>
      <ToastContainer />
      
      <div className="dashboard-content fade-in">
        <div className="card" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              ✍️
            </div>
            <h2 style={{ 
              marginBottom: "0.5rem",
              background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-pink))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Crear Nuevo Post
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              en <span style={{ color: "var(--neon-cyan)", fontWeight: "600" }}>{categoryName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Campo Título */}
            <div className="form-field">
              <label>
                <i className="pi pi-pencil" style={{ marginRight: "0.5rem" }}></i>
                Título del Post
              </label>
              <InputText
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Escribe un título atractivo para tu post..."
                style={{ width: "100%" }}
                disabled={loading}
              />
              <small style={{ color: "var(--text-muted)", marginTop: "0.5rem", display: "block" }}>
                Mínimo 3 caracteres • {title.length}/100
              </small>
            </div>

            {/* Campo Contenido */}
            <div className="form-field">
              <label>
                <i className="pi pi-file" style={{ marginRight: "0.5rem" }}></i>
                Contenido del Post
              </label>
              <InputTextarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comparte tus ideas, conocimientos o preguntas con la comunidad..."
                rows={8}
                style={{ width: "100%", resize: "vertical" }}
                disabled={loading}
              />
              <small style={{ color: "var(--text-muted)", marginTop: "0.5rem", display: "block" }}>
                Mínimo 10 caracteres • {content.length}/5000
              </small>
            </div>

            {/* Información de la Categoría */}
            <div style={{ 
              padding: "1rem",
              background: "rgba(102, 126, 234, 0.1)",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              borderRadius: "var(--radius-md)",
              textAlign: "center"
            }}>
              <p style={{ 
                color: "var(--neon-blue)", 
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}>
                <i className="pi pi-info-circle"></i>
                Este post se publicará en la categoría: <strong>{categoryName}</strong>
              </p>
            </div>

            {/* Botones de Acción */}
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "1rem"
            }}>
              <Button
                type="submit"
                label={loading ? "Creando Post..." : "Publicar Post"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
                className="tech-button tech-button-secondary"
                disabled={loading}
                style={{ minWidth: "160px" }}
              />
              <Button
                type="button"
                label="Cancelar"
                icon="pi pi-times"
                className="tech-button-outlined"
                style={{ 
                  minWidth: "160px",
                  borderColor: "var(--neon-purple)",
                  color: "var(--neon-purple)"
                }}
                onClick={handleCancel}
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}