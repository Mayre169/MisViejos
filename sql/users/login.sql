-- ###############################################################
-- ##    FUNCION PARA LA VERIFICACION DEL INICIO DE SESION      ##
-- ###############################################################

-- Propósito: Autentica un usuario y devuelve su contraseña para verificación.
CREATE OR REPLACE FUNCTION system_data.login(email_user VARCHAR, password_user VARCHAR)
RETURNS BOOL
LANGUAGE plpgsql
AS $$
DECLARE
  v_status BOOL;
BEGIN
    email_user := UPPER(TRIM(email_user));
    
    -- Se combinan la verificación de existencia y la obtención de datos en una sola consulta.
    SELECT data_u.id_user INTO v_status
    FROM system_data.data_users AS data_u
    JOIN system_segurity_data.auth_segurity AS auth_u
      ON data_u.id_auth_fk = auth_u.id_auth 
      AND crypt(password_user, auth_u.password) = auth_u.password
    WHERE data_u.email = login.email_user;

    -- Se verifica si la consulta encontró una fila. Si no, se lanza la excepción.
    IF FOUND THEN
      RETURN v_status;
    ELSE
      RAISE EXCEPTION 'Las credenciales ingresadas son inválidas. Por favor, verifique e intente nuevamente.' USING ERRCODE = 'P0001';
    END IF;

END;
$$;