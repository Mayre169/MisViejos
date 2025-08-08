-- #############################################################
-- ##      FUNCION PARA OBTENER LOS DATOS DEL PERFIL          ##
-- #############################################################

-- Propósito: Devuelve los datos del perfil de un usuario específico.

CREATE OR REPLACE FUNCTION system_data.select_data_user(user_id INTEGER)
-- Datos a devolver en un tabla.
RETURNS TABLE(
    phone VARCHAR,
    img_profile_path VARCHAR,
    firstname VARCHAR,
    lastname VARCHAR,
    email VARCHAR,
    birthdate DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Consulta con las Tablas "data_users" | "data_profiles"
    RETURN QUERY
    SELECT
        profile.phone,
        profile.img_profile_path,
        user_c.firstname,
        user_c.lastname,
        user_c.email,
        user_c.birthdate
    FROM system_data.data_users AS user_c
    JOIN system_data.data_profiles AS profile
        ON user_c.id_user = profile.id_user_fk
    WHERE user_c.id_user = user_id;

    -- Si la consulta anterior no devolvió datos, se lanza el error.
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario con el correo electrónico ingresado no se encuentra registrado' USING ERRCODE = 'P0001';
    END IF;
END;
$$;