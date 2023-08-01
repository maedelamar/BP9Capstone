const signupForm = document.getElementById('signup-form');
const signupCancelBtn = document.getElementById('signup-cancel-btn');

function handleSignup(e) {
    e.preventDefault();

    const password = document.getElementById('signup-password-input').value;
    const passConfirm = document.getElementById('signup-password-confirm').value;

    if (password !== passConfirm) {
        alert("Passwords do not match");
        return;
    }

    const username = document.getElementById('signup-username-input').value;
    const email = document.getElementById('signup-email-input').value;
    const birthday = document.getElementById('signup-birthday-input').value;
    const pronouns = document.getElementById('signup-pronoun-input').value;

    if (!username || !email || !birthday || !password) {
        alert("Missing required field");
        return;
    }

    axios.post('/api/users', {username, email, password, birthday, pronouns})
    .then(res => {
        alert("Welcome to Bookshelf");
        location.href = '/';
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    });
}

signupForm.addEventListener('submit', handleSignup);

signupCancelBtn.addEventListener('click', () => location.href = '/');