-- #############################################################
-- ##      FUNCION PARA LA CREACION DE NUEVOS USUARIOS        ##
-- #############################################################

-- Proposito: registrar los datos de un nuevo usuario en la BD.

CREATE OR REPLACE FUNCTION system_data.insert_user_client(
    -- Parametros a recibir.
    p_firstname VARCHAR,
    p_lastname VARCHAR,
    p_email VARCHAR,
    p_birthdate DATE,
    p_password VARCHAR,
	p_rol INTEGER
) 
RETURNS INTEGER -- Devolvemos el ID del nuevo usuario, que es más útil.
LANGUAGE plpgsql 
AS $$
DECLARE
    -- Declaracion de las variables a usar.
    v_id_auth INTEGER;
    v_id_user INTEGER;
	v_is_active BOOL := TRUE;
	v_is_blocked BOOL := TRUE;
	v_last_login DATE := CURRENT_TIMESTAMP;
	v_id_address INTEGER;
BEGIN
    p_firstname := UPPER(TRIM(p_firstname));
    p_lastname := UPPER(TRIM(p_lastname));
    p_email := UPPER(TRIM(p_email));

    -- 1. Verificar si el correo electrónico ya existe.
    IF EXISTS (SELECT 1 FROM system_data.data_users WHERE email = p_email) THEN
        -- Usamos un código de error estándar para 'unique_violation'.
        RAISE EXCEPTION 'El correo electrónico ''%'' ya se encuentra registrado.', p_email USING ERRCODE = '23505';
    END IF;

    -- 2. Insertar en la tabla de seguridad, guardando un HASH de la contraseña.
    -- Se usa crypt() y gen_salt() de la extensión pgcrypto.
    INSERT INTO system_segurity_data.auth_segurity(
	  is_active,
	  is_blocked,
	  last_login,
	  id_rol_fk,
	  password) 
    VALUES (
	  v_is_active,
	  v_is_blocked,
	  v_last_login,
	  p_rol,
	  crypt(p_password, gen_salt('bf'))) -- 'bf' es el algoritmo Blowfish, muy seguro.
    RETURNING id_auth INTO v_id_auth;

    -- 3. Insertar los datos del usuario.
    INSERT INTO system_data.data_users(
        firstname,
        lastname,
        email,
        birthdate,
        id_auth_fk
    ) VALUES (
        p_firstname,
        p_lastname,
        p_email,
        p_birthdate,
        v_id_auth
    ) RETURNING id_user INTO v_id_user; -- Retorno del ID del usuario creado.

    -- 4. Insertar la direccion del usuario.
	INSERT INTO data_locations.addresses(address_complete)
	VALUES ('')
	RETURNING id_address INTO v_id_address; -- Retorno del ID de la Direccion del Usuario.
    
    -- 5. Insertar el perfil del usuario.
    INSERT INTO system_data.data_profiles(id_user_fk, address_fk) VALUES (v_id_user, v_id_address);

    -- 6. Devolver el ID del nuevo usuario si todo fue exitoso.
    RETURN v_id_user;
END;
$$;