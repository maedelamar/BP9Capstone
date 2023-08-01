require('dotenv').config();
const {SERVER_PORT} = process.env;
const express = require('express');
const app = express();
const path = require('path');

const {seed} = require('./controllers/seed.js');
const {getAllUsers, getUser, createUser, updateUser, changePassword,
    changePermissions, deleteUser, login} = require('./controllers/userController.js');

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

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}`));