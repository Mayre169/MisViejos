-- ############################################################
-- ##   FUNCION PARA ACTUALIZAR UNA PARROQUIA                ##
-- ############################################################

CREATE OR REPLACE FUNCTION data_locations.update_parish(parish_id INTEGER, new_parish VARCHAR)
RETURNS BOOL
LANGUAGE plpgsql AS $$
BEGIN
    new_parish := UPPER(TRIM(new_parish));

    IF EXISTS (SELECT 1 FROM data_locations.parishes AS pari WHERE pari.parish = new_parish) THEN
        RAISE EXCEPTION 'La Parroquia ingresada (%) coincide con la ya registrada', new_parish USING ERRCODE = 'P0001';
    END IF;

    UPDATE data_locations.parishes AS pari SET
        parish = new_parish
    WHERE pari.id_parishes = parish_id;

    RETURN TRUE;
END;
$$;