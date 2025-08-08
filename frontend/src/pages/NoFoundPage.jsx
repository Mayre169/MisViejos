import React from 'react';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform transition-transform duration-500 hover:scale-[1.01] hover:shadow-2xl">
                <div className="flex justify-center mb-6">
                    {/* Icono de exclamación o una ilustración sutil */}
                    <svg
                        className="w-24 h-24 text-indigo-500 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                    </svg>
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    ¡Ups! Página no encontrada.
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Parece que la página que estás buscando no existe o se ha movido.
                </p>
                <div className="space-y-4">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        Volver al Inicio
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        O prueba a buscar algo:
                    </p>
                    <div className="relative mx-auto max-w-sm">
                        <input
                            type="text"
                            placeholder="Buscar en el sitio..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}