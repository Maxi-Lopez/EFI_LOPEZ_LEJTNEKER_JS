import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Email es obligatorio"),
  password: Yup.string().required("Contraseña obligatoria"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const success = await login(values.email, values.password);
    
    if (success) {
      resetForm();
      toast.success("🎉 ¡Login exitoso! Redirigiendo...");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="tech-background">
        <div className="tech-grid"></div>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          <ProgressSpinner style={{ width: "60px", height: "60px" }} />
          <p style={{ color: "var(--text-secondary)" }}>Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tech-background">
      <div className="tech-grid"></div>
      <div className="login-container fade-in">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ 
            fontSize: "3rem", 
            marginBottom: "1rem",
            background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🔐
          </div>
          <h2>Iniciar Sesión</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Accede a tu cuenta para continuar
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="login-form">
              <div className="form-field">
                <label>
                  <i className="pi pi-envelope" style={{ marginRight: "0.5rem" }}></i>
                  Email
                </label>
                <Field 
                  as={InputText} 
                  name="email" 
                  placeholder="tu@email.com"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="email" component="small" className="error" />
              </div>

              <div className="form-field">
                <label>
                  <i className="pi pi-lock" style={{ marginRight: "0.5rem" }}></i>
                  Contraseña
                </label>
                <Field 
                  as={InputText} 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="password" component="small" className="error" />
              </div>

              <div style={{ marginTop: "2rem" }}>
                <Button
                  type="submit"
                  label={isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                  className="tech-button"
                  disabled={isSubmitting}
                  style={{ width: "100%" }}
                  icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                />
              </div>
            </Form>
          )}
        </Formik>

        <div style={{ 
          marginTop: "2rem", 
          padding: "1.5rem",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "var(--radius-md)",
          textAlign: "center"
        }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            ¿No tienes una cuenta?
          </p>
          <Button
            type="button"
            label="Crear Cuenta"
            className="tech-button-outlined"
            style={{ 
              width: "100%",
              borderColor: "var(--neon-purple)",
              color: "var(--neon-purple)"
            }}
            onClick={() => navigate("/register")}
            icon="pi pi-user-plus"
          />
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Button
            type="button"
            label="Volver al Inicio"
            className="p-button-text"
            style={{ color: "var(--text-muted)" }}
            onClick={() => navigate("/")}
            icon="pi pi-arrow-left"
          />
        </div>

        <div style={{ 
          marginTop: "2rem",
          padding: "1rem",
          background: "rgba(67, 233, 123, 0.1)",
          border: "1px solid rgba(67, 233, 123, 0.3)",
          borderRadius: "var(--radius-md)",
          textAlign: "center"
        }}>
          <p style={{ 
            color: "var(--neon-green)", 
            fontSize: "0.9rem",
            margin: 0
          }}>
            <i className="pi pi-info-circle" style={{ marginRight: "0.5rem" }}></i>
            Usa cualquier cuenta registrada para ingresar
          </p>
        </div>
      </div>
    </div>
  );
}