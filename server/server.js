require('dotenv').config();
const {SERVER_PORT} = process.env;
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const corsOptions = {exposedHeaders: 'Authorization'};

const {seed} = require('./controllers/seed.js');
const {isAuthenticated} = require('./controllers/isAuthenticated.js');
const {getAllUsers, getUser, createUser, updateUser, changePassword,
    changePermissions, deleteUser, login} = require('./controllers/userController.js');
const {getAllStories, getStory, searchByTitle, getHighestRated, getLatest,
    getByAuthor, createStory, editStory, changeVisibility, updateRating, deleteStory} = require('./controllers/storyController.js');

app.use(express.json());
app.use(cors(corsOptions));
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

// View Story Page
app.get('/story/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/story/story.html'));
});

// Edit Story Page
app.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/edit/edit.html'));
});

// Seed
app.post("/seed", seed);

// Manage Users
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUser);
app.post('/api/users', createUser);
app.put('/api/users/:id', isAuthenticated, updateUser);
app.put('/api/users/password/:id', isAuthenticated, changePassword);
app.put('/api/users/permissions/:id', isAuthenticated, changePermissions);
app.delete('/api/users/:id', isAuthenticated, deleteUser);
app.post('/api/login', login);

// Manage Stories
app.get('/api/stories', getAllStories);
app.get('/api/stories/:id', getStory);
app.get('/api/search_stories', searchByTitle);
app.get('/api/highest_rated_stories', getHighestRated);
app.get('/api/latest_stories', getLatest);
app.get('/api/stories_by_author', getByAuthor);
app.post('/api/stories', isAuthenticated, createStory);
app.put('/api/stories/:id', isAuthenticated, editStory);
app.put('/api/stories/visibility/:id', isAuthenticated, changeVisibility);
app.put('/api/stories/rating/:id', isAuthenticated, updateRating);
app.delete('/api/stories/:id', isAuthenticated, deleteStory);

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));