const userId = +sessionStorage.getItem('userId');

if (!userId) {
    location.href = '/';
}

const deleteForm = document.getElementById('delete-form');
const cancelBtn = document.getElementById('delete-cancel-btn');

function handleDelete(e) {
    e.preventDefault();

    const password = document.getElementById('delete-confirm-input').value;

    axios.post('/api/password', {id: userId, password}, {headers: {authorization: sessionStorage.getItem('token')}})
    .then(res => {
        if (!res.data) {
            alert("Password is incorrect.");
            return;
        } else {
            const willDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
            if (willDelete) {
                axios.delete(`/api/users/${userId}`, {headers: {authorization: sessionStorage.getItem('token')}})
                .then(res => {
                    alert("Your profile has been deleted. We will miss you.");
                    sessionStorage.clear();
                    location.href = '/';
                })
                .catch(err => {
                    alert("Axios error. Check the console.");
                    console.log(err);
                })
            } else {
                location.href = `/profile/${userId}`;
            }
        }
    })
    .catch(err => {

    });
}

deleteForm.addEventListener('submit', handleDelete);
cancelBtn.addEventListener('click', () => location.href = `/profile/${userId}`);