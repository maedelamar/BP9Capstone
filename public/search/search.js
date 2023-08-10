const queries = location.href.split('?')[1].split('&');

const queryType = queries[0].split('=')[1];
const search = queries[1].split('=')[1];

document.getElementById('search-back-btn').addEventListener('click', () => location.href = '/');

const searchSection = document.getElementById('search-section');

axios.get(`/api/search_${queryType}?search=${search}`)
.then(res => {
    console.log(res.data);
    for (let result of res.data) {
        const a = document.createElement('a');
        if (queryType === 'stories') {
            a.textContent = `${result.title} by ${result.username}`;
            a.href = `/story/${result.story_id}`;
        } else {
            a.textContent = result.username;
            a.href = `/profile/${result.user_id}`;
        }
        searchSection.appendChild(a);
    }
})
.catch(err => {
    alert("Axios error. Check the console.");
    console.log(err);
});