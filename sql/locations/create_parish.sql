-- ###############################################################
-- ##      FUNCION PARA LA CREACION DE NUEVAS PARROQUIAS        ##
-- ###############################################################

CREATE OR REPLACE FUNCTION data_locations.insert_parish(new_parish VARCHAR, id_municipality INTEGER)
RETURNS VARCHAR LANGUAGE plpgsql AS $$
BEGIN
    new_parish := UPPER(TRIM(new_parish));
    
    -- 1. Verificar que la parroquia no se encuentre resgistrada.
    IF EXISTS (SELECT 1 FROM data_locations.parishes AS pari WHERE pari.parish = new_parish) THEN
        RAISE EXCEPTION 'La Parroquia % ya se encuentra registrada', new_parish USING ERRCODE = 'P0001';
    END IF;

    -- 2. Insertar la nueva parroquia.
    INSERT INTO data_locations.parishes (parish, id_municipality_fk) VALUES (new_parish, id_municipality);

    RETURN new_parish;
END;
$$;
