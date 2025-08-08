export default function FeaturedProductsHome() {
    return (
        <>
            {/* <!-- Sección de Productos Destacados --> */}
            <section id="featured-products" className="w-full max-w-6xl mx-auto py-16 px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Productos Destacados</h2>
                <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* <!-- Producto 1 --> */}
                    <div className="product-card rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                        <img src="https://placehold.co/400x300/F0F0F0/000000?text=Producto+1" alt="Producto 1" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-1">Nombre del Producto 1</h3>
                            <p className="text-white-700 dark:text-gray-300 text-sm mb-3">Descripción breve del producto.</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold">$19.99</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">En stock</span>
                            </div>
                            <button className="w-full py-2 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                    {/* <!-- Producto 2 --> */}
                    <div className="product-card rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                        <img src="https://placehold.co/400x300/D0D0D0/000000?text=Producto+2" alt="Producto 2" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-1">Nombre del Producto 2</h3>
                            <p className="text-white-700 dark:text-gray-300 text-sm mb-3">Descripción breve del producto.</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold">$24.50</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">En stock</span>
                            </div>
                            <button className="w-full py-2 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                    {/* <!-- Producto 3 --> */}
                    <div className="product-card rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                        <img src="https://placehold.co/400x300/C0C0C0/000000?text=Producto+3" alt="Producto 3" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-1">Nombre del Producto 3</h3>
                            <p className="text-white-700 dark:text-gray-300 text-sm mb-3">Descripción breve del producto.</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold">$12.00</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Agotado</span>
                            </div>
                            <button className="w-full py-2 rounded-md font-semibold bg-gray-400 cursor-not-allowed" disabled>
                                Agotado
                            </button>
                        </div>
                    </div>
                    {/* <!-- Producto 4 --> */}
                    <div className="product-card rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                        <img src="https://placehold.co/400x300/B0B0B0/000000?text=Producto+4" alt="Producto 4" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-1">Nombre del Producto 4</h3>
                            <p className="text-white-700 dark:text-gray-300 text-sm mb-3">Descripción breve del producto.</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold">$30.00</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">En stock</span>
                            </div>
                            <button className="w-full py-2 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}