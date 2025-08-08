import React, { useState } from 'react';
import Header from './components/Header';
// Importa axios si lo vas a usar para llamadas a API reales
// import axios from 'axios';

// Asegúrate de que Font Awesome esté cargado en tu index.html o equivalente:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0V4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

// Componente para el Spinner de Carga
const LoadingSpinner = ({ color = 'indigo' }) => (
    <div className="flex justify-center items-center py-4">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${color}-600`}></div>
        <p className="ml-3 text-gray-700">Cargando...</p>
    </div>
);

// Componente para el Diálogo de Alerta
const AlertDialog = ({ title, message, onClose, type = 'success' }) => {
    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const buttonColor = type === 'success' ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 animate-fade-in">
            <div className={`bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in`}>
                <h3 className={`text-xl font-semibold ${textColor} mb-4`}>{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

// Componente de la Página de Contacto
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setDialogMessage('');
        setShowDialog(false);

        // Validaciones básicas del formulario
        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage('Por favor, complete todos los campos.');
            setLoading(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Por favor, introduce un correo electrónico válido.');
            setLoading(false);
            return;
        }

        try {
            // Simular llamada a API para enviar el formulario de contacto
            // Reemplaza esto con tu endpoint real. Ejemplo:
            // const response = await axios.post('YOUR_API_ENDPOINT_HERE', formData);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación de retardo de red

            // Si la llamada a la API fue exitosa:
            setDialogMessage('¡Tu mensaje ha sido enviado exitosamente! Nos pondremos en contacto contigo pronto.');
            setDialogType('success');
            setShowDialog(true);
            setFormData({ name: '', email: '', message: '' }); // Limpiar formulario
        } catch (error) {
            // Manejo de errores de la API
            setErrorMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
            setDialogMessage('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error sending contact form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Header />
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col lg:flex-row">
                {/* Sección de Información de Contacto */}
                <div className="lg:w-1/2 p-8 bg-gray-900 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-4xl font-extrabold mb-6">Contáctanos</h2>
                    <p className="text-lg mb-8">
                        Estamos aquí para ayudarte. Elige la forma que prefieras para comunicarte con nosotros.
                    </p>

                    <div className="w-full max-w-xs mb-8">
                        <h3 className="text-2xl font-semibold mb-4">¿Por qué contactarnos?</h3>
                        <p className="text-base mb-4">
                            Ya sea que tengas preguntas sobre nuestros servicios, necesites soporte técnico, o simplemente quieras saludarnos, nuestro equipo está listo para escucharte. ¡Tu opinión es importante para nosotros!
                        </p>
                    </div>

                    <div className="space-y-6 w-full max-w-xs">
                        {/* WhatsApp usando Font Awesome */}
                        <a
                            href="https://wa.me/584123456789" // Reemplaza con tu número de WhatsApp
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            <i className="fab fa-whatsapp text-2xl mr-3"></i> {/* Icono de WhatsApp de Font Awesome */}
                            WhatsApp
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:info@example.com" // Reemplaza con tu correo electrónico
                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            <i className="fas fa-envelope text-2xl mr-3"></i> {/* Icono de Email de Font Awesome */}
                            Correo Electrónico
                        </a>

                        {/* Teléfono */}
                        <a
                            href="tel:+584123456789" // Reemplaza con tu número de teléfono
                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            <i className="fas fa-phone text-2xl mr-3"></i> {/* Icono de Teléfono de Font Awesome */}
                            Llamar
                        </a>

                        {/* Dirección Física */}
                        <div className="flex items-center justify-center text-white py-3 px-6">
                            <i className="fas fa-map-marker-alt text-2xl mr-3"></i>
                            <p className="text-base">Calle Principal 123, Ciudad, País</p>
                        </div>

                        {/* Horario de Atención */}
                        <div className="flex items-center justify-center text-white py-3 px-6">
                            <i className="fas fa-clock text-2xl mr-3"></i>
                            <p className="text-base">Lunes a Viernes: 9:00 AM - 5:00 PM</p>
                        </div>

                        {/* Redes Sociales */}
                        <div className="flex justify-center space-x-6 mt-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-200 transition-colors duration-200">
                                <i className="fab fa-facebook-f text-3xl"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-200 transition-colors duration-200">
                                <i className="fab fa-twitter text-3xl"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-200 transition-colors duration-200">
                                <i className="fab fa-instagram text-3xl"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-200 transition-colors duration-200">
                                <i className="fab fa-linkedin-in text-3xl"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Sección del Formulario de Contacto */}
                <div className="lg:w-1/2 p-8 lg:p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Envíanos un Mensaje</h3>
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Ej: Juan Pérez"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Ej: tu.correo@ejemplo.com"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Escribe tu mensaje o consulta aquí..."
                                disabled={loading}
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner color="white" /> : 'Enviar Mensaje'}
                            </button>
                        </div>
                    </form>
                    {/* Mapa de Ubicación (Placeholder) */}
                    <div className="mt-8 text-center text-gray-600">
                        <h4 className="text-lg font-semibold mb-2">Encuéntranos en el mapa</h4>
                        <div className="bg-gray-200 rounded-md h-48 flex items-center justify-center text-gray-500 text-sm">
                            [Mapa de ubicación aquí - se puede integrar con Google Maps API]
                        </div>
                    </div>
                </div>
            </div>

            {showDialog && (
                <AlertDialog
                    title={dialogType === 'success' ? 'Mensaje Enviado' : 'Error'}
                    message={dialogMessage}
                    onClose={() => setShowDialog(false)}
                    type={dialogType}
                />
            )}
        </div>
        </>
    );
}
