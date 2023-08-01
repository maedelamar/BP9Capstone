require('dotenv').config();
const {SERVER_PORT} = process.env;
const express = require('express');
const app = express();
const path = require('path');

const {seed} = require('./controllers/seed.js');
const {getAllUsers, getUser, createUser, updateUser, changePassword,
    changePermissions, deleteUser, login} = require('./controllers/userController.js');
const {getAllStories, getStory, searchByTitle, getHighestRated, getLowestRated,
    getByAuthor, createStory, editStory, changeVisibility, updateRating, deleteStory} = require('./controllers/storyController.js');

app.use(express.json());
app.use(express.static('public'));

// Navigation
// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home/home.html'));
});

// Sign up page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup/signup.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login/login.html'));
});

// Write Story Page
app.get('/write', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/write_story/writeStory.html'));
});

// Seed
app.post("/seed", seed);

// Manage Users
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUser);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.put('/api/users/password/:id', changePassword);
app.put('/api/users/permissions/:id', changePermissions);
app.delete('/api/users/:id', deleteUser);
app.post('/api/login', login);

// Manage Stories
app.get('/api/stories', getAllStories);
app.get('/api/stories/:id', getStory);
app.get('/api/stories/search', searchByTitle);
app.get('/api/stories/highest_rated', getHighestRated);
app.get('/api/stories/lowest_rated', getLowestRated);
app.get('/api/stories/author', getByAuthor);
app.post('/api/stories', createStory);
app.put('/api/stories/:id', editStory);
app.put('/api/stories/visibility/:id', changeVisibility);
app.put('/api/stories/rating/:id', updateRating);
app.delete('/api/stories/:id', deleteStory);

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));