import { useState, useEffect } from "react";
import AlertDialog from "./AlertDialogDashboard";
import LoadingSpinner from "./LoadingSpinnerDashboard";

const AddressBook = ({ addresses, onAdd, onEdit, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({ street: '', city: '', state: '', zip: '', country: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');
    const [userAddresses, setUserAddresses] = useState([]);

    useEffect(() => {
        const getAddresses = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://127.0.0.1:8000/users/profile/addresses", { // Asumiendo que este es el endpoint para las direcciones
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserAddresses(response.data.addresses); // Asumiendo que la API devuelve un array de direcciones
            } catch (error) {
                if (error.status == 404){
                    console.error("Error al obtener las direcciones:", error.code);
                } 
                else if (error.status == 401){
                    console.error('Autorizacion denegada:', error.code);
                } else {
                    console.error("Error al obtener las direcciones:", error.response?.data || error.message);
                }
            }
        };

        getAddresses();
    }, []);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (editingAddress) {
                onEdit({ ...editingAddress, ...formData });
                setDialogMessage('¡Dirección actualizada exitosamente!');
            } else {
                onAdd({ id: Date.now(), ...formData });
                setDialogMessage('¡Nueva dirección agregada exitosamente!');
            }
            setDialogType('success');
            setShowDialog(true);
            setIsAdding(false);
            setEditingAddress(null);
            setFormData({ street: '', city: '', state: '', zip: '', country: '' });
        } catch (error) {
            setErrorMessage('Error al guardar la dirección. Inténtalo de nuevo.');
            setDialogMessage('Error al guardar la dirección. Por favor, intente de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error saving address:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setFormData(address);
        setIsAdding(true);
    };

    const handleDeleteClick = async (id) => {
        setLoading(true);
        setErrorMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onDelete(id);
            setDialogMessage('¡Dirección eliminada exitosamente!');
            setDialogType('success');
            setShowDialog(true);
        } catch (error) {
            setErrorMessage('Error al eliminar la dirección. Inténtalo de nuevo.');
            setDialogMessage('Error al eliminar la dirección. Por favor, intente de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error deleting address:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Libreta de Direcciones</h3>
            
            {/* Mostrar la dirección principal del usuario */}
            <div className="border border-gray-200 p-4 rounded-md shadow-sm mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Dirección Principal</h4>
                <p className="text-gray-700">{userAddresses || 'No tienes una dirección principal guardada.'}</p>
            </div>

            <button onClick={() => { setIsAdding(true); setEditingAddress(null); setFormData({ street: '', city: '', state: '', zip: '', country: '' }); }} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">Agregar Nueva Dirección</button>

            {isAdding && (
                <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3">
                    <h4 className="text-lg font-medium text-gray-800">{editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}</h4>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Calle y Número</label>
                        <input type="text" name="street" id="street" value={formData.street} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input type="text" name="city" id="city" value={formData.city} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado/Provincia</label>
                        <input type="text" name="state" id="state" value={formData.state} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Código Postal</label>
                        <input type="text" name="zip" id="zip" value={formData.zip} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                        <input type="text" name="country" id="country" value={formData.country} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button onClick={() => { setIsAdding(false); setEditingAddress(null); setErrorMessage(''); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">Cancelar</button>
                        <button onClick={handleSaveAddress} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200" disabled={loading}>
                            {loading ? <LoadingSpinner color="white" /> : 'Guardar Dirección'}
                        </button>
                    </div>
                </div>
            )}

            {userAddresses.length === 0 && !isAdding ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No tienes direcciones guardadas.</p>
                    <p className="text-gray-500">¡Registra tu primera dirección para facilitar tus compras!</p>
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {userAddresses.map(address => (
                        <div key={address.id} className="border border-gray-200 p-4 rounded-md shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">{address.street}</p>
                                <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                                <p className="text-sm text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEditClick(address)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Editar</button>
                                <button onClick={() => handleDeleteClick(address.id)} className="text-red-600 hover:text-red-900 text-sm font-medium" disabled={loading}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showDialog && <AlertDialog title={dialogType === 'success' ? 'Éxito' : 'Error'} message={dialogMessage} onClose={() => setShowDialog(false)} type={dialogType} />}
        </div>
    );
};

export default AddressBook;