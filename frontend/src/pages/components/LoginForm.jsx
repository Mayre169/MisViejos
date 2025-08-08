import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import AlertDialog from './AlertDialog';
import { jwtDecode } from 'jwt-decode';

// Login Component
export default function LoginForm({ onRegisterClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // New state for loading animation
    const [errorMessage, setErrorMessage] = useState(''); // New state for error messages
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // New state for success dialog
    const [successMessage, setSuccessMessage] = useState(''); // New state for success message

    const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: Login, 1: Request Email, 2: Verify Code
    const [emailForRecovery, setEmailForRecovery] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const timerRef = useRef(null);
    const progressBarWidth = (timeLeft / 180) * 100; // Calculate width percentage

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setForgotPasswordStep(1); // Go to email request step
        setErrorMessage(''); // Clear any previous errors
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner
        setErrorMessage(''); // Clear any previous errors
        try {
            // Simulate API call for sending code
            // In a real app: axios.post('/api/send-recovery-code', { email: emailForRecovery });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            console.log(`Simulating sending code to: ${emailForRecovery}`);
            setForgotPasswordStep(2); // Go to verify code step
            setTimeLeft(180); // Reset timer
            // Start the countdown
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } catch (error) {
            setErrorMessage('Error al enviar el código. Por favor, intente de nuevo.');
            console.error('Error sending recovery code:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleCancelRecovery = (e) => {
        e.preventDefault();
        clearInterval(timerRef.current); // Clear timer if active
        setForgotPasswordStep(0); // Go back to login
        setEmailForRecovery(''); // Clear email
        setErrorMessage(''); // Clear any previous errors
    };

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Función para almacenar los tokens de forma segura
    const storeTokens = (accessToken, refreshToken) => {
        // Para el Access Token: idealmente en memoria o sessionStorage para menor riesgo de XSS.
        // Si la aplicación se cierra, se pierde.
        sessionStorage.setItem('accessToken', accessToken);

        // Para el Refresh Token: en localStorage o una cookie httpOnly.
        // localStorage es más fácil, pero con precaución (vulnerable a XSS si no hay buenas prácticas de seguridad en el frontend).
        localStorage.setItem('refreshToken', refreshToken);

        // Opcional: Configurar Axios para enviar el Access Token por defecto
        // Esto es crucial para todas las solicitudes subsiguientes a APIs protegidas.
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    };

    // Función para obtener el Access Token almacenado
    const getAccessToken = () => {
        return sessionStorage.getItem('accessToken');
    };

    // Función para obtener el Refresh Token almacenado
    const getRefreshToken = () => {
        return localStorage.getItem('refreshToken');
    };

    // Función para eliminar los tokens al cerrar sesión
    const clearTokens = () => {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization']; // Limpia el header de Axios
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner
        setErrorMessage(''); // Clear any previous errors
        setSuccessMessage(''); // Clear previous success message
        setShowSuccessDialog(false); // Hide previous success dialog

        try {
            const res = await axios.post('http://127.0.0.1:8000/users/login/auth', { email: email, password: password });
            if (res.status === 200) {
                setSuccessMessage("Inicio de Sesión Exitoso");
                
                const token = res.data.token
                localStorage.setItem("token", token)
                setShowSuccessDialog(true);

                console.log(res.data.rol)

                if (res.data.rol == "client"){
                    window.location.replace("/dashboard")
                } else {
                    window.location.replace("/no-found")
                }
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    setErrorMessage("Ocurrió un error en la solicitud. Intente nuevamente.");
                } else if (status === 401) {
                    setErrorMessage("Credenciales Inválidas!");
                } else if (status === 404) {
                    setErrorMessage("El usuario ingresado no se encuentra registrado.");
                } else {
                    setErrorMessage("Error del servidor. Por favor, intente más tarde.");
                }
            } else if (error.request) {
                setErrorMessage("Error de red. No se recibió respuesta del servidor.");
            } else {
                setErrorMessage("Error inesperado. Por favor, intente de nuevo.");
            }
            console.error("Login error:", error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-[1.01] hover:shadow-2xl">
            {forgotPasswordStep === 0 && (
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                        INICIO DE SESIÓN
                    </h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        ¿No tienes una cuenta?{" "}
                        <a
                            href="#"
                            onClick={onRegisterClick}
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                            Haz clic aquí
                        </a>
                    </p>
                    <form action="#" method="post" className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    id="login-email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                                    placeholder="tu@ejemplo.com"
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="password"
                                    id="login-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                                    placeholder="••••••••"
                                    onChange={e => setPassword(e.target.value)}
                                />
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
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <LoadingSpinner /> : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <a
                            href="#"
                            onClick={handleForgotPasswordClick}
                            className="font-medium text-indigo-600 hover:text-indigo-500 text-sm transition-colors duration-200"
                        >
                            ¿Has olvidado tu clave?
                        </a>
                    </div>
                </div>
            )}

            {forgotPasswordStep === 1 && (
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                        RECUPERAR CONTRASEÑA
                    </h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Ingresa tu correo electrónico para enviar el código de verificación.
                    </p>
                    <form onSubmit={handleSendCode} className="space-y-6">
                        <div>
                            <label
                                htmlFor="recovery-email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    id="recovery-email"
                                    required
                                    value={emailForRecovery}
                                    onChange={(e) => setEmailForRecovery(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all duration-200"
                                    placeholder="tu@ejemplo.com"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-red-600 text-sm text-center -mt-4 mb-2">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex justify-between space-x-4">
                            <button
                                type="button"
                                onClick={handleCancelRecovery}
                                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                disabled={loading}
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner /> : 'Enviar Código'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {forgotPasswordStep === 2 && (
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                        VERIFICAR CÓDIGO
                    </h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Hemos enviado un código de 6 dígitos a <strong className="text-gray-800">{emailForRecovery}</strong>.
                        Introduce el código a continuación.
                    </p>
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-red-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${progressBarWidth}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2">
                            Tiempo restante: {formatTime(timeLeft)}
                        </p>
                        {timeLeft === 0 && (
                            <p className="text-center text-sm text-red-600 mt-1">El código ha expirado. Puedes volver y solicitar uno nuevo.</p>
                        )}
                    </div>
                    <form action="#" method="post" className="space-y-6">
                        <div>
                            <label
                                htmlFor="verification-code"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Código de Verificación
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text" // Use type text for codes, pattern can be added later
                                    name="verificationCode"
                                    id="verification-code"
                                    required
                                    maxLength="6"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-center tracking-widest transition-all duration-200"
                                    placeholder="------"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-red-600 text-sm text-center -mt-4 mb-2">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex justify-between space-x-4">
                            <button
                                type="button"
                                onClick={handleCancelRecovery}
                                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                // Disable if timer runs out or loading
                                disabled={timeLeft === 0 || loading}
                                className={`w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${timeLeft === 0 || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'} transition-colors duration-200`}
                            >
                                {loading ? <LoadingSpinner /> : 'Verificar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showSuccessDialog && (
                <AlertDialog message={successMessage} onClose={() => setShowSuccessDialog(false)} />
            )}
        </div>
    );
}

