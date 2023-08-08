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
            select s.*, username from bkslf_Stories as s join bkslf_Users as u on s.author = u.user_id order by title;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getStory: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select s.*, rating, username from bkslf_Stories as s
            join bkslf_Ratings as r on s.story_id = r.story_id
            join bkslf_Users as u on r.user_id = u.user_id
            where s.story_id = ${+id};

            select s.*, username from bkslf_Stories as s
            join bkslf_Users as u on s.author = u.user_id
            left join bkslf_Ratings as r on s.story_id = r.story_id
            where s.story_id = ${+id} and r.story_id is null;

            select count(*) from bkslf_Ratings where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    searchByTitle: (req, res) => {
        const {search} = req.query;

        sequelize.query(`
            select s.*, username from bkslf_Stories as s join bkslf_Users as u
            on s.author = u.user_id where title like %${search}% and is_public = true;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getHighestRated: (req, res) => {
        sequelize.query(`
            select a.*, username from (
                select s.*, avg(rating) from bkslf_Stories as s
                join bkslf_Ratings as r on s.story_id = r.story_id
                group by s.story_id
            ) as a
            join bkslf_Users as u on a.author = u.user_id
            order by a.avg desc;
        `) //This is incomplete
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
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

    getByAuthorPublic: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select * from bkslf_Stories
            where author = ${+id} and is_public = true order by time_posted desc limit 15;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getByAuthor: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select * from bkslf_Stories where author = ${+id} order by time_posted desc limit 25;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    searchByAuthor: (req, res) => {
        const {author} = req.query;

        sequelize.query(`
            select s.*, username from bkslf_Stories as s join bkslf_Users as u on s.author = u.user_id
            where author = (select user_id from bkslf_Users where username like '${author}%') and is_public = true
            order by time_posted desc;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    createStory: (req, res) => {
        const {author, title, story, timePosted, isPublic} = req.body;

        sequelize.query(`
            insert into bkslf_Stories (author, title, story, time_posted, is_public)
            values (${+author}, '${title}', '${story}', '${timePosted}', ${isPublic});
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    editStory: (req, res) => {
        const {id} = req.params;
        const {title, story} = req.body;

        sequelize.query(`
            update bkslf_Stories set title = '${title}', story = '${story}' where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    changeVisibility: (req, res) => {
        const {id} = req.params;
        const {isPublic} = req.body;

        sequelize.query(`
            update bkslf_Stories set is_public = ${isPublic} where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    updateRating: (req, res) => {
        const {id} = req.params;
        const {userId, rating} = req.body;

        sequelize.query(`
            update bkslf_Ratings set rating = ${+rating} where user_id = ${+userId} and story_id = ${+id};

            insert into bkslf_Ratings (user_id, story_id, rating) select ${+userId}, ${+id}, ${+rating}
            where not exists(
                select * from bkslf_Ratings where user_id = ${+userId} and story_id = ${+id}
            );
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    deleteStory: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            update bkslf_Comments set story_id = null where story_id = ${+id};

            delete from bkslf_Stories where story_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    }
};