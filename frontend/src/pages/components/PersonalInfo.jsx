import { useState, useEffect } from "react";
import axios from 'axios';
import AlertDialog from "./AlertDialogDashboard";
import LoadingSpinner from "./LoadingSpinnerDashboard";

const PersonalInfo = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user, areaCode: '', phoneNumber: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');
    const [dataProfile, setDataProfile] = useState({
        user: { firstname: '', lastname: '', email: '' },
        phone: '',
        img_profile_path: '',
        address: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('')

    const getProfileImage = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://127.0.0.1:8000/users/profile/img", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setImageUrl(response.data.image_url);
        } catch (error) {
            console.error("Error al obtener la imagen del perfil:", error.response?.data || error.message);
        }
    };

    const getDataProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://127.0.0.1:8000/users/profile/data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data_response = response.data.data;
            setDataProfile(data_response);
            // Corregido: Poblar el formulario sin la dirección
            let areaCode = '';
            let phoneNumber = '';
            if (data_response.phone) {
                if (data_response.phone.startsWith('+58')) {
                    areaCode = '+58';
                    phoneNumber = data_response.phone.substring(3);
                } else if (data_response.phone.startsWith('+1')) {
                    areaCode = '+1';
                    phoneNumber = data_response.phone.substring(2);
                } else if (data_response.phone.startsWith('+27')) {
                    areaCode = '+27';
                    phoneNumber = data_response.phone.substring(3);
                } else if (data_response.phone.startsWith('+57')) {
                    areaCode = '+57';
                    phoneNumber = data_response.phone.substring(3);
                } else {
                    areaCode = '+58'; // O un valor por defecto
                    phoneNumber = data_response.phone;
                }
            }

            setFormData(prev => ({
                ...prev,
                firstname: data_response.user.firstname,
                lastname: data_response.user.lastname,
                email: data_response.user.email,
                areaCode: areaCode,
                phoneNumber: phoneNumber,
                profilePicture: data_response.img_profile_path,
                // La dirección ya no se maneja aquí
            }));
        } catch (error) {
            console.error("Error al obtener los datos del perfil:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getDataProfile();
        getProfileImage();
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const imageUrl = URL.createObjectURL(file);
            setFormData({ ...formData, profilePicture: imageUrl });
        }
    };

    const handleRemoveProfilePicture = () => {
        setProfileImage(null);
        setFormData({ ...formData, profilePicture: null }); // O un placeholder por defecto
    };

    const handleSave = async () => {
        if (profileImage) {
            const imageFormData = new FormData();
            imageFormData.append('img_profile_path', profileImage);

            const token = localStorage.getItem('token');
            try {
                await axios.patch('http://127.0.0.1:8000/users/profile/img', imageFormData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error("Error al subir la imagen:", error.response?.data || error.message);
                setErrorMessage('Error al subir la imagen. Inténtalo de nuevo.');
                return;
            }
        }

        const fullPhoneNumber = `${formData.areaCode}${formData.phoneNumber}`;
        const dataToSend = {
            ...formData,
            phone: fullPhoneNumber,
        };
        delete dataToSend.areaCode;
        delete dataToSend.phoneNumber;

        console.log(dataToSend)

        setLoading(true);
        setErrorMessage('');
        try {
            // Simular llamada a API para actualizar datos
            // await new Promise(resolve => setTimeout(resolve, 1500));
            const token = localStorage.getItem('token')
            await axios.patch('http://127.0.0.1:8000/users/profile/data',
                // Segundo argumento: los datos que deseas enviar (tu body)
                dataToSend,
                // Tercer argumento: el objeto de configuración (incluye los headers)
                {
                    headers: {
                        'Content-Type': 'application/json', // Es importante especificar que estás enviando JSON
                        'Authorization': `Bearer ${token}`,
                    },
                }
            )
            .then(response => {
                console.log(response.data); // Accede a response.data para ver la respuesta del servidor
            })
            .catch(error => {
                console.error("Error al actualizar perfil:", error.response ? error.response.data : error.message);
            });
            // Aquí iría tu llamada axios.put('/api/user/profile', formData);
            onUpdate(dataToSend);
            setDialogMessage('¡Tus datos personales han sido actualizados exitosamente!');
            setDialogType('success');
            setShowDialog(true);
            setIsEditing(false);
        } catch (error) {
            setErrorMessage('Error al actualizar los datos. Inténtalo de nuevo.');
            setDialogMessage('Error al actualizar los datos. Por favor, intente de nuevo.');
            setDialogType('error');
            setShowDialog(true);
            console.error('Error updating personal info:', error);
        } finally {
            setLoading(false);
            getDataProfile();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Datos Personales</h3>
            {isEditing ? (
                <div className="space-y-4">
                    {/* Sección de Foto de Perfil */}
                    <div className="flex items-center space-x-4">
                        <img
                            src={formData.profilePicture || imageUrl || 'https://placehold.co/150x150/cccccc/333333?text=Sin+Foto'}
                            alt="Foto de Perfil"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div>
                            <label htmlFor="profilePictureInput" className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
                                Cambiar Foto
                            </label>
                            <input
                                id="profilePictureInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePictureChange}
                            />
                            {formData.profilePicture && (
                                <button
                                    onClick={handleRemoveProfilePicture}
                                    className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Eliminar Foto
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Campos de Información Personal */}
                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" disabled />
                    </div>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                        <input type="date" name="birthdate" id="birthdate" value={formData.birthdate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <div className="flex space-x-2">
                            <select name="areaCode" id="areaCode" value={formData.areaCode} onChange={handleChange} className="mt-1 block w-1/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="+58">+58</option>
                                <option value="+1">+1</option>
                                <option value="+27">+27</option>
                                <option value="+57">+57</option>
                            </select>
                            <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-3/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ej: 123-4567" />
                        </div>
                    </div>  

                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200" disabled={loading}>
                            {loading ? <LoadingSpinner color="white" /> : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center space-x-4 mb-4">
                        <img
                            src={imageUrl || 'https://placehold.co/150x150/cccccc/333333?text=Sin+Foto'}
                            alt="Foto de Perfil"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{`${dataProfile.user.firstname} ${dataProfile.user.lastname}`}</p>
                            <p className="text-sm text-gray-600">{dataProfile.user.email}</p>
                        </div>
                    </div>
                    <p><strong className="text-gray-700">Fecha de Nacimiento:</strong>{`${dataProfile.user.birthdate}`}</p>
                    <p><strong className="text-gray-700">Teléfono:</strong> {dataProfile.phone || 'No especificado'}</p>
                    {/* La sección de dirección se ha movido a AddressBook */}
                    <div className="mt-4">
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">Editar Datos</button>
                    </div>
                </div>
            )}
            {showDialog && <AlertDialog title={dialogType === 'success' ? 'Éxito' : 'Error'} message={dialogMessage} onClose={() => setShowDialog(false)} type={dialogType} />}
        </div>
    );
};

export default PersonalInfo;