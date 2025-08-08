-- #############################################################
-- ##  FUNCION PARA LA ACTUALIZACION DE LOS DATOS DE USUARIO  ##
-- #############################################################

-- Proposito: Actualizar los datos usados en el perfil del usuario
-- Datos no actualizables: (email)

CREATE OR REPLACE FUNCTION system_data.update_data_profile(
-- Declaracion de los Parametros a recibir
p_user_id VARCHAR,
p_firstname VARCHAR,
p_lastname VARCHAR,
p_birthdate DATE,
p_phone VARCHAR
) 
RETURNS BOOL
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaracion de variables
	v_id_user INTEGER;
BEGIN
	p_firstname := UPPER(TRIM(p_firstname));
    p_lastname := UPPER(TRIM(p_lastname));

    -- 1. Verificar que el usuario exista.
	IF NOT EXISTS (SELECT 1 FROM system_data.data_users AS use WHERE use.id_user = p_user_id) THEN
        -- Si el usuario no existe se lanza el ERROR
		RAISE EXCEPTION 'El usuario no ha sido encontrado. Verifique he intente nuevamente' USING ERRCODE = 'P0001';
	END IF;

    -- 2. Actualizar los datos del usuario
	UPDATE system_data.data_users AS use
	SET
		firstname = p_firstname,
		lastname = p_lastname,
		birthdate = p_birthdate
	WHERE use.id_user = p_user_id RETURNING use.id_user INTO v_id_user;

    -- 3. Actualizar los datos del perfil
	UPDATE system_data.data_profiles AS pro
	SET phone = p_phone
	WHERE pro.id_user_fk = v_id_user;

    -- 4. Retornar TRUE (si todo salio bien)
	RETURN TRUE;
END;
$$;
