import { useState } from "react";
import axios from "axios";
import AlertDialog from "./AlertDialogDashboard";
import LoadingSpinner from "./LoadingSpinnerDashboard";

const AccountSettings = ({ onDeleteAccount }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

    const handleChangePassword = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                setErrorMessage(passwordError);
                setLoading(false);
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setErrorMessage('Las nuevas contraseñas no coinciden.');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            const response = await axios.patch('http://127.0.0.1:8000/users/profile/change-password', {
                password: newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setDialogMessage('¡Tu contraseña ha sido cambiada exitosamente!');
                setDialogType('success');
                setShowDialog(true);
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error) {
            setErrorMessage('Error al cambiar la contraseña. Inténtalo de nuevo.');
            setDialogMessage(error.response?.data?.message || 'Error al cambiar la contraseña. Por favor, intente de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error changing password:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setShowDeleteConfirmation(false); // Oculta el modal de confirmación
        setLoading(true);
        setErrorMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Aquí iría tu llamada axios.delete('/api/user/delete-account');
            setDialogMessage('¡Tu cuenta ha sido eliminada exitosamente! Serás redirigido.');
            setDialogType('success');
            setShowDialog(true);
            // La redirección debe ocurrir después de que el usuario vea el mensaje
            setTimeout(onDeleteAccount, 2000); // Llama a la función de redirección después de 2 segundos
        } catch (error) {
            setErrorMessage('Error al eliminar la cuenta. Inténtalo de nuevo.');
            setDialogMessage('Error al eliminar la cuenta. Por favor, intente de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error deleting account:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ajustes de Cuenta</h3>

            {/* Sección de Cambio de Contraseña */}
            <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Cambiar Contraseña</h4>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input type="password" name="newPassword" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                        <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    <div className="flex justify-end mt-4">
                        <button onClick={handleChangePassword} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200" disabled={loading}>
                            {loading ? <LoadingSpinner color="white" /> : 'Cambiar Contraseña'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección de Eliminar Cuenta */}
            <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <h4 className="text-lg font-medium text-red-800 mb-3">Eliminar Cuenta</h4>
                <p className="text-sm text-red-700 mb-4">Esta acción es irreversible. Todos tus datos y historial de compras serán eliminados permanentemente.</p>
                <div className="flex justify-end">
                    <button onClick={() => setShowDeleteConfirmation(true)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200">Eliminar Cuenta</button>
                </div>
            </div>

            {showDeleteConfirmation && (
                <AlertDialog
                    title="Confirmar Eliminación"
                    message="¿Estás absolutamente seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos."
                    onClose={() => setShowDeleteConfirmation(false)} // Permite cerrar el modal sin eliminar
                    onConfirm={handleDeleteAccount} // Llama a la función de eliminación cuando se confirma
                    type="error"
                />
            )}
            {showDialog && <AlertDialog title={dialogType === 'success' ? 'Éxito' : 'Error'} message={dialogMessage} onClose={() => setShowDialog(false)} type={dialogType} />}
        </div>
    );
};

export default AccountSettings;