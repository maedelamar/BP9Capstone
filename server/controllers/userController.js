require('dotenv').config();
const {CONNECTION_STRING, SECRET} = process.env;

const jwt = require('jsonwebtoken');

function createToken(email, id) {
    return jwt.sign(
        {
            email,
            id
        },
        SECRET,
        {
            expiresIn: '2 days'
        }
    );
}

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

const toCipher = character => String.fromCharCode((character.charCodeAt(0) - 12) * 2 - 6);

module.exports = {
    getAllUsers: (req, res) => {
        sequelize.query(`
            select * from bkslf_Users order by username;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    getUser: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            select u.*, d.* from bkslf_Users as u join bkslf_UserDetails as d
            on u.user_id = d.user_id where u.user_id = ${+id};
        `)
        .then(dbRes => {
            dbRes[0][0].birthday = dbRes[0][0].birthday.toISOString().split('T')[0];
            res.status(200).send(dbRes[0][0]);
        })
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    getUserByName: (req, res) => {
        const {name} = req.params;

        sequelize.query(`
            select * from bkslf_Users where username = '${name}';
        `)
        .then(dbRes => res.status(200).send(dbRes[0][0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    },

    createUser: (req, res) => {
        const {username, email, password, birthday, pronouns} = req.body;

        const cipher = password.split('').map(character => toCipher(character)).join('');

        sequelize.query(`
            select count(*) from bkslf_Users where username = '${username}';
        `)
        .then(dbRes => {
            if (+dbRes[0][0].count !== 0) {
                return res.status(400).send("Username is already taken.");
            }

            sequelize.query(`
                select count(*) from bkslf_Users where email = '${email}';
            `)
            .then(dbRes1 => {
                if (+dbRes1[0][0].count) {
                    return res.status(400).send("Email is already in use.");
                }

                const salt = bcrypt.genSaltSync(15);
                const passHash = bcrypt.hashSync(cipher, salt);

                sequelize.query(`
                    insert into bkslf_Users (username, email)
                    values ('${username}', '${email}');

                    insert into bkslf_Passwords (user_id, passHash)
                    values ((select user_id from bkslf_Users where email = '${email}'), '${passHash}');

                    insert into bkslf_UserDetails (user_id, birthday, pronouns, permission, can_comment)
                    values ((select user_id from bkslf_Users where email = '${email}'), '${birthday}',
                    '${pronouns}', 0, true);

                    select * from bkslf_Users where email = '${email}';
                `)
                .then(dbRes2 => {
                    const token = createToken(email, dbRes2[0][0].user_id);
                    const userToSend = {...dbRes2[0][0], token};
                    res.status(200).send(userToSend);
                })
                .catch(dbErr2 => res.status(500).send(dbErr2));
            })
            .catch(dbErr1 => res.status(500).send(dbErr1));
        })
        .catch(dbErr => res.status(500).send(dbErr));
    },

    updateUser: (req, res) => {
        const {id} = req.params;
        const {username, email, birthday, pronouns} = req.body;

        sequelize.query(`
            update bkslf_Users set username = '${username}', email = '${email}' where user_id = ${+id};

            update bkslf_UserDetails set birthday = '${birthday}', pronouns = '${pronouns}' where user_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0][0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(400).send(dbErr)
        });
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
            .then(dbRes => res.status(200).send(dbRes[0][0]))
            .catch(dbErr => res.status(400).send(dbErr));
        });
    },

    changePermissions: (req, res) => {
        const {id} = req.params;
        const {permission} = req.body;

        sequelize.query(`
            update bkslf_UserDetails set permission = ${permission} where user_id = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0][0]))
        .catch(dbErr => res.status(500).send(dbErr));
    },

    deleteUser: (req, res) => {
        const {id} = req.params;

        sequelize.query(`
            delete from bkslf_Passwords where user_id = ${+id};

            delete from bkslf_UserDetails where user_id = ${+id};

            delete from bkslf_Users where user_id = ${+id};

            delete from bkslf_Stories where author = ${+id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0][0]))
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    login: (req, res) => {
        const {logCred, password} = req.body;
        let userData;

        let credType;
        if (logCred.includes('.com') || logCred.includes('.net') || logCred.includes('.edu')) {
            credType = "email";
        } else {
            credType = "username";
        }

        if (logCred.includes("'") || logCred.includes(';') || logCred.includes('(') || logCred.includes(')') || logCred.includes('=')) {
            return res.status(400).send("We know what you're trying to do.");
        }

        const cipher = password.split('').map(character => toCipher(character)).join('');

        sequelize.query(`
            select u.*, passHash from bkslf_Users as u join bkslf_Passwords as p
            on u.user_id = p.user_id where ${credType} = '${logCred}';
        `)
        .then(dbRes => {
            if (!dbRes[0][0]) {
                return res.status(400).send("Bad email or password");
            }

            const authenticated = bcrypt.compareSync(cipher, dbRes[0][0].passhash);
            if (!authenticated) {
                return res.status(400).send("Bad email or password");
            }
            delete dbRes[0][0].passhash;
            const token = createToken(logCred, dbRes[0][0].user_id);
            const userToSend = {...dbRes[0][0], token};
            res.status(200).send(userToSend);
        })
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        });
    },

    checkPassword: (req, res) => {
        const {id, password} = req.body;

        if (password.includes("'") || password.includes(';') || password.includes('(') || password.includes(')') || password.includes('=')) {
            return res.status(400).send("We know what you're trying to do.");
        }

        const cipher = password.split('').map(character => toCipher(character)).join('');

        sequelize.query(`
            select passHash from bkslf_Passwords where user_id = ${+id};
        `)
        .then(dbRes => {
            const isCorrect = bcrypt.compareSync(cipher, dbRes[0][0].passhash);
            res.status(200).send(isCorrect);
        })
        .catch(dbErr => {
            console.log(dbErr);
            res.status(500).send(dbErr);
        })
    }
};