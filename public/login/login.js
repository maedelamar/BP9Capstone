const loginForm = document.getElementById('login-form');
const loginCancelBtn = document.getElementById('login-cancel-btn');

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email-input').value;
    const password = document.getElementById('login-password-input').value;

    axios.post('/api/login', {email, password})
    .then(async res => {
        const token = await res.data.token;
        alert("Successfully logged in");
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", res.data.user_id);
        location.href = '/';
    })
    .catch(err => {
        alert("Bad username or password");
    });
}

loginForm.addEventListener('submit', handleLogin);

loginCancelBtn.addEventListener('click', () => location.href = '/');