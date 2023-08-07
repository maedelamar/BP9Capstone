const userId = +sessionStorage.getItem('userId');

if (!userId) {
    location.href = '/';
}

let otherUser = +location.href.charAt(location.href.length - 1);

const messagePlace = document.getElementById('messages');

const headers = {headers: {
    authorization: sessionStorage.getItem('token'),
    otherUser,
    you: userId
}};

axios.get(`/api/messages/direct/${otherUser}?receiver=${userId}`, headers)
.then(res => {
    document.getElementById('other-person-name').textContent = res.data[0].username;

    for (let message of res.data) {
        const messageContainer = document.createElement('div');
        if (message.receiver === userId) {
            messageContainer.className = 'received-message';
        } else {
            messageContainer.className = 'sent-message';
        }

        const messageContent = document.createElement('p');
        messageContent.textContent = message.message;
        messageContainer.appendChild(messageContent);

        messagePlace.appendChild(messageContainer);
    }

    const newMsgForm = document.createElement('form');
    newMsgForm.id = 'new-msg-form';

    const msgInput = document.createElement('input');
    msgInput.id = 'new-msg-input';
    msgInput.placeholder = "Write a message";

    const sendMsgBtn = document.createElement('button');
    sendMsgBtn.id = 'send-msg-btn';
    sendMsgBtn.textContent = 'Send';
    sendMsgBtn.type = 'submit';

    newMsgForm.appendChild(msgInput);
    newMsgForm.appendChild(sendMsgBtn);

    newMsgForm.addEventListener('submit', e => {
        e.preventDefault();

        const message = document.getElementById('new-msg-input').value;

        const body = {
            sender: userId,
            receiver: otherUser,
            message,
            timeSent: new Date()
        };

        axios.post('/api/messages', body, headers)
        .then(res => location.href = `/messages/direct/${otherUser}`)
        .catch(err => {
            alert("Axios error. Check the console.");
            console.log(err);
        });
    });

    messagePlace.appendChild(newMsgForm);
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
})