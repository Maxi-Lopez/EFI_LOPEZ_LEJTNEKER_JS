import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";
import { API_URL } from "../api";

export default function PostsList({ posts, user, token, initialComments }) {
  const [showCommentInput, setShowCommentInput] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentsData, setCommentsData] = useState(initialComments || {});
  const [deletedPosts, setDeletedPosts] = useState({}); 

  useEffect(() => {
    if (initialComments) setCommentsData(initialComments);
  }, [initialComments]);

  const toggleCommentInput = (postId) => {
    setShowCommentInput((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComment((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    if (!token) return toast.error("🔐 Debes iniciar sesión para comentar");

    if (!newComment[postId]?.trim()) {
      return toast.error("💬 El comentario no puede estar vacío");
    }

    try {
      const newCommentData = await api.post(
        `/posts/${postId}/comments`,
        { content: newComment[postId] },
        token
      );
      toast.success("💬 Comentario creado exitosamente");
      setCommentsData((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentData],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentInput((prev) => ({ ...prev, [postId]: false }));
    } catch (err) {
      toast.error(`❌ Error al crear comentario: ${err.message}`);
    }
  };

  const deletePost = async (postId) => {
    if (!token) return toast.error("🔐 Debes iniciar sesión");

    if (!window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      toast.success("🗑️ Post eliminado exitosamente");
      setDeletedPosts((prev) => ({ ...prev, [postId]: true }));
    } catch (err) {
      toast.error(`❌ No se pudo eliminar el post: ${err.message}`);
    }
  };

  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`, token);
      toast.success("🗑️ Comentario eliminado");
      setCommentsData((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      toast.error("❌ No se pudo eliminar el comentario");
    }
  };

  const canDeletePost = (post) =>
    user &&
    (user.role === "admin" ||
      user.role === "moderator" ||
      user.id === post.author_id);

  const canDeleteComment = (comment) =>
    user &&
    (user.role === "admin" ||
      user.role === "moderator" ||
      user.id === comment.author_id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (posts.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "3rem",
        color: "var(--text-secondary)"
      }}>
        <i className="pi pi-file" style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}></i>
        <p>No hay posts en esta categoría</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <ToastContainer />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {posts.map((post) => (
          <div key={post.id} className="post-item fade-in">
            {deletedPosts[post.id] ? (
              <div style={{ 
                textAlign: "center", 
                padding: "2rem",
                color: "var(--text-muted)",
                fontStyle: "italic"
              }}>
                <i className="pi pi-trash" style={{ marginRight: "0.5rem" }}></i>
                Post eliminado
              </div>
            ) : (
              <>
                {/* Header del Post */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <h3 style={{ 
                      margin: "0 0 0.5rem 0",
                      color: "var(--text-primary)",
                      fontSize: "1.25rem"
                    }}>
                      {post.title}
                    </h3>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <Chip 
                        label={post.author?.name || "Anónimo"} 
                        icon="pi pi-user"
                        style={{ 
                          background: "rgba(79, 172, 254, 0.2)", 
                          color: "var(--neon-cyan)" 
                        }}
                      />
                      {post.category?.name && (
                        <Chip 
                          label={post.category.name} 
                          icon="pi pi-tag"
                          style={{ 
                            background: "rgba(67, 233, 123, 0.2)", 
                            color: "var(--neon-green)" 
                          }}
                        />
                      )}
                      <span style={{ 
                        color: "var(--text-muted)", 
                        fontSize: "0.9rem" 
                      }}>
                        <i className="pi pi-clock" style={{ marginRight: "0.25rem" }}></i>
                        {post.created_at ? formatDate(post.created_at) : "Desconocido"}
                      </span>
                    </div>
                  </div>
                  
                  {canDeletePost(post) && (
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-outlined p-button-sm"
                      style={{ 
                        borderColor: "var(--neon-pink)", 
                        color: "var(--neon-pink)" 
                      }}
                      onClick={() => deletePost(post.id)}
                      tooltip="Eliminar post"
                      tooltipOptions={{ position: 'top' }}
                    />
                  )}
                </div>

                {/* Contenido del Post */}
                <div style={{ 
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                  lineHeight: "1.6"
                }}>
                  <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                    {post.content}
                  </p>
                </div>

                {/* Sección de Comentarios */}
                <div>
                  {user && (
                    <div style={{ marginBottom: "1rem" }}>
                      {!showCommentInput[post.id] ? (
                        <Button
                          label="Agregar comentario"
                          icon="pi pi-comment"
                          className="tech-button-outlined"
                          style={{ 
                            borderColor: "var(--neon-cyan)", 
                            color: "var(--neon-cyan)" 
                          }}
                          onClick={() => toggleCommentInput(post.id)}
                        />
                      ) : (
                        <div style={{ 
                          padding: "1rem",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            <InputText
                              value={newComment[post.id] || ""}
                              onChange={(e) => handleCommentChange(post.id, e.target.value)}
                              placeholder="Escribe tu comentario..."
                              style={{ flex: 1 }}
                              onKeyPress={(e) => e.key === 'Enter' && submitComment(post.id)}
                            />
                            <Button
                              icon="pi pi-send"
                              className="tech-button"
                              onClick={() => submitComment(post.id)}
                              disabled={!newComment[post.id]?.trim()} // ✅ CORREGIDO: usa post.id
                            />
                          </div>
                          <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-text"
                            style={{ color: "var(--text-muted)" }}
                            onClick={() => toggleCommentInput(post.id)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lista de Comentarios */}
                  {commentsData[post.id] && commentsData[post.id].length > 0 && (
                    <div>
                      <h4 style={{ 
                        color: "var(--text-primary)",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <i className="pi pi-comments"></i>
                        Comentarios ({commentsData[post.id].length})
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {commentsData[post.id].map((comment) => (
                          <div
                            key={comment.id}
                            className="comment-item"
                            style={{
                              padding: "1rem",
                              background: "rgba(255, 255, 255, 0.02)",
                              borderRadius: "var(--radius-md)",
                              borderLeft: "3px solid var(--neon-purple)"
                            }}
                          >
                            <div style={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "flex-start",
                              marginBottom: "0.5rem"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Chip 
                                  label={comment.author?.name || "Anónimo"} 
                                  style={{ 
                                    background: "rgba(240, 147, 251, 0.2)", 
                                    color: "var(--neon-pink)" 
                                  }}
                                />
                                <span style={{ 
                                  color: "var(--text-muted)", 
                                  fontSize: "0.8rem" 
                                }}>
                                  <i className="pi pi-clock" style={{ marginRight: "0.25rem" }}></i>
                                  {comment.created_at ? formatDate(comment.created_at) : "Desconocido"}
                                </span>
                              </div>
                              
                              {canDeleteComment(comment) && (
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-text p-button-danger"
                                  style={{ color: "var(--neon-pink)" }}
                                  onClick={() => deleteComment(post.id, comment.id)}
                                  tooltip="Eliminar comentario"
                                  tooltipOptions={{ position: 'top' }}
                                />
                              )}
                            </div>
                            <p style={{ 
                              margin: 0, 
                              color: "var(--text-secondary)",
                              lineHeight: "1.5"
                            }}>
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}