const logContainer = document.getElementById('log-btn-container');

const welcomeMsg = document.getElementById('welcome-msg');

const writeStoryBtn = document.getElementById('make-story-btn');

const recentSection = document.getElementById('recent-stories');
const highestRatedSection = document.getElementById('highest-rated');



let token = sessionStorage.getItem('token');
let userId = sessionStorage.getItem('userId');

if (!token) {
    logContainer.innerHTML = `<button id="login-btn" class="log-btn">Log In</button>
    <button id="signup-btn" class="log-btn">Sign Up</button>`;
    document.getElementById('login-btn').addEventListener('click', () => location.href = '/login');
    document.getElementById('signup-btn').addEventListener('click', () => location.href = '/signup');
    welcomeMsg.textContent = "Welcome, Guest";
    document.getElementById('make-story-btn').hidden = true;
} else {
    logContainer.innerHTML = `<button id="profile-btn" class="log-btn">Profile</button>`;
    document.getElementById('profile-btn').addEventListener('click', () => location.href = `/profile/${+userId}`);
    document.getElementById('make-story-btn').hidden = false;

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
    if (res.data.length === 0) {
        recentSection.innerHTML = '<p>No stories yet. You can change that!</p>';
        return;
    }

    recentSection.innerHTML = '';
    res.data.forEach(element => {
        recentSection.appendChild(document.createElement('br'));
        const title = document.createElement('a');
        title.className = "front-page-title";
        title.href = `/story/${element.story_id}`;
        title.textContent = element.title;
        const by = document.createElement('em');
        by.textContent = " by ";
        const author = document.createElement('a');
        author.href = `/profile/${element.author}`;
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
    if (res.data.length === 0) {
        highestRatedSection.innerHTML = '<p>No stories yet. You can change that!</p>';
        return;
    }

    highestRatedSection.innerHTML = '';
    res.data.forEach(element => {
        highestRatedSection.appendChild(document.createElement('br'));
        const title = document.createElement('a');
        title.className = "front-page-title"
        title.href = `/story/${element.story_id}`;
        title.textContent = element.title;
        const by = document.createElement('em');
        by.textContent = " by ";
        const author = document.createElement('a');
        author.href = `/profile/${element.author}`;
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