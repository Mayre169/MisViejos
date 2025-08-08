const AlertDialog = ({ title, message, onClose, type = 'success', onConfirm }) => {
    const isError = type === 'error';
    const isConfirm = onConfirm !== undefined;

    const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const buttonColor = isError ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 animate-fade-in">
            <div className={`bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in`}>
                <h3 className={`text-xl font-semibold ${textColor} mb-4`}>{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    {isConfirm && (
                        <button
                            onClick={onClose}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        onClick={isConfirm ? onConfirm : onClose}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                    >
                        {isConfirm ? 'Confirmar' : 'Aceptar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;