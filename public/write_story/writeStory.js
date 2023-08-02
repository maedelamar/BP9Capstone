const writeStoryForm = document.getElementById('write-story-form');
const writeCancelBtn = document.getElementById('write-cancel-btn');

let author = sessionStorage.getItem("userId");

function handleWrite(e) {
    e.preventDefault();

    const title = document.getElementById('title-input').value;
    const story = document.getElementById('story-input').value;

    if (!title || !story) {
        alert("A required field is empty.");
        return;
    }

    const isPublic = document.getElementById('public-box').checked;

    const timePosted = new Date();

    const body = {author, title, story, timePosted, isPublic};

    const headers = {headers: {authorization: sessionStorage.getItem('token')}};
    console.log(headers);

    axios.post('/api/stories', body, headers)
    .then(res => {
        alert("Story posted!");
        location.href = '/';
    })
    .catch(err => {
        alert("You are not authorized to post your story. Please log in.");
        location.href = '/login';
    });
}

writeStoryForm.addEventListener('submit', handleWrite);

writeCancelBtn.addEventListener('click', () => location.href = '/');