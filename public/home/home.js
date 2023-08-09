const logContainer = document.getElementById('log-btn-container');

const welcomeMsg = document.getElementById('welcome-msg');

const writeStoryBtn = document.querySelector('.make-story-btn');

const recentTable = document.getElementById('recent-story-table');
const highestRatedTable = document.getElementById('highest-rated-table');



let token = sessionStorage.getItem('token');
let userId = sessionStorage.getItem('userId');

writeStoryBtn.hidden = true;

if (!userId) {
    logContainer.innerHTML = `<button id="login-btn" class="log-btn">Log In</button>
    <button id="signup-btn" class="log-btn">Sign Up</button>`;
    document.getElementById('login-btn').addEventListener('click', () => location.href = '/login');
    document.getElementById('signup-btn').addEventListener('click', () => location.href = '/signup');
    welcomeMsg.textContent = "Welcome, Guest";
} else {
    logContainer.innerHTML = `<button id="profile-btn" class="log-btn">Profile</button>`;
    document.getElementById('profile-btn').addEventListener('click', () => location.href = `/profile/${+userId}`);
    writeStoryBtn.hidden = false;

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
        const td = document.createElement('td');
        td.textContent = 'No stories yet. You can change that!';

        const tr = document.createElement('tr');
        tr.appendChild(td);

        recentTable.appendChild(tr);

        return;
    }

    res.data.forEach(element => {
        const title = document.createElement('a');
        title.className = "front-page-title";
        title.href = `/story/${element.story_id}`;
        title.textContent = element.title;
        const by = document.createElement('em');
        by.textContent = " by ";
        const author = document.createElement('a');
        author.href = `/profile/${element.author}`;
        author.textContent = element.username;
        const td = document.createElement('td');
        td.appendChild(title);
        td.appendChild(by);
        td.appendChild(author);

        const tr = document.createElement('tr');
        tr.appendChild(td);

        recentTable.appendChild(tr);
    });
})
.catch(err => console.log(err));

axios.get('/api/highest_rated_stories')
.then(res => {
    if (res.data.length === 0) {
        const td = document.createElement('td');
        td.textContent = 'No stories have been rated yet.';

        const tr = document.createElement('tr');
        tr.appendChild(td);

        highestRatedTable.appendChild(tr);

        return;
    }

    res.data.forEach(element => {
        const title = document.createElement('a');
        title.className = "front-page-title"
        title.href = `/story/${element.story_id}`;
        title.textContent = element.title;
        const by = document.createElement('em');
        by.textContent = " by ";
        const author = document.createElement('a');
        author.href = `/profile/${element.author}`;
        author.textContent = element.username;
        const td = document.createElement('td');
        td.appendChild(title);
        td.appendChild(by);
        td.appendChild(author);

        const tr = document.createElement('tr');
        tr.appendChild(td);

        highestRatedTable.appendChild(tr);
    });
})
.catch(err => console.log(err));



writeStoryBtn.addEventListener('click', () => location.href = '/write');