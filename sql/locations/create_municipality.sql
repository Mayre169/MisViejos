-- ###############################################################
-- ##      FUNCION PARA LA CREACION DE NUEVOS MUNICIPIOS        ##
-- ###############################################################

CREATE OR REPLACE FUNCTION data_locations.insert_municipality(new_municipality VARCHAR, id_state INTEGER)
RETURNS VARCHAR 
LANGUAGE plpgsql AS $$
BEGIN
    new_municipality := UPPER(TRIM(new_municipality));
    
    -- 1. Verificar si el municipio ingresado se encuentra registrado.
    IF EXISTS (SELECT 1 FROM data_locations.municipalities AS mun WHERE mun.municipality = new_municipality) THEN
        RAISE EXCEPTION 'El Municipio % ya se cuentra registrado', new_municipality USING ERRCODE = 'P0001';
    END IF;

    -- 2. Insertar el nuevo municipio.
    INSERT INTO data_locations.municipalities (municipality, id_state_fk) VALUES (new_municipality, id_state);

    RETURN new_municipality;
END;
$$;