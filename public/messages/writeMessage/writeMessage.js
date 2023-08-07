const userId = +sessionStorage.getItem('userId');

if (!userId) {
    location.href = '/';
}

const msgForm = document.getElementById('send-message-form');
const cancelBtn = document.getElementById('msg-cancel-btn');

function handleSendMessage(e) {
    e.preventDefault();

    const receiverName = document.getElementById('msg-receiver').value;
    const message = document.getElementById('message-input').value;

    if (!receiverName || !message) {
        alert("A required field is empty.");
        return;
    }

    axios.get(`/api/users/name/${receiverName}`)
    .then(res => {
        const body = {
            sender: userId,
            receiver: res.data.user_id,
            message,
            timeSent: new Date()
        };

        const headers = {headers: {
            authorization: sessionStorage.getItem('token'),
            otherUser: res.data.user_id,
            you: userId
        }};

        axios.post('/api/messages', body, headers)
        .then(subRes => {
            alert("Message sent!");
            location.href = `/messages/direct/${res.data.user_id}`;
        })
        .catch(subErr => {
            alert("Error creating message. Check the console.");
            console.log(subErr);
        })
    })
    .catch(err => {
        alert("Axios error. Check the console.");
        console.log(err);
    });
}

msgForm.addEventListener('submit', handleSendMessage);
cancelBtn.addEventListener('click', () => location.href = '/messages');