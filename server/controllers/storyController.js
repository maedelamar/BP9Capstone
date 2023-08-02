require('dotenv').config();
const {CONNECTION_STRING} = process.env;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = {
    getAllStories: (req, res) => {
        sequelize.query(`
            select * from bkslf_Stories;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    getStory: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select * from bkslf_Stories where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    searchByTitle: (req, res) => {
        const {search} = req.query;

        sequelize.query(`
            select * from bkslf_Stories where title like %${search}% and is_public = true;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    getHighestRated: (req, res) => {
        sequelize.query(`
            select s.*, username from bkslf_Stories as s join bkslf_Users as u
            on s.author = u.user_id where is_public = true order by rating desc limit 10;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    getLatest: (req, res) => {
        sequelize.query(`
            select s.*, username from bkslf_Stories as s join bkslf_Users as u
            on s.author = u.user_id where is_public = true order by time_posted desc limit 10;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr)
        });
    },

    getByAuthor: (req, res) => {
        const {author} = req.query;

        sequelize.query(`
            select * from bkslf_Stories
            where author = (select user_id from bkslf_Users where username like '${author}%') and is_public = true;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    createStory: (req, res) => {
        const {author, title, story, timePosted, isPublic} = req.body;

        sequelize.query(`
            insert into bkslf_Stories (author, title, story, time_posted, is_public, rating)
            values (${+author}, '${title}', '${story}', '${timePosted}', ${isPublic}, 0);
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    editStory: (req, res) => {
        const {id} = req.params;
        const {title, story} = req.body;

        sequelize.query(`
            update bkslf_Stories set title = '${title}', story = '${story}' where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(400).send(dbErr));
    },

    changeVisibility: (req, res) => {
        const {id} = req.params;
        const {isPublic} = req.body;

        sequelize.query(`
            update bkslf_Stories set is_public = ${isPublic} where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    updateRating: (req, res) => {
        const {id} = req.params;
        const {rating} = req.body;

        sequelize.query(`
            update bkslf_Stories set rating = ${+rating} where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    deleteStory: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            delete from bkslf_Stories where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    }
};