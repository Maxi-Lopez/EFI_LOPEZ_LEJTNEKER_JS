import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { ToastContainer, toast } from "react-toastify";
import api from '../api';
import { AuthContext } from "../context/AuthContext";

export default function SelectCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get("/categories");
        setCategories(res.data || res);
      } catch (error) {
        toast.error("❌ Error cargando categorías");
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategorySelect = (category) => {
    navigate(`/posts/create/${category.id}`);
  };

  const handleCreateNewCategory = () => {
    navigate("/categories/create");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="tech-background">
      <div className="tech-grid"></div>
      <ToastContainer />
      
      <div className="dashboard-content fade-in">
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              📂
            </div>
            <h2 style={{ 
              marginBottom: "0.5rem",
              background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-pink))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Seleccionar Categoría
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Elige una categoría para tu nuevo post
            </p>
          </div>

          {loading ? (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "200px",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              <p style={{ color: "var(--text-secondary)" }}>Cargando categorías...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "3rem",
              color: "var(--text-secondary)"
            }}>
              <i className="pi pi-inbox" style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}></i>
              <p style={{ marginBottom: "1.5rem" }}>No hay categorías disponibles</p>
              <Button
                label="Crear Primera Categoría"
                icon="pi pi-plus"
                className="tech-button"
                onClick={handleCreateNewCategory}
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ 
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <i className="pi pi-tags"></i>
                  Categorías Disponibles ({categories.length})
                </h3>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem"
                }}>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="card category-card"
                      style={{
                        padding: "1.5rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.05)"
                      }}
                      onClick={() => handleCategorySelect(category)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.borderColor = "var(--neon-cyan)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "1rem" 
                      }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-purple))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.2rem"
                        }}>
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ 
                            margin: "0 0 0.25rem 0",
                            color: "var(--text-primary)"
                          }}>
                            {category.name}
                          </h4>
                          <p style={{ 
                            margin: 0,
                            color: "var(--text-muted)",
                            fontSize: "0.9rem"
                          }}>
                            {category.posts_count ? `${category.posts_count} posts` : 'Sin posts'}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        marginTop: "1rem",
                        textAlign: "center"
                      }}>
                        <Button
                          label="Seleccionar"
                          icon="pi pi-arrow-right"
                          className="tech-button-outlined"
                          style={{ 
                            borderColor: "var(--neon-green)",
                            color: "var(--neon-green)"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                gap: "1rem", 
                justifyContent: "center",
                flexWrap: "wrap"
              }}>
                <Button
                  label="Crear Nueva Categoría"
                  icon="pi pi-folder-plus"
                  className="tech-button tech-button-secondary"
                  onClick={handleCreateNewCategory}
                />
                <Button
                  label="Volver al Dashboard"
                  icon="pi pi-arrow-left"
                  className="tech-button-outlined"
                  style={{ 
                    borderColor: "var(--neon-purple)",
                    color: "var(--neon-purple)"
                  }}
                  onClick={handleCancel}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}