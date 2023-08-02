const logContainer = document.getElementById('log-btn-container');

const welcomeMsg = document.getElementById('welcome-msg');

const writeStoryBtn = document.getElementById('make-story-btn');

const recentSection = document.getElementById('recent-stories');



function destorySession() {
    sessionStorage.clear();
    location.href = '/';
}

let token = sessionStorage.getItem('token');
let userId = sessionStorage.getItem('userId');

if (!token) {
    logContainer.innerHTML = `<button id="login-btn" class="log-btn">Log In</button>
    <button id="signup-btn" class="log-btn">Sign Up</button>`;
    document.getElementById('login-btn').addEventListener('click', () => location.href = '/login');
    document.getElementById('signup-btn').addEventListener('click', () => location.href = '/signup');
    welcomeMsg.textContent = "Welcome, Guest";
} else {
    logContainer.innerHTML = `<button id="logout-btn" class="log-btn">Log Out</button>`;
    document.getElementById('logout-btn').addEventListener('click', destorySession);

    axios.get(`/api/users/${userId}`)
    .then(res => {
        welcomeMsg.textContent = `Welcome, ${res.data.username}`;
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    })
}

axios.get('/api/stories/latest')
.then(res => {
    res.data.forEach(element => {
        const title = element.title;
        axios.get(`/api/users/${element.author}`)
        .then(subRes => {
            const author = subRes.user_id;
            const p = document.createElement('p');
            p.textContent = `${title} by ${author}`;
            recentSection.appendChild(p);
        })
        .catch(subErr => console.log(subErr));
    });
})
.catch(err => console.log(err));



writeStoryBtn.addEventListener('click', () => location.href = '/write');