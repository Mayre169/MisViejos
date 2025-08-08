// AuthUser.js (o hooks/useAuthUser.js)
import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';


export default function AuthUser() { // Renombrado a useAuthUser para seguir convenciones de hooks
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error decodificando el token:", error);
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        }
    }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar

    // Retorna los valores que quieres que el componente consumidor use
    return { isAuthenticated };
}