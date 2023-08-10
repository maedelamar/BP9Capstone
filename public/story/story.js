const titleHeader = document.getElementById('story-view-title');
const storySection = document.getElementById('story-content');
const commentSection = document.getElementById('comment-section');

const storyId = +location.href.charAt(location.href.length - 1);
const userId = +sessionStorage.getItem('userId');
const permission = +sessionStorage.getItem('permission');

let isPublic = false;

function rateStory(e) {
    e.preventDefault();

    const rating = document.getElementById('rating-select').value;

    axios.put(`/api/stories/rating/${storyId}`, {userId, rating}, {headers: {authorization: sessionStorage.getItem('token')}})
    .then(res => {
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

    isPublic = res.data[0].is_public;

    titleHeader.textContent = `${res.data[0].title} by ${res.data[0].username}`;
    storySection.innerHTML = '';

    const story = res.data[0].story.split('\n');
    for (let paragraph of story) {
        const p = document.createElement('p');
        p.textContent = paragraph;
        storySection.appendChild(p);
    }

    if (res.data[0].author === userId) {
        const headers = {headers: {authorization: sessionStorage.getItem('token')}};

        const changePublicityBtn = document.createElement('button');
        changePublicityBtn.id = 'change-public-btn'
        if (isPublic) {
            changePublicityBtn.textContent = "Make Private";
            changePublicityBtn.addEventListener('click', () => {
                axios.put(`/api/stories/visibility/${storyId}`, {isPublic: !isPublic}, headers)
                .then(res => {
                    alert("This story has been made private.");
                    location.href = `/story/${storyId}`;
                })
            });
        } else {
            changePublicityBtn.textContent = "Make Public";
            changePublicityBtn.addEventListener('click', () => {
                axios.put(`/api/stories/visibility/${storyId}`, {isPublic: !isPublic}, headers)
                .then(res => {
                    alert("This story has been made public.");
                    location.href = `/story/${storyId}`;
                })
                .catch(err => {
                    alert("Axios error. Check the console.");
                    console.log(err);
                })
            });
        }

        const editLink = document.createElement('a');
        editLink.id = 'edit-link'
        editLink.textContent = 'edit';
        editLink.href = `/edit/${storyId}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.id = 'delete-btn';
        deleteBtn.textContent = 'delete';

        deleteBtn.addEventListener('click', () => {
            const willDelete = confirm("Are you sure you want to delete this story? This cannot be undone.");
            if (willDelete) {
                axios.delete(`/api/stories/${storyId}`, headers)
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

        storyBtnContainer = document.createElement('div');
        storyBtnContainer.id = "story-btn-container";

        storyBtnContainer.appendChild(changePublicityBtn);
        storyBtnContainer.appendChild(editLink);
        storyBtnContainer.appendChild(deleteBtn);

        storySection.appendChild(storyBtnContainer);
    } else if (permission > 0) {
        const headers = {headers: {authorization: sessionStorage.getItem('token')}};

        const changePublicityBtn = document.createElement('button');
        changePublicityBtn.id = 'change-public-btn'
        if (isPublic) {
            changePublicityBtn.textContent = "Make Private";
            changePublicityBtn.addEventListener('click', () => {
                axios.put(`/api/stories/visibility/${storyId}`, {isPublic: !isPublic}, headers)
                .then(res => {
                    alert("This story has been made private.");
                    location.href = `/story/${storyId}`;
                })
            });
        } else {
            changePublicityBtn.textContent = "Make Public";
            changePublicityBtn.addEventListener('click', () => {
                axios.put(`/api/stories/visibility/${storyId}`, {isPublic: !isPublic}, headers)
                .then(res => {
                    alert("This story has been made public.");
                    location.href = `/story/${storyId}`;
                })
                .catch(err => {
                    alert("Axios error. Check the console.");
                    console.log(err);
                })
            });
        }

        storyBtnContainer = document.createElement('div');
        storyBtnContainer.id = "story-btn-container";

        storyBtnContainer.appendChild(changePublicityBtn);

        storySection.appendChild(storyBtnContainer);
    }

    const ratingText = document.getElementById('rating');
    if (!res.data[0].rating) {
        ratingText.textContent = "This story has not been rated.";
    } else {
        const finalRating = (res.data[0].rating / res.data[1].count).toFixed(1);
        ratingText.textContent = `Rating: ${finalRating}/5`;
    }

    if (userId && userId !== res.data[0].author) {
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

        document.getElementById('rating-container').appendChild(rateForm);

        rateForm.addEventListener('submit', rateStory);
    }

    axios.get(`/api/comments/story/${storyId}`)
        .then(res => {
            if (isPublic) {
                commentSection.innerHTML = `
                    <form id="comment-form">
                        <label for="comment-input">Write a Comment: </label>
                        <textarea name="comment-input" id="comment-input" cols="30" rows="10"></textarea>
                        <button type="submit">Submit</button>
                    </form>
                    <div id="comment-container"></div>
                `;

                const commentForm = document.getElementById('comment-form');

                commentForm.addEventListener('submit', e => {
                    e.preventDefault();

                    const comment = document.getElementById('comment-input').value;
                    const timePosted = new Date();

                    const headers = {headers: {authorization: sessionStorage.getItem('token')}};

                    axios.post(`/api/comments/${storyId}`, {userId, comment, timePosted}, headers)
                    .then(res => {
                        alert("Comment posted!");
                        location.href = `/story/${storyId}`;
                    })
                    .catch(err => {
                        alert("Axios error. Check the console");
                        console.log(err);
                    });
                });

                const commentContainer = document.getElementById('comment-container');

                if (res.data.length === 0) {
                    commentContainer.innerHTML = '<p>This story has no comments.</p>';
                    return;
                }

                for (let comment of res.data) {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = "comment";
                    commentDiv.innerHTML = `<br><br>
                                            <a href="/profile/${comment.user_id}" class="comment-user">${comment.username}</a>
                                            <p id="comment-${comment.comment_id}" class="comment-text">${comment.comment}</p>`;
                    
                    if (comment.user_id === userId) {
                        const editCommentBtn = document.createElement('button');
                        editCommentBtn.textContent = 'Edit';
                        editCommentBtn.addEventListener('click', () => {
                            editCommentBtn.hidden = true;

                            const editCommentBox = document.createElement('textarea');
                            editCommentBox.rows = "10";
                            editCommentBox.cols - "30";
                            editCommentBox.value = comment.comment;

                            const editConfirmBtn = document.createElement('button');
                            editCommentBtn.type = 'submit';
                            editConfirmBtn.textContent = "Submit";
                            
                            const editCommentForm = document.createElement('form');
                            editCommentForm.id = 'edit-comment-form';
                            editCommentForm.appendChild(editCommentBox);
                            editCommentForm.appendChild(editConfirmBtn);

                            editCommentForm.addEventListener('submit', e => {
                                e.preventDefault();

                                const commentBody = editCommentBox.value;

                                const headers = {headers: {authorization: sessionStorage.getItem('token')}};

                                axios.put(`/api/comments/${comment.comment_id}`, {commentBody}, headers)
                                .then(res => {
                                    const newComment = document.createElement('p');
                                    newComment.id = `comment-${comment.comment_id}`;
                                    newComment.className = 'comment-text';
                                    newComment.textContent = comment.comment;
                                    location.href = `/story/${storyId}`;
                                })
                                .catch(err => {
                                    alert("Axios error. Check the console.");
                                    console.log(err);
                                });
                            });

                            console.log(editCommentForm);

                            document.getElementById(`comment-${comment.comment_id}`).replaceWith(editCommentForm);
                        });

                        commentDiv.appendChild(editCommentBtn);

                        const removeCommentBtn = document.createElement('button');
                        removeCommentBtn.textContent = "Remove";

                        removeCommentBtn.addEventListener('click', () => {
                            const willRemove = confirm("Are you sure you want to remove this comment? It will still exist, but users will not see it.");

                            if (willRemove) {
                                const headers = {headers: {authorization: sessionStorage.getItem('token')}};

                                axios.put(`/api/comments/remove/${comment.comment_id}`, {}, headers)
                                .then(res => {
                                    alert("Your comment has been removed.");
                                    location.href = `/story/${storyId}`;
                                })
                                .catch(err => {
                                    alert("Axios error. Check the console.");
                                    console.log(err);
                                });
                            }
                        });

                        commentDiv.appendChild(removeCommentBtn);
                    } else if (permission > 0) {
                        const removeCommentBtn = document.createElement('button');
                        removeCommentBtn.textContent = "Remove";

                        removeCommentBtn.addEventListener('click', () => {
                            const willRemove = confirm("Are you sure you want to remove this comment? It will still exist, but users will not see it.");

                            if (willRemove) {
                                const headers = {headers: {authorization: sessionStorage.getItem('token')}};

                                axios.put(`/api/comments/remove/${comment.comment_id}`, {}, headers)
                                .then(res => {
                                    alert("Your comment has been removed.");
                                    location.href = `/story/${storyId}`;
                                })
                                .catch(err => {
                                    alert("Axios error. Check the console.");
                                    console.log(err);
                                });
                            }
                        });

                        commentDiv.appendChild(removeCommentBtn);
                    }

                    commentContainer.appendChild(commentDiv);
                }
            } else {
                commentSection.innerHTML = '<p>This story is private.</p>'
            }
        })
        .catch(err => {
            alert("Axios error. Check the console.");
            console.log(err);
        });
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});

document.getElementById('story-back-btn').addEventListener('click', () => location.href = '/');