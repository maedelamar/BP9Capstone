const writeStoryForm = document.getElementById('write-story-form');
const writeCancelBtn = document.getElementById('write-cancel-btn');

const author = 1; // Change this later

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

    axios.post('/api/stories', {author, title, story, timePosted, isPublic})
    .then(res => {
        alert("Story posted!");
        location.href = '/';
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    });
}

writeStoryForm.addEventListener('submit', handleWrite);

writeCancelBtn.addEventListener('click', () => location.href = '/');