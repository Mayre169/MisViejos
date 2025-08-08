from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import DataUser, AuthSecurity, DataProfile, Municipality, Parish, State, Address

ERRORS = {
    "credenciales": "Credenciales Invalidas!",
    "no-email": "Usuario no registrado!",
}

class DataUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataUser
        fields = '__all__'

    def validate_email(self, value):
        if DataUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo electronico ya fue registrado anteriormente!")
        
        return value
    
    def create(self, validated_data):
        user = DataUser.objects.create(**validated_data)
        DataProfile.objects.create(user=user)

        return user

class AuthSeguritySerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthSecurity
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password')

        hasched_password = make_password(password)

        auth_segurity_instance = AuthSecurity.objects.create(**validated_data, password=hasched_password)

        return auth_segurity_instance
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

class HomeDataProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataUser
        fields = ['firstname', 'lastname']

class DataProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataProfile
        fields = '__all__'

class CompleteUserSerializer(serializers.ModelSerializer):
    user = DataUserSerializer()
    #address = AddressSerializer(source='profile.address')
    # Agrega aquí las otras 3 relaciones que necesitas
    
    class Meta:
        model = DataProfile
        fields = ['id', 'phone', 'img_profile_path', 'address', 'user']  # Incluye todos los campos necesarios

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'state']

class MunicipalitySerializer(serializers.ModelSerializer):
    state = StateSerializer(read_only=True) # Anida el serializador de Estado
    class Meta:
        model = Municipality
        fields = ['id', 'municipality', 'state']

class ParishSerializer(serializers.ModelSerializer):
    municipality = MunicipalitySerializer(read_only=True) # Anida el serializador de Municipio
    class Meta:
        model = Parish
        fields = ['id', 'parish', 'municipality']

class AddressSerializer(serializers.ModelSerializer):
    parish = ParishSerializer(read_only=True) # Anida el serializador de Parroquia
    class Meta:
        model = Address
        fields = ['id', 'address_complete', 'parish']

class AddressBookSerializer(serializers.ModelSerializer):
    # Usamos el AddressSerializer para representar la relación de dirección
    address = AddressSerializer(read_only=True)

    class Meta:
        model = DataProfile # El modelo principal de este serializador es DataProfile
        fields = ['address'] # Solo si quieres devolver solo la dirección desde el perfil
        # Si quieres más campos del perfil, añádelos aquí, por ejemplo:
        # fields = ['id', 'phone', 'img_profile_path', 'address']


class DataUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataUser
        fields = ['firstname', 'lastname', 'birthdate']

class DataProfileUpdateSerializer(serializers.ModelSerializer):
    img_profile_path = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = DataProfile
        fields = '__all__'

class ChangePasswordUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = AuthSecurity
        fields = ['password']

    def update(self, instance, validated_data):
        instance.password = make_password(validated_data.get('password'))
        instance.save()
        return instance
