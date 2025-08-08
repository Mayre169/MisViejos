# Este archivo models.py traduce el esquema SQL de PostgreSQL a modelos de Django.
# Se utiliza la clase Meta y la opción `db_table` para especificar los esquemas
# y nombres de tabla exactos (ej: 'system_data.data_users').
# Las llaves foráneas usan el parámetro `db_column` para coincidir con los
# nombres de columna del esquema SQL original.

from django.db import models
from django.utils import timezone

# --- Modelos del esquema 'system_segurity_data' ---

class Roles(models.Model):
    id = models.BigAutoField(primary_key=True, db_column='id_rol')
    rol = models.CharField(max_length=100)
    descriptions = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'system_segurity_data"."roles'
        verbose_name = "Rol de Usuario"
        verbose_name_plural = "Roles de Usuarios"

class AuthSecurity(models.Model):
    """
    Modelo para almacenar los datos de autenticación de los usuarios.
    Corresponde a la tabla 'system_segurity_data.auth_segurity'.
    """
    # El campo 'id_auth' es manejado automáticamente por Django como 'id'.
    id = models.BigAutoField(primary_key=True, db_column='id_auth')
    is_active = models.BooleanField(default=True, help_text="Indica si un usuario se encuentra activo.")
    is_blocked = models.BooleanField(default=False, help_text="Indica si un usuario se encuentra bloqueado.")
    verification_code = models.CharField(max_length=10, null=True, blank=True, help_text="Código de verificación, ej: para olvido de clave.")
    last_login = models.DateTimeField(default=timezone.now, help_text="Última fecha de conexión del usuario.")
    rol = models.ForeignKey(
        Roles,
        on_delete=models.PROTECT,
        db_column="id_rol_fk",
        related_name="roles",
        default=1
    )
    
    # El tipo 'bytea' en SQL se usa para datos binarios. Para contraseñas hasheadas en Django,
    # se suele usar un CharField, ya que el hash es una cadena de texto.
    # NOTA: Para proyectos nuevos, se recomienda extender el modelo de Usuario de Django
    # que ya gestiona las contraseñas de forma segura.
    password = models.CharField(max_length=128, help_text="Contraseña hasheada del usuario.")

    class Meta:
        db_table = 'system_segurity_data"."auth_segurity'
        verbose_name = "Seguridad de Autenticación"
        verbose_name_plural = "Seguridad de Autenticaciones"

    def __str__(self):
        return f"Auth Record #{self.id}"

# --- Modelos del esquema 'data_locations' ---

class State(models.Model):
    """
    Modelo para los estados.
    Corresponde a la tabla 'data_locations.states'.
    """
    id = models.BigAutoField(primary_key=True, db_column='id_state')
    state = models.CharField(max_length=255)

    class Meta:
        db_table = 'data_locations"."states'
        verbose_name = "Estado"
        verbose_name_plural = "Estados"

    def __str__(self):
        return self.state

class Municipality(models.Model):
    """
    Modelo para los municipios.
    Corresponde a la tabla 'data_locations.municipalities'.
    """
    id = models.BigAutoField(primary_key=True, db_column='id_municipality')
    municipality = models.CharField(max_length=255)
    state = models.ForeignKey(
        State, 
        on_delete=models.PROTECT, # RESTRICT en SQL se mapea a PROTECT en Django
        db_column='id_state_fk',
        related_name='municipalities'
    )

    class Meta:
        db_table = 'data_locations"."municipalities'
        verbose_name = "Municipio"
        verbose_name_plural = "Municipios"

    def __str__(self):
        return f"{self.municipality}, {self.state.state}"

class Parish(models.Model):
    """
    Modelo para las parroquias.
    Corresponde a la tabla 'data_locations.parishes'.
    """
    id = models.BigAutoField(primary_key=True, db_column='id_parishes')
    parish = models.CharField(max_length=255)
    municipality = models.ForeignKey(
        Municipality, 
        on_delete=models.PROTECT, 
        db_column='id_municipality_fk',
        related_name='parishes'
    )

    class Meta:
        db_table = 'data_locations"."parishes'
        verbose_name = "Parroquia"
        verbose_name_plural = "Parroquias"

    def __str__(self):
        return self.parish

class Address(models.Model):
    """
    Modelo para las direcciones completas.
    Corresponde a la tabla 'data_locations.addresses'.
    """
    id = models.BigAutoField(primary_key=True, db_column='id_address')
    parish = models.ForeignKey(
        Parish, 
        on_delete=models.PROTECT, 
        db_column='id_parish_fk', # El nombre de la columna en SQL es 'address_fk'
        related_name='addresses'
    )
    address_complete = models.TextField(help_text="Dirección exacta y completa (calle, casa, etc.)")

    class Meta:
        db_table = 'data_locations"."addresses'
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"

    def __str__(self):
        return f"{self.address_complete}, {self.parish.parish}"


# --- Modelos del esquema 'system_data' ---

class DataUser(models.Model):
    """
    Modelo que almacena la información principal de cada usuario.
    Corresponde a la tabla 'system_data.data_users'.
    """
    id = models.BigAutoField(primary_key=True, db_column='id_user')
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    email = models.EmailField(max_length=100, unique=True)
    birthdate = models.DateField()
    
    # Una relación uno a uno, ya que cada usuario tiene un único registro de seguridad.
    auth_security = models.OneToOneField(
        AuthSecurity,
        on_delete=models.PROTECT,
        db_column='id_auth_fk',
        related_name='user'
    )

    class Meta:
        db_table = 'system_data"."data_users'
        verbose_name = "Dato de Usuario"
        verbose_name_plural = "Datos de Usuarios"

    @property
    def full_name(self):
        return f"{self.firstname} {self.lastname}"

    def __str__(self):
        return self.full_name


class DataProfile(models.Model):
    """
    Modelo para almacenar los datos adicionales del perfil de cada usuario.
    Corresponde a la tabla 'system_data.data_profiles'.
    """
    id = models.BigAutoField(primary_key=True, db_column='id_profile')
    phone = models.CharField(max_length=20, null=True, blank=True)
    
    # Para rutas de imágenes, FileField o ImageField son más idiomáticos en Django,
    # pero CharField funciona si solo almacenas la ruta como texto.
    img_profile_path = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    # Relación con la dirección. Puede ser nula.
    address = models.ForeignKey(
        Address, 
        on_delete=models.SET_NULL, # Permite borrar la dirección sin borrar el perfil
        null=True, 
        blank=True, 
        db_column='address_fk',
        related_name='profiles'
    )
    
    # Relación uno a uno con el usuario. Cada usuario tiene un solo perfil.
    user = models.OneToOneField(
        DataUser,
        on_delete=models.CASCADE, # Si se borra el usuario, se borra su perfil.
        db_column='id_user_fk',
        related_name='profile'
    )

    class Meta:
        db_table = 'system_data"."data_profiles'
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

    def __str__(self):
        return f"Perfil de {self.user.full_name}"
    

