export default function NavigationBarHome() {
    return (
        <>
            {/* <!-- Barra de Navegación --> */}
            <div className="flex flex-col items-center w-full max-w-xl">
            {/* <!-- Barra de Navegación --> */}
            <div className="navigation-bar flex items-center w-full h-12 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl bg-white dark:bg-gray-700 px-4">
                <i className="fas fa-search text-xl mr-3 text-gray-600 dark:text-gray-300"></i>
               <input
                    type="search"
                    name="search-bar"
                    id="search-bar"
                    placeholder="Buscar productos..."
                    className="search-bar flex-grow h-full bg-transparent outline-none text-lg rounded-full px-2 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
            </div>
            {/* Botón con flecha hacia abajo */}
            <a href="#categories">
                <button className="mt-18 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <i className="fas fa-chevron-down text-xl"></i>
            </button>
            </a>
            
        </div>
        </>
    )
}