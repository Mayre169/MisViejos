// Componente FeaturedCategoriesHome
export default function FeaturedCategoriesHome() {
    // Datos de ejemplo para categorías
    const categories = [
        { id: 1, name: 'Vinos Tintos', imageUrl: 'https://placehold.co/300x200/FFD700/000000?text=Vino+Tinto' },
        { id: 2, name: 'Vinos Blancos', imageUrl: 'https://placehold.co/300x200/ADD8E6/000000?text=Vino+Blanco' },
        { id: 3, name: 'Espumosos', imageUrl: 'https://placehold.co/300x200/DDA0DD/000000?text=Espumoso' },
        { id: 4, name: 'Accesorios', imageUrl: 'https://placehold.co/300x200/C0C0C0/000000?text=Accesorios' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8" id="categories">
            {categories.map(category => (
                <div key={category.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200?text=Categoría"; }}
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Descubre nuestra selección.</p>
                    </div>
                </div>
            ))}
        </div>
    );
};