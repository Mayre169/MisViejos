-- #############################################################
-- ##  FUNCION PARA ACTUALIZAR LAS DIRECCIONES DEL USUARIO    ##
-- #############################################################

-- Proposito: Actualizar las direcciones de usuario.

CREATE OR REPLACE FUNCTION data_locations.update_address_user(
    -- Parametros a recibir
    p_user_id INTEGER,
    p_address VARCHAR,
    p_parish INTEGER
)
RETURNS TRUE
LANGUAGE plpgsql AS $$
DECLARE
    v_id_address INTEGER;
BEGIN
    p_address := UPPER(TRIM(p_address));
    
    -- 1. Verificar la existencia del usuario
    IF NOT EXISTS (SELECT 1 FROM system_data.data_users AS use WHERE use.id_user = p_user_id) THEN
        RAISE EXCEPTION 'El usuario recibido no se encuentra registrado' USING ERRCODE = 'P0001';
    END IF;

    -- 2. Obtener el ID correspondiente a la direccion del usuario
    SELECT pro.address_fk INTO v_id_address FROM system_data.data_profiles AS pro
    WHERE pro.id_user_fk = p_user_id;

    -- 3. Actualizar las direcciones del usuario
    UPDATE data_locations.addresses AS addr SET
        addr.id_parish_fk = p_parish,
        addr.address_complete = p_address
    WHERE addr.id_address = v_id_address;

    RETURN TRUE;
END;
$$;