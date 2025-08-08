import { useRef, useState, useEffect } from "react";
import AuthUser from './authUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function GetDataProfile(){
    const [nameUser, setNameUser] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://127.0.0.1:8000/users/profile/data-basic", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNameUser(`Usuario: ${response.data.firstname} ${response.data.lastname}` || "Usuario"); // Ajusta el campo según lo que devuelva tu backend
            } catch (error) {
                console.error("Error al obtener datos del perfil:", error.response?.data || error.message);
            }
        };

        fetchData();
    }, []);


    return (
        <>
         {nameUser}
        </>
    )
}

// modal para el pefil de usurio en el home
export default function UserProfileModal({ isOpen, onClose, anchorRef }) {
    const modalRef = useRef(null);
    const [positionStyle, setPositionStyle] = useState({});
    const { isAuthenticated } = AuthUser();

    // funcion para calcular la posicion adecuada del modal
    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();

            setPositionStyle({
                position: 'absolute',
                top: `${rect.bottom + 10}px`,
                right: `${window.innerWidth - rect.right}px`, 
                zIndex: 60, 
            });
        }
    }, [isOpen, anchorRef]);

    // funcion para cerrar el modal cuando se presione por fuera del contenedor
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target) && anchorRef.current && !anchorRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);


    if (!isOpen) return null;

    const handleCloseSession = (e) => {
        localStorage.removeItem("token")
        //window.location.replace('/login')
    }

    

    return (
        <div
            ref={modalRef}
            style={positionStyle}
            className="bg-white p-4 rounded-lg shadow-xl w-64 transform transition-all duration-200 opacity-0 scale-95 animate-scale-in-fast origin-top-right"
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
                <FontAwesomeIcon icon={faTimes} className="text-md" />
            </button>
            {isAuthenticated === true && (
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-1">¡Hola de nuevo!</h3>
                    <p className="text-gray-600 mb-4 text-sm">{<GetDataProfile />}</p>
                    <a href="/login">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm" onClick={handleCloseSession}>
                            Cerrar Sesion
                        </button>
                    </a> 
                </div>
            )}

            {isAuthenticated === false && (
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-1">¡Hola de nuevo!</h3>
                    <p className="text-gray-600 mb-4 text-sm">Parece que no has iniciado sesión.</p>
                    <a href="/login">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm">
                            Iniciar Sesión
                        </button>
                    </a>
                </div>
            )}
            
        </div>
    );
}