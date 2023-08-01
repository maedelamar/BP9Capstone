const loginForm = document.getElementById('login-form');

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email-input').value;
    const password = document.getElementById('login-password-input').value;

    axios.post('/api/login', {email, password})
    .then(res => {
        if (res.data.success) {
            alert("Successfully logged in");
            location.href = '/';
        } else {
            alert(res.data.message);
        }
    })
    .catch(err => {
        alert("Axios error, check console");
        console.log(err);
    })
}

loginForm.addEventListener('submit', handleLogin);