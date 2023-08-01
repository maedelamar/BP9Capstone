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

const bcrypt = require('bcryptjs');

// Private functions
const toCipher = character => String.fromCharCode((character.charCodeAt(0) - 12) * 2 - 6);

module.exports = {
    getAllUsers: (req, res) => {
        sequelize.query(`
            select * from bkslf_Users;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    getUser: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select * from bkslf_Users where user_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    createUser: (req, res) => {
        const {username, email, password, birthday, pronouns} = req.body;

        const cipher = password.split('').map(character => toCipher(character)).join('');
        const saltRounds = 15;

        bcrypt.hash(cipher, saltRounds, (error, passHash) => {
            sequelize.query(`
                insert into bkslf_Users (username, email) values ('${username}', '${email}');

                insert into bkslf_Passwords (user_id, passHash)
                values ((select user_id from bkslf_Users where email = '${email}'), '${passHash}');

                insert into bkslf_UserDetails (user_id, birthday, pronouns, permission, can_comment)
                values ((select user_id from bkslf_Users where email = '${email}'), ${birthday}, '${pronouns}', 0, true);
            `)
            .then(dbRes => res.status(200).send({success: false, result: dbRes[0]}))
            .catch(dbErr => res.status(200).send({success: false, message: "Email already exists"}));
        });
    },

    updateUser: (req, res) => {
        const {id} = req.params;
        const {username, email, birthday, pronouns} = req.body;

        sequelize.query(`
            update bkslf_Users set username = '${username}', email = '${email}' where user_id = ${+id};

            update bkslf_UserDetails set birthday = ${birthday}, pronouns = '${pronouns}' where user_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(400).send(dbErr));
    },

    changePassword: (req, res) => {
        const {id} = req.params;
        const {password} = req.body;

        const cipher = password.split('').map(character => toCipher(character)).join('');
        const saltRounds = 15;

        bcrypt.hash(cipher, saltRounds, (error, passHash) => {
            sequelize.query(`
                update bkslf_Passwords set passHash = '${passHash}' where user_id = ${+id};
            `)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(dbErr => res.status(400).send(dbErr));
        });
    },

    changePermissions: (req, res) => {
        const {id} = req.params;
        const {permission} = req.body;

        sequelize.query(`
            update bkslf_UserDetails set permission = ${permission} where user_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    deleteUser: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            delete from bkslf_Users where user_id = ${+id} cascade;

            delete from bkslf_Stories where user_id = ${+id} cascade;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    login: (req, res) => {
        const {email, password} = req.body;
        let userData;

        sequelize.query(`
            select email, passHash from bkslf_Users as u join bkslf_Passwords as p
            on u.user_id = p.user_id where email = '${email}';
        `)
        .then(dbRes => {
            userData = dbRes[0][0];

            const cipher = password.split('').map(character => toCipher(character)).join('');
            bcrypt.compare(cipher, userData.passhash, (error, result) => {
                if (!error) {
                    if (result) {
                        res.status(200).send({success: true, content: userData});
                    } else {
                        console.log("Password was wrong");
                        res.status(200).send({success: false, message: "Bad username or password"});
                    }
                } else {
                    console.log("Error in bcrypt.compare()");
                    res.status(500).send({success: false, message: "Error in bcrypt.compare()"});
                }
            });
        })
        .catch(dbErr => {
            console.log(dbErr);
            res.status(200).send({success: false, message: "Bad username or password"});
        });
    }
};