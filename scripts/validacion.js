document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioContacto');

    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        document.getElementById('errorNombre').textContent = '';
        document.getElementById('errorApellido').textContent = '';
        document.getElementById('errorEmail').textContent = '';
        document.getElementById('errorConsulta').textContent = '';

        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const consulta = document.getElementById('consulta').value.trim();

        let esValido = true;

        // Validar nombre
        if (nombre.length < 3) {
            document.getElementById('errorNombre').textContent = 'El nombre debe tener al menos 3 caracteres.';
            esValido = false;
        }

        // Validar apellido
        if (apellido.length < 3) {
            document.getElementById('errorApellido').textContent = 'El apellido debe tener al menos 3 caracteres.';
            esValido = false;
        }

        // Validar correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            document.getElementById('errorEmail').textContent = 'Debe ingresar un correo válido.';
            esValido = false;
        }

        // Validar consulta
        if (consulta.length < 10) {
            document.getElementById('errorConsulta').textContent = 'La consulta debe tener al menos 10 caracteres.';
            esValido = false;
        }

        // Enviar formulario si es válido
        if (esValido) {
            alert('Formulario enviado correctamente.');
            formulario.submit();
        } else {
            alert('Por favor corrija los errores antes de enviar.');
        }
    });
});