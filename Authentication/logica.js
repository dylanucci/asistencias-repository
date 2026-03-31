// Script del login.
// Qué hace: valida el acceso local y redirige al panel principal.
// Qué se puede cambiar: mensajes visibles, credenciales de prueba o la pantalla de destino.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    const loginSec = document.getElementById('login-container');
    const appSec = document.getElementById('app-asistencia');
    const errorMsg = document.getElementById('mensaje-error'); 
    form.addEventListener('submit', (e) => {

        e.preventDefault(); 

        const user = e.target.usuario.value
        const pass = e.target.pass.value

        if (user === "ADMIN" && pass === "1234") {
            console.log("Acceso concedido");
            window.location.assign("../principal/principal.html")
        } else {
            errorMsg.style.display = 'block';
            document.getElementById('pass').value = "";
        }
    });
});