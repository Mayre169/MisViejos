-- ##############################################################
-- ##                ACTUALIZAR MUNICIPIO                      ##
-- ##############################################################

CREATE OR REPLACE FUNCTION data_locations.update_municipality(
    mun_id INTEGER, -- ID de municipio a actualizar 
    new_mun VARCHAR, -- Nuevo municipio
    sta_id INTEGER, -- ID del estado relacionado
)
RETURNS BOOLEAN 
LANGUAGE plpgsql AS $$
BEGIN
    new_mun := UPPER(TRIM(new_mun));

    IF NOT EXISTS (SELECT 1 FROM data_locations.municipalities AS mun WHERE mun.id_municipality = mun_id) THEN
        RAISE EXCEPTION 'Ha ocurrido un error al tratar de obtener el municipio' USING ERRCODE = 'P0001';
    END IF;

    UPDATE data_locations.municipalities AS mun 
    SET municipality = new_mun, id_state_fk = sta_id
    WHERE mun.id_municipality = mun_id;

    RETURN true;
END;
$$;