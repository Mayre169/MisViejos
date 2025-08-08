// AlertDialog Component
const AlertDialog = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">¡Éxito!</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default AlertDialog;