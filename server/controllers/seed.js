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
    seed: (req, res) => {
        sequelize.query(`
            drop table if exists bkslf_Passwords;
            drop table if exists bkslf_UserDetails;
            drop table if exists bkslf_UserComment;
            drop table if exists bkslf_Users cascade;
            drop table if exists bkslf_Stories cascade;
            drop table if exists bkslf_Comments cascade;

            create table bkslf_Users (
                user_id serial primary key,
                username varchar(50) unique not null,
                email varchar(50) unique not null
            );

            create table bkslf_Passwords (
                pass_id serial primary key,
                user_id int references bkslf_Users(user_id),
                passHash varChar(255) not null
            );

            create table bkslf_UserDetails (
                detail_id serial primary key,
                user_id int references bkslf_Users(user_id),
                birthday timestamp not null,
                pronouns varchar(10),
                permission int not null,
                can_comment boolean not null 
            );

            create table bkslf_Stories (
                story_id serial primary key,
                author int references bkslf_Users(user_id),
                title varchar(255) not null,
                story text not null,
                time_posted timestamp not null,
                is_public boolean not null,
                rating float
            );

            create table bkslf_Comments (
                comment_id serial primary key,
                story_id int references bkslf_Stories(story_id),
                comment varchar(255) not null,
                time_posted timestamp not null
            );

            create table bkslf_UserComment (
                user_comment_id serial primary key,
                user_id int references bkslf_Users(user_id),
                comment_id int references bkslf_Stories(story_id)
            );

            insert into bkslf_Users (username, email) values ('prehistoric_dolphin', 'prehistoricdolphin789@gmail.com');

            insert into bkslf_Passwords (user_id, passHash)
            values ((select user_id from bkslf_Users where email = 'prehistoricdolphin789@gmail.com'), '$2a$15$8O5pskigIapi/Kp29dH1EuRtkbJokX4VUsaMwUUTrZzTKM9s.hcgy');

            insert into bkslf_UserDetails (user_id, birthday, pronouns, permission, can_comment)
            values ((select user_id from bkslf_Users where email = 'prehistoricdolphin789@gmail.com'),'2000-10-08', 'she/her',
            3, true);
        `)
        .then(dbRes => {
            console.log("DB seeded!");
            res.sendStatus(200);
        })
        .catch(dbErr => console.log('ERROR SEEDING DB', dbErr));
    }
};