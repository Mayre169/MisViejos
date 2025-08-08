import React, { useState, useEffect, use } from 'react';
import Header from './components/Header';
import axios from 'axios';
// Reutilizamos los componentes de utilidades para carga y diálogos
// Puedes guardarlos en un archivo separado como 'components/Utils.js'
import LoadingSpinner from './components/LoadingSpinnerDashboard';
import AlertDialog from './components/AlertDialogDashboard';

// Componentes de las Pestañas del Dashboard
// ------------------------------------------

// 1. Componente de Información Personal
import PersonalInfo from './components/PersonalInfo';

// 2. Componente de Historial de Compras
import OrderHistory from './components/OrderHistory';

// 3. Componente de Libreta de Direcciones
import AddressBook from './components/AddressBook';

// 4. Nuevo Componente: Lista de Deseos
import Wishlist from './components/Wishlist';


// 5. Componente de Ajustes de Cuenta (renumerado)
import AccountSettings from './components/AccountSettings';

// 6. Componente de Dashboard Principal (el "page")
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('personalInfo'); // Estado para la pestaña activa

    // Datos de ejemplo para el usuario (se cargarían desde la API en un entorno real)
    const [user, setUser] = useState({
        firstname: 'Juan',
        lastname: 'Pérez',
        email: 'juan.perez@example.com',
        birthdate: '1990-05-15',
        phone: '123-456-7890',
        profilePicture: 'https://placehold.co/150x150/aabbcc/ffffff?text=JP',
        // addressState: 'Carabobo',
        // addressMunicipality: 'Valencia',
        // addressParish: 'San José',
        // addressFullAddress: 'Calle Principal, Casa #10, Urb. El Sol, Edificio A, Piso 3'
    });
    const [orders, setOrders] = useState([
        { id: 'ORD001', date: '2023-01-10', total: 120.50, status: 'Entregado' },
        { id: 'ORD002', date: '2023-02-20', total: 75.00, status: 'Pendiente' },
        { id: 'ORD003', date: '2023-03-05', total: 200.00, status: 'Enviado' },
    ]);
    const [addresses, setAddresses] = useState([
        { id: 1, street: 'Calle Falsa 123', city: 'Springfield', state: 'IL', zip: '62701', country: 'USA' },
        { id: 2, street: 'Avenida Siempre Viva 742', city: 'Springfield', state: 'IL', zip: '62701', country: 'USA' },
    ]);
    // Datos de ejemplo para la lista de deseos
    const [wishlistItems, setWishlistItems] = useState([
        { id: 101, name: 'Auriculares Inalámbricos XYZ', price: 89.99, image: 'https://placehold.co/100x100/FF5733/FFFFFF?text=Auriculares' },
        { id: 102, name: 'Smartwatch Deportivo', price: 199.99, image: 'https://placehold.co/100x100/33FF57/FFFFFF?text=Smartwatch' },
        { id: 103, name: 'Cámara Mirrorless 4K', price: 799.00, image: 'https://placehold.co/100x100/3357FF/FFFFFF?text=Camara' },
    ]);

    // Funciones para manejar la lógica de datos
    const handleUpdateUser = (updatedUser) => setUser(updatedUser);
    const handleAddAddress = (newAddress) => setAddresses([...addresses, newAddress]);
    const handleEditAddress = (updatedAddress) => setAddresses(addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    const handleDeleteAddress = (id) => setAddresses(addresses.filter(addr => addr.id !== id));
    
    const handleRemoveFromWishlist = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    const handleAddToCartFromWishlist = (item) => {
        console.log(`Añadiendo ${item.name} al carrito...`);
        // Aquí iría la lógica real para añadir al carrito
        // y quizás una notificación al usuario de que se añadió.
    };
    
    // Función para manejar la eliminación de la cuenta y redirigir
    const handleAccountDeletion = () => {
        // En un entorno real, aquí redirigirías al usuario o cerrarías la sesión
        console.log('¡Cuenta eliminada! Redirigiendo al inicio...');
        // Por ejemplo, podrías usar el enrutador de tu aplicación (como `router.push('/login')`)
        // o simplemente recargar la página.
        window.location.href = '/'; // Redirección simple para el ejemplo
    };

    return (
        <>
        <Header />
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="lg:flex">
                    {/* Sidebar de Navegación */}
                    <div className="w-full lg:w-1/4 bg-gray-800 text-white p-6">
                        <h2 className="text-3xl font-bold mb-8">Mi Cuenta</h2>
                        <nav>
                            <ul>
                                <li className="mb-4">
                                    <button
                                        onClick={() => setActiveTab('personalInfo')}
                                        className={`w-full text-left py-3 px-4 rounded-md text-lg font-medium transition-colors duration-200 ${activeTab === 'personalInfo' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                                    >
                                        Datos Personales
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => setActiveTab('orderHistory')}
                                        className={`w-full text-left py-3 px-4 rounded-md text-lg font-medium transition-colors duration-200 ${activeTab === 'orderHistory' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                                    >
                                        Historial de Compras
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => setActiveTab('addressBook')}
                                        className={`w-full text-left py-3 px-4 rounded-md text-lg font-medium transition-colors duration-200 ${activeTab === 'addressBook' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                                    >
                                        Libreta de Direcciones
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => setActiveTab('wishlist')}
                                        className={`w-full text-left py-3 px-4 rounded-md text-lg font-medium transition-colors duration-200 ${activeTab === 'wishlist' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                                    >
                                        Favoritos
                                    </button>
                                </li>
                                <li className="mb-4">
                                    <button
                                        onClick={() => setActiveTab('accountSettings')}
                                        className={`w-full text-left py-3 px-4 rounded-md text-lg font-medium transition-colors duration-200 ${activeTab === 'accountSettings' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                                    >
                                        Ajustes de Cuenta
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Contenido Principal del Dashboard */}
                    <div className="w-full lg:w-3/4 p-6 bg-gray-50">
                        {activeTab === 'personalInfo' && <PersonalInfo user={user} onUpdate={handleUpdateUser} />}
                        {activeTab === 'orderHistory' && <OrderHistory orders={orders} />}
                        {activeTab === 'addressBook' && <AddressBook addresses={addresses} onAdd={handleAddAddress} onEdit={handleEditAddress} onDelete={handleDeleteAddress} />}
                        {activeTab === 'wishlist' && <Wishlist wishlistItems={wishlistItems} onRemoveFromWishlist={handleRemoveFromWishlist} onAddToCart={handleAddToCartFromWishlist} />}
                        {activeTab === 'accountSettings' && <AccountSettings onDeleteAccount={handleAccountDeletion} />}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
