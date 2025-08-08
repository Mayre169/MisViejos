-- ###############################################################
-- ##      FUNCION PARA LA CREACION DE NUEVOS ESTADOS           ##
-- ###############################################################

CREATE OR REPLACE FUNCTION data_locations.insert_state(new_state VARCHAR)
RETURNS VARCHAR LANGUAGE plpgsql AS $$
BEGIN
    new_state := UPPER(TRIM(new_state));

    -- 1. Verificar que el estado no se encuentre registrado
    IF EXISTS (SELECT 1 FROM data_locations.states AS sta WHERE sta.state = new_state) THEN
        RAISE EXCEPTION 'El estado % ya se encuentra registrado', new_state USING ERRCODE = 'P0001';
    END IF;

    -- 2. Insertar el nuevo Estado
    INSERT INTO data_locations.states (state) VALUES (new_state);

    -- retornar el estado.
    RETURN new_state;
END;
$$;
