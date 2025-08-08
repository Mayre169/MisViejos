import { useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import AlertDialog from "./AlertDialog";

// Register Component
export default function Register({ onLoginClick }) {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [birthdate, setBirthdate] = useState('');

    const [loading, setLoading] = useState(false); // State for loading animation
    const [errorMessage, setErrorMessage] = useState(''); // State for general API errors
    const [validationErrors, setValidationErrors] = useState({}); // State for field-specific validation errors
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // State for success dialog
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Formato de correo electrónico inválido.';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (password.length < 8 || password.length > 16) {
            return 'La contraseña debe tener entre 8 y 16 caracteres.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        }
        if (!/[a-z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra minúscula.';
        }
        if (!/[0-9]/.test(password)) {
            return 'La contraseña debe contener al menos un número.';
        }
        return '';
    };

    const validateName = (name, fieldName) => {
        if (name.length < 3 || name.length > 20) {
            return `${fieldName} debe tener entre 3 y 20 caracteres.`;
        }
        return '';
    };

    const validateBirthdate = (dateString) => {
        if (!dateString) {
            return 'La fecha de nacimiento es requerida.';
        }
        const birthDate = new Date(dateString);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            // Adjust age if birthday hasn't occurred yet this year
            return 'Fecha de nacimiento inválida.';
        }
        return '';
    };


    const handleNext = (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear general errors
        setValidationErrors({}); // Clear field-specific errors

        const errors = {};

        // Validate Email
        const emailError = validateEmail(email);
        if (emailError) errors.email = emailError;

        // Validate Password
        const passwordError = validatePassword(password);
        if (passwordError) errors.password = passwordError;

        // Validate Confirm Password
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setStep(2); // Proceed to next step only if no errors
        }
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner
        setErrorMessage(''); // Clear general errors
        setValidationErrors({}); // Clear field-specific errors
        setSuccessMessage(''); // Clear previous success message
        setShowSuccessDialog(false); // Hide previous success dialog

        const errors = {};

        // Validate First Name
        const firstnameError = validateName(firstname, 'El nombre');
        if (firstnameError) errors.firstname = firstnameError;

        // Validate Last Name
        const lastnameError = validateName(lastname, 'El apellido');
        if (lastnameError) errors.lastname = lastnameError;

        // Validate Birthdate
        const birthdateError = validateBirthdate(birthdate);
        if (birthdateError) errors.birthdate = birthdateError;

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setLoading(false); // Hide loading spinner if validation fails
            return; // Stop submission
        }

        let idSecurity = null;

        try {
            // First API call: Register auth security
            const authRes = await axios.post('http://127.0.0.1:8000/users/register/auth', { password: password });

            if (authRes.status === 201) {
                idSecurity = authRes.data.id;
                console.log("Auth Security ID:", idSecurity);

                // Second API call: Register user details
                const userRes = await axios.post('http://127.0.0.1:8000/users/register/', {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    birthdate: birthdate, // Include birthdate in the payload
                    auth_security: idSecurity
                });

                if (userRes.status === 201) {
                    setSuccessMessage("Usuario registrado exitosamente.");
                    setShowSuccessDialog(true);
                    // The onLoginClick will be triggered when the dialog is closed
                }
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    setErrorMessage("Ocurrió un error en la solicitud. Verifique los datos e intente nuevamente.");
                } else if (status === 409) { // Assuming 409 for conflict (e.g., email already registered)
                    setErrorMessage("El correo electrónico ya está registrado.");
                } else {
                    setErrorMessage(`Error del servidor (${status}). Por favor, intente más tarde.`);
                }
            } else if (error.request) {
                setErrorMessage("Error de red. No se recibió respuesta del servidor.");
            } else {
                setErrorMessage("Error inesperado. Por favor, intente de nuevo.");
            }
            console.error("Registration error:", error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    // Function to handle closing the success dialog and redirecting to login
    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false); // Hide the dialog
        onLoginClick(); // Call the prop function to switch to login form
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-[1.01] hover:shadow-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                REGISTRO
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
                ¿Ya tienes una cuenta?{" "}
                <a
                    href="#"
                    onClick={onLoginClick}
                    className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                    Inicia sesión aquí
                </a>
            </p>

            {step === 1 && (
                <form onSubmit={handleNext} className="space-y-6 animate-fade-in">
                    <div>
                        <label
                            htmlFor="register-email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Correo electrónico
                        </label>
                        <div className="mt-1">
                            <input
                                type="email"
                                name="email"
                                id="register-email"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200`}
                                placeholder="tu@ejemplo.com"
                                onChange={(e) => { setEmail(e.target.value); setValidationErrors({ ...validationErrors, email: '' }); }}
                            />
                            {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="register-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                name="password"
                                id="register-password"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200`}
                                placeholder="••••••••"
                                onChange={(e) => { setPassword(e.target.value); setValidationErrors({ ...validationErrors, password: '' }); }}
                            />
                            {validationErrors.password && <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>}
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirmar Contraseña
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirm-password"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200`}
                                placeholder="••••••••"
                                onChange={(e) => { setConfirmPassword(e.target.value); setValidationErrors({ ...validationErrors, confirmPassword: '' }); }}
                            />
                            {validationErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>}
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="text-red-600 text-sm text-center -mt-4 mb-2">
                            {errorMessage}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : 'Siguiente'}
                        </button>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmitRegister} className="space-y-6 animate-fade-in">
                    <div>
                        <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nombre
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="firstName"
                                id="first-name"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${validationErrors.firstname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200`}
                                placeholder="Tu nombre"
                                onChange={(e) => { setFirstname(e.target.value); setValidationErrors({ ...validationErrors, firstname: '' }); }}
                            />
                            {validationErrors.firstname && <p className="mt-1 text-sm text-red-600">{validationErrors.firstname}</p>}
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Apellido
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="lastName"
                                id="last-name"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${validationErrors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200`}
                                placeholder="Tu apellido"
                                onChange={(e) => { setLastname(e.target.value); setValidationErrors({ ...validationErrors, lastname: '' }); }}
                            />
                            {validationErrors.lastname && <p className="mt-1 text-sm text-red-600">{validationErrors.lastname}</p>}
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Fecha de Nacimiento
                        </label>
                        <div className="mt-1">
                            <input
                                type="date"
                                name="dob"
                                id="dob"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${validationErrors.birthdate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200`}
                                onChange={(e) => { setBirthdate(e.target.value); setValidationErrors({ ...validationErrors, birthdate: '' }); }}
                            />
                            {validationErrors.birthdate && <p className="mt-1 text-sm text-red-600">{validationErrors.birthdate}</p>}
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="text-red-600 text-sm text-center -mt-4 mb-2">
                            {errorMessage}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : 'Registrar'}
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => { setStep(1); setErrorMessage(''); setValidationErrors({}); }}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            Volver
                        </button>
                    </div>
                </form>
            )}

            {showSuccessDialog && (
                <AlertDialog message={successMessage} onClose={handleSuccessDialogClose} />
            )}
        </div>
    );
}
