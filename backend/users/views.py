from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import check_password
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError, DecodeError
from django.shortcuts import get_object_or_404
from django.db import connection
from django.conf import settings
from operator import itemgetter
from typing import Union
import datetime
import time

from .models import DataUser, AuthSecurity, DataProfile, Address
from .serializers import DataUserSerializer, AuthSeguritySerializer, LoginSerializer, HomeDataProfileSerializer, DataProfileSerializer, CompleteUserSerializer, AddressBookSerializer, DataProfileUpdateSerializer, DataUserUpdateSerializer, ChangePasswordUserSerializer

PRIVATE_KEY = 'key'

class DataUserListView(generics.ListAPIView):
    queryset = DataUser.objects.all()
    serializer_class = DataUserSerializer

class AuthSecurityCreateView(generics.CreateAPIView):
    queryset = AuthSecurity.objects.all()
    serializer_class = AuthSeguritySerializer

class DataUserCreate(APIView):
    def post(self, request, format=None):
        serializer = DataUserSerializer(data=request.data)
        print(serializer)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = DataUser.objects.get(email=email)
            except DataUser.DoesNotExist:
                return Response(
                    {"error": "Correo no encontrado"},
                    status=status.HTTP_404_NOT_FOUND
                )

            if not check_password(password, user.auth_security.password):
                return Response(
                    {"error": "Clave incorrecta"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            rol = user.auth_security.rol.rol
        
            token_expire = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            issued_at = datetime.datetime.utcnow()
            
            token = encode(
                {
                "user_id": user.id,
                "email": user.email,
                "rol": rol,
                "exp": token_expire,
                "iat": issued_at,
                }, 
                PRIVATE_KEY, 
                algorithm="HS256"
            )

            return Response({
                "token": token,
                "rol": rol,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HomeDataProfileView(APIView):
    def get(self, request, format=None):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token no proporcionado o malformado'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]
        
        try:
            decoded = decode(token, PRIVATE_KEY, algorithms=["HS256"])
            user_id = decoded.get("user_id")  # Asegúrate de que este campo se incluya al generar el token

            if not user_id:
                return Response({'error': 'Token inválido: falta user_id'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = DataUser.objects.get(id=user_id)

            serializer = HomeDataProfileSerializer(user)
            return Response(serializer.data)
        
        except ExpiredSignatureError:
            return Response({'error': 'El token ha expirado'}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidTokenError:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except DataUser.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except DataUser.DoesNotExist:
            return Response({'error': 'No se encontraron datos del perfil'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Ha ocurrido un error inesperado: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def verifyToken(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'error': 'Token no proporcionado o malformado'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        
    token = auth_header.split(' ')[1]

    return token
     
class DashboardDataProfile(APIView):
    def get(self, request, format=None):
        token = verifyToken(request)

        try:
            decoded = decode(token, PRIVATE_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            # Optimización: Obtenemos todos los datos en una sola consulta usando select_related/prefetch_related
            data_user = DataProfile.objects.select_related(
                'user',

            ).prefetch_related(
                # Para relaciones ManyToMany
            ).get(user=user_id)

            # Serializador que incluya todas las relaciones
            serializer = CompleteUserSerializer(data_user)

            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            
        except ExpiredSignatureError:
            return Response({'error': 'El token ha expirado'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        except InvalidTokenError:
            return Response({'error': 'Token inválido'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        except DataUser.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Ha ocurrido un error inesperado: {e}"}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def patch(self, request, format=None):
        try:
            token = verifyToken(request)
            decoded = decode(token, PRIVATE_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            # Separar los datos
            claves_usuario = ['firstname', 'lastname', 'birthdate']
            data_user = {clave: request.data.get(clave) for clave in claves_usuario if clave in request.data}
            data_profile = {clave: valor for clave, valor in request.data.items() if clave not in claves_usuario}

            # Actualizar perfil
            profile_instance = get_object_or_404(DataProfile, user=user_id)
            serializer_profile = DataProfileUpdateSerializer(profile_instance, data=data_profile, partial=True)

            if serializer_profile.is_valid():
                serializer_profile.save()

                # Actualizar usuario
                user_instance = get_object_or_404(DataUser, pk=user_id)
                serializer_user = DataUserUpdateSerializer(user_instance, data=data_user, partial=True)

                if serializer_user.is_valid():
                    serializer_user.save()
                    return Response({'response': 'registro exitoso'}, status=status.HTTP_200_OK)

                return Response(serializer_user.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer_profile.errors, status=status.HTTP_400_BAD_REQUEST)

        except ExpiredSignatureError:
            return Response({'error': 'El token ha expirado'}, status=status.HTTP_401_UNAUTHORIZED)
        except InvalidTokenError:
            return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except (DataUser.DoesNotExist, DataProfile.DoesNotExist):
            return Response({'error': 'Usuario o perfil no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Ha ocurrido un error inesperado: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        
class AddressBookView(APIView):
    def get(self, request, format=None):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token no proporcionado o malformado'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        
        token = auth_header.split(' ')[1]

        try:
            decoded = decode(token, PRIVATE_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            data_profile = DataProfile.objects.select_related(
                'address__parish__municipality__state',  # Carga la dirección, luego su parroquia, luego su municipio, luego su estado.
                'user' # Si necesitas datos del usuario también
            ).get(user__id=user_id)

            serializer = AddressBookSerializer(data_profile)

            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        
        except ExpiredSignatureError:
            return Response({'error': 'El token ha expirado'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        except InvalidTokenError:
            return Response({'error': 'Token inválido'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        except DataUser.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Ha ocurrido un error inesperado: {e}"}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ImgProfileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, format=None):
        token = verifyToken(request)
        if isinstance(token, Response):
            return token

        try:
            decoded = decode(token, PRIVATE_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            profile_instance = get_object_or_404(DataProfile, user=user_id)

            # Usar el nombre de campo correcto del modelo: img_profile_path
            if 'img_profile_path' not in request.FILES:
                return Response({'error': 'No se ha proporcionado ninguna imagen.'}, status=status.HTTP_400_BAD_REQUEST)

            data_profile = {'img_profile_path': request.FILES['img_profile_path']}

            serializer = DataProfileUpdateSerializer(profile_instance, data=data_profile, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({'response': 'Perfil actualizado'}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except (ExpiredSignatureError, InvalidTokenError, DataProfile.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        token = verifyToken(request)
        if isinstance(token, Response):
            return token

        try:
            decoded = decode(token, PRIVATE_KEY, algorithms=['HS256'])
            user_id = decoded.get('user_id')

            profile = get_object_or_404(DataProfile, user=user_id)
            image_path = profile.img_profile_path

            if image_path and hasattr(image_path, 'url'):
                full_url = request.build_absolute_uri(image_path.url)
                return Response({'image_url': full_url}, status=status.HTTP_200_OK)

            return Response({'error': 'No hay imagen cargada'}, status=status.HTTP_404_NOT_FOUND)

        except (ExpiredSignatureError, InvalidTokenError, DataProfile.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class TokenExtractor:
    def __init__(self, request):
        self.request = request

    def extract(self) -> str:
        token = self.request.headers.get("Authorization")
        if not token or not token.startswith("Bearer "):
            raise ValueError("Token no proporcionado o malformado")
        return token.split(" ")[1]

class TokenDecoder:
    def __init__(self, token):
        self.token = token

    def decode(self) -> dict:
        return decode(self.token, PRIVATE_KEY, algorithms=["HS256"])
    
    def extract_id_user(self, token_decoded):
        return token_decoded.get("user_id")

# funcion para obtener la instancia
def get_instance_serializer(request: dict, user_id: int):
    auth_user_instance = get_object_or_404(AuthSecurity, pk=user_id)
    serializer = ChangePasswordUserSerializer(auth_user_instance ,data=request.data, partial=True)

    return serializer
       
class ChangePasswordUserView(APIView):
    def get(self, request, *args):
        token = TokenExtractor(request).extract()
        token_decoder = TokenDecoder(token)
        decoded_token = token_decoder.decode()
        user_id = token_decoder.extract_id_user(decoded_token)
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM select_data_user(%s)", [user_id])
                columns = [col[0] for col in cursor.description]
                data = [
                    dict(zip(columns, row))
                    for row in cursor.fetchall()
                ]

                return Response({'data': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def patch(self, request, *args, **kwargs):
        try:
            token = TokenExtractor(request).extract()
            token_decoder = TokenDecoder(token)
            decoded_token = token_decoder.decode()
            user_id = token_decoder.extract_id_user(decoded_token)

            user = DataUser.objects.get(pk=user_id)

            if user:
                auth_id = user.auth_security.id

                auth_user_instance = get_object_or_404(AuthSecurity, pk=auth_id)
                serializer = ChangePasswordUserSerializer(auth_user_instance, data=request.data, partial=True)

                if serializer.is_valid():
                    serializer.save()

                    return Response({'cambio exitoso': 'la clave fue actualizada de manera exitosa!'}, status=status.HTTP_200_OK)

                return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

        except (InvalidTokenError, ExpiredSignatureError):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
