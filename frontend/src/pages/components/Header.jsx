import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faCartShopping, faCircleUser, faMoon, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import "../../Header.css";
import AuthUser from './authUser';
import UserProfileModal from './UserProfileModal';

// --- Modal Component for Shopping Cart (Central with Blurred Background) ---
function ShoppingCartModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        // The backdrop for blur effect
        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-hidden">
            {/* Blurred background effect */}
            <div className="absolute inset-0 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-md relative z-10 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Tu Carrito</h3>
                <p className="text-gray-600 mb-4">Tu carrito de compras está vacío.</p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                    Ver Carrito Completo
                </button>
            </div>
        </div>
    );
}

// --- Header Component ---
export default function Header({ mode, setMode, type }) {
    const [isCartModalOpen, setCartModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    // Ref for the profile icon to position the modal directly below it
    const profileIconRef = useRef(null);

    function toggleModeDark() {
        setMode(mode === '' ? 'dark-mode' : '');
    }

    // Common header styles
    const baseHeaderClasses = "header flex justify-between items-center px-4 py-3 md:px-8 lg:px-12 rounded-b-xl shadow-md relative z-40"; // Added relative and z-index
    const logoClasses = "logo text-3xl font-bold";
    const iconBaseClasses = "cursor-pointer hover:opacity-75 transition-opacity duration-300";

    // --- Header for Login/Authentication Pages ---
    if (type === 'auth') {
        return (
            <header className={`${baseHeaderClasses} bg-gray-900 text-white`}>
                <a href="/" className="flex items-center space-x-2 text-lg font-medium hover:text-gray-300 transition-colors duration-300">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                    <span>Volver a Inicio</span>
                </a>

                <h1 className="logo text-3xl font-bold">LOGO</h1>

                <div className="relative flex items-center w-64 md:w-80">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-3 pr-10 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute right-3 text-gray-400 text-lg" />
                </div>
            </header>
        );
    }

    // --- Default Header for Home/App Pages ---
    return (
        <>
            <header className={`${baseHeaderClasses} bg-white text-gray-900`}>
                <h1 className={logoClasses}>LOGO</h1>

                {/* Links (hidden on mobile, shown on md and lg) */}
                <nav className="hidden md:flex flex-grow justify-center">
                    <ul className="links flex space-x-6 lg:space-x-12 text-lg">
                        <li><a href="/" className="hover:text-opacity-80 transition-opacity duration-300">Inicio</a></li>
                        <li><a href="#" className="hover:text-opacity-80 transition-opacity duration-300">Categorias</a></li>
                        <li><a href="#" className="hover:text-opacity-80 transition-opacity duration-300">Productos</a></li>
                        <li><a href="/about-us" className="hover:text-opacity-80 transition-opacity duration-300">Sobre Nosotros</a></li>
                        <li><a href="/contact" className="hover:text-opacity-80 transition-opacity duration-300">Contacto</a></li>
                    </ul>
                </nav>

                {/* User Options and Theme Toggle */}
                <div className="options flex items-center space-x-4 text-2xl md:text-3xl">
                    {/* Carrito de compras */}
                    <div className={iconBaseClasses} onClick={() => setCartModalOpen(true)}>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>

                    {/* Perfil de usuario */}
                    <div ref={profileIconRef} className={iconBaseClasses} onClick={() => setProfileModalOpen(true)}>
                        <FontAwesomeIcon icon={faCircleUser} />
                    </div>

                    {/* Toggle de Tema */}
                    <div className={iconBaseClasses} onClick={toggleModeDark}>
                        <FontAwesomeIcon icon={faMoon} />
                    </div>

                    {/* Menú de hamburguesa (visible solo en screen < 768px) */}
                    <div className="menu-burger md:hidden cursor-pointer hover:opacity-75 transition-opacity duration-300">
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                </div>
            </header>

            {/* Modals rendered conditionally based on state */}
            <ShoppingCartModal
                isOpen={isCartModalOpen}
                onClose={() => setCartModalOpen(false)}
            />
            <UserProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                anchorRef={profileIconRef} // Pass the ref to position the modal
            />
        </>
    );
}

// Register Component (no changes, included for completeness)
// ... (Your Register component code here)

// Login Component (no changes, included for completeness)
// ... (Your LoginForm component code here)

// Main Login Page Component (no changes, included for completeness)
// ... (Your LoginPage component code here)