-- #############################################################
-- ##   FUNCION PARA OBTENER LAS DIRECCIONES DE LOS USUARIOS  ##
-- #############################################################

-- Proposito: Obtener las direcciones de un Usuario.

CREATE OR REPLACE FUNCTION data_locations.select_address_user(user_id INTEGER)
-- Datos a devolver en una tabla
RETURNS TABLE (
  a_state VARCHAR,
  a_municipality VARCHAR,
  a_parish VARCHAR,
  a_address_complete TEXT
) LANGUAGE plpgsql AS $$
BEGIN
    -- Consulta con las tablas | "data_users" | "data_profiles" | "addresses" | "parishes" | "municipalities" | "states"
    RETURN QUERY
    SELECT
        sta.state,
        muni.municipality,
        pari.parish,
        addr.address_complete
    FROM system_data.data_users AS users -- Agregamos el join a la tabla de usuarios
    JOIN system_data.data_profiles AS prof
        ON users.id_user = prof.id_user_fk -- Hacemos el join usando el ID del usuario
    JOIN data_locations.addresses AS addr
        ON prof.address_fk = addr.id_address -- Hacemos el join usando el ID de addresses
    JOIN data_locations.parishes AS pari
        ON addr.address_fk = pari.id_parishes -- Hacemos el join usando el ID de parishes
    JOIN data_locations.municipalities AS muni
        ON pari.id_municipality_fk = muni.id_municipality -- Hacemos el join usando el ID de municipalities
    JOIN data_locations.states AS sta
        ON muni.id_state_fk = sta.id_state -- Hacemos el join usando el ID de states
    WHERE users.id_user = user_id;

    -- Si la consulta anterior no devolvió datos, se lanza el error.
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario no tiene direcciones registradas o no existe el correo' USING ERRCODE = 'P0001';
    END IF;
END;
$$;