import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ToastContainer, toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../api";
import PostsList from "./PostList";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadCategories();
  }, []);

  const loadUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/categories", { headers });
      setCategories(res.data || res);
    } catch (err) {
      toast.error("Error al cargar categorías");
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadPostsByCategory = async (categoryId) => {
    setLoadingPosts(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/posts", { headers });
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
      console.error(err);
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <div>
      <ToastContainer />

      {/* Header fijo */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #ddd",
           backgroundColor: "#3399ff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: "#333",
        }}
      >
        <h2>Dashboard</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            icon="pi pi-home"
            className="p-button-rounded p-button-text p-button-info"
            onClick={() => navigate("/")}
          />
          {!user ? (
            <>
              <Button
                label="Register"
                className="p-button-outlined p-button-secondary"
                onClick={() => navigate("/register")}
              />
              <Button
                label="Login"
                className="p-button-success"
                onClick={() => navigate("/login")}
              />
            </>
          ) : (
            <>
              <span style={{ alignSelf: "center" }}>Hola, {user.name}</span>
              <Button
                icon="pi pi-sign-out"
                label="Logout"
                className="p-button-danger p-button-outlined"
                onClick={handleLogout}
              />
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div
        style={{
          padding: "1.5rem",
          maxWidth: "900px",
          margin: "0 auto",
          marginTop: "80px", // deja espacio para el header
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>
              {selectedCategory
                ? `Posts en "${selectedCategory.name}"`
                : "Categorías"}
            </h3>
            {user && (
              <>
                {!selectedCategory ? (
                  <Button
                    label="Crear Categoría"
                    icon="pi pi-folder-plus"
                    className="p-button-info"
                    onClick={() => navigate("/categories/create")}
                  />
                ) : (
                  <Button
                    label={`Crear Post en "${selectedCategory.name}"`}
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={() =>
                      navigate(`/posts/create/${selectedCategory.id}`)
                    }
                  />
                )}
              </>
            )}
          </div>

          {!selectedCategory && (
            <>
              {loadingCategories ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <ProgressSpinner />
                </div>
              ) : categories.length === 0 ? (
                <p>No hay categorías disponibles</p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginBottom: "1rem",
                  }}
                >
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      label={cat.name}
                      className="p-button-outlined"
                      onClick={() => handleCategoryClick(cat)}
                    />
                  ))}
                </div>
              )}
              {!user && <p>Inicia sesión para crear categorías o posts.</p>}
            </>
          )}

          {selectedCategory && (
            <>
              {loadingPosts ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <ProgressSpinner />
                </div>
              ) : posts.length > 0 ? (
                <PostsList
                  posts={posts}
                  user={user}
                  token={localStorage.getItem("token")}
                  initialComments={commentsData}
                />
              ) : (
                <p>No hay posts en esta categoría.</p>
              )}
              <div style={{ marginTop: "1rem" }}>
                <Button
                  label="Volver a Categorías"
                  icon="pi pi-arrow-left"
                  className="p-button-text p-button-secondary"
                  onClick={() => {
                    setSelectedCategory(null);
                    setPosts([]);
                    setCommentsData({});
                  }}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
