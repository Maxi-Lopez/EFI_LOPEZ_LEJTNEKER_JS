import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";
import { API_URL } from "../api";

export default function PostsList({ posts, user, token, initialComments }) {
  const [showCommentInput, setShowCommentInput] = useState({});
  const [newComment, setNewComment] = useState({});
  const [commentsData, setCommentsData] = useState(initialComments || []);
  const [deletedPosts, setDeletedPosts] = useState({}); // <-- posts eliminados

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
    if (!token) return toast.error("Debes iniciar sesión para comentar");

    try {
      const newCommentData = await api.post(
        `/posts/${postId}/comments`,
        { content: newComment[postId] },
        token
      );
      toast.success("Comentario creado");
      setCommentsData((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentData],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentInput((prev) => ({ ...prev, [postId]: false }));
    } catch (err) {
      toast.error(`Error en el servidor: ${err.message}`);
    }
  };

  const deletePost = async (postId) => {
    if (!token) return toast.error("Debes iniciar sesión");

    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      toast.success("Post eliminado");
      setDeletedPosts((prev) => ({ ...prev, [postId]: true })); // <-- marcar como borrado
    } catch (err) {
      toast.error(`No se pudo eliminar el post: ${err.message}`);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, token);
      toast.success("Comentario eliminado");
      setCommentsData((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      toast.error("No se pudo eliminar el comentario");
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

  return (
    <div style={{ marginTop: "1rem" }}>
      <ToastContainer />
      {posts.length === 0 ? (
        <p>No hay posts en esta categoría</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            {deletedPosts[post.id] ? (
              <p style={{ color: "red", fontWeight: "bold" }}>Post borrado</p>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>
                  <strong>Autor:</strong> {post.author?.name || "Anónimo"}{" "}
                  {post.category?.name &&
                    ` | Categoría: ${post.category.name}`}
                </p>

                {user && (
                  <Button
                    label="Agregar comentario"
                    className="p-button-secondary p-button-sm"
                    onClick={() => toggleCommentInput(post.id)}
                  />
                )}

                {showCommentInput[post.id] && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post.id, e.target.value)
                      }
                    />
                    <Button
                      label="Comentar"
                      className="p-button-success"
                      onClick={() => submitComment(post.id)}
                    />
                  </div>
                )}

                {commentsData[post.id] && commentsData[post.id].length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <h4>Comentarios</h4>
                    {commentsData[post.id].map((c) => (
                      <div
                        key={c.id}
                        style={{
                          borderTop: "1px dashed #ccc",
                          paddingTop: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <p>{c.content}</p>
                        <p>
                          <strong>Autor:</strong> {c.author?.name || "Anónimo"}
                        </p>
                        {canDeleteComment(c) && (
                          <Button
                            label="Eliminar comentario"
                            className="p-button-danger p-button-text"
                            onClick={() => deleteComment(post.id, c.id)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {canDeletePost(post) && (
                  <Button
                    label="Eliminar post"
                    className="p-button-danger p-button-text"
                    onClick={() => deletePost(post.id)}
                  />
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
