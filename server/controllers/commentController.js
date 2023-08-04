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
    getStoryComments: (req, res) => {
        const {storyId} = req.params;

        sequelize.query(`
            select c.*, u.user_id, username from bkslf_Comments as c
            join bkslf_UserComment as uc on c.comment_id = uc.comment_id
            join bkslf_Users as u on uc.user_id = u.user_id
            where story_id = ${+storyId} and is_visible = true order by time_posted desc;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    },

    getComment: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select c.*, u.user_id, username from bkslf_Comments as c
            join bkslf_UserComment as uc on c.comment_id = uc.comment_id
            join bkslf_Users as u on uc.user_id = u.user_id
            where comment_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0][0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    },

    getCommentsByUser: (req, res) => {
        const {userId} = req.params;

        sequelize.query(`
            select c.*, u.user_id, username from bkslf_Comments as c
            join bkslf_UserComment as uc on c.comment_id = uc.comment_id
            join bkslf_Users as u on uc.user_id = u.user_id
            where user_id = ${+userId} order by time_posted desc;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]));
    },

    createComment: (req, res) => {
        const {storyId} = req.params;
        const {userId, comment, timePosted} = req.body;

        if (comment.includes(';') || comment.includes("'") || comment.includes(')')) {
            res.status(400).send("Do not use these characters.");
            return;
        }

        sequelize.query(`
            insert into bkslf_Comments (story_id, comment, time_posted, is_visible)
            values (${+storyId}, '${comment}', '${timePosted}', true);

            insert into bkslf_UserComment (user_id, comment_id)
            values (${+userId},
                (select comment_id from bkslf_Comments where comment = '${comment}' and time_posted = '${timePosted}')
            );
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    editComment: (req, res) => {
        const {id} = req.params;
        const {commentBody} = req.body;

        if (commentBody.includes(';') || commentBody.includes("'") || commentBody.includes(')')) {
            res.status(400).send("Do not use these characters.");
            return;
        }

        sequelize.query(`
            update bkslf_Comments set comment = '${commentBody}' where comment_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    },

    removeComment: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            update bkslf_Comments set is_visible = false where comment_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    }
};