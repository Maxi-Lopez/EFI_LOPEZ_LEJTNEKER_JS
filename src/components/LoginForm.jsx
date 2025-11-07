import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Usa el hook personalizado
import "../styles/RegisterForm.css";

const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Email es obligatorio"),
  password: Yup.string().required("Contraseña obligatoria"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth(); // ✅ Usa el hook personalizado

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("📝 Formulario enviado:", values);
    
    const success = await login(values.email, values.password);
    console.log("✅ Resultado del login:", success);
    
    if (success) {
      resetForm();
      setTimeout(() => navigate("/dashboard"), 1500);
    }
    setSubmitting(false);
  };

  // ✅ Loading state si es necesario
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="register-container">
      <h2>Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <div className="form-field">
              <label>Email</label>
              <Field as={InputText} name="email" />
              <ErrorMessage name="email" component="small" className="error" />
            </div>
            <div className="form-field">
              <label>Contraseña</label>
              <Field as={InputText} name="password" type="password" />
              <ErrorMessage name="password" component="small" className="error" />
            </div>
            <div className="form-buttons" style={{ display: "flex", gap: "1rem" }}>
              <Button
                type="submit"
                label={isSubmitting ? "Iniciando sesión..." : "Login"}
                className="p-button-secondary"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                label="Cancel"
                className="p-button-secondary"
                onClick={() => navigate("/")}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}