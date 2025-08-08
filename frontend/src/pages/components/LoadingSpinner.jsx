// LoadingSpinner Component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="ml-3 text-white">Cargando...</p>
    </div>
);

export default LoadingSpinner;