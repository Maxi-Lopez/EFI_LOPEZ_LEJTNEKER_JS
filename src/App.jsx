import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import CreatePost from "./components/CreatePost";
import SelectCategory from "./components/SelectCategory";
import CreateCategory from "./components/CreateCategory";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Rutas protegidas */}
      <Route
        path="/posts/create/:categoryId"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/select"
        element={
          <ProtectedRoute>
            <SelectCategory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/create"
        element={
          <ProtectedRoute>
            <CreateCategory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
