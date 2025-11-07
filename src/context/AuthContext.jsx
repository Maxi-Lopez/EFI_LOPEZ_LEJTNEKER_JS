// context/AuthContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import api from "../api";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); 
    
    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser)); // 
          setToken(storedToken);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user"); // 
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // 
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      
      const data = await api.post("/login", { email, password });
      
      const jwtToken = data.access_token || data.token;

      if (!jwtToken) {
        toast.error("No se recibió token del servidor");
        return false;
      }

      localStorage.setItem("token", jwtToken);
      const decoded = jwtDecode(jwtToken);
      
      localStorage.setItem("user", JSON.stringify(decoded));
      
      setUser(decoded);
      setToken(jwtToken);

      toast.success("Inicio de sesión exitoso");
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error);
      toast.error(error.message || "Error en el login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    toast.info("Sesión cerrada");
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};