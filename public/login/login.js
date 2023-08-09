const loginForm = document.getElementById('login-form');
const loginCancelBtn = document.getElementById('login-cancel-btn');

function handleLogin(e) {
    e.preventDefault();

    const logCred = document.getElementById('login-cred-input').value;
    const password = document.getElementById('login-password-input').value;

    axios.post('/api/login', {logCred, password})
    .then(async res => {
        const token = await res.data.token;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", res.data.user_id);
        sessionStorage.setItem("permission", res.data.permission);
        alert("Successfully logged in");
        location.href = '/';
    })
    .catch(err => {
        alert("Bad username or password");
    });
}

loginForm.addEventListener('submit', handleLogin);

loginCancelBtn.addEventListener('click', () => location.href = '/');