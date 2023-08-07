let mode = 'view';

const userId = +sessionStorage.getItem('userId');
const profileId = +location.href.charAt(location.href.length - 1);

if (userId === profileId) {
    mode = 'interact';
} else {
    mode = 'view';
}

function destroySession() {
    sessionStorage.clear();
    location.href = '/';
}

const openNav = () => document.getElementById('nav').style.width = '33%';

const closeNav = () => document.getElementById('nav').style.width = '0%';

axios.get(`/api/users/${profileId}`)
.then(res => {
    document.getElementById('author-name').textContent = res.data.username;
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});

if (mode === 'view') {
    axios.get(`/api/author_stories_public/${profileId}`)
    .then(res => {
        const authorStories = document.getElementById('author-stories');

        if (res.data.length === 0) {
            authorStories.innerHTML = '<p>This author has no public stories.</p>';
            return;
        }

        for (let story of res.data) {
            const title = document.createElement('a');
            title.className = 'author-story-title';
            title.textContent = story.title;
            title.href = `/story/${story.story_id}`;
            const p = document.createElement('p');
            p.appendChild(title);
            authorStories.appendChild(p);
        }
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    })
} else if (mode === 'interact') {
    axios.get(`/api/author_stories/${profileId}`, {headers: {authorization: sessionStorage.getItem('token')}})
    .then(res => {
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'log-btn';
        settingsBtn.textContent = 'Settings';
        settingsBtn.addEventListener('click', openNav);
        document.querySelector('header').appendChild(settingsBtn);

        const messageLink = document.getElementById('messages-link');
        const profileUpdateLink = document.getElementById('profile-update-link');
        const passwordChangeLink = document.getElementById('password-change-link');
        const logoutLink = document.getElementById('logout-link');
        const profileDeleteLink = document.getElementById('profile-delete-link');

        messageLink.addEventListener('click', () => location.href = '/messages');
        profileUpdateLink.addEventListener('click', () => location.href = `/update_profile`);
        passwordChangeLink.addEventListener('click', () => location.href = `/change_password`);
        logoutLink.addEventListener('click', destroySession);
        profileDeleteLink.addEventListener('click', () => location.href = `/delete_profile`);

        const authorStories = document.getElementById('author-stories');

        if (res.data.length === 0) {
            authorStories.innerHTML = '<p>You have not written any stories.</p>';
            return;
        }

        for (let story of res.data) {
            const title = document.createElement('a');
            title.className = 'author-story-title';
            title.textContent = story.title;
            title.href = `/story/${story.story_id}`;
            const p = document.createElement('p');
            p.appendChild(title);
            authorStories.appendChild(p);
        }
    })
    .catch(err => {
        alert('Axios error. Check the console.');
        console.log(err);
    })
} else {
    alert('Something has gone wrong. Check the console.');
    console.log(mode);
}