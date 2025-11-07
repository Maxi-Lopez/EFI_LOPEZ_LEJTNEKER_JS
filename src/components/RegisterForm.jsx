import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../api'  
import "../styles/RegisterForm.css"

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string().required("Role is required")
})

const roleOptions = [
    { label: 'Usuario', value: 'user' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Moderador', value: 'moderator' }
]

export default function RegisterForm() {
    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: "user"  
            }

            const data = await api.post('/register', payload)

            toast.success(`Usuario registrado exitosamente`)
            resetForm()
            setTimeout(() => navigate('/'), 1500)
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.errors || 
                               error.message;
            toast.error(`Error en registro: ${errorMessage}`)
        }
    }

    return (
        <div className='register-container'>
            <h2>Crear Cuenta</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '', role: 'user' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Nombre</label>
                            <Field as={InputText} name='name' />
                            <ErrorMessage name='name' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Email</label>
                            <Field as={InputText} name='email' />
                            <ErrorMessage name='email' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Contraseña</label>
                            <Field as={InputText} name='password' type='password' />
                            <ErrorMessage name='password' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Rol</label>
                            <Field 
                                as={Dropdown} 
                                name="role" 
                                options={roleOptions}
                                placeholder="Selecciona un rol"
                                className="role-dropdown"
                            />
                            <small style={{ color: '#666', fontStyle: 'italic', marginTop: '5px' }}>
                                * Por seguridad, todos los usuarios se registran como "Usuario"
                            </small>
                        </div>
                        <div className='form-buttons' style={{ display: 'flex', gap: '1rem' }}>
                            <Button 
                                type='submit' 
                                label={isSubmitting ? "Registrando..." : "Registrarse"} 
                                disabled={isSubmitting}
                            />
                            <Button 
                                type='button' 
                                label="Cancelar" 
                                className='p-button-secondary' 
                                onClick={() => navigate('/')} 
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}