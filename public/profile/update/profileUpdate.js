const userId = +sessionStorage.getItem('userId');

if (!userId) {
    location.href = '/';
}

const updateForm = document.getElementById('update-form');
const cancelBtn = document.getElementById('update-cancel-btn');

axios.get(`/api/users/${userId}`)
.then(res => {
    console.log(res.data);
    document.getElementById('update-username-input').value = res.data.username;
    document.getElementById('update-email-input').value = res.data.email;
    document.getElementById('update-birthday-input').value = res.data.birthday;
    document.getElementById('update-pronoun-input').value = res.data.pronouns;
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});

function handleUpdate(e) {
    e.preventDefault();

    const username = document.getElementById('update-username-input').value;
    const email = document.getElementById('update-email-input').value;
    const birthday = document.getElementById('update-birthday-input').value;
    const pronouns = document.getElementById('update-pronoun-input').value;

    if (!username || !email || !birthday) {
        alert("A required field is empty.");
        return;
    }

    axios.put(`/api/users/${userId}`, {username, email, birthday, pronouns}, {headers: {authorization: sessionStorage.getItem('token')}})
    .then(res => {
        alert("Your profile has been updated.");
        location.href = `/profile/${userId}`;
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    })
}

updateForm.addEventListener('submit', handleUpdate);
cancelBtn.addEventListener('click', () => location.href = `/profile/${userId}`);