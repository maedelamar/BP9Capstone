const titleHeader = document.getElementById('story-view-title');
const storySection = document.getElementById('story-content');

const storyId = +location.href.charAt(location.href.length - 1);
const userId = +sessionStorage.getItem('userId');

axios.get(`/api/stories/${storyId}`)
.then(res => {
    titleHeader.textContent = `${res.data.title} by ${res.data.username}`;
    storySection.innerHTML = '';

    const story = res.data.story.split('\n');
    for (let paragraph of story) {
        const p = document.createElement('p');
        p.textContent = paragraph;
        storySection.appendChild(p);
    }

    if (res.data.author === userId) {
        console.log("User is the author.");

        const editLink = document.createElement('a');
        editLink.textContent = 'edit';
        editLink.href = `/edit/${storyId}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';

        deleteBtn.addEventListener('click', () => {
            const willDelete = confirm("Are you sure you want to delete this story? This cannot be undone.");
            if (willDelete) {
                axios.delete(`/api/stories/${storyId}`, {headers: {authorization: sessionStorage.getItem('token')}})
                .then(res => alert("Story deleted."))
                .catch(err => {
                    alert("Axios error. Check the console.");
                    console.log(err);
                });
            }
        });

        storySection.appendChild(editLink);
        storySection.appendChild(deleteBtn);
    }
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});