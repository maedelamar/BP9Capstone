const userId = +sessionStorage.getItem('userId');
const storyId = +location.href.charAt(location.href.length - 1);

const editTitleInput = document.getElementById('edit-title-input');
const editStoryInput = document.getElementById('edit-story-input');
const editForm = document.getElementById('edit-story-form');
const cancelEditBtn = document.getElementById('edit-cancel-btn');

axios.get(`/api/stories/${storyId}`)
.then(res => {
    if (userId !== res.data.author) {
        location.href = `/story/${storyId}`;
        return;
    }

    editTitleInput.value = res.data.title;
    editStoryInput.value = res.data.story;
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});

function handleEdit(e) {
    e.preventDefault();

    const title = editTitleInput.value.toLowerCase();;
    const story = editStoryInput.value;

    axios.put(`/api/stories/${storyId}`, {title, story})
    .then(res => {
        alert("Story updated.");
        location.href = `/story/${storyId}`;
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    })
}

editForm.addEventListener('submit', handleEdit);
cancelEditBtn.addEventListener('click', () => location.href = `/story/${storyId}`);