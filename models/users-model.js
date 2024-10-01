const db = require("../db/connection");

exports.fetchAllUsers = (username) => {
  if (username) {
    return db
      .query(`SELECT * FROM users WHERE username = $1;`, [username])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "User does not exist!" });
        } else return rows[0];
      });
  } else
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
      return rows;
    });
};

exports.fetchUserById = (user_id) => {
  return db
    .query(
      `SELECT name, username, email, avatar_url, user_type, user_id FROM users WHERE user_id = $1;`,
      [user_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist!" });
      } else return rows[0];
    });
};
