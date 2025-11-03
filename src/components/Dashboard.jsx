import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { toast } from "react-toastify";
import api from "../api";
import PostsList from "./PostList";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [commentsData, setCommentsData] = useState({});
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
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/categories", { headers });
      setCategories(res.data || res);
    } catch (err) {
      toast.error("Error al cargar categorías");
      console.error(err);
    }
  };

  const loadPostsByCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/posts", { headers });
      const allPosts = res.data || res;

      const matchesCategory = (post, catId) => {
        const target = String(catId);
        if (post?.category?.id !== undefined && String(post.category.id) === target) return true;
        if (post?.category_id !== undefined && String(post.category_id) === target) return true;
        if (post?.category !== undefined && String(post.category) === target) return true;
        if (post?.categoryId !== undefined && String(post.categoryId) === target) return true;
        return false;
      };

      const filtered = allPosts.filter((p) => matchesCategory(p, categoryId));

      // Creamos objeto con comentarios por postId
      const commentsMap = {};
      filtered.forEach((p) => {
        commentsMap[p.id] = p.comments || [];
      });

      setPosts(filtered);
      setCommentsData(commentsMap);
      toast.info(`${filtered.length} posts en la categoría seleccionada`);
    } catch (err) {
      toast.error("Error al cargar los posts de esta categoría");
      console.error(err);
      setPosts([]);
      setCommentsData({});
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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <h2>Dashboard</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button icon="pi pi-home" className="p-button-rounded p-button-text p-button-info" onClick={() => navigate("/")} />
          {!user ? (
            <>
              <Button label="Register" className="p-button-outlined p-button-secondary" onClick={() => navigate("/register")} />
              <Button label="Login" className="p-button-success" onClick={() => navigate("/login")} />
            </>
          ) : (
            <>
              <span style={{ alignSelf: "center" }}>Hola, {user.name}</span>
              <Button icon="pi pi-sign-out" label="Logout" className="p-button-danger p-button-outlined" onClick={handleLogout} />
            </>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3>{selectedCategory ? `Posts en "${selectedCategory.name}"` : "Categorías"}</h3>
            {user && (
              <>
                {!selectedCategory ? (
                  <Button label="Crear Categoría" icon="pi pi-folder-plus" className="p-button-info" onClick={() => navigate("/categories/create")} />
                ) : (
                  <Button label={`Crear Post en "${selectedCategory.name}"`} icon="pi pi-plus" className="p-button-success" onClick={() => navigate(`/posts/create/${selectedCategory.id}`)} />
                )}
              </>
            )}
          </div>

          {/* Botones de categorías */}
          {!selectedCategory && (
            <>
              {categories.length === 0 ? (
                <p>No hay categorías disponibles</p>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {categories.map((cat) => (
                    <Button key={cat.id} label={cat.name} className="p-button-outlined" onClick={() => handleCategoryClick(cat)} />
                  ))}
                </div>
              )}
              {!user && <p>Inicia sesión para crear categorías o posts.</p>}
            </>
          )}

          {/* Listado de posts */}
          {selectedCategory && (
            <>
              {posts.length > 0 ? (
                <PostsList posts={posts} user={user} token={localStorage.getItem("token")} initialComments={commentsData} />
              ) : (
                <p>No hay posts en esta categoría.</p>
              )}
              <div style={{ marginTop: "1rem" }}>
                <Button label="Volver a Categorías" icon="pi pi-arrow-left" className="p-button-text p-button-secondary" onClick={() => { setSelectedCategory(null); setPosts([]); setCommentsData({}); }} />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
