const userId = +sessionStorage.getItem('userId');

if (!userId) {
    location.href = '/';
}

const passwordForm = document.getElementById('chng-pass-form');
const cancelBtn = document.getElementById('pass-cancel-btn');

function handleChangePassword(e) {
    e.preventDefault();

    const password = document.getElementById('password-input').value;
    const confirmPass = document.getElementById('password-confirm').value;

    if (!password) {
        alert("Password cannot be empty.");
        return;
    }
    if (password !== confirmPass) {
        alert("Passwords must match.");
        return;
    }

    axios.put(`/api/users/password/${userId}`, {password}, {headers: {authorization: sessionStorage.getItem('token')}})
    .then(res => {
        alert("Your password has been changed. Please Log back in.");
        sessionStorage.clear();
        location.href = '/';
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    });
}

passwordForm.addEventListener('submit', handleChangePassword);
cancelBtn.addEventListener('click', () => location.href = `/profile/${userId}`);