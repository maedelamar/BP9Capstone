const logContainer = document.getElementById('log-btn-container');

const welcomeMsg = document.getElementById('welcome-msg');

const writeStoryBtn = document.getElementById('make-story-btn');

const recentSection = document.getElementById('recent-stories');
const highestRatedSection = document.getElementById('highest-rated');



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
    });
}

axios.get('/api/latest_stories')
.then(res => {
    recentSection.innerHTML = '';
    res.data.forEach(element => {
        const title = document.createElement('a');
        title.className = "front-page-title";
        title.href = `/api/stories/${element.story_id}`;
        title.textContent = element.title;
        const by = document.createElement('em');
        by.textContent = " by ";
        const author = document.createElement('a');
        author.href = `/api/users/${element.author}`;
        author.textContent = element.username;
        const p = document.createElement('p');
        p.appendChild(title);
        p.appendChild(by);
        p.appendChild(author);
        recentSection.appendChild(p);
    });
})
.catch(err => console.log(err));

axios.get('/api/highest_rated_stories')
.then(res => {
    highestRatedSection.innerHTML = '';
    res.data.forEach(element => {
        const title = document.createElement('a');
        title.className = "front-page-title"
        title.href = `/api/stories/${element.story_id}`;
        title.textContent = element.title;
        const by = document.createElement('em');
        by.textContent = " by ";
        const author = document.createElement('a');
        author.href = `/api/users/${element.author}`;
        author.textContent = element.username;
        const p = document.createElement('p');
        p.appendChild(title);
        p.appendChild(by);
        p.appendChild(author);
        highestRatedSection.appendChild(p);
    });
})
.catch(err => console.log(err));



writeStoryBtn.addEventListener('click', () => location.href = '/write');