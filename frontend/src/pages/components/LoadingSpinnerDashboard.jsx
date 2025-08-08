const LoadingSpinner = ({ color = 'indigo' }) => (
    <div className="flex justify-center items-center py-4">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${color}-600`}></div>
        <p className="ml-3 text-gray-700">Cargando...</p>
    </div>
);

export default LoadingSpinner;