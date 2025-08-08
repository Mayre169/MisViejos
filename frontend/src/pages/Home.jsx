import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavigationBarHome from "./components/NavigationBarHome";
import FeaturedCategoriesHome from "./components/FeaturedCategoriesHome";
import FeaturedProductsHome from "./components/FeaturedProductsHome";
import '../App.css';

export default function Home() {
    const [modeDark, setModeDark] = useState('');

    return (
        <>

            <div className={`bg-indigo-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-500 ${modeDark}`}>
                <Header mode={modeDark} setMode={setModeDark} type="home" />

                {/* Hero Section */}
                <main className="flex-grow">
                    <div className="relative text-center bg-white dark:bg-gray-800 overflow-hidden h-[80vh]">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white animate-fade-in-down">
                                Bienvenido a la Tienda <span className="text-indigo-600 dark:text-indigo-400">Mis Viejos</span>
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fade-in-up">
                                Aquí podrás buscar y comprar lo que necesites, ¡descubre nuestros productos!
                            </p>
                            {/* Navigation Bar - Centrada */}
                            <div className="animate-fade-in-up animation-delay-200 flex justify-center">
                                <NavigationBarHome />
                            </div>
                        </div>
                    </div>

                    {/* Sección de Categorías Destacadas */}
                    <section className="py-16 sm:py-24 bg-gray-100 dark:bg-gray-800">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
                                Categorías Destacadas
                            </h2>
                            <FeaturedCategoriesHome />
                        </div>
                    </section>

                    {/* How to Buy Section */}
                    <section id="procedure" className="py-16 sm:py-24 bg-white dark:bg-gray-700">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">¿Cómo Comprar?</h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Sigue estos simples pasos para obtener tus productos.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                <div className="procedure-card text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mx-auto mb-6">
                                        <i className="fa-solid fa-magnifying-glass text-3xl text-indigo-600 dark:text-indigo-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Explora y Encuentra</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Navega por nuestras categorías o usa la barra de búsqueda para encontrar lo que necesitas.</p>
                                </div>
                                <div className="procedure-card text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-6">
                                        <i className="fa-solid fa-cart-plus text-3xl text-green-600 dark:text-green-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Añade a tu Carrito</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Selecciona tus productos favoritos y agrégalos a tu carrito de compras.</p>
                                </div>
                                <div className="procedure-card text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto mb-6">
                                        <i className="fa-solid fa-truck-fast text-3xl text-purple-600 dark:text-purple-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Paga y Recibe</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Completa tu compra de forma segura y espera tu pedido en la puerta de tu casa.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <FeaturedProductsHome />

                    {/* Payment Methods Section */}
                    <section id="payment-methods" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Métodos de Pago Seguros</h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Aceptamos una amplia variedad de métodos de pago.</p>
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-5xl sm:text-6xl text-gray-500 dark:text-gray-400">
                                <i className="fa-brands fa-cc-visa hover:text-blue-700 transition-colors"></i>
                                <i className="fa-brands fa-cc-mastercard hover:text-red-700 transition-colors"></i>
                                <i className="fa-brands fa-cc-paypal hover:text-blue-500 transition-colors"></i>
                                {/* <i className="fa-brands fa-google-pay hover:text-yellow-600 transition-colors"></i>
                                <i className="fa-brands fa-apple-pay hover:text-gray-800 dark:hover:text-gray-200 transition-colors"></i> */}
                                <i className="fa-solid fa-money-bill-transfer hover:text-green-600 transition-colors"></i>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}