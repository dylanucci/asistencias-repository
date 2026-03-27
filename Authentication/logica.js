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
            errorMsg.style.display = 'none';
            loginSec.style.display = 'none';
            appSec.style.display = 'block';
            console.log("Acceso concedido");
            window.location.href = "http://127.0.0.1:5500/interfaces/principal.html"
        } else {
            errorMsg.style.display = 'block';
            document.getElementById('pass').value = "";
        }
    });
});