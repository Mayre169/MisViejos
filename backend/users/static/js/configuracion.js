document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("main-content");
  const original = main.innerHTML; // guardamos el HTML inicial

  // Render de pantallas
  function renderOriginal() {
    main.innerHTML = original;
  }

  function renderActualizar() {
    main.innerHTML = `
        <section class="form-section">
            <h3>Actualizar Datos</h3>
            <form class="formulario">
                <label for="nombre">Nombre</label>
                <input 
                    type="text" 
                    name="name" 
                    id="nombre" 
                    placeholder="Tu nombre" 
                    pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ]{4,20}$"
                    minlength="4" 
                    maxlength="20" 
                    required
                >

                <label for="apellido">Apellido</label>
                <input 
                    type="text" 
                    name="lastname" 
                    id="apellido" 
                    placeholder="Tu apellido" 
                    pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ]{4,20}$"
                    minlength="4" 
                    maxlength="20" 
                    required
                >

                <label for="date">Fecha de nacimiento</label>
                <input type="date" name="fn" id="date" required>

                <div class="acciones">
                    <button type="submit" id="btn-guardar-datos" class="btn-guardar">Guardar</button>
                    <button type="button" id="btn-volver" class="btn-regresar">Volver</button>
                </div>
                <p id="msg" class="mensaje"></p>
            </form>
        </section>
    `;

    // --- Validación personalizada Nombre y Apellido ---
    function configurarValidacionTexto(inputId) {
        const input = document.getElementById(inputId);
        input.addEventListener("invalid", function () {
            input.setCustomValidity(
                "Debe contener entre 4 y 20 letras, sin números ni caracteres especiales."
            );
        });
        input.addEventListener("input", function () {
            input.setCustomValidity("");
        });
    }

    configurarValidacionTexto("nombre");
    configurarValidacionTexto("apellido");

    // --- Validación de fecha ---
    const dateInput = document.getElementById("date");
    dateInput.addEventListener("input", function () {
        const today = new Date();
        const minAgeDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const maxAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const selectedDate = new Date(this.value);

        if (selectedDate < minAgeDate || selectedDate > maxAgeDate) {
            this.setCustomValidity("Debes ser mayor de 18 y menor de 100 años.");
        } else {
            this.setCustomValidity("");
        }
    });

    const form = document.querySelector(".formulario");
    const msg = document.getElementById("msg");
    const submitBtn = document.getElementById("btn-guardar-datos");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Spinner + bloquear botón
        submitBtn.disabled = true;
        submitBtn.textContent = "Guardando...";

        // Convertir a JSON
        const formData = new FormData(form);
        
        try {
            const response = await fetch("http://127.0.0.1:8000/users/update-data", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }

            const data = await response.json();

            msg.textContent = "✅ Datos actualizados exitosamente";
            msg.style.color = "green";
            console.log("Respuesta del servidor:", data);

            form.reset(); // limpiar formulario
        } catch (error) {
            console.error("Hubo un problema con la operación fetch:", error);
            msg.textContent = "❌ Error al actualizar los datos. Inténtalo nuevamente.";
            msg.style.color = "red";
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = "Guardar";
        }
    });
}


  function renderClave() {
    main.innerHTML = `
      <section class="form-section">
        <h3>Cambiar Clave</h3>
        <form class="formulario">
          <label for="clave_actual">Clave Actual</label>
          <input type="password" id="clave_actual" placeholder="Clave actual">

          <label for="nueva_clave">Nueva Clave</label>
          <input type="password" id="nueva_clave" placeholder="Nueva clave">

          <label for="confirmar_clave">Confirmar Clave</label>
          <input type="password" id="confirmar_clave" placeholder="Confirmar clave">

          <div class="acciones">
            <button type="submit" id="btn-guardar-clave" class="btn-guardar">Actualizar Clave</button>
            <button type="button" id="btn-volver" class="btn-regresar">Volver</button>
          </div>
        </form>
      </section>
    `;

    // const form = document.querySelector('.formulario');

    // form.addEventListener('click', e => {
    //     e.preventDefault()
    //     const formData = new FormData(form)

    //     fetch('http://127.0.0.1:8000/users/update-data', {
    //         method: 'POST',
    //         body: formData
    //     })
    //     .then(response => {
    //         // Verifica si la respuesta es exitosa
    //         if (!response.ok) {
    //             throw new Error(`Error en la petición: ${response.status}`);
    //         }

    //         alert('Datos Actualizados Exitosamente!')
    //     })
    //     .then(data => {
    //         // Maneja los datos de la respuesta del servidor
    //         console.log('Respuesta del servidor:', data);
    //     })
    //     .catch(error => {
    //         // Maneja cualquier error que ocurra durante la petición
    //         console.error('Hubo un problema con la operación fetch:', error);
    //     });
    // })
        
  }

  // Delegación de eventos (un listener para gobernarlos a todos)
  main.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;

    switch (btn.id) {
      case "btn-actualizar":
        renderActualizar();
        break;
      case "btn-clave":
        renderClave();
        break;
      case "btn-volver":
        renderOriginal();
        break;
    //   case "btn-guardar-datos":
    //     ev.preventDefault();
    //     // Aquí luego conectas con tu API
    //     const form = document.querySelector('.formulario');
    //     const formData = new FormData(form)

    //     fetch('http://127.0.0.1:8000/users/update-data', {
    //         method: 'POST',
    //         body: formData
    //     })
    //     .then(response => {
    //         // Verifica si la respuesta es exitosa
    //         if (!response.ok) {
    //             throw new Error(`Error en la petición: ${response.status}`);
    //         }

    //         alert('Datos Actualizados Exitosamente!')
    //     })
    //     .then(data => {
    //         // Maneja los datos de la respuesta del servidor
    //         console.log('Respuesta del servidor:', data);
    //     })
    //     .catch(error => {
    //         // Maneja cualquier error que ocurra durante la petición
    //         console.error('Hubo un problema con la operación fetch:', error);
    //     });

    //     break;
    //   case "btn-guardar-clave":
    //     ev.preventDefault();
    //     // Aquí luego conectas con tu API
    //     alert("Clave actualizada (demo)");
    //     break;
    }
  });
});
