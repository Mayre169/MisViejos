import { useState } from "react";
import AlertDialog from "./AlertDialogDashboard";
import LoadingSpinner from "./LoadingSpinnerDashboard";

const Wishlist = ({ wishlistItems, onRemoveFromWishlist, onAddToCart }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');

    const handleRemove = async (id) => {
        setLoading(true);
        setErrorMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simular API call
            onRemoveFromWishlist(id);
            setDialogMessage('¡Producto eliminado de la lista de deseos!');
            setDialogType('success');
            setShowDialog(true);
        } catch (error) {
            setErrorMessage('Error al eliminar producto.');
            setDialogMessage('Error al eliminar producto de la lista de deseos. Inténtalo de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error removing from wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCartClick = async (item) => {
        setLoading(true);
        setErrorMessage('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
            onAddToCart(item); // Lógica para añadir al carrito
            setDialogMessage(`¡"${item.name}" añadido al carrito!`);
            setDialogType('success');
            setShowDialog(true);
            onRemoveFromWishlist(item.id); // Opcional: remover de la wishlist al añadir al carrito
        } catch (error) {
            setErrorMessage('Error al añadir al carrito.');
            setDialogMessage('Error al añadir el producto al carrito. Inténtalo de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error adding to cart from wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Lista de Deseos</h3>
            {wishlistItems.length === 0 ? (
                <p className="text-gray-600">Tu lista de deseos está vacía. ¡Explora nuestros productos!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h4>
                                <p className="text-gray-700 text-xl font-bold mb-2">${item.price.toFixed(2)}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <button
                                        onClick={() => handleAddToCartClick(item)}
                                        className="flex-1 mr-2 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner color="white" /> : 'Añadir al Carrito'}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="px-3 py-2 text-red-600 border border-red-300 rounded-md text-sm font-medium hover:bg-red-50 transition-colors duration-200"
                                        disabled={loading}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showDialog && <AlertDialog title={dialogType === 'success' ? 'Éxito' : 'Error'} message={dialogMessage} onClose={() => setShowDialog(false)} type={dialogType} />}
        </div>
    );
};

export default Wishlist;