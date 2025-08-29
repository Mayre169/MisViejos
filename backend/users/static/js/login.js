const input_email = document.getElementById('email');
const input_password = document.getElementById('password');
const btn_submit = document.getElementById('btn-submit');
const btn_register = document.getElementById('btn-register');
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const active_btn_submit = [false, false];

const active_btn = () => {
    if (active_btn_submit[0] && active_btn_submit[1]){
        btn_submit.disabled = false;
    } else {
        btn_submit.disabled = true;
    }
}

input_email.addEventListener('input', (e) => {
    const email = e.target.value.trim();

    if (email.length <= 4 || !emailRegex.test(email)){
        input_email.classList.add('input-error');
    } else {
        input_email.classList.remove('input-error');
        active_btn_submit[0] = true;
    }

    active_btn();
});

input_password.addEventListener('input', (e) => {
    const password = e.target.value.trim();

    if (password.length < 6 || password.length > 12) {
        input_password.classList.add('input-error');
    } else {
        input_password.classList.remove('input-error');
        active_btn_submit[1] = true;
    }

    active_btn();
});

btn_register.addEventListener('click', () => {window.location.href = '/users/register'});