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
        mainSection.appendChild(link);
    }
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});