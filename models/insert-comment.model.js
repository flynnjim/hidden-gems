const db = require("../db/connection");

exports.insertComment = (body) => {
  // const dateFormat = typeof body.date === "number";
  const usernameFormat = typeof body.username === "string";
  const bodyFormat = typeof body.body === "string";
  const gemIdFormat = typeof body.gem_id === "number";

  if (usernameFormat && bodyFormat && gemIdFormat) {
    return db
      .query(
        "INSERT INTO COMMENTS (username, body, gem_id) VALUES ($1, $2, $3) RETURNING *",
        [body.username, body.body, body.gem_id]
      )
      .then((commentNewData) => {
        return commentNewData.rows[0];
      });
  } else {
    return Promise.reject({ msg: "Invalid request body", status: 400 });
  }
};
