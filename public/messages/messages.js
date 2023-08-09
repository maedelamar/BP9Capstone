const userId = +sessionStorage.getItem('userId');

if (!userId) {
    location.href = '/';
}

const mainSection = document.querySelector('main');

axios.get(`/api/messages/senders/${userId}`, {headers: {authorization: sessionStorage.getItem('token')}})
.then(res => {
    for (let sender of res.data) {
        const link = document.createElement('a');
        link.className = "dm-link";
        link.href = `/messages/direct/${sender.sender}`;
        link.textContent = sender.username;

        const shortMessage = document.createElement('p');
        shortMessage.className = 'short-message';
        if (sender.message.length > 30) {
            let i = 30;
            while (sender.message.charAt(i) !== ' ') {
                i++;
            }
            shortMessage.textContent = sender.message.slice(0, i) + '...';
        } else {
            shortMessage.textContent = sender.message;
        }

        const messengerContainer = document.createElement('div');
        messengerContainer.className = 'messenger-container';

        messengerContainer.appendChild(link);
        messengerContainer.appendChild(shortMessage);

        mainSection.appendChild(messengerContainer);
    }
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});

document.getElementById('msg-back-btn').addEventListener('click', () => location.href = `/profile/${userId}`);