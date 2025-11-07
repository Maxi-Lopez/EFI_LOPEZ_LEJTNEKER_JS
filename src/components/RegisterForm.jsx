import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../api'  

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
    role: Yup.string().required("El rol es obligatorio")
})

const roleOptions = [
    { label: '👤 Usuario', value: 'user' },
    { label: '🛡️ Administrador', value: 'admin' },
    { label: '⚡ Moderador', value: 'moderator' }
]

export default function RegisterForm() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: "user"  
            }

            const data = await api.post('/register', payload)

            toast.success('🎉 ¡Usuario registrado exitosamente!')
            resetForm()
            setTimeout(() => navigate('/dashboard'), 1500)
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.errors || 
                               error.message;
            toast.error(`❌ Error en registro: ${errorMessage}`)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="tech-background">
            <div className="tech-grid"></div>
            <div className="register-container fade-in">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ 
                        fontSize: "3rem", 
                        marginBottom: "1rem",
                        background: "linear-gradient(45deg, var(--neon-cyan), var(--neon-pink))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>
                        🚀
                    </div>
                    <h2>Crear Cuenta</h2>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                        Únete a nuestra comunidad tecnológica
                    </p>
                </div>

                <Formik
                    initialValues={{ name: '', email: '', password: '', role: 'user' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values }) => (
                        <Form className="register-form">
                            <div className="form-field">
                                <label>
                                    <i className="pi pi-user" style={{ marginRight: "0.5rem" }}></i>
                                    Nombre Completo
                                </label>
                                <Field 
                                    as={InputText} 
                                    name="name" 
                                    placeholder="Ingresa tu nombre completo"
                                    style={{ width: "100%" }}
                                />
                                <ErrorMessage name="name" component="small" className="error" />
                            </div>

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
                                    placeholder="Mínimo 6 caracteres"
                                    style={{ width: "100%" }}
                                />
                                <ErrorMessage name="password" component="small" className="error" />
                            </div>

                            <div className="form-field">
                                <label>
                                    <i className="pi pi-shield" style={{ marginRight: "0.5rem" }}></i>
                                    Tipo de Cuenta
                                </label>
                                <Field 
                                    as={Dropdown} 
                                    name="role" 
                                    options={roleOptions}
                                    placeholder="Selecciona un tipo de cuenta"
                                    style={{ width: "100%" }}
                                />
                                <small style={{ 
                                    color: 'var(--text-muted)', 
                                    fontStyle: 'italic', 
                                    marginTop: '8px',
                                    display: 'block'
                                }}>
                                    <i className="pi pi-info-circle" style={{ marginRight: "0.5rem" }}></i>
                                    Por seguridad, todas las cuentas se crean como "Usuario"
                                </small>
                            </div>

                            <div style={{ marginTop: "2rem" }}>
                                <Button 
                                    type="submit" 
                                    label={isSubmitting ? "Creando cuenta..." : "Crear Cuenta"} 
                                    className="tech-button"
                                    disabled={isSubmitting}
                                    style={{ width: "100%" }}
                                    icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
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
                        ¿Ya tienes una cuenta?
                    </p>
                    <Button 
                        type="button" 
                        label="Iniciar Sesión" 
                        className="tech-button-outlined"
                        style={{ 
                            width: "100%",
                            borderColor: "var(--neon-cyan)",
                            color: "var(--neon-cyan)"
                        }}
                        onClick={() => navigate("/login")}
                        icon="pi pi-sign-in"
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

                {/* Security notice */}
                <div style={{ 
                    marginTop: "2rem",
                    padding: "1rem",
                    background: "rgba(102, 126, 234, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center"
                }}>
                    <p style={{ 
                        color: "var(--neon-blue)", 
                        fontSize: "0.9rem",
                        margin: 0
                    }}>
                        <i className="pi pi-shield" style={{ marginRight: "0.5rem" }}></i>
                        Tus datos están protegidos con encriptación avanzada
                    </p>
                </div>
            </div>
        </div>
    )
}