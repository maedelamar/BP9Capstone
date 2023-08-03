const titleHeader = document.getElementById('story-view-title');
const storySection = document.getElementById('story-content');

const storyId = +location.href.charAt(location.href.length - 1);
const userId = +sessionStorage.getItem('userId');

function rateStory(e) {
    e.preventDefault();

    const rating = document.getElementById('rating-select').value;

    axios.put(`/api/stories/rating/${storyId}`, {rating}, {headers: {authorization: sessionStorage.getItem('token')}})
    .then(res => {
        alert("The story has been rated.");
        location.href = `/story/${storyId}`;
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    });
}

axios.get(`/api/stories/${storyId}`)
.then(res => {
    if (!res.data) {
        location.href = '/';
        return;
    }

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
                .then(res => {
                    alert("Story deleted.");
                    location.href = '/';
                })
                .catch(err => {
                    alert("Axios error. Check the console.");
                    console.log(err);
                });
            }
        });

        storySection.appendChild(editLink);
        storySection.appendChild(deleteBtn);
    }

    const ratingText = document.getElementById('rating');
    ratingText.id = "rating-text";
    if (res.data.rating === 0) {
        ratingText.textContent = "This story has not been rated.";
    } else {
        const finalRating = (res.data.rating / res.data.ratecount).toFixed(1);
        ratingText.textContent = `Rating: ${finalRating}/5`;
    }

    if (userId && userId !== res.data.author) {
        const rateForm = document.createElement('form');
        rateForm.id = 'rate-form';

        const rateLabel = document.createElement('label');
        rateLabel.textContent = "Rate: ";
        const dropDown = document.createElement('select');
        dropDown.name = "rating-select";
        dropDown.id = "rating-select";
        rateLabel.htmlFor = "rating-select";
        for (let i = 1; i <= 5; i++) {
            const rateOption = document.createElement('option');
            rateOption.value = i;
            rateOption.textContent = i;
            dropDown.appendChild(rateOption);
        }

        const rateSubmit = document.createElement('button');
        rateSubmit.type = 'submit';
        rateSubmit.textContent = 'Rate';

        rateForm.appendChild(rateLabel);
        rateForm.appendChild(dropDown);
        rateForm.appendChild(rateSubmit);

        document.querySelector('main').appendChild(rateForm);

        rateForm.addEventListener('submit', rateStory);
    }
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});