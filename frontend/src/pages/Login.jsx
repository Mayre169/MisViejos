import { useState } from 'react';
import Header from "./components/Header";
import LoginForm from './components/LoginForm';
import Register from './components/RegisterForm';

// Main Login Page Component
export default function LoginPage() {
    const [showRegister, setShowRegister] = useState(false);

    const handleLoginClick = (e) => {
        e.preventDefault();
        setShowRegister(false);
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        setShowRegister(true);
    };

    return (
        <>
            <Header type="auth" />
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8 space-x-8">
                {showRegister ? (
                    <Register onLoginClick={handleLoginClick} />
                ) : (
                    <LoginForm onRegisterClick={handleRegisterClick} />
                )}
            </div>
        </>
    );
}