const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db.query('SELECT name, username, email, avatar_url, user_type FROM users;')
    .then(({rows}) => {
        return rows
    })
}