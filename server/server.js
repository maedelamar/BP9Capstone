require('dotenv').config();
const {SERVER_PORT} = process.env;
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const corsOptions = {exposedHeaders: 'Authorization'};

const {seed, seed2, insertColumnToTable} = require('./controllers/seed.js');
const {isAuthenticated} = require('./controllers/isAuthenticated.js');
const {getAllUsers, getUser, getUserByName, createUser, updateUser, changePassword,
    changePermissions, changePrivilages, deleteUser, login, checkPassword} = require('./controllers/userController.js');
const {getAllStories, getStory, searchByTitle, getHighestRated, getLatest, getByAuthorPublic, getByAuthor,
    searchByAuthor, createStory, editStory, changeVisibility, updateRating, deleteStory} = require('./controllers/storyController.js');
const {getStoryComments, getComment, getCommentsByUser, createComment,
    editComment, removeComment} = require('./controllers/commentController.js');
const {getAllMessages, getMessage, getSenders, getMessagesBySender, createMessage,
    editMessage, blockUser, unBlockUser, isNotBlocked} = require('./controllers/messageController.js');

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home/home.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup/signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login/login.html'));
});

app.get('/write', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/write_story/writeStory.html'));
});

app.get('/story/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/story/story.html'));
});

app.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/edit/edit.html'));
});

app.get('/profile/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile/profile.html'));
});

app.get('/update_profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile/update/profileUpdate.html'));
});

app.get('/change_password', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile/password/profilePass.html'));
});

app.get('/delete_profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile/delete/profileDel.html'));
});

app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/messages/messages.html'));
});

app.get('/messages/write', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/messages/writeMessage/writeMessage.html'));
});

app.get('/messages/direct/:otherUser', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/messages/directMsg/directMsg.html'));
})

app.post("/seed", seed);
app.post('/seed2', seed2);
app.post('/new_column', insertColumnToTable);

app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUser);
app.get('/api/users/name/:name', getUserByName)
app.post('/api/users', createUser);
app.put('/api/users/:id', isAuthenticated, updateUser);
app.put('/api/users/password/:id', isAuthenticated, changePassword);
app.put('/api/users/permissions/:id', isAuthenticated, changePermissions);
app.put('/api/users/privilages/:id', isAuthenticated, changePrivilages);
app.delete('/api/users/:id', isAuthenticated, deleteUser);
app.post('/api/login', login);
app.post('/api/password', isAuthenticated, checkPassword);

app.get('/api/stories', getAllStories);
app.get('/api/stories/:id', getStory);
app.get('/api/search_stories', searchByTitle);
app.get('/api/highest_rated_stories', getHighestRated);
app.get('/api/latest_stories', getLatest);
app.get('/api/author_stories_public/:id', getByAuthorPublic);
app.get('/api/author_stories/:id', isAuthenticated, getByAuthor);
app.get('/api/search_author', searchByAuthor);
app.post('/api/stories', isAuthenticated, createStory);
app.put('/api/stories/:id', isAuthenticated, editStory);
app.put('/api/stories/visibility/:id', isAuthenticated, changeVisibility);
app.put('/api/stories/rating/:id', isAuthenticated, updateRating);
app.delete('/api/stories/:id', isAuthenticated, deleteStory);

app.get('/api/comments/story/:storyId', getStoryComments);
app.get('/api/comments/:id', getComment);
app.get('/api/comments/:userId', getCommentsByUser);
app.post('/api/comments/:storyId', isAuthenticated, createComment);
app.put('/api/comments/:id', isAuthenticated, editComment);
app.put('/api/comments/remove/:id', isAuthenticated, removeComment);

app.get('/api/messages', isAuthenticated, getAllMessages);
app.get('/api/messages/:id', isAuthenticated, getMessage);
app.get('/api/messages/senders/:receiver', isAuthenticated, getSenders);
app.get('/api/messages/direct/:sender', isAuthenticated, getMessagesBySender);
app.post('/api/messages', isAuthenticated, isNotBlocked, createMessage);
app.put('/api/messages/:id', isAuthenticated, isNotBlocked, editMessage);
app.post('/api/block', isAuthenticated, isNotBlocked, blockUser);
app.put('/api/unblock', isAuthenticated, isNotBlocked, unBlockUser);

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));