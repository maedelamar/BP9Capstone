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
    getAllMessages: (req, res) => {
        sequelize.query(`
            select * from bkslf_Messages;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getMessage: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select m.*, username from bkslf_Messages as m join bkslf_Users as u
            on m.sender = u.user_id where message_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0][0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getSenders: (req, res) => {
        const {receiver} = req.params;

        sequelize.query(`
            select sender, message, time_sent, username from bkslf_Messages as m join bkslf_Users as u
            on m.sender = u.user_id where receiver = ${+receiver}
            order by time_sent desc limit 1;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getMessagesBySender: (req, res) => {
        const {sender} = req.params;
        const {receiver} = req.query;

        sequelize.query(`
            select sender, receiver, message, time_sent, username from bkslf_Messages as m join bkslf_Users as u
            on m.sender = u.user_id where sender = ${+sender} or sender = ${+receiver} order by time_sent;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    createMessage: (req, res) => {
        const {sender, receiver, message, timeSent} = req.body;

        sequelize.query(`
            insert into bkslf_Messages (sender, receiver, message, time_sent)
            values (${+sender}, ${+receiver}, '${message}', '${timeSent}');
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    editMessage: (req, res) => {
        const {id} = req.params;
        const {message} = req.body;

        sequelize.query(`
            update bkslf_Messages set message = '${message}' where message_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    blockUser: (req, res) => {
        const {blockingId, blockedId} = req.body;

        sequelize.query(`
            select user_blocking_id, blocked_user_id case when exists
            (select * from bkslf_BlockedUsers where user_blocking_id = ${+blockingId} and blocked_user_id = ${+blockedId})
            then (update bkslf_BlockedUsers set in_use = true where user_blocking_id = ${+blockingId} and blocked_user_id = ${+blockedId})
            else (insert into bkslf_BlockedUsers (user_blocking_id, blocked_user_id, in_use)
            values (${+blockingId}, ${+blockedId}, true)) end
            from bkslf_BlockedUsers;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    unBlockUser: (req, res) => {
        const {blockingId, blockedId} = req.body;

        sequelize.query(`
            update bkslf_BlockedUsers set in_use = false
            where user_blocking_id = ${+blockingId} and blocked_user_id = ${+blockedId};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    isNotBlocked: (req, res, next) => {
        console.log(req.headers);
        const {otheruser, you} = req.headers;

        sequelize.query(`
            select count(*) from bkslf_BlockedUsers
            where user_blocking_id = ${otheruser} and blocked_user_id = ${you} and in_use = true;
        `)
        .then(dbRes => {
            if (dbRes[0][0].count > 0) {
                const error = new Error("This user has blocked you.");
                error.statusCode = 403;
                throw error;
            }

            next();
        })
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    }
};