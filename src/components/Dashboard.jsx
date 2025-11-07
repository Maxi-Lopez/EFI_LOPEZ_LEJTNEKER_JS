import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ToastContainer, toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { Chip } from "primereact/chip";
import api from "../api";
import PostsList from "./PostList";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const navigate = useNavigate();

  const { user, token, logout } = useContext(AuthContext);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/categories", headers);
      setCategories(res.data || res);
    } catch (err) {
      toast.error("Error al cargar categorías");
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadPostsByCategory = async (categoryId) => {
    setLoadingPosts(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/posts", headers);
      const allPosts = res.data || res;
      
      const filtered = allPosts.filter(
        (p) =>
          p.category?.id === categoryId ||
          p.category_id === categoryId ||
          p.categoryId === categoryId
      );
      
      const commentsMap = {};
      filtered.forEach((p) => {
        commentsMap[p.id] = p.comments || [];
      });
      setPosts(filtered);
      setCommentsData(commentsMap);
    } catch (err) {
      toast.error("Error al cargar los posts de esta categoría");
      setPosts([]);
      setCommentsData({});
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    loadPostsByCategory(category.id);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="tech-background">
      <div className="tech-grid"></div>
      <ToastContainer />

      {/* Header fijo */}
      <div className="dashboard-header fade-in">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <i className="pi pi-th-large" style={{ fontSize: "1.5rem", color: "var(--neon-cyan)" }}></i>
          <h2 style={{ 
            margin: 0, 
            background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-pink))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Dashboard
          </h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Button
            icon="pi pi-home"
            className="p-button-rounded p-button-text"
            style={{ color: "var(--text-primary)" }}
            onClick={() => navigate("/")}
          />
          {!user ? (
            <>
              <Button
                label="Registrarse"
                className="tech-button-outlined"
                onClick={() => navigate("/register")}
              />
              <Button
                label="Iniciar Sesión"
                className="tech-button"
                onClick={() => navigate("/login")}
              />
            </>
          ) : (
            <>
              <Chip 
                label={user.email} 
                icon="pi pi-user"
                className="category-chip"
                style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-primary)" }}
              />
              {user.role && (
                <Chip 
                  label={user.role} 
                  icon={user.role === 'admin' ? 'pi pi-shield' : 'pi pi-user'}
                  style={{ 
                    background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(67, 233, 123, 0.2)',
                    color: user.role === 'admin' ? '#ef4444' : '#43e97b'
                  }}
                />
              )}
              <Button
                icon="pi pi-sign-out"
                label="Cerrar Sesión"
                className="tech-button-outlined"
                style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}
                onClick={handleLogout}
              />
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="dashboard-content fade-in">
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <h3 style={{ 
              margin: 0,
              color: "var(--text-primary)",
              fontSize: "1.5rem"
            }}>
              {selectedCategory ? (
                <>
                  <i className="pi pi-folder" style={{ marginRight: "0.5rem" }}></i>
                  Posts en <span style={{ color: "var(--neon-cyan)" }}>"{selectedCategory.name}"</span>
                </>
              ) : (
                <>
                  <i className="pi pi-tags" style={{ marginRight: "0.5rem" }}></i>
                  Explorar Categorías
                </>
              )}
            </h3>
            {user && (
              <>
                {!selectedCategory ? (
                  <Button
                    label="Crear Categoría"
                    icon="pi pi-folder-plus"
                    className="tech-button"
                    onClick={() => navigate("/categories/create")}
                  />
                ) : (
                  <Button
                    label={`Crear Post en ${selectedCategory.name}`}
                    icon="pi pi-plus"
                    className="tech-button tech-button-secondary"
                    onClick={() => navigate(`/posts/create/${selectedCategory.id}`)}
                  />
                )}
              </>
            )}
          </div>

          {!selectedCategory && (
            <>
              {loadingCategories ? (
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
                  <p>No hay categorías disponibles</p>
                  {user && (
                    <Button
                      label="Crear Primera Categoría"
                      icon="pi pi-plus"
                      className="tech-button"
                      onClick={() => navigate("/categories/create")}
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              ) : (
                <div style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "1.5rem"
                }}>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      label={cat.name}
                      className="tech-button-outlined category-chip"
                      style={{ 
                        borderRadius: "25px",
                        padding: "0.75rem 1.5rem",
                        borderColor: "var(--neon-cyan)",
                        color: "var(--neon-cyan)"
                      }}
                      onClick={() => handleCategoryClick(cat)}
                    />
                  ))}
                </div>
              )}
              {!user && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "2rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-md)",
                  marginTop: "1rem"
                }}>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                    <i className="pi pi-info-circle" style={{ marginRight: "0.5rem" }}></i>
                    Inicia sesión para crear categorías o posts
                  </p>
                  <Button
                    label="Iniciar Sesión"
                    className="tech-button"
                    onClick={() => navigate("/login")}
                  />
                </div>
              )}
            </>
          )}

          {selectedCategory && (
            <>
              {loadingPosts ? (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "200px",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                  <p style={{ color: "var(--text-secondary)" }}>Cargando posts...</p>
                </div>
              ) : posts.length > 0 ? (
                <PostsList
                  posts={posts}
                  user={user}
                  token={token}
                  initialComments={commentsData}
                />
              ) : (
                <div style={{ 
                  textAlign: "center", 
                  padding: "3rem",
                  color: "var(--text-secondary)"
                }}>
                  <i className="pi pi-file" style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}></i>
                  <p>No hay posts en esta categoría</p>
                  {user && (
                    <Button
                      label={`Crear Primer Post en ${selectedCategory.name}`}
                      icon="pi pi-plus"
                      className="tech-button tech-button-secondary"
                      onClick={() => navigate(`/posts/create/${selectedCategory.id}`)}
                      style={{ marginTop: "1rem" }}
                    />
                  )}
                </div>
              )}
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <Button
                  label="Volver a Categorías"
                  icon="pi pi-arrow-left"
                  className="tech-button-outlined"
                  style={{ borderColor: "var(--neon-purple)", color: "var(--neon-purple)" }}
                  onClick={() => {
                    setSelectedCategory(null);
                    setPosts([]);
                    setCommentsData({});
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}